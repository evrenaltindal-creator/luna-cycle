// Style: Sessiz Ay Takvimi — tema seçimi sade, erişilebilir ve üç durumlu.
import { useState } from "react";
import { getPreferences, savePreferences } from "../cycle/cycle.storage";

export function ThemeSelector() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">(getPreferences().theme ?? "system");
  const change = (value: "system" | "light" | "dark") => { setTheme(value); savePreferences({ ...getPreferences(), theme: value }); window.dispatchEvent(new CustomEvent("luna-theme-change", { detail: value })); };
  return <label className="theme-selector">Tema<select aria-label="Tema seçimi" value={theme} onChange={(event) => change(event.target.value as "system" | "light" | "dark")}><option value="system">Sistem</option><option value="light">Açık</option><option value="dark">Koyu</option></select></label>;
}
