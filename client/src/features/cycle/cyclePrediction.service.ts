// Style: Sessiz Ay Takvimi — deterministic, private, data-derived cycle calculations.
import { getCyclePhase } from "./cyclePhase.service";
export type PredictionConfidence = "high" | "medium" | "low";
export type PredictionResult = {
  last: Date;
  average: number;
  weightedAverage: number;
  next: Date;
  start: Date;
  end: Date;
  lengths: number[];
  variability: number;
  confidence: "Yüksek" | "Orta" | "Düşük";
  confidenceKey: PredictionConfidence;
  confidenceReason: string;
  cycleDay: number;
  phase: string;
};

const toDate = (key: string) => new Date(`${key}T12:00:00`);
const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const today = () => { const date = new Date(); return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12); };

export function calculatePrediction(records: Array<{ startDate?: string; date?: string }>): PredictionResult {
  const sorted = [...records].map((record) => ({ ...record, startDate: record.startDate ?? record.date ?? "" })).filter((record) => /^\d{4}-\d{2}-\d{2}$/.test(record.startDate)).sort((a, b) => a.startDate.localeCompare(b.startDate));
  const last = sorted.length ? toDate(sorted[sorted.length - 1].startDate) : today();
  const rawLengths = sorted.slice(1).map((record, index) => Math.round((toDate(record.startDate).getTime() - toDate(sorted[index].startDate).getTime()) / 86400000));
  const lengths = rawLengths.filter((value) => value >= 15 && value <= 90).slice(-6);
  const average = lengths.length ? lengths.reduce((sum, value) => sum + value, 0) / lengths.length : 28;
  const weights = lengths.map((_, index) => Math.min(3, 1 + (index / Math.max(1, lengths.length - 1)) * 2));
  const weightedAverage = lengths.length ? lengths.reduce((sum, value, index) => sum + value * weights[index], 0) / weights.reduce((sum, weight) => sum + weight, 0) : 28;
  const variability = lengths.length > 1 ? Math.sqrt(lengths.reduce((sum, value) => sum + (value - average) ** 2, 0) / lengths.length) : 7;
  const spread = Math.max(2, Math.min(7, Math.round(variability)));
  const next = addDays(last, Math.round(weightedAverage));
  const confidenceKey: PredictionConfidence = lengths.length >= 4 && variability <= 3 ? "high" : lengths.length >= 2 && variability <= 5 ? "medium" : "low";
  const confidence = confidenceKey === "high" ? "Yüksek" : confidenceKey === "medium" ? "Orta" : "Düşük";
  const confidenceReason = lengths.length < 2 ? "Daha fazla gerçek döngü kaydı oldukça tahmin güçlenecek." : variability > 5 ? "Döngüler arasındaki değişkenlik aralığı genişletiyor." : "Son gerçek döngü kayıtların birbirine yakın.";
  const cycleDay = Math.max(1, Math.min(Math.round(weightedAverage), Math.round((today().getTime() - last.getTime()) / 86400000) + 1));
  const phase = getCyclePhase(cycleDay, Math.round(weightedAverage), 5, sorted.length > 0);
  return { last, average: Number(average.toFixed(1)), weightedAverage: Number(weightedAverage.toFixed(1)), next, start: addDays(next, -spread), end: addDays(next, spread), lengths, variability: Number(variability.toFixed(1)), confidence, confidenceKey, confidenceReason, cycleDay, phase };
}
