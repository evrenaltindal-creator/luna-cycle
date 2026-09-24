import { describe, expect, it } from "vitest";
import { calculatePrediction } from "./cyclePrediction.service";

const starts = (lengths: number[]) => lengths.reduce<string[]>((dates, length) => { const previous = new Date(`${dates.at(-1) ?? "2026-01-01"}T12:00:00`); previous.setDate(previous.getDate() + length); dates.push(previous.toISOString().slice(0, 10)); return dates; }, ["2026-01-01"]);
const records = (dates: string[]) => dates.map((startDate) => ({ startDate }));

describe("calculatePrediction", () => {
  it("boş ve tek kayıtta güveni düşük tutar", () => {
    expect(calculatePrediction([]).confidenceKey).toBe("low");
    expect(calculatePrediction(records(["2026-01-01"]), { referenceDate: new Date(2026, 0, 15) }).next.toISOString().slice(0, 10)).toBe("2026-01-29");
  });
  it("iki başlangıç arasındaki cycle uzunluğunu hesaplar", () => {
    const result = calculatePrediction(records(starts([28])));
    expect(result.lengths).toEqual([28]);
    expect(result.weightedAverage).toBe(28);
  });
  it("yeni cycle’a daha yüksek ağırlık verir", () => {
    const result = calculatePrediction(records(starts([35, 27])));
    expect(result.average).toBe(31);
    expect(result.weightedAverage).toBeLessThan(result.average);
    expect(result.weightedAverage).toBeGreaterThan(27);
  });
  it("en son en fazla altı cycle’ı kullanır", () => {
    const result = calculatePrediction(records(starts([90, 15, 28, 29, 27, 30, 28, 27])));
    expect(result.lengths).toHaveLength(6);
    expect(result.lengths).not.toContain(90);
  });
  it("düzenli veride minimum range ve düzensiz veride geniş range üretir", () => {
    const regular = calculatePrediction(records(starts([28, 28, 29, 28, 27])));
    const irregular = calculatePrediction(records(starts([24, 34, 27, 36, 25])));
    expect((regular.end.getTime() - regular.next.getTime()) / 86400000).toBeGreaterThanOrEqual(2);
    expect((irregular.end.getTime() - irregular.next.getTime())).toBeGreaterThan((regular.end.getTime() - regular.next.getTime()));
    expect((irregular.end.getTime() - irregular.next.getTime()) / 86400000).toBeLessThanOrEqual(7);
  });
  it("yüksek değişkenlikte düşük confidence üretir", () => {
    expect(calculatePrediction(records(starts([20, 50]))).confidenceKey).toBe("low");
  });
  it("kayıt silindiğinde prediction cache kullanmadan değişir", () => {
    const before = calculatePrediction(records(starts([28, 29, 30])));
    const after = calculatePrediction(records(starts([28, 29])));
    expect(after.next.getTime()).not.toBe(before.next.getTime());
  });
  it("geçmiş başlangıç ve bitişlerden döngü ile adet süresi ortalamasını çıkarır", () => {
    const result = calculatePrediction([
      { startDate: "2026-01-01", endDate: "2026-01-05" },
      { startDate: "2026-01-29", endDate: "2026-02-02" },
      { startDate: "2026-02-28", endDate: "2026-03-05" },
    ], { referenceDate: new Date(2026, 2, 10) });
    expect(result.lengths).toEqual([28, 30]);
    expect(result.average).toBe(29);
    expect(result.periodLengths).toEqual([5, 5, 6]);
    expect(result.averagePeriodLength).toBe(5.3);
    expect(result.futurePeriods.map(period => period.start.toISOString().slice(0, 10))).toEqual(["2026-03-29", "2026-04-27", "2026-05-26"]);
    expect(result.futurePeriods[0].end.toISOString().slice(0, 10)).toBe("2026-04-02");
  });
  it("eski kayıtlarda bir sonraki gerçek gelecek döneme ilerler", () => {
    const result = calculatePrediction([{ startDate: "2026-01-01", endDate: "2026-01-05" }], { referenceDate: new Date(2026, 8, 24) });
    expect(result.next >= new Date(2026, 8, 24)).toBe(true);
    expect(result.confidenceKey).toBe("low");
  });
  it("yeterli gerçek kayıt yoksa kullanıcının yaklaşık değerlerini kullanır", () => {
    const result = calculatePrediction([{ startDate: "2026-09-01" }], { referenceDate: new Date(2026, 8, 5), fallbackCycleLength: 32, fallbackPeriodLength: 4 });
    expect(result.average).toBe(32);
    expect(result.averagePeriodLength).toBe(4);
    expect(result.futurePeriods[0].end.toISOString().slice(0, 10)).toBe("2026-10-06");
  });
});
