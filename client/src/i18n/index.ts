import { detectLanguage, localeTag, type Language } from "./language";
import { translations } from "./translations";
import { overrides } from "./overrides";
import { legalTranslation } from "./legalTranslations";
import { formatMessage } from "./messages";

let currentLanguage: Language = detectLanguage();

export function getLanguage(): Language { return currentLanguage; }

export function initializeLanguage(language: Language) {
  currentLanguage = language;
  if (typeof document !== "undefined") {
    document.documentElement.lang = language;
    document.title = {
      tr: "Luna Cycle — Döngün senin alanın",
      en: "Luna Cycle — Your cycle, your space",
      ru: "Luna Cycle — Ваш цикл, ваше пространство",
      de: "Luna Cycle — Dein Zyklus, dein Raum",
      es: "Luna Cycle — Tu ciclo, tu espacio",
    }[language];
  }
}

export function setLanguage(language: Language) {
  initializeLanguage(language);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("luna-language-changed"));
}

export function t(source: string): string {
  if (currentLanguage === "tr") return source;
  const key = source.trim().replace(/\s+/g, " ");
  const legal = legalTranslation(key, currentLanguage);
  if (legal) return legal;
  const override = overrides[key];
  if (override) return override[["en", "ru", "de", "es"].indexOf(currentLanguage)];
  return translations[currentLanguage][key] ?? source;
}

export function formatLocalizedDate(date: Date, withYear = true): string {
  return new Intl.DateTimeFormat(localeTag[currentLanguage], {
    day: "numeric", month: "long", ...(withYear ? { year: "numeric" } : {}),
  }).format(date);
}

export function localizedMonth(date: Date): string {
  return new Intl.DateTimeFormat(localeTag[currentLanguage], { month: "long" }).format(date);
}

export function localizedWeekdays(): string[] {
  const monday = new Date(2024, 0, 1);
  return Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(localeTag[currentLanguage], { weekday: "short" }).format(new Date(2024, 0, 1 + index))
  );
}

export function msg(key: Parameters<typeof formatMessage>[1], values: Record<string, string | number>): string {
  return formatMessage(currentLanguage, key, values);
}
