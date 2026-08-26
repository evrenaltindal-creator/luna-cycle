// Style: Sessiz Ay Takvimi — entitlement UI’da sakin, deterministik ve sağlık verisinden tamamen ayrı.

import { MONETIZATION_STORAGE_KEY } from "./monetization.config";
import type {
  BillingService,
  EntitlementSnapshot,
  EntitlementState,
  EntitlementStoreApi,
  PurchaseResult,
} from "./monetization.types";

const defaultSnapshot: EntitlementSnapshot = {
  entitlement: "free",
  status: "unknown",
  source: "default",
  lastCheckedAt: null,
  expiresAt: null,
  cachedAt: null,
};

function readCache(): EntitlementSnapshot | null {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(MONETIZATION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<EntitlementSnapshot>;
    if (parsed.entitlement !== "free" && parsed.entitlement !== "luna_plus") return null;
    if (parsed.entitlement === "luna_plus" && parsed.expiresAt && Date.parse(parsed.expiresAt) <= Date.now()) {
      return { ...defaultSnapshot, status: "expired", source: "cache", cachedAt: parsed.cachedAt ?? null };
    }
    return {
      ...defaultSnapshot,
      ...parsed,
      source: "cache",
      cachedAt: parsed.cachedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function writeCache(snapshot: EntitlementSnapshot) {
  try {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(MONETIZATION_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Cache is an optimization only; inability to write must not unlock premium.
  }
}

function stateFromSnapshot(snapshot: EntitlementSnapshot, isLoading: boolean): EntitlementState {
  return { ...snapshot, isPremium: snapshot.entitlement === "luna_plus", isLoading };
}

export function createEntitlementStore(billing: BillingService): EntitlementStoreApi {
  let state = stateFromSnapshot(readCache() ?? defaultSnapshot, true);
  const listeners = new Set<(next: EntitlementState) => void>();
  let initialized = false;

  const publish = (next: EntitlementState) => {
    state = next;
    listeners.forEach((listener) => listener(state));
  };

  const applySnapshot = (snapshot: EntitlementSnapshot, sourceIsStore = true) => {
    const safeSnapshot = snapshot.entitlement === "luna_plus" && snapshot.status !== "active" && snapshot.status !== "grace_period" && snapshot.status !== "billing_retry"
      ? { ...snapshot, entitlement: "free" as const }
      : snapshot;
    if (sourceIsStore) writeCache({ ...safeSnapshot, cachedAt: new Date().toISOString() });
    publish(stateFromSnapshot(safeSnapshot, false));
    return state;
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    async initialize() {
      if (initialized) return state;
      initialized = true;
      publish({ ...state, isLoading: true });
      try {
        await billing.initialize();
        return applySnapshot(await billing.refreshEntitlements());
      } catch {
        const cached = readCache();
        return applySnapshot(cached ? { ...cached, source: "cache" } : { ...defaultSnapshot, status: "unavailable", source: "unavailable" }, false);
      }
    },
    async refresh() {
      publish({ ...state, isLoading: true });
      try {
        return applySnapshot(await billing.refreshEntitlements());
      } catch {
        publish({ ...state, isLoading: false });
        return state;
      }
    },
    async getProducts() {
      return billing.getProducts();
    },
    async purchase(productId: string): Promise<PurchaseResult> {
      const result = await billing.purchase(productId);
      if (result.state === "SUCCESS" || result.state === "ALREADY_OWNED") await this.refresh();
      return result;
    },
    async manageSubscription() {
      return billing.manageSubscription();
    },
    async restore() {
      publish({ ...state, isLoading: true });
      try {
        return applySnapshot(await billing.restore());
      } catch {
        publish({ ...state, isLoading: false });
        return state;
      }
    },
  };
}

export { defaultSnapshot };
