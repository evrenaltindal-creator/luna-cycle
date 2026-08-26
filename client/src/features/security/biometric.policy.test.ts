import { describe, expect, it } from "vitest";
import { authOutcomeFromError, normalizeBiometricAvailability, resolveBackAction, shouldLockOnResume } from "./biometric.policy";

describe("biometric policy", () => {
  it("normalizes available, not-enrolled and unavailable states", () => {
    expect(normalizeBiometricAvailability({ isAvailable: true })).toBe("available");
    expect(normalizeBiometricAvailability({ isAvailable: false, status: "not-enrolled" })).toBe("not-enrolled");
    expect(normalizeBiometricAvailability({ isAvailable: false, status: "hardware-unavailable" })).toBe("unavailable");
  });

  it("distinguishes cancellation from authentication failure", () => {
    expect(authOutcomeFromError({ code: "CANCELLED" })).toBe("cancel");
    expect(authOutcomeFromError({ code: "AUTHENTICATION_FAILED" })).toBe("failure");
    expect(authOutcomeFromError(undefined)).toBe("failure");
  });

  it("locks after the configured resume timeout only when enabled", () => {
    expect(shouldLockOnResume({ enabled: true, backgroundedAt: 1000, now: 31000, timeoutMs: 30000 })).toBe(true);
    expect(shouldLockOnResume({ enabled: true, backgroundedAt: 1000, now: 30999, timeoutMs: 30000 })).toBe(false);
    expect(shouldLockOnResume({ enabled: false, backgroundedAt: 1000, now: 90000, timeoutMs: 30000 })).toBe(false);
    expect(shouldLockOnResume({ enabled: true, backgroundedAt: 0, now: 90000, timeoutMs: 30000 })).toBe(false);
  });

  it("prioritizes back actions without saving or deleting", () => {
    expect(resolveBackAction({ confirmOpen: true, modalOpen: true, innerView: true, atRoot: false })).toBe("cancel-confirm");
    expect(resolveBackAction({ confirmOpen: false, modalOpen: true, innerView: true, atRoot: false })).toBe("close-modal");
    expect(resolveBackAction({ confirmOpen: false, modalOpen: false, innerView: true, atRoot: false })).toBe("go-parent");
    expect(resolveBackAction({ confirmOpen: false, modalOpen: false, innerView: false, atRoot: true })).toBe("background-or-exit");
  });
});
