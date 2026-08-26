// Style: Sessiz Ay Takvimi — reklam yalnız Home/Insights footer’da, consent-derived policy ile ve health-free.

import type { Entitlement } from "./monetization.types";
import type { AdConsentSnapshot } from "./consent.service";
import { NativeAdMobAdapter } from "./admob.adapter";

export type AdSlot = "home_footer" | "insights_footer";
export type AdConsentState = "unknown" | "not_required" | "granted" | "denied";

export interface AdRequest { slot: AdSlot; consent: AdConsentState; nonPersonalized: true; }
export interface AdResult { slot: AdSlot; filled: false; reason: "sdk_not_configured" | "premium" | "consent_required" | "unsupported"; }

const SAFE_SLOTS: readonly AdSlot[] = ["home_footer", "insights_footer"];

export const AdService = {
  initializeAds: async (entitlement: Entitlement, consent?: AdConsentSnapshot): Promise<boolean> => {
    if (entitlement === "luna_plus") { await NativeAdMobAdapter.shutdown(); return false; }
    if (!consent) return false;
    return NativeAdMobAdapter.initialize(entitlement, consent);
  },
  shutdown: () => NativeAdMobAdapter.shutdown(),
  canShowAds: (entitlement: Entitlement, slot: AdSlot) => entitlement === "free" && SAFE_SLOTS.includes(slot),
  loadBanner: async (slot: AdSlot, entitlement: Entitlement, consent: AdConsentSnapshot): Promise<boolean> => {
    if (!AdService.canShowAds(entitlement, slot) || !consent.adRequestAllowed) return false;
    return NativeAdMobAdapter.loadBanner(slot, entitlement, consent);
  },
  hideBanner: () => NativeAdMobAdapter.hideBanner(),
  requestAd: async (request: AdRequest, entitlement: Entitlement): Promise<AdResult> => {
    if (entitlement === "luna_plus") return { slot: request.slot, filled: false, reason: "premium" };
    if (!SAFE_SLOTS.includes(request.slot)) return { slot: request.slot, filled: false, reason: "unsupported" };
    if (request.consent === "unknown" || request.consent === "denied") return { slot: request.slot, filled: false, reason: "consent_required" };
    return { slot: request.slot, filled: false, reason: "sdk_not_configured" };
  },
};
