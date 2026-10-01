import { afterEach, describe, expect, it } from "vitest";
import { getLanguage, initializeLanguage, localizedMonth, t } from ".";
import { normalizeLanguage, supportedLanguages } from "./language";
import { termsSections } from "@/features/legal/terms";

afterEach(() => initializeLanguage("tr"));

describe("app languages", () => {
  it("accepts the five requested languages and normalizes device locales", () => {
    expect(supportedLanguages).toEqual(["tr", "en", "ru", "de", "es"]);
    expect(normalizeLanguage("de-DE")).toBe("de");
    expect(normalizeLanguage("es_MX")).toBe("es");
    expect(normalizeLanguage("fr-FR")).toBeNull();
  });

  it("uses reviewed period terminology and localized month names", () => {
    for (const [language, button, january] of [
      ["tr", "Adet başladı", "Ocak"],
      ["en", "Period started", "January"],
      ["ru", "Начались месячные", "январь"],
      ["de", "Periode begonnen", "Januar"],
      ["es", "Comenzó el período", "enero"],
    ] as const) {
      initializeLanguage(language);
      expect(getLanguage()).toBe(language);
      expect(t("Adet başladı")).toBe(button);
      expect(localizedMonth(new Date(2024, 0, 1)).toLocaleLowerCase(language)).toBe(january.toLocaleLowerCase(language));
    }
  });

  it("shows the contraception limitation in each language", () => {
    const source = termsSections[2].paragraphs[0];
    for (const language of ["en", "ru", "de", "es"] as const) {
      initializeLanguage(language);
      const localized = t(source);
      expect(localized).not.toBe(source);
      expect(localized.length).toBeGreaterThan(180);
    }
  });

  it("makes the provider and contact available in every supported language", () => {
    const contact = termsSections[7].paragraphs[1];
    for (const language of supportedLanguages) {
      initializeLanguage(language);
      const localized = t(contact);
      expect(localized).toContain("Evren Altındal");
      expect(localized).toContain("info@ewocom.com");
      expect(localized).not.toContain("TestFlight");
      if (language !== "tr") expect(localized).not.toBe(contact);
    }
  });
});
