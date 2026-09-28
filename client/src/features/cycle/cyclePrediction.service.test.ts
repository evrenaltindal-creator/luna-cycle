import { describe, expect, it } from "vitest";
import { calculatePrediction, MIN_COMPLETED_CYCLES } from "./cyclePrediction.service";

const day = (key: string, offset = 0) => {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + offset);
  return date;
};
const key = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const starts = (intervals: number[]) => intervals.reduce<string[]>((dates, interval) => {
  dates.push(key(day(dates.at(-1) ?? "2026-01-01", interval)));
  return dates;
}, ["2026-01-01"]);
const records = (dates: string[]) => dates.map(startDate => ({ startDate }));
const afterLast = (dates: string[]) => day(dates.at(-1) ?? "2026-01-01", 1);

describe("calculatePrediction", () => {
  it("bir ya da iki tamamlanmış aralıkta kişisel tarih veya ortalama gösterilmesine izin vermez", () => {
    expect(MIN_COMPLETED_CYCLES).toBe(3);
    for (const intervals of [[], [21], [21, 24]]) {
      const dates = starts(intervals);
      const result = calculatePrediction(records(dates), { referenceDate: afterLast(dates) });
      expect(result.stage).toBe("learning");
      expect(result.hasPersonalizedPrediction).toBe(false);
      expect(result.futureWindows).toEqual([]);
      expect(result.futurePeriods).toEqual([]);
      expect(result.estimatedOvulationWindows).toEqual([]);
      expect(result.remainingCycles).toBe(3 - intervals.length);
    }
  });

  it("21 ve 24 günlük kişisel döngüler için ilk yaklaşık aralığı üç döngüden sonra çıkarır", () => {
    const dates = starts([21, 24, 22]);
    const referenceDate = afterLast(dates);
    const result = calculatePrediction(records(dates), { referenceDate });
    expect(result.stage).toBe("tentative");
    expect(result.hasPersonalizedPrediction).toBe(true);
    expect(result.lengths).toEqual([21, 24, 22]);
    expect(result.average).toBe(22.3);
    expect(result.futureWindows).toHaveLength(1);
    expect(result.futureWindows[0].start >= referenceDate).toBe(true);
    expect(result.futureWindows[0].end > result.futureWindows[0].start).toBe(true);
    expect(result.estimatedOvulationWindows).toHaveLength(1);
    expect(key(result.estimatedOvulationWindows[0].start)).toBe("2026-03-11");
    expect(key(result.estimatedOvulationWindows[0].end)).toBe("2026-03-25");
  });

  it("28 günlük döngüde tek gün yerine sonraki adet belirsizliğini de içeren ovülasyon aralığı verir", () => {
    const dates = starts([28, 28, 28]);
    const result = calculatePrediction(records(dates), { referenceDate: afterLast(dates) });
    expect(key(result.estimatedOvulationWindows[0].start)).toBe("2026-04-03");
    expect(key(result.estimatedOvulationWindows[0].end)).toBe("2026-04-17");
  });

  it("altı birbirine yakın döngüde aralığı daraltır fakat tek kesin gün iddia etmez", () => {
    const dates = starts([24, 24, 25, 24, 23, 24]);
    const result = calculatePrediction(records(dates), { referenceDate: afterLast(dates) });
    expect(result.stage).toBe("familiar");
    expect(result.lengths).toHaveLength(6);
    expect(result.futureWindows).toHaveLength(3);
    expect(result.estimatedOvulationWindows).toHaveLength(3);
    expect(result.futureWindows[0].start < result.futureWindows[0].end).toBe(true);
    expect(result.futureWindows[0].end < result.futureWindows[1].start).toBe(true);
  });

  it("tek uzun kayıt boşluğunu ortalamaya katmadan açıklama üretir", () => {
    const dates = starts([24, 60, 23, 25]);
    const result = calculatePrediction(records(dates), { referenceDate: afterLast(dates) });
    expect(result.lengths).toEqual([24, 23, 25]);
    expect(result.excludedGaps).toBe(1);
    expect(result.average).toBe(24);
    expect(result.stage).toBe("tentative");
    expect(result.confidenceReason).toContain("atlanmış");
  });

  it("90 günü aşan kayıtsız boşluktan sonra eski ritmi yeni kayda taşımaz", () => {
    const dates = starts([24, 25, 24, 120, 23, 24]);
    const result = calculatePrediction(records(dates), { referenceDate: afterLast(dates) });
    expect(result.resetAfterLongGap).toBe(true);
    expect(result.recordedStarts).toBe(3);
    expect(result.lengths).toEqual([23, 24]);
    expect(result.stage).toBe("learning");
    expect(result.futureWindows).toEqual([]);
    expect(result.estimatedOvulationWindows).toEqual([]);
    expect(result.confidenceReason).toContain("yeniden öğreniyoruz");
  });

  it("bitişi bilinmeyen kayıttan adet süresi uydurmaz", () => {
    const dates = starts([28, 28, 28]);
    const result = calculatePrediction(records(dates), { referenceDate: afterLast(dates) });
    expect(result.hasPersonalizedPrediction).toBe(true);
    expect(result.periodLengths).toEqual([]);
    expect(result.hasPeriodDurationEstimate).toBe(false);
    expect(result.futurePeriods).toEqual([]);
  });

  it("üç gerçek bitişten sonra adet süresini ayrı hesaplar", () => {
    const dates = starts([28, 29, 27]);
    const durations = [5, 6, 4, 5];
    const result = calculatePrediction(dates.map((startDate, index) => ({
      startDate,
      endDate: key(day(startDate, durations[index] - 1)),
    })), { referenceDate: day(dates.at(-1) ?? "2026-01-01", 10) });
    expect(result.periodLengths).toEqual(durations);
    expect(result.averagePeriodLength).toBe(5);
    expect(result.hasPeriodDurationEstimate).toBe(true);
    expect(result.futurePeriods).toHaveLength(1);
  });

  it("yaklaşık aralık geçince kayıt olmadan sonraki ayı tahmin etmez", () => {
    const dates = starts([28, 28, 28]);
    const expectedCenter = day(dates.at(-1) ?? "2026-01-01", 28);
    const result = calculatePrediction(records(dates), { referenceDate: day(key(expectedCenter), 5) });
    expect(result.stage).toBe("stale");
    expect(result.hasPersonalizedPrediction).toBe(false);
    expect(result.futureWindows).toEqual([]);
    expect(result.estimatedOvulationWindows).toEqual([]);
  });

  it("eski başlangıçlardan bugüne otomatik yeni tarih taşımayı durdurur", () => {
    const dates = starts([28, 28, 28]);
    const result = calculatePrediction(records(dates), { referenceDate: day("2026-09-27") });
    expect(result.stage).toBe("stale");
    expect(result.hasPersonalizedPrediction).toBe(false);
    expect(result.futureWindows).toEqual([]);
  });

  it("kayıt silinince öğrenme aşamasına geri döner", () => {
    const dates = starts([21, 24, 22]);
    const before = calculatePrediction(records(dates), { referenceDate: afterLast(dates) });
    const after = calculatePrediction(records(dates.slice(0, -1)), { referenceDate: afterLast(dates) });
    expect(before.hasPersonalizedPrediction).toBe(true);
    expect(after.hasPersonalizedPrediction).toBe(false);
  });

  it("kullanıcı tercihi tek kayıtla kişisel tahmin sayılmaz", () => {
    const result = calculatePrediction([{ startDate: "2026-09-01" }], {
      referenceDate: day("2026-09-05"), fallbackCycleLength: 32, fallbackPeriodLength: 4,
    });
    expect(result.average).toBe(32);
    expect(result.hasPersonalizedPrediction).toBe(false);
    expect(result.futureWindows).toEqual([]);
  });
});
