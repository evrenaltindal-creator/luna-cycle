// Style: Sessiz Ay Takvimi — security state is explicit, deterministic, and never contains health payloads.

export type BiometricAvailability = "available" | "unavailable" | "not-enrolled" | "unknown";
export type BiometricAuthOutcome = "success" | "cancel" | "failure";

export function normalizeBiometricAvailability(result: { isAvailable: boolean; status?: string }): BiometricAvailability {
  if (result.isAvailable) return "available";
  if (result.status === "not-enrolled") return "not-enrolled";
  return "unavailable";
}

export function authOutcomeFromError(error: { code?: unknown } | null | undefined): BiometricAuthOutcome {
  if (error?.code === "CANCELLED") return "cancel";
  return "failure";
}

export function shouldLockOnResume({ enabled, backgroundedAt, now, timeoutMs }: { enabled: boolean; backgroundedAt: number; now: number; timeoutMs: number }): boolean {
  return enabled && backgroundedAt > 0 && now - backgroundedAt >= timeoutMs;
}

export type BackState = { confirmOpen: boolean; modalOpen: boolean; innerView: boolean; atRoot: boolean };
export type BackAction = "cancel-confirm" | "close-modal" | "go-parent" | "background-or-exit" | "noop";

export function resolveBackAction(state: BackState): BackAction {
  if (state.confirmOpen) return "cancel-confirm";
  if (state.modalOpen) return "close-modal";
  if (state.innerView) return "go-parent";
  if (state.atRoot) return "background-or-exit";
  return "noop";
}
