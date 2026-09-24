// Predictions use real start-to-start intervals and completed period lengths; dates remain local.
import { getCyclePhase } from "./cyclePhase.service";

export type PredictionConfidence = "high" | "medium" | "low";
export type PredictedPeriod = { start: Date; end: Date };
export type PredictionResult = {
  last: Date;
  average: number;
  weightedAverage: number;
  averagePeriodLength: number;
  next: Date;
  start: Date;
  end: Date;
  futurePeriods: PredictedPeriod[];
  lengths: number[];
  periodLengths: number[];
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
  const lengths = distinct.slice(1)
    .map((record, index) => dayGap(toDate(distinct[index].startDate), toDate(record.startDate)))
    .filter(value => value >= 15 && value <= 90)
    .slice(-6);
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
  const spread = Math.max(2, Math.min(7, Math.round(variability)));
  let next = addDays(last, cycleDays);
  while (next < reference) next = addDays(next, cycleDays);
  const futurePeriods = Array.from({ length: 3 }, (_, index) => {
    const start = addDays(next, cycleDays * index);
    return { start, end: addDays(start, periodDays - 1) };
  });
  const stale = distinct.length > 0 && dayGap(last, reference) > 90;
  const confidenceKey: PredictionConfidence = stale ? "low" : lengths.length >= 4 && variability <= 3 ? "high" : lengths.length >= 2 && variability <= 5 ? "medium" : "low";
  const confidence = confidenceKey === "high" ? "Yüksek" : confidenceKey === "medium" ? "Orta" : "Düşük";
  const confidenceReason = stale ? "Son gerçek kayıt eski; yeni kayıtlar tahmini güçlendirir." : lengths.length < 2 ? "Daha fazla gerçek döngü kaydı oldukça tahmin güçlenecek." : variability > 5 ? "Döngüler arasındaki değişkenlik aralığı genişletiyor." : "Son gerçek döngü kayıtların birbirine yakın.";
  const elapsed = Math.max(0, dayGap(last, reference));
  const cycleDay = distinct.length ? elapsed % cycleDays + 1 : 1;
  const phase = getCyclePhase(cycleDay, cycleDays, periodDays, distinct.length > 0 && !stale);
  return {
    last,
    average: Number(average.toFixed(1)),
    weightedAverage: Number(weightedAverage.toFixed(1)),
    averagePeriodLength: Number(averagePeriodLength.toFixed(1)),
    next,
    start: addDays(next, -spread),
    end: addDays(next, spread),
    futurePeriods,
    lengths,
    periodLengths,
    variability: Number(variability.toFixed(1)),
    confidence,
    confidenceKey,
    confidenceReason,
    cycleDay,
    phase,
  };
}
