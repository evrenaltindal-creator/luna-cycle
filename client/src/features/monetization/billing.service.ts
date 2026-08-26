// Style: Sessiz Ay Takvimi — mağaza akışı görünür, dürüst ve health data’dan bağımsız.

import { PRODUCT_CONFIG } from "./monetization.config";
import type { BillingService, EntitlementSnapshot, PurchaseResult, StoreProduct } from "./monetization.types";
import { createStoreBillingService } from "./store-adapters";

const unavailableSnapshot = (): EntitlementSnapshot => ({
  entitlement: "free",
  status: "unavailable",
  source: "unavailable",
  lastCheckedAt: new Date().toISOString(),
  expiresAt: null,
  cachedAt: null,
});

const placeholderProducts = (): StoreProduct[] => PRODUCT_CONFIG.map((product) => ({
  id: product.id,
  kind: product.kind,
  localizedPrice: null,
  currencyCode: null,
  billingPeriod: product.billingPeriod,
  offerDetails: null,
}));

/** Production-safe adapter until a verified store plugin/native bridge is installed. */
export class UnavailableBillingService implements BillingService {
  async initialize() { return undefined; }
  async getProducts() { return placeholderProducts(); }
  async purchase(_productId: string): Promise<PurchaseResult> {
    return { state: "STORE_UNAVAILABLE", message: "Mağaza bağlantısı henüz kullanılamıyor." };
  }
  async restore() { return unavailableSnapshot(); }
  async refreshEntitlements() { return unavailableSnapshot(); }
  async manageSubscription() { return false; }
}

/**
 * Development-only adapter for deterministic UI/unit testing. It is never selected
 * by the production factory and therefore cannot unlock premium in a production build.
 */
export class DevelopmentBillingService implements BillingService {
  private active = false;
  private readonly products = placeholderProducts();
  async initialize() { return undefined; }
  async getProducts() { return this.products; }
  async purchase(productId: string): Promise<PurchaseResult> {
    if (!this.products.some((product) => product.id === productId)) return { state: "PRODUCT_UNAVAILABLE" };
    this.active = true;
    return { state: "SUCCESS", productId };
  }
  async restore() { return this.snapshot(); }
  async refreshEntitlements() { return this.snapshot(); }
  async manageSubscription() { return true; }
  private snapshot(): EntitlementSnapshot {
    return {
      entitlement: this.active ? "luna_plus" : "free",
      status: this.active ? "active" : "free",
      source: "development",
      lastCheckedAt: new Date().toISOString(),
      expiresAt: null,
      cachedAt: null,
    };
  }
}

export function createBillingService(): BillingService {
  // Never use a fake purchase adapter in production.
  if (import.meta.env.DEV && import.meta.env.VITE_LUNA_DEV_BILLING === "true") return new DevelopmentBillingService();
  return createStoreBillingService();
}
