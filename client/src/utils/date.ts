// Style: Sessiz Ay Takvimi — tarihleri yerel takvim günü olarak işler.
export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
export const parseLocalDate = (value: string) => { const [year, month, day] = value.split("-").map(Number); return new Date(year, month - 1, day); };
export const toLocalDateKey = (date: Date) => { const d = startOfDay(date); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
export const addDays = (date: Date, days: number) => { const d = new Date(date); d.setDate(d.getDate() + days); return startOfDay(d); };
export const daysBetween = (a: Date, b: Date) => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86400000);
export const isSameDay = (a: Date, b: Date) => toLocalDateKey(a) === toLocalDateKey(b);
export const formatDateTR = (date: Date, withYear = true) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", ...(withYear ? { year: "numeric" } : {}) }).format(date);
