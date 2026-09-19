// Style: Sessiz Ay Takvimi — product truth tek merkezde; fiyat ve teklif bilgisi mağazadan gelir.

import type { Entitlement, MonetizationFeature, StoreProduct } from "./monetization.types";

export const MONETIZATION_STORAGE_KEY = "luna.monetization.entitlement.v1";
export const PRODUCT_IDS = {
  monthly: "luna_plus_monthly",
  yearly: "luna_plus_yearly",
} as const;

export const PRODUCT_CONFIG = [
  { id: PRODUCT_IDS.monthly, kind: "monthly", billingPeriod: "P1M" },
  { id: PRODUCT_IDS.yearly, kind: "yearly", billingPeriod: "P1Y" },
] as const;

export const PREMIUM_FEATURES: readonly MonetizationFeature[] = [
  "advanced_insights",
  "ad_free",
];

export const FREE_FEATURES = [
  "period_tracking",
  "daily_checkin",
  "basic_prediction",
  "calendar",
  "current_cycle_overview",
  "basic_reminders",
  "privacy_controls",
  "export_import",
  "biometric_lock",
  "theme",
  "local_storage",
] as const;

export type FreeFeature = (typeof FREE_FEATURES)[number];

export function hasEntitlement(entitlement: Entitlement, required: Entitlement = "luna_plus") {
  return required === "free" || entitlement === required;
}

export function canAccessFeature(entitlement: Entitlement, feature: MonetizationFeature | FreeFeature) {
  if ((FREE_FEATURES as readonly string[]).includes(feature)) return true;
  return hasEntitlement(entitlement) && (PREMIUM_FEATURES as readonly string[]).includes(feature);
}

export function normalizeProducts(products: StoreProduct[]): StoreProduct[] {
  return PRODUCT_CONFIG.map((config) => {
    const storeProduct = products.find((product) => product.id === config.id);
    return storeProduct ?? {
      id: config.id,
      kind: config.kind,
      localizedPrice: null,
      currencyCode: null,
      billingPeriod: config.billingPeriod,
      offerDetails: null,
    };
  });
}
