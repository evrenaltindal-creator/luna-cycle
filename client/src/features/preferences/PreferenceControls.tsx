import { t } from "../../i18n";
// Preferences stay local; reminders start only after a personal prediction is available.
import { useState } from "react";
import { getPeriodRecords, getPreferences, savePreferences } from "../cycle/cycle.storage";
import { calculatePrediction } from "../cycle/cyclePrediction.service";
import { syncCycleReminder } from "../notifications/notification.service";

export function PreferenceControls() {
  const initial = getPreferences();
  const [enabled, setEnabled] = useState(initial.notificationEnabled);
  const [days, setDays] = useState(String(initial.notificationDaysBefore));
  const [privateText, setPrivateText] = useState(initial.privateNotificationText);
  const save = (patch: Partial<ReturnType<typeof getPreferences>>) => {
    const next = { ...getPreferences(), ...patch };
    if (!savePreferences(next)) return false;
    const prediction = calculatePrediction(getPeriodRecords());
    void syncCycleReminder(prediction.futureWindows[0]?.start ?? null, next);
    return true;
  };

  return (
    <div className="settings-group preference-controls">
      <span className="tiny-label">{t("DÖNGÜ TERCİHLERİ")}</span>
      <p className="preference-explainer">
        {t("Luna herkese 28 veya 30 günlük döngü atamaz. Yaklaşık tarih aralığı, üç tamamlanmış döngüden sonra kendi başlangıç kayıtlarından hesaplanır.")}
      </p>
      <div className="setting-row">
        <div>
          <strong>{t("Yaklaşık dönem yaklaşırken hatırlat")}</strong>
          <span>{t("Kişisel aralık oluşana kadar bildirim planlanmaz.")}</span>
        </div>
        <button className="toggle" aria-label={t("Dönem hatırlatıcısını değiştir")} aria-pressed={enabled} onClick={() => {
          const next = !enabled;
          if (save({ notificationEnabled: next })) setEnabled(next);
        }}><span className={enabled ? "on" : ""} /></button>
      </div>
      {enabled && <label>{t("Kaç gün önce")}
        <select value={days} onChange={event => {
          const value = event.target.value;
          if (save({ notificationDaysBefore: Number(value) as 1 | 2 | 3 | 5 })) setDays(value);
        }}>
          <option value="1">{t("1 gün önce")}</option>
          <option value="2">{t("2 gün önce")}</option>
          <option value="3">{t("3 gün önce")}</option>
          <option value="5">{t("5 gün önce")}</option>
        </select>
      </label>}
      <div className="setting-row">
        <div>
          <strong>{t("Bildirimlerde özel bilgileri gizle")}</strong>
          <span>{t(privateText ? "Luna’dan bir hatırlatman var." : "Yaklaşık başlangıç aralığının yaklaştığı belirtilir; kesin gün sayısı verilmez.")}</span>
        </div>
        <button className="toggle" aria-label={t("Bildirimlerde özel bilgileri gizlemeyi değiştir")} aria-pressed={privateText} onClick={() => {
          const next = !privateText;
          if (save({ privateNotificationText: next })) setPrivateText(next);
        }}><span className={privateText ? "on" : ""} /></button>
      </div>
    </div>
  );
}
