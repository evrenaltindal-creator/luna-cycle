// Style: Sessiz Ay Takvimi — system theme respects the device; overrides are explicit.
export type ThemePreference = "system" | "light" | "dark";
export function resolveTheme(theme: ThemePreference, systemDark: boolean): "light" | "dark" { return theme === "system" ? (systemDark ? "dark" : "light") : theme; }
