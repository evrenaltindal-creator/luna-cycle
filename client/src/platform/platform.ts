// Style: Sessiz Ay Takvimi — platform behavior stays quiet, centralized, and invisible to the journal UI.
import { Capacitor } from "@capacitor/core";

export const isNativePlatform = () => Capacitor.isNativePlatform();
export const isIOS = () => Capacitor.getPlatform() === "ios";
export const isAndroid = () => Capacitor.getPlatform() === "android";
export const isWeb = () => !isNativePlatform();

export const NATIVE_RESUME_AUTH_TIMEOUT_MS = 30_000;
export const NATIVE_STORAGE_KEY = "luna-cycle-secure-snapshot-v1";

export type NativeCapability = "notifications" | "biometric" | "secure-storage" | "file-share";

export function nativeCapabilityLabel(capability: NativeCapability) {
  return {
    notifications: "cihaz bildirimleri",
    biometric: "biyometrik kilit",
    "secure-storage": "güvenli cihaz depolaması",
    "file-share": "dosya paylaşımı",
  }[capability];
}
