// Style: Sessiz Ay Takvimi — monetization state health data’dan ayrı, açık ve düşük baskılı.

export type Entitlement = "free" | "luna_plus";

export type SubscriptionStatus =
  | "unknown"
  | "free"
  | "active"
  | "grace_period"
  | "billing_retry"
  | "expired"
  | "cancelled"
  | "unavailable";

export type EntitlementSource =
  | "default"
  | "cache"
  | "android_play"
  | "ios_storekit"
  | "development"
  | "unavailable";

export type MonetizationFeature =
  | "advanced_insights"
  | "long_term_trends"
  | "advanced_reports"
  | "extended_history"
  | "advanced_reminders"
  | "ad_free";

export type PurchaseState =
  | "SUCCESS"
  | "USER_CANCELLED"
  | "PENDING"
  | "ALREADY_OWNED"
  | "NETWORK_ERROR"
  | "STORE_UNAVAILABLE"
  | "PRODUCT_UNAVAILABLE"
  | "UNKNOWN_ERROR";

export interface EntitlementSnapshot {
  entitlement: Entitlement;
  status: SubscriptionStatus;
  source: EntitlementSource;
  lastCheckedAt: string | null;
  expiresAt: string | null;
  cachedAt: string | null;
}

export interface EntitlementState extends EntitlementSnapshot {
  isPremium: boolean;
  isLoading: boolean;
}

export interface StoreProduct {
  id: string;
  kind: "monthly" | "yearly";
  localizedPrice: string | null;
  currencyCode: string | null;
  billingPeriod: "P1M" | "P1Y" | null;
  offerDetails: string | null;
}

export interface PurchaseResult {
  state: PurchaseState;
  productId?: string;
  message?: string;
}

export interface BillingService {
  initialize(): Promise<void>;
  getProducts(): Promise<StoreProduct[]>;
  purchase(productId: string): Promise<PurchaseResult>;
  restore(): Promise<EntitlementSnapshot>;
  refreshEntitlements(): Promise<EntitlementSnapshot>;
  manageSubscription(): Promise<boolean>;
}

export interface EntitlementStoreApi {
  getState(): EntitlementState;
  initialize(): Promise<EntitlementState>;
  refresh(): Promise<EntitlementState>;
  getProducts(): Promise<StoreProduct[]>;
  purchase(productId: string): Promise<PurchaseResult>;
  restore(): Promise<EntitlementState>;
  manageSubscription(): Promise<boolean>;
  subscribe(listener: (state: EntitlementState) => void): () => void;
}
