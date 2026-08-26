// Style: Sessiz Ay Takvimi — reklam sınırları statik ve health-free kalır.

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { AdService } from "./ad.service";

describe("privacy-safe ads", () => {
  it("allows only safe free-tier slots", () => {
    expect(AdService.canShowAds("free", "home_footer")).toBe(true);
    expect(AdService.canShowAds("free", "insights_footer")).toBe(true);
    expect(AdService.canShowAds("free", "settings_footer" as never)).toBe(false);
    expect(AdService.canShowAds("free", "home_footer" as never)).toBe(true);
    expect(AdService.canShowAds("luna_plus", "home_footer")).toBe(false);
  });

  it("never requests ads for premium", async () => {
    const result = await AdService.requestAd({ slot: "home_footer", consent: "granted", nonPersonalized: true }, "luna_plus");
    expect(result.filled).toBe(false);
    expect(result.reason).toBe("premium");
  });

  it("keeps the AdService source free of health-module imports", () => {
    const source = readFileSync(new URL("./ad.service.ts", import.meta.url), "utf8");
    expect(source).not.toMatch(/PeriodRecord|DailyLog|symptom|prediction|mood|notes|cycle\.storage/);
  });

  it("blocks requests when consent is denied", async () => {
    const result = await AdService.requestAd({ slot: "home_footer", consent: "denied", nonPersonalized: true }, "free");
    expect(result.reason).toBe("consent_required");
  });

  it("does not accept health state or health-shaped payloads", async () => {
    const request = { slot: "insights_footer" as const, consent: "granted" as const, nonPersonalized: true };
    const result = await AdService.requestAd(request, "free");
    expect(result.reason).toBe("sdk_not_configured");
    expect(Object.keys(request)).toEqual(["slot", "consent", "nonPersonalized"]);
  });
});
