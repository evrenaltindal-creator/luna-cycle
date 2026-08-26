// Style: Sessiz Ay Takvimi — sadece düşük yoğunluklu, anchored adaptive banner; premium hard-stop.

import { AdMob, BannerAdPosition, BannerAdSize } from "@capacitor-community/admob";
import { isNativePlatform } from "../../platform/platform";
import type { AdSlot } from "./ad.service";
import type { AdConsentSnapshot } from "./consent.service";

export const TEST_BANNER_AD_UNIT_ID = "ca-app-pub-3940256099942544/6300978111";
const configuredProductionId = import.meta.env.VITE_LUNA_ADMOB_PRODUCTION_BANNER_ID?.trim() || null;
export const AD_CONFIG = { adUnitId: import.meta.env.DEV || !configuredProductionId ? TEST_BANNER_AD_UNIT_ID : configuredProductionId, isTesting: import.meta.env.DEV || !configuredProductionId };

const nativeSlot = (slot: AdSlot) => slot === "home_footer" || slot === "insights_footer";
let initialized = false;
let activeSlot: AdSlot | null = null;

export const NativeAdMobAdapter = {
  async initialize(entitlement: "free" | "luna_plus", consent: AdConsentSnapshot): Promise<boolean> {
    if (!isNativePlatform() || entitlement === "luna_plus" || !consent.adRequestAllowed) return false;
    if (!initialized) { await AdMob.initialize(); initialized = true; }
    return true;
  },
  async loadBanner(slot: AdSlot, entitlement: "free" | "luna_plus", consent: AdConsentSnapshot): Promise<boolean> {
    if (!(await this.initialize(entitlement, consent)) || !nativeSlot(slot)) return false;
    await AdMob.showBanner({ adId: AD_CONFIG.adUnitId, adSize: BannerAdSize.ADAPTIVE_BANNER, position: BannerAdPosition.BOTTOM_CENTER, margin: 0, isTesting: AD_CONFIG.isTesting, npa: true });
    activeSlot = slot;
    return true;
  },
  async hideBanner(): Promise<void> {
    if (!isNativePlatform()) return;
    try { await AdMob.hideBanner(); } catch { /* native adapter unavailable is non-fatal */ }
    try { await AdMob.removeBanner(); } catch { /* already removed */ }
    activeSlot = null;
  },
  async shutdown(): Promise<void> { await this.hideBanner(); initialized = false; },
  getActiveSlot: () => activeSlot,
};
