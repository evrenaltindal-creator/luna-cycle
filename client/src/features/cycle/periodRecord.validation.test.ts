import { describe, expect, it } from "vitest";
import { periodLength, validatePeriodRange } from "./periodRecord.validation";

const existing = [{ id: 1, date: "2026-01-01", endDate: "2026-01-05", length: 5 }];

describe("historical period range", () => {
  it("accepts inclusive past start and end dates", () => {
    expect(validatePeriodRange("2026-01-29", "2026-02-02", existing, undefined, "2026-09-24")).toBeNull();
    expect(periodLength("2026-01-29", "2026-02-02")).toBe(5);
  });
  it("rejects impossible, reversed, future, long and overlapping ranges", () => {
    expect(validatePeriodRange("2026-02-30", "2026-03-02", [], undefined, "2026-09-24")).toMatch(/tarih/);
    expect(validatePeriodRange("2026-02-05", "2026-02-04", [], undefined, "2026-09-24")).toMatch(/önce/);
    expect(validatePeriodRange("2026-09-25", "2026-09-26", [], undefined, "2026-09-24")).toMatch(/gelecek/);
    expect(validatePeriodRange("2026-01-01", "2026-01-15", [], undefined, "2026-09-24")).toMatch(/14/);
    expect(validatePeriodRange("2026-01-05", "2026-01-08", existing, undefined, "2026-09-24")).toMatch(/çakışıyor/);
  });
  it("allows editing the same record without flagging self-overlap", () => {
    expect(validatePeriodRange("2026-01-01", "2026-01-06", existing, 1, "2026-09-24")).toBeNull();
  });
  it("accepts a start without a known end date", () => {
    expect(validatePeriodRange("2026-02-01", null, existing, undefined, "2026-09-24")).toBeNull();
  });
  it("rejects overlapping or future start-only entries", () => {
    expect(validatePeriodRange("2026-01-03", null, existing, undefined, "2026-09-24")).toMatch(/çakışıyor/);
    expect(validatePeriodRange("2026-09-25", null, existing, undefined, "2026-09-24")).toMatch(/gelecek/);
  });
});
