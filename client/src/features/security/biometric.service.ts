// Style: Sessiz Ay Takvimi — biometric access is opt-in, local, and never pretends to be available when the native bridge is absent.
import { registerPlugin } from "@capacitor/core";
import { isNativePlatform } from "@/platform/platform";
import { normalizeBiometricAvailability } from "./biometric.policy";

interface NativeBiometricBridge {
  isAvailable(): Promise<{ isAvailable: boolean; status?: BiometricState }>;
  verifyIdentity(options: { reason: string; title: string; subtitle: string; description: string }): Promise<void>;
}

const NativeBiometric = registerPlugin<NativeBiometricBridge>("NativeBiometric");
export type BiometricState = "available" | "unavailable" | "not-enrolled" | "unknown";

export async function checkBiometricAvailability(): Promise<BiometricState> {
  if (!isNativePlatform()) return "unavailable";
  try {
    const result = await NativeBiometric.isAvailable();
    return normalizeBiometricAvailability(result);
  } catch {
    return "unavailable";
  }
}

export async function authenticateBiometric(reason = "Verilerini açmak için doğrula"): Promise<boolean> {
  if (!isNativePlatform()) return false;
  try { await NativeBiometric.verifyIdentity({ reason, title: "Luna Cycle", subtitle: "Özel sağlık kayıtların", description: "Kayıtlarını görmek için biyometrik doğrulama yap." }); return true; } catch { return false; }
}

export async function enableBiometricLock(): Promise<boolean> {
  const availability = await checkBiometricAvailability();
  return availability === "available" && authenticateBiometric("Uygulama kilidini etkinleştirmek için doğrula");
}

export async function unlockApplication(): Promise<boolean> { return authenticateBiometric(); }
