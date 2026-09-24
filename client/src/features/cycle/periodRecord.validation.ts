import { addDays, daysBetween, parseLocalDate, toLocalDateKey } from "../../utils/date";

type PeriodRange = { id: number; date: string; endDate?: string | null; length: number };

const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && toLocalDateKey(parseLocalDate(value)) === value;
const rangeDays = (start: string, end: string) => daysBetween(parseLocalDate(start), parseLocalDate(end));

export function validatePeriodRange(start: string, end: string, records: PeriodRange[], excludeId?: number, today = toLocalDateKey(new Date())): string | null {
  if (!validDate(start) || !validDate(end)) return "Başlangıç ve bitiş tarihlerini gir.";
  if (start > today || end > today) return "Gerçek adet kaydı için gelecek tarih seçilemez.";
  const length = rangeDays(start, end) + 1;
  if (length < 1) return "Bitiş tarihi başlangıçtan önce olamaz.";
  if (length > 14) return "Adet süresi en fazla 14 gün olabilir.";
  const overlaps = records.some(record => {
    if (record.id === excludeId) return false;
    const recordEnd = record.endDate ?? toLocalDateKey(addDays(parseLocalDate(record.date), record.length - 1));
    return start <= recordEnd && end >= record.date;
  });
  return overlaps ? "Bu tarihler başka bir adet kaydıyla çakışıyor." : null;
}

export function periodLength(start: string, end: string): number {
  return rangeDays(start, end) + 1;
}
