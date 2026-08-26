// Style: Sessiz Ay Takvimi — insight dili ölçülü, yerel ve teşhis içermez.
import type { DailyLog } from "../symptoms/symptom.types";
import { labelFor } from "../symptoms/symptom.catalog";

const date = (key: string) => new Date(`${key}T12:00:00`);
const diff = (a: string, b: string) => Math.round((date(a).getTime() - date(b).getTime()) / 86400000);
export type PersonalInsight = { kind: string; text: string };

export function buildPersonalInsights(periodStarts: string[], logs: DailyLog[]): PersonalInsight[] {
  const starts = [...periodStarts].sort();
  if (starts.length < 3) return [];
  const insights: PersonalInsight[] = [];
  const relevant = starts.slice(-5);
  const prePeriod = (predicate: (log: DailyLog) => boolean) => relevant.filter((start) => logs.some((log) => { const offset = diff(start, log.date); return offset >= 1 && offset <= 3 && predicate(log); })).length;
  const bloating = prePeriod((log) => log.symptoms?.includes("bloating") ?? false);
  if (bloating / relevant.length >= 0.6) insights.push({ kind: "pre-period", text: `Son ${relevant.length} döngünün ${bloating}'inde adet başlamadan 1–3 gün önce şişkinlik kaydettin.` });
  const crampsEarly = relevant.filter((start) => logs.some((log) => { const offset = diff(log.date, start); return offset >= 0 && offset <= 1 && log.cramps && log.cramps !== "none"; })).length;
  if (crampsEarly / relevant.length >= 0.6) insights.push({ kind: "cramps", text: "Kramp kayıtlarının çoğu adet döneminin ilk iki gününde görülüyor." });
  const sensitive = prePeriod((log) => log.mood?.includes("sensitive") ?? false);
  if (sensitive / relevant.length >= 0.6) insights.push({ kind: "mood", text: `Son ${relevant.length} döngünün ${sensitive}'inde adet başlangıcından önceki günlerde “Hassas” ruh halini kaydettin.` });
  const lowEnergy = prePeriod((log) => log.energy === "low" || log.energy === "very_low");
  if (lowEnergy / relevant.length >= 0.6) insights.push({ kind: "energy", text: "Enerji seviyen adet başlangıcından önceki günlerde bazı döngülerde daha düşük kaydedilmiş." });
  if (starts.length >= 7) { const lengths = starts.slice(1).map((start, index) => diff(start, starts[index])); const previous = lengths.slice(-6, -3); const recent = lengths.slice(-3); const avg = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length; const delta = Math.round(avg(recent) - avg(previous)); if (Math.abs(delta) >= 2) insights.push({ kind: "trend", text: `Son 3 döngünün ortalaması önceki 3 döngüye göre yaklaşık ${Math.abs(delta)} gün ${delta < 0 ? "kısa" : "uzun"}.` }); }
  return insights;
}

export function mostFrequentSymptoms(logs: DailyLog[]) { const counts = new Map<string, number>(); logs.forEach((log) => (log.symptoms ?? []).forEach((key) => counts.set(key, (counts.get(key) ?? 0) + 1))); return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([key, count]) => ({ key, label: labelFor(key), count })); }
