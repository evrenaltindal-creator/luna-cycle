// Style: Sessiz Ay Takvimi — native store sınırı açıkça hazırlanmış, doğrulanmamış purchase asla premium sayılmıyor.

import { isNativePlatform } from "../../platform/platform";
import { PRODUCT_CONFIG } from "./monetization.config";
import type { BillingService, EntitlementSnapshot, PurchaseResult, StoreProduct } from "./monetization.types";
import { UnavailableBillingService } from "./billing.service";
import { NativeBilling } from "./NativeBillingPlugin";

export const ANDROID_BILLING_TARGET = "9.1.0";
export const IOS_STOREKIT_TARGET = "StoreKit 2 currentEntitlements";

class NativeBridgeBillingService implements BillingService {
  async initialize() { await NativeBilling.initialize(); }
  async getProducts() { const response = await NativeBilling.getProducts(); return response.products.filter((product) => PRODUCT_CONFIG.some((configured) => configured.id === product.id)); }
  async purchase(productId: string) { return NativeBilling.purchase({ productId }); }
  async restore() { return NativeBilling.restore(); }
  async refreshEntitlements() { return NativeBilling.refreshEntitlements(); }
  async manageSubscription() { return (await NativeBilling.manageSubscription()).opened; }
}

export function createStoreBillingService(): BillingService {
  if (isNativePlatform()) return new NativeBridgeBillingService();
  return new UnavailableBillingService();
}

export const billingReadiness = {
  android: { status: "READY" as const, target: ANDROID_BILLING_TARGET, purchase: "NOT_VERIFIED" as const },
  ios: { status: "READY" as const, target: IOS_STOREKIT_TARGET, purchase: "NOT_VERIFIED" as const },
};
