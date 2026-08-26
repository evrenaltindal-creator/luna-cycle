// Style: Sessiz Ay Takvimi — monetization testleri ürün state’ini health data’dan ayrı doğrular.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { canAccessFeature, hasEntitlement } from "./monetization.config";
import { DevelopmentBillingService } from "./billing.service";
import { AdService } from "./ad.service";
import { createEntitlementStore } from "./entitlement.store";
import { clearAllData, importBackup } from "../cycle/cycle.storage";

beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
    clear: () => values.clear(),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("entitlement policy", () => {
  it("defaults to free and keeps core features free", async () => {
    const store = createEntitlementStore(new DevelopmentBillingService());
    const state = await store.initialize();
    expect(state.entitlement).toBe("free");
    expect(state.isPremium).toBe(false);
    expect(canAccessFeature("free", "period_tracking")).toBe(true);
    expect(canAccessFeature("free", "daily_checkin")).toBe(true);
    expect(canAccessFeature("free", "advanced_insights")).toBe(false);
  });

  it("unlocks only premium policy after a successful development purchase", async () => {
    const store = createEntitlementStore(new DevelopmentBillingService());
    await store.initialize();
    const result = await store.purchase("luna_plus_monthly");
    expect(result.state).toBe("SUCCESS");
    expect(store.getState().entitlement).toBe("luna_plus");
    expect(store.getState().isPremium).toBe(true);
    expect(hasEntitlement("luna_plus")).toBe(true);
    expect(canAccessFeature("luna_plus", "advanced_insights")).toBe(true);
  });

  it("does not treat an invalid product as a purchase", async () => {
    const store = createEntitlementStore(new DevelopmentBillingService());
    await store.initialize();
    const result = await store.purchase("invalid");
    expect(result.state).toBe("PRODUCT_UNAVAILABLE");
    expect(store.getState().entitlement).toBe("free");
  });

  it("uses a cached premium snapshot only as temporary startup state", async () => {
    localStorage.setItem("luna.monetization.entitlement.v1", JSON.stringify({
      entitlement: "luna_plus",
      status: "active",
      source: "development",
      lastCheckedAt: new Date().toISOString(),
      expiresAt: null,
      cachedAt: new Date().toISOString(),
    }));
    const store = createEntitlementStore(new DevelopmentBillingService());
    expect(store.getState().isPremium).toBe(true);
    const refreshed = await store.initialize();
    expect(refreshed.source).toBe("development");
  });

  it("maps both canonical products without hardcoded prices", async () => {
    const products = await new DevelopmentBillingService().getProducts();
    expect(products.map((product) => product.id)).toEqual(["luna_plus_monthly", "luna_plus_yearly"]);
    expect(products.map((product) => product.billingPeriod)).toEqual(["P1M", "P1Y"]);
    expect(products.every((product) => product.localizedPrice === null)).toBe(true);
  });

  it("keeps entitlement unchanged for cancelled and pending purchases", async () => {
    let purchaseState: "USER_CANCELLED" | "PENDING" = "USER_CANCELLED";
    const service = {
      initialize: async () => undefined,
      getProducts: async () => [],
      purchase: async () => ({ state: purchaseState } as const),
      restore: async () => ({ entitlement: "free" as const, status: "free" as const, source: "android_play" as const, lastCheckedAt: null, expiresAt: null, cachedAt: null }),
      refreshEntitlements: async () => ({ entitlement: "free" as const, status: "free" as const, source: "android_play" as const, lastCheckedAt: null, expiresAt: null, cachedAt: null }),
      manageSubscription: async () => false,
    };
    const store = createEntitlementStore(service);
    await store.initialize();
    expect((await store.purchase("luna_plus_monthly")).state).toBe("USER_CANCELLED");
    purchaseState = "PENDING";
    expect((await store.purchase("luna_plus_monthly")).state).toBe("PENDING");
    expect(store.getState().entitlement).toBe("free");
  });

  it("restores an active store entitlement without health backup data", async () => {
    const store = createEntitlementStore({
      initialize: async () => undefined,
      getProducts: async () => [],
      purchase: async () => ({ state: "STORE_UNAVAILABLE" as const }),
      restore: async () => ({ entitlement: "luna_plus" as const, status: "active" as const, source: "android_play" as const, lastCheckedAt: new Date().toISOString(), expiresAt: null, cachedAt: null }),
      refreshEntitlements: async () => ({ entitlement: "luna_plus" as const, status: "active" as const, source: "android_play" as const, lastCheckedAt: new Date().toISOString(), expiresAt: null, cachedAt: null }),
      manageSubscription: async () => false,
    });
    const state = await store.restore();
    expect(state.isPremium).toBe(true);
    expect(state.source).toBe("android_play");
  });

  it("suppresses every ad request for premium users", async () => {
    expect(AdService.canShowAds("luna_plus", "home_footer")).toBe(false);
    expect((await AdService.requestAd({ slot: "home_footer", consent: "not_required", nonPersonalized: true }, "luna_plus")).reason).toBe("premium");
  });

  it("keeps subscription entitlement separate from health backup and clear-all-data", () => {
    const premium = JSON.stringify({ entitlement: "luna_plus", status: "active", source: "android_play", lastCheckedAt: new Date().toISOString(), expiresAt: null, cachedAt: new Date().toISOString() });
    localStorage.setItem("luna.monetization.entitlement.v1", premium);
    const backup = JSON.stringify({ schema: "luna-cycle-backup", version: 1, exportedAt: new Date().toISOString(), periodRecords: [], dailyLogs: [], preferences: {} });
    importBackup(backup);
    clearAllData();
    expect(localStorage.getItem("luna.monetization.entitlement.v1")).toBe(premium);
  });

  it("does not restore premium from an empty/unavailable store", async () => {
    const store = createEntitlementStore({
      initialize: async () => undefined,
      getProducts: async () => [],
      purchase: async () => ({ state: "STORE_UNAVAILABLE" as const }),
      restore: async () => ({ entitlement: "free", status: "free", source: "unavailable", lastCheckedAt: null, expiresAt: null, cachedAt: null }),
      refreshEntitlements: async () => ({ entitlement: "free", status: "free", source: "unavailable", lastCheckedAt: null, expiresAt: null, cachedAt: null }),
      manageSubscription: async () => false,
    });
    const state = await store.initialize();
    expect(state.entitlement).toBe("free");
    expect(state.isPremium).toBe(false);
  });
});
