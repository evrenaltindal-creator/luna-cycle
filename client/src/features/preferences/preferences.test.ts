import { beforeEach, describe, expect, it } from "vitest";
import { getPreferences, savePreferences } from "../cycle/cycle.storage";

class MemoryStorage { private values = new Map<string, string>(); getItem(key: string) { return this.values.get(key) ?? null; } setItem(key: string, value: string) { this.values.set(key, value); } removeItem(key: string) { this.values.delete(key); } clear() { this.values.clear(); } }

describe("preferences storage", () => {
  beforeEach(() => { Object.defineProperty(globalThis, "localStorage", { value: new MemoryStorage(), configurable: true }); });
  it("returns safe defaults", () => { expect(getPreferences()).toMatchObject({ averageCycleLength: 28, averagePeriodLength: 5, notificationEnabled: false, notificationDaysBefore: 3, privateNotificationText: true, theme: "system" }); });
  it("persists reminder and theme choices", () => { for (const value of [1, 2, 3, 5] as const) { savePreferences({ ...getPreferences(), notificationEnabled: true, notificationDaysBefore: value }); expect(getPreferences().notificationDaysBefore).toBe(value); } for (const theme of ["system", "light", "dark"] as const) { savePreferences({ ...getPreferences(), theme, privateNotificationText: false }); expect(getPreferences()).toMatchObject({ theme, privateNotificationText: false }); } });
  it("bootstraps stored dark, light, and system values without changing them", () => { for (const theme of ["dark", "light", "system"] as const) { localStorage.setItem("luna.preferences.v1", JSON.stringify({ storageVersion: 1, data: { theme } })); expect(getPreferences().theme).toBe(theme); } });
  it("does not let a default preference overwrite a hydrated theme", () => { localStorage.setItem("luna.preferences.v1", JSON.stringify({ storageVersion: 1, data: { theme: "dark" } })); const hydrated = getPreferences(); savePreferences({ ...hydrated, notificationEnabled: true }); expect(getPreferences().theme).toBe("dark"); });
  it("falls back to system for absent or corrupted theme values", () => { expect(getPreferences().theme).toBe("system"); localStorage.setItem("luna.preferences.v1", "{not-json"); expect(getPreferences().theme).toBe("system"); localStorage.setItem("luna.preferences.v1", JSON.stringify({ storageVersion: 1, data: { theme: "sepia" } })); expect(getPreferences().theme).toBe("system"); });
  it("migrates legacy darkMode and rejects invalid numeric preferences", () => { localStorage.setItem("luna.preferences.v1", JSON.stringify({ storageVersion: 1, data: { darkMode: true, averageCycleLength: 0, averagePeriodLength: -2, notificationDaysBefore: 9 } })); expect(getPreferences()).toMatchObject({ averageCycleLength: 28, averagePeriodLength: 5, notificationDaysBefore: 3, theme: "dark" }); });
});
