import { useState } from "react";
import { getPreferences, savePreferences } from "@/features/cycle/cycle.storage";
import { getLanguage, setLanguage, t } from ".";
import { languageNames, supportedLanguages, type Language } from "./language";

export function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const [value, setValue] = useState(getLanguage);
  const [error, setError] = useState(false);
  return <label className={compact ? "language-selector compact" : "language-selector"}>
    <span>{t("Dil / Language")}</span>
    <select aria-label={t("Uygulama dili")} value={value} onChange={event => {
      const next = event.target.value as Language;
      if (!savePreferences({ ...getPreferences(), language: next })) { setError(true); return; }
      setValue(next);
      setError(false);
      setLanguage(next);
    }}>
      {supportedLanguages.map(language => <option key={language} value={language}>{languageNames[language]}</option>)}
    </select>
    {error && <small role="alert">{t("Dil tercihi kaydedilemedi.")}</small>}
  </label>;
}
