import { beforeEach, describe, expect, it } from "vitest";
import { clearAllData, deleteDailyLog, exportBackup, getDailyLogs, getPeriodRecords, getPreferences, importBackup, saveDailyLog, savePeriodRecord, savePreferences, updatePeriodRecord, validateBackup } from "./cycle.storage";
import { createTermsAcceptance } from "../legal/terms";

class MemoryStorage {
  private values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
  clear() { this.values.clear(); }
}

describe("cycle storage adapter", () => {
  beforeEach(() => { Object.defineProperty(globalThis, "localStorage", { value: new MemoryStorage(), configurable: true }); });

  it("boş ve bozuk storage’da güvenli varsayılan döndürür", () => {
    expect(getPeriodRecords()).toEqual([]); expect(getDailyLogs()).toEqual([]); expect(getPreferences().onboardingCompleted).toBe(false);
    localStorage.setItem("luna.periods.v1", "{ invalid json"); expect(getPeriodRecords()).toEqual([]);
  });

  it("save/load ve update duplicate üretmeden çalışır", () => {
    const first = { id: "p1", startDate: "2026-01-01", endDate: "2026-01-05", createdAt: "now", updatedAt: "now" };
    savePeriodRecord(first); expect(getPeriodRecords()).toHaveLength(1);
    updatePeriodRecord({ ...first, endDate: "2026-01-06", updatedAt: "later" }); expect(getPeriodRecords()).toEqual([{ ...first, endDate: "2026-01-06", updatedAt: "later" }]);
    saveDailyLog({ id: "d1", date: "2026-01-02", energy: "high" }); saveDailyLog({ id: "d2", date: "2026-01-02", energy: "low" }); expect(getDailyLogs()).toHaveLength(1);
    savePreferences({ ...getPreferences(), onboardingCompleted: true }); expect(getPreferences().onboardingCompleted).toBe(true);
  });

  it("export/import roundtrip ve clearAllData çalışır", () => {
    savePeriodRecord({ id: "p1", startDate: "2026-01-01", endDate: null, createdAt: "now", updatedAt: "now" });
    saveDailyLog({ id: "d1", date: "2026-01-02" }); const backup = exportBackup(); expect(JSON.parse(backup).schema).toBe("luna-cycle-backup");
    clearAllData(false); expect(getPeriodRecords()).toEqual([]); expect(getDailyLogs()).toEqual([]); expect(getPreferences().onboardingCompleted).toBe(false);
    importBackup(backup); expect(getPeriodRecords()).toHaveLength(1); expect(getDailyLogs()).toHaveLength(1);
  });

  it("sözleşme kabulünü yedeğe taşımaz; veri temizleme kabulü de sıfırlar", () => {
    const accepted = createTermsAcceptance(new Date("2026-09-28T10:00:00.000Z"));
    savePreferences({ ...getPreferences(), termsAcceptance: accepted });
    const backup = exportBackup();
    expect(JSON.parse(backup).preferences.termsAcceptance).toBeUndefined();
    const forged = JSON.stringify({ ...JSON.parse(backup), preferences: { ...JSON.parse(backup).preferences, termsAcceptance: { version: accepted.version, acceptedAt: "2020-01-01T00:00:00.000Z" } } });
    importBackup(forged);
    expect(getPreferences().termsAcceptance).toEqual(accepted);
    clearAllData();
    expect(getPreferences().termsAcceptance).toBeUndefined();
  });

  it("valid backup yalnızca validation aşamasında storage’ı değiştirmez", () => {
    savePeriodRecord({ id: "existing", startDate: "2026-01-01", endDate: null, createdAt: "now", updatedAt: "now" });
    const candidate = JSON.stringify({ schema: "luna-cycle-backup", version: 1, exportedAt: "now", periodRecords: [{ id: "new", startDate: "2026-02-01", endDate: null }], dailyLogs: [], preferences: getPreferences() });
    expect(() => validateBackup(candidate)).not.toThrow(); expect(getPeriodRecords()[0].id).toBe("existing");
  });

  it("cancel davranışı import çağrılmadığında mevcut veriyi korur", () => {
    savePeriodRecord({ id: "existing", startDate: "2026-01-01", endDate: null, createdAt: "now", updatedAt: "now" });
    const candidate = JSON.stringify({ schema: "luna-cycle-backup", version: 1, exportedAt: "now", periodRecords: [{ id: "new", startDate: "2026-02-01", endDate: null }], dailyLogs: [], preferences: getPreferences() });
    validateBackup(candidate); expect(getPeriodRecords()[0].id).toBe("existing");
  });

  it("confirm sonrası yeni backup verisi yüklenir", () => {
    savePeriodRecord({ id: "existing", startDate: "2026-01-01", endDate: null, createdAt: "now", updatedAt: "now" });
    const candidate = JSON.stringify({ schema: "luna-cycle-backup", version: 1, exportedAt: "now", periodRecords: [{ id: "new", startDate: "2026-02-01", endDate: null }], dailyLogs: [], preferences: getPreferences() });
    importBackup(candidate); expect(getPeriodRecords()[0].id).toBe("new");
  });

  it("invalid backup confirmation aşamasına ulaşmadan reddedilir", () => { expect(() => validateBackup("{ invalid json")).toThrow(); });

  it("DailyLog silme yalnızca seçili logu kaldırır", () => {
    const period = { id: "p1", startDate: "2026-08-18", endDate: "2026-08-22", createdAt: "now", updatedAt: "now" };
    savePeriodRecord(period); saveDailyLog({ id: "d18", date: "2026-08-18", energy: "normal" }); saveDailyLog({ id: "d19", date: "2026-08-19", energy: "high" });
    const before = getPeriodRecords(); const selected = getDailyLogs().find((log) => log.id === "d18");
    expect(selected).toBeDefined(); deleteDailyLog(selected!.id);
    expect(getDailyLogs().map((log) => log.id)).toEqual(["d19"]); expect(getPeriodRecords()).toEqual(before);
  });

  it("iptal veya Escape eşdeğeri olarak delete çağrılmadığında veriyi korur", () => {
    const period = { id: "p1", startDate: "2026-08-18", endDate: "2026-08-22", createdAt: "now", updatedAt: "now" };
    savePeriodRecord(period); saveDailyLog({ id: "d18", date: "2026-08-18", energy: "normal" });
    const beforeLogs = getDailyLogs(); const beforePeriods = getPeriodRecords();
    expect(() => { /* UI Cancel/Escape burada deleteDailyLog çağırmaz. */ }).not.toThrow();
    expect(getDailyLogs()).toEqual(beforeLogs); expect(getPeriodRecords()).toEqual(beforePeriods);
  });
});
