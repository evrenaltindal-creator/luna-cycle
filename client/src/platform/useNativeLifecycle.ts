// Style: Sessiz Ay Takvimi — backgrounding a private journal hides content first and restores it only after the security policy allows.
import { useEffect, useRef, useState } from "react";
import { App } from "@capacitor/app";
import { PrivacyScreen } from "@capacitor/privacy-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { isNativePlatform, NATIVE_RESUME_AUTH_TIMEOUT_MS } from "./platform";
import { unlockApplication } from "../features/security/biometric.service";
import { shouldLockOnResume } from "../features/security/biometric.policy";

export function useNativeLifecycle({ biometricLockEnabled, onBack }: { biometricLockEnabled: boolean; onBack?: () => boolean }) {
  const [privacyHidden, setPrivacyHidden] = useState(false);
  const [locked, setLocked] = useState(() => isNativePlatform() && biometricLockEnabled);
  const onBackRef = useRef(onBack);
  const backgroundedAtRef = useRef(0);

  useEffect(() => { onBackRef.current = onBack; }, [onBack]);

  useEffect(() => {
    if (!isNativePlatform()) return;
    let disposed = false;
    const hidePrivateSurface = () => {
      if (disposed) return;
      if (backgroundedAtRef.current === 0) backgroundedAtRef.current = Date.now();
      setPrivacyHidden(true);
      void PrivacyScreen.enable({ android: { dimBackground: true, privacyModeOnActivityHidden: "splash" }, ios: { blurEffect: "dark" } });
    };
    const restorePrivateSurface = () => {
      if (disposed) return;
      const mustLock = shouldLockOnResume({ enabled: biometricLockEnabled, backgroundedAt: backgroundedAtRef.current, now: Date.now(), timeoutMs: NATIVE_RESUME_AUTH_TIMEOUT_MS });
      if (mustLock) {
        setLocked(true);
        setPrivacyHidden(true);
        // The React lock surface already hides private data; disable the native screen cover so BiometricPrompt can render.
        void PrivacyScreen.disable();
        return;
      }
      backgroundedAtRef.current = 0;
      setPrivacyHidden(false);
      void PrivacyScreen.disable();
    };
    const applyStatusBar = async () => {
      try { await StatusBar.setStyle({ style: document.documentElement.classList.contains("dark") ? Style.Dark : Style.Light }); } catch { /* safe fallback */ }
    };
    void applyStatusBar();
    const appStateListener = App.addListener("appStateChange", ({ isActive }) => { if (isActive) restorePrivateSurface(); else hidePrivateSurface(); });
    const pauseListener = App.addListener("pause", hidePrivateSurface);
    const resumeListener = App.addListener("resume", restorePrivateSurface);
    const backButtonListener = App.addListener("backButton", ({ canGoBack }) => { if (onBackRef.current?.()) return; if (!canGoBack) void App.exitApp(); });
    const onVisibilityChange = () => { if (document.visibilityState === "hidden") hidePrivateSurface(); else restorePrivateSurface(); };
    const onPageHide = () => hidePrivateSurface();
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      void PrivacyScreen.disable();
      void appStateListener.then((handle) => handle.remove());
      void pauseListener.then((handle) => handle.remove());
      void resumeListener.then((handle) => handle.remove());
      void backButtonListener.then((handle) => handle.remove());
    };
  }, [biometricLockEnabled]);

  const unlock = async () => {
    // The Android PrivacyScreen is intentionally disabled before BiometricPrompt so the system prompt can render above the WebView.
    await PrivacyScreen.disable();
    const success = await unlockApplication();
    if (success) { backgroundedAtRef.current = 0; setLocked(false); setPrivacyHidden(false); } 
    else setPrivacyHidden(true);
    return success;
  };
  return { privacyHidden, locked, unlock };
}
