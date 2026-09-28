import { getLanguage, t } from "../../i18n";
// Style: Sessiz Ay Takvimi — hızlı, katmanlı ve cihaz içinde kalan günlük check-in.
import { useMemo, useRef, useState } from "react";
import { Droplets, Search, X } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  deleteDailyLog,
  getDailyLogs,
  saveDailyLog,
} from "../cycle/cycle.storage";
import {
  energyOptions,
  flowOptions,
  moodOptions,
  symptomGroups,
} from "./symptom.catalog";
import type { DailyLog, Energy, Flow, MoodKey } from "./symptom.types";

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const labels = new Map([
  ...moodOptions,
  ...symptomGroups.flatMap(group => group.items),
]);
const defaultLog = (date: string): DailyLog => ({
  id: date,
  date,
  flow: "none",
  cramps: "none",
  energy: "normal",
  mood: [],
  symptoms: [],
  note: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function DailyCheckin({
  dateProp,
  openInitially = false,
  onSaved,
}: {
  dateProp?: string;
  openInitially?: boolean;
  onSaved?: () => void;
}) {
  const date = dateProp ?? todayKey();
  const existing = getDailyLogs<DailyLog>().find(item => item.date === date);
  const [open, setOpen] = useState(openInitially);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
  const [dataVersion, setDataVersion] = useState(0);
  const [log, setLog] = useState<DailyLog>(existing ?? defaultLog(date));
  const [search, setSearch] = useState("");
  const savedSummary = existing
    ? [
        existing.flow !== "none"
          ? flowOptions.find(([key]) => key === existing.flow)?.[1]
          : null,
        existing.energy &&
          energyOptions.find(([key]) => key === existing.energy)?.[1],
        ...(existing.mood ?? []).slice(0, 2).map(key => labels.get(key)),
      ]
        .filter(Boolean)
        .map(label => t(String(label)))
        .join(" · ")
    : t("Henüz bugünkü kaydın yok");
  const frequentSymptoms = useMemo(() => {
    const count = new Map<string, number>();
    getDailyLogs<DailyLog>().forEach(item =>
      (item.symptoms ?? []).forEach(key =>
        count.set(key, (count.get(key) ?? 0) + 1)
      )
    );
    return Array.from(count.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [open, dataVersion]);
  void dataVersion;
  const symptomResults = symptomGroups
    .flatMap(group => group.items)
    .filter(
      ([, label]) =>
        !search ||
        t(label)
          .toLocaleLowerCase(getLanguage())
          .includes(search.toLocaleLowerCase(getLanguage()))
    );
  const toggle = <T extends string>(field: "mood" | "symptoms", key: T) =>
    setLog(current => ({
      ...current,
      [field]: ((current[field] as string[] | undefined) ?? []).includes(key)
        ? ((current[field] as string[] | undefined) ?? []).filter(
            item => item !== key
          )
        : [...((current[field] as string[] | undefined) ?? []), key],
    }));
  const save = () => {
    saveDailyLog({ ...log, updatedAt: new Date().toISOString() });
    setDataVersion(value => value + 1);
    setOpen(false);
    onSaved?.();
    toast.success(
      t(existing ? "Günlük kayıt güncellendi." : "Günlük kayıt kaydedildi.")
    );
  };
  const remove = () => {
    if (!existing || deleteBusy) return;
    setDeleteBusy(true);
    deleteDailyLog(existing.id);
    setDataVersion(value => value + 1);
    setDeleteOpen(false);
    setOpen(false);
    setDeleteBusy(false);
    onSaved?.();
    toast.success(t("Günlük kayıt silindi."));
    requestAnimationFrame(() => deleteTriggerRef.current?.focus());
  };
  return (
    <section className="checkin surface">
      <div className="section-top">
        <div>
          <span className="tiny-label">{t("BUGÜN NASILSIN?")}</span>
          <h3>{t("Gününle ilgili birkaç şeyi kaydet.")}</h3>
          <p className="checkin-summary">{savedSummary}</p>
        </div>
        <Droplets size={20} className="sage-icon" />
      </div>
      <button
        className="secondary-button checkin-open"
        onClick={() => {
          setLog(
            getDailyLogs<DailyLog>().find(item => item.date === date) ??
              defaultLog(date)
          );
          setOpen(true);
        }}
      >
        {t(existing ? "Bugünkü kaydını düzenle" : "Bugünü kaydet")}
      </button>
      {open && (
        <div className="modal-backdrop" role="presentation">
          <section
            className="record-modal checkin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="daily-checkin-title"
          >
            <div className="modal-heading">
              <div>
                <span className="tiny-label">
                  {t("GÜNLÜK KAYIT ·")} {date}
                </span>
                <h3 id="daily-checkin-title">{t("Bugün nasılsın?")}</h3>
              </div>
              <button
                className="icon-button"
                aria-label={t("Check-in’i kapat")}
                onClick={() => setOpen(false)}
              >
                <X size={17} />
              </button>
            </div>
            <div className="checkin-section">
              <span>{t("Kanama")}</span>
              <div className="check-chips">
                {flowOptions.map(([key, label]) => (
                  <button
                    key={key}
                    className={`check-chip ${log.flow === key ? "selected" : ""}`}
                    aria-pressed={log.flow === key}
                    onClick={() => setLog({ ...log, flow: key as Flow })}
                  >
                    {t(label)}
                  </button>
                ))}
              </div>
            </div>
            <div className="checkin-section">
              <span>{t("Kramp")}</span>
              <div className="check-chips">
                {[
                  ["none", "Yok"],
                  ["mild", "Hafif"],
                  ["medium", "Orta"],
                  ["severe", "Şiddetli"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    className={`check-chip ${log.cramps === key ? "selected" : ""}`}
                    aria-pressed={log.cramps === key}
                    onClick={() =>
                      setLog({ ...log, cramps: key as DailyLog["cramps"] })
                    }
                  >
                    {t(label)}
                  </button>
                ))}
              </div>
            </div>
            <div className="checkin-section">
              <span>{t("Enerji")}</span>
              <div className="check-chips">
                {energyOptions.map(([key, label]) => (
                  <button
                    key={key}
                    className={`check-chip ${log.energy === key ? "selected" : ""}`}
                    aria-pressed={log.energy === key}
                    onClick={() => setLog({ ...log, energy: key as Energy })}
                  >
                    {t(label)}
                  </button>
                ))}
              </div>
            </div>
            <div className="checkin-section">
              <span>{t("Ruh hali · birden fazla seçebilirsin")}</span>
              <div className="check-chips">
                {moodOptions.map(([key, label]) => (
                  <button
                    key={key}
                    className={`check-chip ${log.mood?.includes(key) ? "selected" : ""}`}
                    aria-pressed={log.mood?.includes(key) ?? false}
                    onClick={() => toggle("mood", key as MoodKey)}
                  >
                    {t(label)}
                  </button>
                ))}
              </div>
            </div>
            <div className="checkin-section">
              <label htmlFor="symptom-search">{t("Belirti ara")}</label>
              <div className="search-field">
                <Search size={16} />
                <input
                  id="symptom-search"
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder={t("Örn. baş veya şişkinlik")}
                />
              </div>
              {!search && frequentSymptoms.length > 0 && (
                <>
                  <small>{t("Sık kullandıkların")}</small>
                  <div className="check-chips">
                    {frequentSymptoms.map(([key, count]) => (
                      <button
                        key={key}
                        className={`check-chip ${log.symptoms?.includes(key) ? "selected" : ""}`}
                        aria-pressed={log.symptoms?.includes(key) ?? false}
                        onClick={() => toggle("symptoms", key)}
                      >
                        {t(labels.get(key) ?? key)} · {count}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="symptom-groups">
                {symptomResults.map(([key, label]) => (
                  <button
                    key={key}
                    className={`check-chip ${log.symptoms?.includes(key) ? "selected" : ""}`}
                    aria-pressed={log.symptoms?.includes(key) ?? false}
                    onClick={() => toggle("symptoms", key)}
                  >
                    {t(label)}
                  </button>
                ))}
              </div>
            </div>
            <div className="checkin-section">
              <label htmlFor="daily-note">{t("Not")}</label>
              <textarea
                id="daily-note"
                maxLength={1000}
                value={log.note ?? ""}
                onChange={event => setLog({ ...log, note: event.target.value })}
                placeholder={t("Bugünle ilgili bir şey eklemek ister misin?")}
              />
              <small>{(log.note ?? "").length}/1000</small>
            </div>
            <div className="modal-actions">
              <button className="ghost-button" onClick={() => setOpen(false)}>
                {t("Vazgeç")}
              </button>
              {existing && (
                <button
                  ref={deleteTriggerRef}
                  className="danger-link"
                  onClick={() => setDeleteOpen(true)}
                >
                  {t("Sil")}
                </button>
              )}
              <button className="primary-solid" onClick={save}>
                {t("Kaydet")}
              </button>
            </div>
          </section>
        </div>
      )}
      <ConfirmDialog
        open={deleteOpen}
        title={t("Bu günlük kaydı silinsin mi?")}
        description={t(
          "Bu işlem yalnızca seçili günün belirtilerini, ruh hali kayıtlarını ve notunu silecektir. Adet kayıtların etkilenmez."
        )}
        confirmLabel={t("Kaydı Sil")}
        cancelLabel={t("İptal")}
        destructive
        loading={deleteBusy}
        onCancel={() => {
          if (!deleteBusy) {
            setDeleteOpen(false);
            requestAnimationFrame(() => deleteTriggerRef.current?.focus());
          }
        }}
        onConfirm={remove}
      />
    </section>
  );
}
