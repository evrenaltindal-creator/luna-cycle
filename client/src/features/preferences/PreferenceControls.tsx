// Style: Sessiz Ay Takvimi — tercihler sade, ölçülü ve cihaz içinde kalır.
import { useState } from "react";
import { getPeriodRecords, getPreferences, savePreferences } from "../cycle/cycle.storage";
import { calculatePrediction } from "../cycle/cyclePrediction.service";
import { syncCycleReminder } from "../notifications/notification.service";

export function PreferenceControls() {
  const initial = getPreferences();
  const [cycle, setCycle] = useState(String(initial.averageCycleLength));
  const [period, setPeriod] = useState(String(initial.averagePeriodLength));
  const [enabled, setEnabled] = useState(initial.notificationEnabled);
  const [days, setDays] = useState(String(initial.notificationDaysBefore));
  const [privateText, setPrivateText] = useState(initial.privateNotificationText);
  const save = (patch: Partial<ReturnType<typeof getPreferences>>) => { const next = { ...getPreferences(), ...patch }; savePreferences(next); const records = getPeriodRecords(); if (records.length) { const predictedStart = calculatePrediction(records, { fallbackCycleLength: next.averageCycleLength, fallbackPeriodLength: next.averagePeriodLength }).next; void syncCycleReminder(predictedStart, next); } };
  const validNumber = (value: string, min: number, max: number) => { const numeric = Number(value); return Number.isInteger(numeric) && numeric >= min && numeric <= max; };
  return <div className="settings-group preference-controls"><span className="tiny-label">DÖNGÜ TERCİHLERİ</span><div className="preference-grid"><label>Döngü uzunluğu<input type="number" min={15} max={90} value={cycle} onChange={(event) => { setCycle(event.target.value); if (validNumber(event.target.value, 15, 90)) save({ averageCycleLength: Number(event.target.value) }); }} /><small>Yalnızca yeterli gerçek kayıt yoksa fallback.</small></label><label>Adet süresi<input type="number" min={1} max={14} value={period} onChange={(event) => { setPeriod(event.target.value); if (validNumber(event.target.value, 1, 14)) save({ averagePeriodLength: Number(event.target.value) }); }} /><small>Teknik bir varsayılandır.</small></label></div><div className="setting-row"><div><strong>Tahmini dönem yaklaşırken hatırlat</strong><span>İzin verildiğinde seçtiğin tarihte yalnızca cihazında planlanır.</span></div><button className="toggle" aria-label="Dönem hatırlatıcısını değiştir" aria-pressed={enabled} onClick={() => { const next = !enabled; setEnabled(next); save({ notificationEnabled: next }); }}><span className={enabled ? "on" : ""} /></button></div>{enabled && <label>Kaç gün önce<select value={days} onChange={(event) => { setDays(event.target.value); save({ notificationDaysBefore: Number(event.target.value) as 1 | 2 | 3 | 5 }); }}><option value="1">1 gün önce</option><option value="2">2 gün önce</option><option value="3">3 gün önce</option><option value="5">5 gün önce</option></select></label>}<div className="setting-row"><div><strong>Bildirimlerde özel bilgileri gizle</strong><span>{privateText ? "Luna’dan bir hatırlatman var." : "Tahmini dönemine kaç gün kaldığı gösterilir."}</span></div><button className="toggle" aria-label="Bildirimlerde özel bilgileri gizlemeyi değiştir" aria-pressed={privateText} onClick={() => { const next = !privateText; setPrivateText(next); save({ privateNotificationText: next }); }}><span className={privateText ? "on" : ""} /></button></div></div>;
}
