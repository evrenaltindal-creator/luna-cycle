export const supportedLanguages = ["tr", "en", "ru", "de", "es"] as const;
export type Language = (typeof supportedLanguages)[number];

export const languageNames: Record<Language, string> = {
  tr: "Türkçe",
  en: "English",
  ru: "Русский",
  de: "Deutsch",
  es: "Español",
};

export function normalizeLanguage(value: unknown): Language | null {
  if (typeof value !== "string") return null;
  const code = value.toLowerCase().split(/[-_]/)[0];
  return supportedLanguages.find(language => language === code) ?? null;
}

export function detectLanguage(): Language {
  if (typeof navigator === "undefined") return "tr";
  for (const language of navigator.languages ?? [navigator.language]) {
    const match = normalizeLanguage(language);
    if (match) return match;
  }
  return "tr";
}

export const localeTag: Record<Language, string> = {
  tr: "tr-TR",
  en: "en-US",
  ru: "ru-RU",
  de: "de-DE",
  es: "es-ES",
};
