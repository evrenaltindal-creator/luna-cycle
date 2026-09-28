import { describe, expect, it } from "vitest";
import { resolveTheme } from "../preferences/theme.service";

describe("theme engine", () => {
  it("resolves system preference", () => { expect(resolveTheme("system", false)).toBe("light"); expect(resolveTheme("system", true)).toBe("dark"); });
  it("honors explicit overrides", () => { expect(resolveTheme("light", true)).toBe("light"); expect(resolveTheme("dark", false)).toBe("dark"); });
});
