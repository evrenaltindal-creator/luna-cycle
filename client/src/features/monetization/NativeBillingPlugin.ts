// Style: Sessiz Ay Takvimi — store bridge typed, health-data-free and operational-state-only.

import { registerPlugin } from "@capacitor/core";
import type { EntitlementSnapshot, PurchaseResult, StoreProduct } from "./monetization.types";

interface NativeBillingPlugin {
  initialize(): Promise<void>;
  getProducts(): Promise<{ products: StoreProduct[] }>;
  purchase(options: { productId: string }): Promise<PurchaseResult>;
  restore(): Promise<EntitlementSnapshot>;
  refreshEntitlements(): Promise<EntitlementSnapshot>;
  manageSubscription(): Promise<{ opened: boolean }>;
}

export const NativeBilling = registerPlugin<NativeBillingPlugin>("NativeBilling");
