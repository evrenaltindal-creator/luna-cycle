import type { Language } from "./language";

const messages = {
  homeLearning: {
    tr: "{recorded} başlangıç kayıtlı · kişisel aralık için {remaining} tamamlanmış döngü daha gerekiyor.",
    en: "{recorded} period starts recorded · {remaining} more completed cycles are needed for a personal range.",
    ru: "Записано начал менструации: {recorded}. Для личного интервала нужно ещё завершённых циклов: {remaining}.",
    de: "Erfasste Periodenbeginne: {recorded}. Für eine persönliche Spanne fehlen noch {remaining} abgeschlossene Zyklen.",
    es: "Inicios de período registrados: {recorded}. Faltan {remaining} ciclos completos para obtener un intervalo personal.",
  },
  historyLearning: {
    tr: "{recorded} başlangıç ve {intervals} tamamlanmış döngü aralığı kayıtlı. İlk kişisel tahmin için {remaining} aralık daha gerekiyor.",
    en: "{recorded} period starts and {intervals} completed cycle intervals recorded. {remaining} more intervals are needed for a first personal estimate.",
    ru: "Записано начал менструации: {recorded}; завершённых интервалов цикла: {intervals}. Для первого личного прогноза нужно ещё интервалов: {remaining}.",
    de: "Erfasste Periodenbeginne: {recorded}; abgeschlossene Zyklusintervalle: {intervals}. Für die erste persönliche Schätzung fehlen noch {remaining} Intervalle.",
    es: "Inicios de período registrados: {recorded}; intervalos de ciclo completos: {intervals}. Faltan {remaining} intervalos para la primera estimación personal.",
  },
  afterLongGap: {
    tr: "Uzun boşluktan sonra {text}", en: "After a long gap: {text}", ru: "После долгого перерыва: {text}", de: "Nach einer längeren Pause: {text}", es: "Tras una pausa larga: {text}",
  },
  days: {
    tr: "{count} gün", en: "{count} days", ru: "Дней: {count}", de: "{count} Tage", es: "{count} días",
  },
  records: {
    tr: "{count} kayıt", en: "{count} entries", ru: "Записей: {count}", de: "{count} Einträge", es: "{count} registros",
  },
  remainingIntervals: {
    tr: "{count} döngü aralığı daha bekleniyor", en: "Waiting for {count} more cycle intervals", ru: "Ожидаются дополнительные интервалы цикла: {count}", de: "Es fehlen noch {count} Zyklusintervalle", es: "Faltan {count} intervalos de ciclo",
  },
} as const;

export function formatMessage(language: Language, key: keyof typeof messages, values: Record<string, string | number>): string {
  return messages[key][language].replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}
