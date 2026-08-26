import { describe, expect, it } from "vitest";
import { calculatePrediction } from "./cyclePrediction.service";

const starts = (lengths: number[]) => lengths.reduce<string[]>((dates, length) => { const previous = new Date(`${dates.at(-1) ?? "2026-01-01"}T12:00:00`); previous.setDate(previous.getDate() + length); dates.push(previous.toISOString().slice(0, 10)); return dates; }, ["2026-01-01"]);
const records = (dates: string[]) => dates.map((startDate) => ({ startDate }));

describe("calculatePrediction", () => {
  it("boş ve tek kayıtta güveni düşük tutar", () => {
    expect(calculatePrediction([]).confidenceKey).toBe("low");
    expect(calculatePrediction(records(["2026-01-01"])).next.toISOString().slice(0, 10)).toBe("2026-01-29");
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
});
