import { describe, expect, it } from "vitest";
import { isWeb, isNativePlatform, isAndroid, isIOS } from "./platform";
import { getNotificationPermission, scheduleCycleReminder } from "../features/notifications/notification.service";
import { checkBiometricAvailability, authenticateBiometric } from "../features/security/biometric.service";

describe("native platform adapters", () => {
  it("detects the Vitest environment as web and never calls native APIs", () => {
    expect(isWeb()).toBe(true);
    expect(isNativePlatform()).toBe(false);
    expect(isAndroid()).toBe(false);
    expect(isIOS()).toBe(false);
  });

  it("uses the browser notification state as a safe fallback", async () => {
    expect(await getNotificationPermission()).toBe("denied");
    expect(await scheduleCycleReminder(new Date(Date.now() + 86_400_000), { notificationDaysBefore: 3, privateNotificationText: true })).toBe(false);
  });

  it("does not claim biometric support on web", async () => {
    expect(await checkBiometricAvailability()).toBe("unavailable");
    expect(await authenticateBiometric()).toBe(false);
  });
});
