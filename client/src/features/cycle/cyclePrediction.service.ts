// Predictions use real start-to-start intervals and completed period lengths; dates remain local.
import { getCyclePhase } from "./cyclePhase.service";

export type PredictionConfidence = "high" | "medium" | "low";
export type PredictedPeriod = { start: Date; end: Date };
export type PredictionStage = "learning" | "tentative" | "familiar" | "stale";
export const MIN_COMPLETED_CYCLES = 3;
export type PredictionResult = {
  last: Date;
  average: number;
  weightedAverage: number;
  averagePeriodLength: number;
  next: Date;
  start: Date;
  end: Date;
  futurePeriods: PredictedPeriod[];
  futureWindows: PredictedPeriod[];
  lengths: number[];
  periodLengths: number[];
  recordedStarts: number;
  remainingCycles: number;
  excludedGaps: number;
  resetAfterLongGap: boolean;
  stage: PredictionStage;
  hasPersonalizedPrediction: boolean;
  hasPeriodDurationEstimate: boolean;
  variability: number;
  confidence: "Yüksek" | "Orta" | "Düşük";
  confidenceKey: PredictionConfidence;
  confidenceReason: string;
  cycleDay: number;
  phase: string;
};

type InputRecord = { startDate?: string; date?: string; endDate?: string | null; length?: number };
type PredictionOptions = { referenceDate?: Date; fallbackCycleLength?: number; fallbackPeriodLength?: number };

const toDate = (key: string) => new Date(`${key}T12:00:00`);
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const validDateKey = (key: string) => /^\d{4}-\d{2}-\d{2}$/.test(key) && dateKey(toDate(key)) === key;
const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const dayGap = (first: Date, second: Date) => Math.round((second.getTime() - first.getTime()) / 86400000);
const today = () => { const date = new Date(); return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12); };
const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
const median = (values: number[]) => { const sorted = [...values].sort((a, b) => a - b); const middle = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2; };

export function calculatePrediction(records: InputRecord[], options: PredictionOptions = {}): PredictionResult {
  const reference = options.referenceDate ? toDate(dateKey(options.referenceDate)) : today();
  const fallbackCycle = options.fallbackCycleLength && options.fallbackCycleLength >= 15 && options.fallbackCycleLength <= 90 ? options.fallbackCycleLength : 28;
  const fallbackPeriod = options.fallbackPeriodLength && options.fallbackPeriodLength >= 1 && options.fallbackPeriodLength <= 14 ? options.fallbackPeriodLength : 5;
  const sorted = records
    .map(record => ({ ...record, startDate: record.startDate ?? record.date ?? "" }))
    .filter(record => validDateKey(record.startDate) && toDate(record.startDate) <= reference)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  const distinct = sorted.filter((record, index) => index === 0 || record.startDate !== sorted[index - 1].startDate);
  const last = distinct.length ? toDate(distinct[distinct.length - 1].startDate) : reference;
  const allGaps = distinct.slice(1)
    .map((record, index) => dayGap(toDate(distinct[index].startDate), toDate(record.startDate)));
  // After a very long untracked interval, old rhythm is not evidence for a new start.
  const lastUntrackedGap = allGaps.findLastIndex(value => value > 90);
  const resetAfterLongGap = lastUntrackedGap >= 0;
  const recent = resetAfterLongGap ? distinct.slice(lastUntrackedGap + 1) : distinct;
  const candidateLengths = recent.slice(1)
    .map((record, index) => dayGap(toDate(recent[index].startDate), toDate(record.startDate)))
    .filter(value => value >= 15 && value <= 90)
    .slice(-8);
  // A single long gap among shorter cycles may be a missed entry, not a new personal rhythm.
  const longGapLimit = candidateLengths.length >= 3 ? Math.max(45, median(candidateLengths) * 1.6) : 90;
  const usableLengths = candidateLengths.filter(value => value <= longGapLimit);
  const lengths = usableLengths.slice(-6);
  const excludedGaps = candidateLengths.length - usableLengths.length;
  const periodLengths = distinct
    .map(record => {
      if (record.endDate && validDateKey(record.endDate) && toDate(record.endDate) <= reference) {
        return dayGap(toDate(record.startDate), toDate(record.endDate)) + 1;
      }
      return record.endDate ? 0 : record.length ?? 0;
    })
    .filter(value => value >= 1 && value <= 14)
    .slice(-6);
  const average = lengths.length ? mean(lengths) : fallbackCycle;
  const weights = lengths.map((_, index) => Math.min(3, 1 + (index / Math.max(1, lengths.length - 1)) * 2));
  const weightedAverage = lengths.length ? lengths.reduce((sum, value, index) => sum + value * weights[index], 0) / weights.reduce((sum, weight) => sum + weight, 0) : fallbackCycle;
  const averagePeriodLength = periodLengths.length ? mean(periodLengths) : fallbackPeriod;
  const cycleDays = Math.round(average);
  const periodDays = Math.round(averagePeriodLength);
  const variability = lengths.length > 1 ? Math.sqrt(mean(lengths.map(value => (value - average) ** 2))) : 7;
  const tentativeSpread = Math.min(14, Math.max(4, Math.ceil(variability * 1.5)));
  // Do not roll an expired window forward by assuming an unrecorded period happened.
  const stale = distinct.length > 0 && lengths.length >= MIN_COMPLETED_CYCLES && dayGap(last, reference) > cycleDays + tentativeSpread;
  const stage: PredictionStage = lengths.length < MIN_COMPLETED_CYCLES ? "learning" : stale ? "stale" : lengths.length >= 6 && variability <= 4 && excludedGaps === 0 ? "familiar" : "tentative";
  const hasPersonalizedPrediction = stage === "tentative" || stage === "familiar";
  const hasPeriodDurationEstimate = periodLengths.length >= MIN_COMPLETED_CYCLES;
  const spread = Math.min(14, Math.max(stage === "familiar" ? 2 : 4, Math.ceil(variability * 1.5)));
  let next = addDays(last, cycleDays);
  while (next < reference) next = addDays(next, cycleDays);
  const futureWindows = hasPersonalizedPrediction ? Array.from({ length: stage === "familiar" ? 3 : 1 }, (_, index) => {
    const start = addDays(next, cycleDays * index);
    const windowSpread = Math.min(21, Math.floor((cycleDays - 1) / 2), spread + index * 2);
    const earliest = addDays(start, -windowSpread);
    return { start: index === 0 && earliest < reference ? reference : earliest, end: addDays(start, windowSpread) };
  }) : [];
  const futurePeriods = hasPersonalizedPrediction && hasPeriodDurationEstimate ? Array.from({ length: stage === "familiar" ? 3 : 1 }, (_, index) => {
    const start = addDays(next, cycleDays * index);
    return { start, end: addDays(start, periodDays - 1) };
  }) : [];
  const confidenceKey: PredictionConfidence = stage === "familiar" ? "high" : stage === "tentative" ? "medium" : "low";
  const confidence = confidenceKey === "high" ? "Yüksek" : confidenceKey === "medium" ? "Orta" : "Düşük";
  const confidenceReason = stage === "learning" && resetAfterLongGap ? "Uzun kayıt boşluğundan sonra yakın dönem kayıtlarıyla yeniden öğreniyoruz." : stage === "learning" ? "Kişisel aralık için üç tamamlanmış döngü kaydı bekleniyor." : stage === "stale" ? "Önceki yaklaşık aralık geçti; yeni kayıt olmadan ileri tarih tahmini yapmıyoruz." : excludedGaps ? "Uzun bir kayıt aralığı tahmine katılmadı; atlanmış bir kayıt olabilir." : variability > 5 ? "Döngüler arasındaki değişkenlik tahmini aralığı genişletiyor." : "Bu aralık kayıtlarına dayanır, kesin bir tarih değildir.";
  const elapsed = Math.max(0, dayGap(last, reference));
  const cycleDay = distinct.length ? elapsed + 1 : 1;
  const phase = getCyclePhase(cycleDay, cycleDays, periodDays, hasPersonalizedPrediction);
  return {
    last,
    average: Number(average.toFixed(1)),
    weightedAverage: Number(weightedAverage.toFixed(1)),
    averagePeriodLength: Number(averagePeriodLength.toFixed(1)),
    next,
    start: addDays(next, -spread),
    end: addDays(next, spread),
    futurePeriods,
    futureWindows,
    lengths,
    periodLengths,
    recordedStarts: recent.length,
    remainingCycles: Math.max(0, MIN_COMPLETED_CYCLES - lengths.length),
    excludedGaps,
    resetAfterLongGap,
    stage,
    hasPersonalizedPrediction,
    hasPeriodDurationEstimate,
    variability: Number(variability.toFixed(1)),
    confidence,
    confidenceKey,
    confidenceReason,
    cycleDay,
    phase,
  };
}
