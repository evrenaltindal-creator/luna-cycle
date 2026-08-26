// Style: Sessiz Ay Takvimi — consent state health consent’ten ayrı ve minimum veriyle saklanır.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConsentService } from "./consent.service";

beforeEach(() => {
  const values = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  });
});
afterEach(() => { vi.unstubAllGlobals(); });

describe("ad consent boundary", () => {
  it("returns a non-health consent snapshot in web/no-native environments", async () => {
    const snapshot = await ConsentService.refreshConsentInfo();
    expect(snapshot.adRequestAllowed).toBe(false);
    expect(snapshot.personalizationAllowed).toBe(false);
    expect(snapshot).not.toHaveProperty("cycleDay");
    expect(snapshot).not.toHaveProperty("health");
  });

  it("caches only policy booleans and exposes no raw consent payload", async () => {
    await ConsentService.refreshConsentInfo();
    const raw = localStorage.getItem("luna.monetization.ad-consent.v1");
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw ?? "{}")).toEqual({ state: "denied", adRequestAllowed: false, personalizationAllowed: false, privacyOptionsRequired: false });
  });
});
