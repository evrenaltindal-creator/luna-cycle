import { describe, expect, it } from "vitest";
import { createTermsAcceptance, hasCurrentTermsAcceptance, TERMS_VERSION } from "./terms";

describe("terms acceptance", () => {
  it("requires explicit acceptance of the current text version", () => {
    const accepted = createTermsAcceptance(new Date("2026-09-28T10:00:00.000Z"));
    expect(accepted).toEqual({ version: TERMS_VERSION, acceptedAt: "2026-09-28T10:00:00.000Z" });
    expect(hasCurrentTermsAcceptance(accepted)).toBe(true);
    expect(hasCurrentTermsAcceptance({ ...accepted, version: "older" })).toBe(false);
    expect(hasCurrentTermsAcceptance({ ...accepted, acceptedAt: "invalid" })).toBe(false);
    expect(hasCurrentTermsAcceptance(undefined)).toBe(false);
  });
});
