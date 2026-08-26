// Style: Sessiz Ay Takvimi — entitlement yüklenirken sakin durum, premium kararı tek context üzerinden.

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { createBillingService } from "./billing.service";
import { createEntitlementStore } from "./entitlement.store";
import type { EntitlementState, EntitlementStoreApi, PurchaseResult, StoreProduct } from "./monetization.types";
import { ConsentService, type AdConsentSnapshot } from "./consent.service";
import { AdService } from "./ad.service";

const store: EntitlementStoreApi = createEntitlementStore(createBillingService());
const MonetizationContext = createContext<EntitlementState & {
  refresh: () => Promise<EntitlementState>;
  getProducts: () => Promise<StoreProduct[]>;
  purchase: (productId: string) => Promise<PurchaseResult>;
  restore: () => Promise<EntitlementState>;
  manageSubscription: () => Promise<boolean>;
  adConsent: AdConsentSnapshot;
  refreshAdConsent: () => Promise<AdConsentSnapshot>;
  showAdPrivacyOptions: () => Promise<AdConsentSnapshot>;
}>({
  ...store.getState(),
  refresh: store.refresh,
  getProducts: store.getProducts,
  purchase: store.purchase,
  restore: store.restore,
  manageSubscription: store.manageSubscription,
  adConsent: ConsentService.getCached(),
  refreshAdConsent: ConsentService.refreshConsentInfo,
  showAdPrivacyOptions: ConsentService.showPrivacyOptions,
});

export function MonetizationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(store.getState());
  const [adConsent, setAdConsent] = useState<AdConsentSnapshot>(ConsentService.getCached());
  useEffect(() => {
    let active = true;
    const unsubscribe = store.subscribe(setState);
    void (async () => { await store.initialize(); const consent = await ConsentService.initialize(); if (active) setAdConsent(consent); })();
    return () => { active = false; unsubscribe(); };
  }, []);
  useEffect(() => { if (state.isPremium) void AdService.shutdown(); }, [state.isPremium]);
  const value = useMemo(() => ({ ...state, adConsent, refresh: store.refresh, getProducts: store.getProducts, purchase: store.purchase, restore: store.restore, manageSubscription: store.manageSubscription, refreshAdConsent: async () => { const next = await ConsentService.refreshConsentInfo(); setAdConsent(next); return next; }, showAdPrivacyOptions: async () => { const next = await ConsentService.showPrivacyOptions(); setAdConsent(next); return next; } }), [state, adConsent]);
  return <MonetizationContext.Provider value={value}>{children}</MonetizationContext.Provider>;
}

export function useMonetization() {
  return useContext(MonetizationContext);
}
