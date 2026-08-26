import { describe, expect, it } from "vitest";
import { addDays, daysBetween, parseLocalDate, toLocalDateKey } from "./date";

describe("local date utilities", () => {
  it("ay ve yıl sınırlarını doğru geçer", () => {
    expect(toLocalDateKey(addDays(parseLocalDate("2026-01-31"), 1))).toBe("2026-02-01");
    expect(toLocalDateKey(addDays(parseLocalDate("2026-12-31"), 1))).toBe("2027-01-01");
    expect(toLocalDateKey(addDays(parseLocalDate("2027-01-01"), -1))).toBe("2026-12-31");
  });
  it("artık yılları doğru işler", () => {
    expect(toLocalDateKey(addDays(parseLocalDate("2028-02-28"), 1))).toBe("2028-02-29");
    expect(toLocalDateKey(addDays(parseLocalDate("2028-02-29"), 1))).toBe("2028-03-01");
    expect(toLocalDateKey(addDays(parseLocalDate("2027-02-28"), 1))).toBe("2027-03-01");
  });
  it("daysBetween ve serialize/parse roundtrip bir günlük sapma üretmez", () => {
    const date = parseLocalDate("2026-08-22");
    expect(toLocalDateKey(date)).toBe("2026-08-22");
    expect(daysBetween(parseLocalDate("2026-08-01"), parseLocalDate("2026-08-29"))).toBe(28);
  });
});
