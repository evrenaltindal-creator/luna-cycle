import { t } from "../../i18n";
// Style: Sessiz Ay Takvimi — tema seçimi sade, erişilebilir ve üç durumlu.
import { useEffect, useState } from "react";
import { getPreferences, savePreferences } from "../cycle/cycle.storage";

export function ThemeSelector() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">(getPreferences().theme ?? "system");
  useEffect(() => {
    const syncTheme = () => setTheme(getPreferences().theme ?? "system");
    window.addEventListener("luna-theme-change", syncTheme);
    return () => window.removeEventListener("luna-theme-change", syncTheme);
  }, []);
  const change = (value: "system" | "light" | "dark") => { setTheme(value); savePreferences({ ...getPreferences(), theme: value }); window.dispatchEvent(new CustomEvent("luna-theme-change", { detail: value })); };
  return <label className="theme-selector">{t("Tema")}<select aria-label={t("Tema seçimi")} value={theme} onChange={(event) => change(event.target.value as "system" | "light" | "dark")}><option value="system">{t("Sistem")}</option><option value="light">{t("Açık")}</option><option value="dark">{t("Koyu")}</option></select></label>;
}
