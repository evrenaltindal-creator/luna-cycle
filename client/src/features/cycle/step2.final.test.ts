import { describe, expect, it } from "vitest";
import { getCyclePhase } from "./cyclePhase.service";
import { resolveTheme } from "../preferences/theme.service";

describe("cycle phase engine", () => {
  it("period boundaries return period phase", () => { expect(getCyclePhase(1, 28, 5, true)).toBe("Adet dönemi"); expect(getCyclePhase(5, 28, 5, true)).toBe("Adet dönemi"); });
  it("returns follicular, estimated ovulation and luteal phases", () => { expect(getCyclePhase(8, 28, 5, true)).toBe("Foliküler faz"); expect(getCyclePhase(14, 28, 5, true)).toBe("Tahmini ovülasyon"); expect(getCyclePhase(20, 28, 5, true)).toBe("Luteal faz"); });
  it("handles insufficient data and irregular cycles safely", () => { expect(getCyclePhase(0, 28, 5, false)).toBe("Yetersiz veri"); expect(getCyclePhase(31, 45, 5, true)).toBe("Tahmini ovülasyon"); });
  it("resets at the next period boundary", () => { expect(getCyclePhase(1, 30, 5, true)).toBe("Adet dönemi"); });
});

describe("theme engine", () => {
  it("resolves system preference", () => { expect(resolveTheme("system", false)).toBe("light"); expect(resolveTheme("system", true)).toBe("dark"); });
  it("honors explicit overrides", () => { expect(resolveTheme("light", true)).toBe("light"); expect(resolveTheme("dark", false)).toBe("dark"); });
});
