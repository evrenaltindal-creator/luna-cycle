// Style: Sessiz Ay Takvimi — reklam izni, sağlık izninden tamamen ayrı ve yalnız policy-derived booleans taşır.

import { AdMob } from "@capacitor-community/admob";
import { isNativePlatform } from "../../platform/platform";

export type ConsentState = "unknown" | "allowed" | "denied";
export interface AdConsentSnapshot { state: ConsentState; adRequestAllowed: boolean; personalizationAllowed: boolean; privacyOptionsRequired: boolean; }

const STORAGE_KEY = "luna.monetization.ad-consent.v1";
const defaultSnapshot: AdConsentSnapshot = { state: "unknown", adRequestAllowed: false, personalizationAllowed: false, privacyOptionsRequired: false };
let initialization: Promise<AdConsentSnapshot> | null = null;

const readCached = (): AdConsentSnapshot => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSnapshot;
    const parsed = JSON.parse(raw) as Partial<AdConsentSnapshot>;
    return {
      state: parsed.state === "allowed" || parsed.state === "denied" ? parsed.state : "unknown",
      adRequestAllowed: parsed.adRequestAllowed === true,
      personalizationAllowed: parsed.personalizationAllowed === true,
      privacyOptionsRequired: parsed.privacyOptionsRequired === true,
    };
  } catch { return defaultSnapshot; }
};

const writeCached = (snapshot: AdConsentSnapshot) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot)); } catch { /* consent cache is non-critical */ }
};

const fromPlugin = (info: { canRequestAds?: boolean; isConsentFormAvailable?: boolean; status?: string; privacyOptionsRequirementStatus?: string }): AdConsentSnapshot => {
  const allowed = info.canRequestAds === true;
  const privacyOptionsRequired = info.privacyOptionsRequirementStatus === "REQUIRED";
  return { state: allowed ? "allowed" : "denied", adRequestAllowed: allowed, personalizationAllowed: false, privacyOptionsRequired };
};

export const ConsentService = {
  getCached: readCached,
  async initialize(): Promise<AdConsentSnapshot> {
    if (initialization) return initialization;
    initialization = (async () => {
      if (!isNativePlatform()) { const cached = readCached(); const snapshot: AdConsentSnapshot = { ...cached, state: cached.adRequestAllowed ? "allowed" : "denied" }; writeCached(snapshot); return snapshot; }
      try {
        const info = await AdMob.requestConsentInfo();
        let snapshot = fromPlugin(info);
        if (!info.canRequestAds && info.isConsentFormAvailable) snapshot = fromPlugin(await AdMob.showConsentForm());
        writeCached(snapshot);
        return snapshot;
      } catch { return readCached(); }
    })();
    return initialization!;
  },
  async refreshConsentInfo(): Promise<AdConsentSnapshot> {
    initialization = null;
    return this.initialize();
  },
  isAdRequestAllowed(snapshot: AdConsentSnapshot) { return snapshot.adRequestAllowed; },
  isPersonalizedAdsAllowed(snapshot: AdConsentSnapshot) { return snapshot.personalizationAllowed; },
  async showPrivacyOptions(): Promise<AdConsentSnapshot> {
    if (!isNativePlatform()) return readCached();
    try {
      await AdMob.showPrivacyOptionsForm();
      const snapshot = fromPlugin(await AdMob.requestConsentInfo());
      writeCached(snapshot);
      return snapshot;
    } catch { return readCached(); }
  },
};
