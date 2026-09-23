// Style: Sessiz Ay Takvimi — sadece düşük yoğunluklu, anchored adaptive banner; premium hard-stop.

import { AdMob, BannerAdPluginEvents, BannerAdPosition, BannerAdSize } from "@capacitor-community/admob";
import type { PluginListenerHandle } from "@capacitor/core";
import { isAndroid } from "../../platform/platform";
import type { AdSlot } from "./ad.service";
import type { AdConsentSnapshot } from "./consent.service";

export const TEST_BANNER_AD_UNIT_ID = "ca-app-pub-3940256099942544/6300978111";
const configuredProductionId = import.meta.env.VITE_LUNA_ADMOB_PRODUCTION_BANNER_ID?.trim() || null;
export const AD_CONFIG = { adUnitId: import.meta.env.DEV || !configuredProductionId ? TEST_BANNER_AD_UNIT_ID : configuredProductionId, isTesting: import.meta.env.DEV || !configuredProductionId };

const nativeSlot = (slot: AdSlot) => slot === "home_footer" || slot === "insights_footer";
let initialized = false;
let activeSlot: AdSlot | null = null;
let sizeListener: PluginListenerHandle | null = null;
let bannerGeneration = 0;
let nativeOperation: Promise<void> = Promise.resolve();
const inOrder = <T>(task: () => Promise<T>): Promise<T> => {
  const result = nativeOperation.then(task);
  nativeOperation = result.then(() => undefined, () => undefined);
  return result;
};
const reserveBannerSpace = (height: number) => {
  if (typeof document !== "undefined") document.documentElement.style.setProperty("--luna-ad-height", `${Math.max(0, height)}px`);
};

export const NativeAdMobAdapter = {
  async initialize(entitlement: "free" | "luna_plus", consent: AdConsentSnapshot): Promise<boolean> {
    if (!isAndroid() || entitlement === "luna_plus" || !consent.adRequestAllowed) return false;
    if (!initialized) { await AdMob.initialize(); initialized = true; }
    return true;
  },
  async loadBanner(slot: AdSlot, entitlement: "free" | "luna_plus", consent: AdConsentSnapshot): Promise<boolean> {
    const generation = ++bannerGeneration;
    return inOrder(async () => {
      if (generation !== bannerGeneration || !nativeSlot(slot) || !(await this.initialize(entitlement, consent))) return false;
      if (generation !== bannerGeneration) return false;
      if (sizeListener) { await sizeListener.remove(); sizeListener = null; }
      const listener = await AdMob.addListener(BannerAdPluginEvents.SizeChanged, ({ height }) => {
        if (generation === bannerGeneration) reserveBannerSpace(height);
      });
      if (generation !== bannerGeneration) { await listener.remove(); return false; }
      sizeListener = listener;
      reserveBannerSpace(60);
      try {
        await AdMob.showBanner({ adId: AD_CONFIG.adUnitId, adSize: BannerAdSize.ADAPTIVE_BANNER, position: BannerAdPosition.BOTTOM_CENTER, margin: 0, isTesting: AD_CONFIG.isTesting, npa: true });
      } catch {
        reserveBannerSpace(0);
        await listener.remove();
        sizeListener = null;
        return false;
      }
      if (generation !== bannerGeneration) return false;
      activeSlot = slot;
      return true;
    });
  },
  async hideBanner(): Promise<void> {
    ++bannerGeneration;
    reserveBannerSpace(0);
    return inOrder(async () => {
      if (sizeListener) { await sizeListener.remove(); sizeListener = null; }
      if (!isAndroid()) return;
      try { await AdMob.hideBanner(); } catch { /* native adapter unavailable is non-fatal */ }
      try { await AdMob.removeBanner(); } catch { /* already removed */ }
      activeSlot = null;
    });
  },
  async shutdown(): Promise<void> { await this.hideBanner(); initialized = false; },
  getActiveSlot: () => activeSlot,
};
