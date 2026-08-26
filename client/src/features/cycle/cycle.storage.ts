// Style: Sessiz Ay Takvimi — one business API, two storage adapters, atomic writes, and no health data network path.
import type { PeriodRecord, UserPreferences } from "./cycle.types";
import { isNativePlatform } from "@/platform/platform";
import { nativeReplace, nativeSnapshot, nativeStorageReady } from "./nativeStorage.adapter";

export const VERSION = 1;
const keys = { periods: "luna.periods.v1", logs: "luna.daily-logs.v1", preferences: "luna.preferences.v1" } as const;
const defaultPreferences: UserPreferences = { averageCycleLength: 28, averagePeriodLength: 5, onboardingCompleted: false, notificationEnabled: false, notificationDaysBefore: 3, privateNotificationText: true, theme: "system" };

type NativeKey = "periods" | "logs" | "preferences";
const nativeKey = (key: string): NativeKey | null => key === keys.periods ? "periods" : key === keys.logs ? "logs" : key === keys.preferences ? "preferences" : null;
const unwrap = <T>(value: unknown, fallback: T): T => value && typeof value === "object" && "data" in value ? (value as { data: T }).data : (value as T) ?? fallback;
const safeRead = <T>(key: string, fallback: T): T => {
  if (isNativePlatform()) {
    const slot = nativeKey(key); const snapshot = nativeSnapshot();
    if (slot === "periods") return snapshot.periods as T;
    if (slot === "logs") return snapshot.logs as T;
    if (slot === "preferences") return (snapshot.preferences ?? fallback) as T;
  }
  try { const parsed = JSON.parse(localStorage.getItem(key) || "null"); return parsed === null ? fallback : unwrap(parsed, fallback); } catch { return fallback; }
};
const safeWrite = (key: string, value: unknown) => {
  try {
    if (isNativePlatform()) {
      if (!nativeStorageReady()) return false;
      const next = nativeSnapshot(); const slot = nativeKey(key);
      if (slot === "periods") next.periods = value as unknown[];
      if (slot === "logs") next.logs = value as unknown[];
      if (slot === "preferences") next.preferences = value as Record<string, unknown>;
      nativeReplace(next); return true;
    }
    localStorage.setItem(key, JSON.stringify({ storageVersion: VERSION, data: value })); return true;
  } catch { return false; }
};

export const getPeriodRecords = (): PeriodRecord[] => safeRead(keys.periods, []);
export const savePeriodRecord = (record: PeriodRecord) => safeWrite(keys.periods, [...getPeriodRecords().filter((item) => item.id !== record.id && item.startDate !== record.startDate), record]);
export const updatePeriodRecord = savePeriodRecord;
export const savePeriodRecords = (records: PeriodRecord[]) => safeWrite(keys.periods, records);
export const deletePeriodRecord = (id: string) => safeWrite(keys.periods, getPeriodRecords().filter((item) => item.id !== id));
export const getPreferences = (): UserPreferences => {
  const raw = safeRead(keys.preferences, {} as Partial<UserPreferences> & { darkMode?: unknown }); const cycle = Number(raw.averageCycleLength); const period = Number(raw.averagePeriodLength); const days = Number(raw.notificationDaysBefore);
  return { ...defaultPreferences, ...raw, averageCycleLength: Number.isInteger(cycle) && cycle >= 15 && cycle <= 90 ? cycle : defaultPreferences.averageCycleLength, averagePeriodLength: Number.isInteger(period) && period >= 1 && period <= 14 ? period : defaultPreferences.averagePeriodLength, notificationDaysBefore: ([1, 2, 3, 5] as number[]).includes(days) ? days as 1 | 2 | 3 | 5 : defaultPreferences.notificationDaysBefore, privateNotificationText: typeof raw.privateNotificationText === "boolean" ? raw.privateNotificationText : defaultPreferences.privateNotificationText, theme: raw.theme === "light" || raw.theme === "dark" || raw.theme === "system" ? raw.theme : typeof raw.darkMode === "boolean" ? (raw.darkMode ? "dark" : "light") : defaultPreferences.theme };
};
export const savePreferences = (preferences: UserPreferences) => safeWrite(keys.preferences, preferences);
export const getDailyLogs = <T = unknown>(): T[] => safeRead(keys.logs, []);
export const saveDailyLog = <T extends { id: string; date: string }>(log: T) => safeWrite(keys.logs, [...getDailyLogs<T>().filter((item) => item.id !== log.id && item.date !== log.date), log]);
export const deleteDailyLog = (id: string) => safeWrite(keys.logs, getDailyLogs<{ id: string }>().filter((item) => item.id !== id));
export const clearAllData = (keepTheme = true) => { const theme = keepTheme ? getPreferences().theme : "system"; if (isNativePlatform()) nativeReplace({ periods: [], logs: [], preferences: { ...defaultPreferences, theme } }); else { localStorage.removeItem(keys.periods); localStorage.removeItem(keys.logs); localStorage.removeItem(keys.preferences); savePreferences({ ...defaultPreferences, theme }); } };
export const exportBackup = () => JSON.stringify({ schema: "luna-cycle-backup", version: VERSION, exportedAt: new Date().toISOString(), periodRecords: getPeriodRecords(), dailyLogs: getDailyLogs(), preferences: getPreferences() }, null, 2);

export const validateBackup = (raw: string) => {
  const parsed: unknown = JSON.parse(raw); if (!parsed || typeof parsed !== "object") throw new Error("Geçersiz Luna yedek dosyası");
  const backup = parsed as { schema?: unknown; version?: unknown; periodRecords?: unknown; dailyLogs?: unknown; preferences?: unknown };
  if (backup.schema !== "luna-cycle-backup" || backup.version !== VERSION || !Array.isArray(backup.periodRecords) || !Array.isArray(backup.dailyLogs) || !backup.preferences || typeof backup.preferences !== "object") throw new Error("Geçersiz Luna yedek dosyası");
  const validDate = (value: unknown) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (!backup.periodRecords.every((item) => { if (!item || typeof item !== "object") return false; const record = item as { id?: unknown; startDate?: unknown; endDate?: unknown }; return typeof record.id === "string" && validDate(record.startDate) && (record.endDate === null || record.endDate === undefined || validDate(record.endDate)); })) throw new Error("Geçersiz dönem tarihi");
  if (!backup.dailyLogs.every((item) => !!item && typeof item === "object" && validDate((item as { date?: unknown }).date))) throw new Error("Geçersiz günlük kayıt tarihi");
  return backup;
};

export const importBackup = (raw: string) => { const backup = validateBackup(raw); const previous = { periods: getPeriodRecords(), logs: getDailyLogs(), preferences: getPreferences() }; try { if (!safeWrite(keys.periods, backup.periodRecords) || !safeWrite(keys.logs, backup.dailyLogs) || !safeWrite(keys.preferences, backup.preferences)) throw new Error("Yedek yazılamadı"); } catch (error) { safeWrite(keys.periods, previous.periods); safeWrite(keys.logs, previous.logs); safeWrite(keys.preferences, previous.preferences); throw error; } };
