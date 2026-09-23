// Style: Sessiz Ay Takvimi — asymmetric dashboard, bone canvas, sage ink, lemon moments.
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Droplets,
  Flower2,
  Home as HomeIcon,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Settings,
  Sparkles,
  Sun,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import {
  clearAllData,
  deleteDailyLog,
  exportBackup,
  getDailyLogs,
  getPeriodRecords,
  getPreferences,
  importBackup,
  saveDailyLog,
  savePeriodRecords,
  savePreferences,
  validateBackup,
} from "../features/cycle/cycle.storage";
import type { DailyLog } from "../features/symptoms/symptom.types";
import { calculatePrediction } from "../features/cycle/cyclePrediction.service";
import { DailyCheckin as RichDailyCheckin } from "../features/symptoms/DailyCheckin";
import { PreferenceControls } from "../features/preferences/PreferenceControls";
import { ThemeSelector } from "../features/preferences/ThemeSelector";
import { ConfirmDialog } from "../components/ConfirmDialog";
import {
  buildPersonalInsights,
  mostFrequentSymptoms,
} from "../features/insights/personalInsights.service";
import { isAndroid, isNativePlatform } from "../platform/platform";
import { useNativeLifecycle } from "../platform/useNativeLifecycle";
import {
  checkBiometricAvailability,
  enableBiometricLock,
} from "../features/security/biometric.service";
import {
  getNotificationPermission,
  requestNotificationPermission,
  syncCycleReminder,
} from "../features/notifications/notification.service";
import {
  exportNativeBackup,
  importNativeBackup,
} from "../features/backup/nativeBackup.service";
import { LunaPlusPanel } from "../features/monetization/LunaPlusPanel";
import { useMonetization } from "../features/monetization/MonetizationContext";
import { PremiumInsightsGate } from "../features/monetization/PremiumInsightsGate";
import { PrivacySafeAdSlot } from "../features/monetization/PrivacySafeAdSlot";
import {
  addDays as addLocalDays,
  formatDateTR,
  parseLocalDate,
  toLocalDateKey,
} from "../utils/date";

type Tab = "home" | "calendar" | "history" | "insights" | "settings";
type RecordItem = {
  id: number;
  date: string;
  endDate?: string | null;
  length: number;
};

const initialRecords: RecordItem[] = [];

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];
const weekdayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

function parseDate(value: string) {
  return parseLocalDate(value);
}
function iso(date: Date) {
  return toLocalDateKey(date);
}
function pretty(date: Date, withYear = true) {
  return formatDateTR(date, withYear);
}
function addDays(date: Date, days: number) {
  return addLocalDays(date, days);
}
function startOfToday() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12);
}
function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";
}

const prediction = (records: RecordItem[]) =>
  calculatePrediction(records.map(record => ({ date: record.date })));

function Logo() {
  return (
    <div className="brand-mark" aria-label="Luna Cycle">
      <img className="brand-icon" src="/luna-icon-192.png" alt="" />
      <span className="brand-word">
        <b>Luna</b>
        <small>CYCLE</small>
      </span>
    </div>
  );
}

function Nav({
  active,
  setActive,
}: {
  active: Tab;
  setActive: (tab: Tab) => void;
}) {
  const items: [Tab, string, typeof HomeIcon][] = [
    ["home", "Ana sayfa", HomeIcon],
    ["calendar", "Takvim", CalendarDays],
    ["history", "Geçmiş", TrendingUp],
    ["insights", "İçgörüler", Sparkles],
    ["settings", "Ayarlar", Settings],
  ];
  return (
    <nav className="side-nav">
      <div className="nav-brand">
        <Logo />
      </div>
      <div className="nav-links">
        {items.map(([id, label, Icon]) => (
          <button
            key={id}
            className={`nav-item ${active === id ? "active" : ""}`}
            onClick={() => setActive(id)}
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{label}</span>
            {active === id && <i />}
          </button>
        ))}
      </div>
      <div className="privacy-mini">
        <LockKeyhole size={16} />
        <span>Verilerin cihazında</span>
        <ChevronRight size={14} />
      </div>
    </nav>
  );
}

function Onboarding({
  onDone,
}: {
  onDone: (setup?: {
    startDate: string;
    periodLength: number;
    cycleLength: number;
  }) => void;
}) {
  const [step, setStep] = useState(0);
  const [startDate, setStartDate] = useState(iso(startOfToday()));
  const [periodLength, setPeriodLength] = useState("5");
  const [cycleLength, setCycleLength] = useState("28");
  const slides = [
    {
      title: "Döngünü takip et",
      text: "Adet dönemlerini kaydet ve yaklaşan dönemini tahmini olarak görüntüle.",
      icon: CalendarDays,
    },
    {
      title: "Verilerin sana ait",
      text: "Döngü ve sağlık bilgilerin cihazında saklanır. Bu bilgiler sunucularımıza gönderilmez.",
      icon: LockKeyhole,
    },
    {
      title: "Tahminler kesin değildir",
      text: "Adet döngüsü kişiden kişiye ve aydan aya değişebilir. Gösterilen tarihler yalnızca tahmindir.",
      icon: Flower2,
    },
  ];
  if (step === 3)
    return (
      <div className="onboarding-screen setup-screen">
        <div className="onboarding-orbit">
          <CalendarDays size={30} strokeWidth={1.3} />
        </div>
        <span className="eyebrow">LUNA CYCLE / KURULUM</span>
        <h2>
          Ritmini
          <br />
          <em>buradan başlat.</em>
        </h2>
        <p>
          Son adet başlangıcını ve yaklaşık sürelerini gir. Bu bilgiler yalnızca
          cihazında saklanır.
        </p>
        <div className="setup-fields">
          <label>
            Son adet başlangıcı
            <input
              type="date"
              value={startDate}
              onChange={event => setStartDate(event.target.value)}
            />
          </label>
          <label>
            Ortalama adet süresi (gün)
            <input
              type="number"
              min="1"
              max="14"
              value={periodLength}
              onChange={event => setPeriodLength(event.target.value)}
            />
          </label>
          <label>
            Ortalama döngü uzunluğu (gün)
            <input
              type="number"
              min="15"
              max="90"
              value={cycleLength}
              onChange={event => setCycleLength(event.target.value)}
            />
          </label>
        </div>
        <button
          className="secondary-button"
          onClick={() => {
            const period = Math.max(1, Math.min(14, Number(periodLength) || 5));
            const cycle = Math.max(15, Math.min(90, Number(cycleLength) || 28));
            onDone({ startDate, periodLength: period, cycleLength: cycle });
          }}
        >
          Takibi başlat <ChevronRight size={16} />
        </button>
      </div>
    );
  const current = slides[step];
  return (
    <div className="onboarding-screen">
      <div className="onboarding-orbit">
        <current.icon size={30} strokeWidth={1.3} />
      </div>
      <span className="eyebrow">LUNA CYCLE / 0{step + 1}</span>
      <h2>{current.title}</h2>
      <p>{current.text}</p>
      <div className="onboarding-dots">
        {slides.map((_, index) => (
          <span className={index === step ? "active" : ""} key={index} />
        ))}
      </div>
      <button
        className="secondary-button"
        onClick={() => {
          if (step < 2) setStep(step + 1);
          else setStep(3);
        }}
      >
        {step === 2 ? "Başla" : "Devam et"}
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function Header({ active, onAdd }: { active: Tab; onAdd: () => void }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">
          LUNA / {active === "home" ? "BUGÜN" : active.toUpperCase()}
        </p>
        <h1>
          {active === "home"
            ? greeting()
            : active === "calendar"
              ? "Takvim"
              : active === "history"
                ? "Geçmiş kayıtların"
                : active === "insights"
                  ? "İçgörüler"
                  : "Ayarlar"}
        </h1>
      </div>
      <div className="top-actions">
        <button className="secondary-button" onClick={onAdd}>
          <Plus size={17} /> Adet başladı
        </button>
      </div>
    </header>
  );
}

function HomeView({
  records,
  setActive,
}: {
  records: RecordItem[];
  setActive: (tab: Tab) => void;
}) {
  const [checkinRequest, setCheckinRequest] = useState(0);
  const openDailyCheckin = () => setCheckinRequest(value => value + 1);
  const p = prediction(records);
  const daysLeft = Math.max(
    0,
    Math.ceil((p.next.getTime() - startOfToday().getTime()) / 86400000)
  );
  return (
    <div className="home-view">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="tiny-label">BİR SONRAKİ DÖNEM</span>
          <h2>{pretty(p.next, false)}</h2>
          <p className="hero-count">
            <strong>{daysLeft}</strong> gün kaldı{" "}
            <span className="confidence-badge">
              Tahmin güveni: {p.confidence}
            </span>
          </p>
          <div className="range-line">
            <span />
            Tahmini aralık:{" "}
            <b>
              {pretty(p.start, false)} – {pretty(p.end, false)}
            </b>
          </div>
          <p className="muted-note">
            {records.length ? (
              <>
                Döngünün {p.cycleDay}. günü · {p.phase} · {p.confidenceReason}
              </>
            ) : (
              <>Döngü gününü hesaplamak için ilk adet kaydını ekle.</>
            )}
          </p>
        </div>
        <div className="cycle-progress" aria-label="Döngü ilerlemesi">
          <div className="progress-heading">
            <span>DÖNGÜ İLERLEMESİ</span>
            <strong>
              {records.length
                ? `Döngünün ${p.cycleDay}. günü`
                : "İlk kayıt bekleniyor"}
            </strong>
          </div>
          <div className="progress-track">
            <span
              style={{
                width: `${records.length ? Math.min(100, (p.cycleDay / Math.max(1, p.average)) * 100) : 0}%`,
              }}
            />
          </div>
          <div className="phase-rail">
            <span>Adet</span>
            <span>Foliküler</span>
            <span>Tahmini ovülasyon</span>
            <span>Luteal</span>
          </div>
        </div>
        <div className="hero-art">
          <img className="rose-disc" src="/luna-icon-512.png" alt="" />
          <p>
            kesinlik değil,
            <br />
            <em>hazırlık.</em>
          </p>
        </div>
      </section>
      <section className="dashboard-grid">
        <div className="surface today-card">
          <div className="section-top">
            <div>
              <span className="tiny-label">BUGÜNÜN NOTU</span>
              <h3>Ritmini dinle.</h3>
            </div>
            <button className="more-button" aria-label="Günlük kaydı aç" onClick={openDailyCheckin}>
              <MoreHorizontal size={19} />
            </button>
          </div>
          <p>
            Takvimine küçük bir not bırakmak, bedenindeki değişimleri fark
            etmenin nazik bir yolu olabilir.
          </p>
          <button className="text-link" onClick={openDailyCheckin}>
            Bugünü kaydet <ChevronRight size={16} />
          </button>
        </div>
        <div className="surface stats-card">
          <div className="section-top">
            <div>
              <span className="tiny-label">DÖNGÜ ÖZETİ</span>
              <h3>Son kayıtların</h3>
            </div>
            <TrendingUp size={20} className="sage-icon" />
          </div>
          <div className="stat-row">
            <div>
              <strong>{p.average}</strong>
              <span>ortalama gün</span>
            </div>
            <div>
              <strong>{records.at(-1)?.length ?? 0}</strong>
              <span>adet süresi</span>
            </div>
            <div>
              <strong>{p.lengths.length}</strong>
              <span>kayıtlı döngü</span>
            </div>
          </div>
          <button className="text-link" onClick={() => setActive("insights")}>
            İçgörülere git <ChevronRight size={16} />
          </button>
        </div>
      </section>
      <RichDailyCheckin key={checkinRequest} openInitially={checkinRequest > 0} />
      <section className="lower-grid">
        <div className="surface calendar-preview">
          <div className="section-top">
            <div>
              <span className="tiny-label">
                {monthNames[startOfToday().getMonth()].toUpperCase()}{" "}
                {startOfToday().getFullYear()}
              </span>
              <h3>Bu ay</h3>
            </div>
            <button
              className="round-arrow"
              aria-label="Takvimi aç"
              onClick={() => setActive("calendar")}
            >
              <ChevronRight size={17} />
            </button>
          </div>
          <MiniCalendar records={records} prediction={p} />
        </div>
        <div className="side-note">
          <div className="note-icon">
            <LockKeyhole size={17} />
          </div>
          <div>
            <span className="tiny-label">GİZLİLİK NOTU</span>
            <h3>
              Senin verin,
              <br />
              senin alanın.
            </h3>
            <p>
              Luna Cycle kayıtlarını bu cihazda tutar. Hiçbir sunucuya
              göndermez.
            </p>
            <button className="text-link" onClick={() => setActive("settings")}>
              Ayarları gör <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function DailyCheckin() {
  const today = iso(startOfToday());
  const existing = getDailyLogs<DailyLog>().find(log => log.date === today);
  const [flow, setFlow] = useState(existing?.flow ?? "none");
  const [cramps, setCramps] = useState(existing?.cramps ?? "none");
  const [energy, setEnergy] = useState(existing?.energy ?? "normal");
  const save = (field: "flow" | "cramps" | "energy", value: string) => {
    const next = {
      id: existing?.id ?? today,
      date: today,
      flow,
      cramps,
      energy,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      [field]: value,
    } as DailyLog;
    saveDailyLog(next);
    toast.success("Bugünkü notun kaydedildi");
  };
  const Chip = ({
    value,
    label,
    selected,
    onClick,
  }: {
    value: string;
    label: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      className={`check-chip ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
  return (
    <section className="checkin surface">
      <div className="section-top">
        <div>
          <span className="tiny-label">BUGÜN NASILSIN?</span>
          <h3>Kendine küçük bir not.</h3>
        </div>
        <Droplets size={20} className="sage-icon" />
      </div>
      <div className="check-grid">
        <div>
          <span>Kanama</span>
          <div className="check-chips">
            {[
              ["none", "Yok"],
              ["light", "Hafif"],
              ["medium", "Orta"],
              ["heavy", "Yoğun"],
            ].map(([v, l]) => (
              <Chip
                key={v}
                value={v}
                label={l}
                selected={flow === v}
                onClick={() => {
                  setFlow(v as Exclude<DailyLog["flow"], undefined>);
                  save("flow", v);
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <span>Kramp</span>
          <div className="check-chips">
            {[
              ["none", "Yok"],
              ["mild", "Hafif"],
              ["medium", "Orta"],
              ["severe", "Şiddetli"],
            ].map(([v, l]) => (
              <Chip
                key={v}
                value={v}
                label={l}
                selected={cramps === v}
                onClick={() => {
                  setCramps(v as Exclude<DailyLog["cramps"], undefined>);
                  save("cramps", v);
                }}
              />
            ))}
          </div>
        </div>
        <div>
          <span>Enerji</span>
          <div className="check-chips">
            {[
              ["low", "Düşük"],
              ["normal", "Normal"],
              ["high", "Yüksek"],
            ].map(([v, l]) => (
              <Chip
                key={v}
                value={v}
                label={l}
                selected={energy === v}
                onClick={() => {
                  setEnergy(v as Exclude<DailyLog["energy"], undefined>);
                  save("energy", v);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniCalendar({
  records,
  prediction: p,
}: {
  records: RecordItem[];
  prediction: ReturnType<typeof prediction>;
}) {
  const base = startOfToday();
  base.setDate(1);
  const start = (base.getDay() + 6) % 7;
  const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
  const actual = new Set(
    records.flatMap(r =>
      Array.from({ length: r.length }, (_, i) =>
        iso(addDays(parseDate(r.date), i))
      )
    )
  );
  const dailyLogDates = new Set(getDailyLogs<DailyLog>().map(log => log.date));
  return (
    <div className="mini-calendar">
      <div className="weekday-row">
        {weekdayNames.map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="day-grid">
        {Array.from({ length: start }).map((_, i) => (
          <span className="day muted" key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const d = new Date(base.getFullYear(), base.getMonth(), i + 1, 12);
          const id = iso(d);
          const isActual = actual.has(id);
          const isPred = d >= p.start && d <= p.end;
          const isToday = d.toDateString() === startOfToday().toDateString();
          const hasDailyLog = dailyLogDates.has(id);
          return (
            <span
              className={`day ${isActual ? "actual" : ""} ${isPred ? "predicted" : ""} ${isToday ? "today" : ""}`}
              key={id}
            >
              <span>{i + 1}</span>
              {hasDailyLog && (
                <i className="daily-indicator" aria-label="Günlük kayıt" />
              )}
            </span>
          );
        })}
      </div>
      <div className="calendar-legend">
        <span>
          <i className="dot actual-dot" />
          Gerçek
        </span>
        <span>
          <i className="dot predicted-dot" />
          Tahmini
        </span>
      </div>
    </div>
  );
}

function CalendarView({
  records,
  setRecords,
}: {
  records: RecordItem[];
  setRecords: (records: RecordItem[]) => void;
}) {
  const now = startOfToday();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState(now.getDate());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "delete">("edit");
  const [checkinDate, setCheckinDate] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const deleteTriggerRef = useRef<HTMLButtonElement>(null);
  const [logVersion, setLogVersion] = useState(0);
  const p = prediction(records);
  const days = new Date(year, month + 1, 0).getDate();
  const selectedDay = Math.min(selected, days);
  const start = (new Date(year, month, 1, 12).getDay() + 6) % 7;
  const actual = new Set(
    records.flatMap(r =>
      Array.from({ length: r.length }, (_, i) =>
        iso(addDays(parseDate(r.date), i))
      )
    )
  );
  const dailyLogs = getDailyLogs<DailyLog>();
  const dailyLogDates = new Set(dailyLogs.map(log => log.date));
  const selectedId = iso(new Date(year, month, selectedDay, 12));
  const selectedLog = dailyLogs.find(log => log.date === selectedId);
  void logVersion;
  return (
    <div className="page-view calendar-page">
      <div className="calendar-heading">
        <div>
          <span className="tiny-label">DÖNGÜ TAKVİMİ</span>
          <h2>Her gün bir veri noktası değil.</h2>
          <p>
            Takvimini gözlemlemek için kullan; kendini yargılamak için değil.
          </p>
        </div>
        <div className="month-switch">
          <button
            aria-label="Önceki ay"
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear(value => value - 1);
              } else setMonth(value => value - 1);
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <strong>
            {monthNames[month]} {year}
          </strong>
          <button
            aria-label="Sonraki ay"
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear(value => value + 1);
              } else setMonth(value => value + 1);
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="calendar-layout">
        <div className="surface full-calendar">
          <div className="weekday-row">
            {weekdayNames.map(day => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="large-day-grid">
            {Array.from({ length: start }).map((_, i) => (
              <span className="large-day muted" key={`empty-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const d = new Date(year, month, i + 1, 12);
              const id = iso(d);
              const isActual = actual.has(id);
              const isPred = d >= p.start && d <= p.end;
              const hasDailyLog = dailyLogDates.has(id);
              return (
                <button
                  className={`large-day ${isActual ? "actual" : ""} ${isPred ? "predicted" : ""} ${selectedDay === i + 1 ? "selected" : ""}`}
                  onClick={() => setSelected(i + 1)}
                  key={id}
                >
                  <span>{i + 1}</span>
                  {isActual && <small>kayıt</small>}
                  {isPred && <small>tahmini</small>}
                  {hasDailyLog && (
                    <i className="daily-indicator" aria-label="Günlük kayıt" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <aside className="surface selected-day">
          <span className="tiny-label">SEÇİLİ GÜN</span>
          <h3>
            {selectedDay} {monthNames[month]}
          </h3>
          <div className="selected-state">
            <span className="state-dot" />
            {actual.has(selectedId)
              ? "Gerçek adet günü"
              : new Date(year, month, selectedDay, 12) >= p.start &&
                  new Date(year, month, selectedDay, 12) <= p.end
                ? "Tahmini dönem"
                : "Henüz kayıt yok"}
          </div>
          <p>
            Bir güne dokunarak adet başlangıcını veya gününü manuel olarak
            ekleyebilirsin.
          </p>
          {selectedLog && (
            <div className="daily-summary">
              <span className="tiny-label">GÜNLÜK ÖZET</span>
              {selectedLog.flow && (
                <p>
                  <b>Kanama</b>
                  {selectedLog.flow}
                </p>
              )}
              {selectedLog.cramps && selectedLog.cramps !== "none" && (
                <p>
                  <b>Kramp</b>
                  {selectedLog.cramps}
                </p>
              )}
              {selectedLog.energy && (
                <p>
                  <b>Enerji</b>
                  {selectedLog.energy}
                </p>
              )}
              {selectedLog.mood?.length ? (
                <p>
                  <b>Ruh hali</b>
                  {selectedLog.mood.join(", ")}
                </p>
              ) : null}
              {selectedLog.symptoms?.length ? (
                <p>
                  <b>Belirtiler</b>
                  {selectedLog.symptoms.join(", ")}
                </p>
              ) : null}
              {selectedLog.note ? (
                <p>
                  <b>Not</b>
                  {selectedLog.note}
                </p>
              ) : null}
              <div className="summary-actions">
                <button
                  className="text-link"
                  onClick={() => setCheckinDate(selectedId)}
                >
                  Düzenle <ChevronRight size={15} />
                </button>
                <button
                  ref={deleteTriggerRef}
                  className="danger-link"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Günlük kaydı sil
                </button>
              </div>
            </div>
          )}
          <ConfirmDialog
            open={deleteDialogOpen}
            title="Bu günlük kaydı silinsin mi?"
            description="Bu işlem yalnızca seçili günün belirtilerini, ruh hali kayıtlarını ve notunu silecektir. Adet kayıtların etkilenmez."
            confirmLabel="Kaydı Sil"
            cancelLabel="İptal"
            destructive
            loading={deleteBusy}
            onCancel={() => {
              if (!deleteBusy) {
                setDeleteDialogOpen(false);
                deleteTriggerRef.current?.focus();
              }
            }}
            onConfirm={() => {
              if (!selectedLog || deleteBusy) return;
              setDeleteBusy(true);
              deleteDailyLog(selectedLog.id);
              setLogVersion(value => value + 1);
              setDeleteBusy(false);
              setDeleteDialogOpen(false);
              toast.success("Günlük kayıt silindi.");
              requestAnimationFrame(() => deleteTriggerRef.current?.focus());
            }}
          />
          <button
            className="secondary-button wide"
            onClick={() => {
              setModalMode("edit");
              setModalOpen(true);
            }}
          >
            <Plus size={16} /> Bu günü düzenle
          </button>
        </aside>
      </div>
      {modalOpen && <CalendarRecordModal
        key={`${year}-${month}-${selectedDay}`}
        open={modalOpen}
        mode={modalMode}
        selectedDate={new Date(year, month, selectedDay, 12)}
        records={records}
        onClose={() => setModalOpen(false)}
        onSave={next => {
          setRecords(next);
          setModalOpen(false);
        }}
        onDelete={next => {
          setRecords(next);
          setModalOpen(false);
        }}
      />}
      {checkinDate && (
        <RichDailyCheckin
          dateProp={checkinDate}
          openInitially
          onSaved={() => {
            setCheckinDate(null);
            setLogVersion(value => value + 1);
          }}
        />
      )}
    </div>
  );
}

function CalendarRecordModal({
  open,
  mode,
  selectedDate,
  records,
  onClose,
  onSave,
  onDelete,
}: {
  open: boolean;
  mode: "edit" | "delete";
  selectedDate: Date;
  records: RecordItem[];
  onClose: () => void;
  onSave: (next: RecordItem[]) => void;
  onDelete: (next: RecordItem[]) => void;
}) {
  const existing = records.find(record => {
    const start = parseDate(record.date);
    const end = addDays(start, record.length - 1);
    return selectedDate >= start && selectedDate <= end;
  });
  const [startDate, setStartDate] = useState(
    existing?.date ?? iso(selectedDate)
  );
  const [endDate, setEndDate] = useState(
    existing?.endDate ??
      iso(
        addDays(
          parseDate(existing?.date ?? iso(selectedDate)),
          (existing?.length ?? 5) - 1
        )
      )
  );
  const [length, setLength] = useState(existing?.length ?? 5);
  const [confirming, setConfirming] = useState(mode === "delete");
  if (!open) return null;
  const save = () => {
    const calculatedLength = Math.max(
      1,
      Math.min(
        14,
        Math.round(
          (parseDate(endDate).getTime() - parseDate(startDate).getTime()) /
            86400000
        ) + 1
      )
    );
    const nextRecord = {
      id: existing?.id ?? Date.now(),
      date: startDate,
      endDate,
      length: calculatedLength,
    };
    const next = existing
      ? records.map(record => (record.id === existing.id ? nextRecord : record))
      : [...records, nextRecord];
    onSave(next);
    toast.success(existing ? "Adet kaydı güncellendi" : "Adet kaydı eklendi", {
      description: "Takvim ve tahminlerin yenilendi.",
    });
  };
  const remove = () => {
    if (!existing) {
      toast.info("Bu gün için silinecek kayıt yok.");
      onClose();
      return;
    }
    onDelete(records.filter(record => record.id !== existing.id));
    toast.success("Adet kaydı silindi");
  };
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="record-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-modal-title"
      >
        <div className="modal-heading">
          <div>
            <span className="tiny-label">TAKVİM KAYDI</span>
            <h3 id="record-modal-title">
              {confirming
                ? "Kaydı sil?"
                : existing
                  ? "Kaydı düzenle"
                  : "Bu günü kaydet"}
            </h3>
          </div>
          <button
            className="icon-button"
            aria-label="Modalı kapat"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {confirming ? (
          <div className="delete-confirm">
            <div className="delete-symbol">
              <Trash2 size={22} />
            </div>
            <p>Bu adet kaydını silmek istediğinizden emin misin?</p>
            <span>Bu işlem tahmini tarihleri de yeniden hesaplar.</span>
            <div className="modal-actions">
              <button
                className="ghost-button"
                onClick={() => setConfirming(false)}
              >
                Vazgeç
              </button>
              <button className="danger-solid" onClick={remove}>
                Evet, sil
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-fields">
              <label className="field-label">
                Başlangıç tarihi
                <input
                  type="date"
                  value={startDate}
                  onChange={event => {
                    const value = event.target.value;
                    setStartDate(value);
                    setEndDate(
                      iso(addDays(parseDate(value), Math.max(1, length) - 1))
                    );
                  }}
                />
              </label>
              <label className="field-label">
                Bitiş tarihi
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={event => {
                    const value = event.target.value;
                    setEndDate(value);
                    setLength(
                      Math.max(
                        1,
                        Math.min(
                          14,
                          Math.round(
                            (parseDate(value).getTime() -
                              parseDate(startDate).getTime()) /
                              86400000
                          ) + 1
                        )
                      )
                    );
                  }}
                />
              </label>
            </div>
            <p className="calculated-duration">
              Otomatik hesaplanan süre:{" "}
              <strong>
                {Math.max(
                  1,
                  Math.min(
                    14,
                    Math.round(
                      (parseDate(endDate).getTime() -
                        parseDate(startDate).getTime()) /
                        86400000
                    ) + 1
                  )
                )}{" "}
                gün
              </strong>
            </p>
            <p className="modal-note">
              Kayıt yalnızca bu cihazda saklanır. Tahmin kesin değildir.
            </p>
            <div className="modal-actions">
              <button className="ghost-button" onClick={onClose}>
                Vazgeç
              </button>
              {existing && (
                <button
                  className="danger-link"
                  onClick={() => setConfirming(true)}
                >
                  Sil
                </button>
              )}
              <button className="primary-solid" onClick={save}>
                Kaydet
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function HistoryView({
  records,
  setRecords,
}: {
  records: RecordItem[];
  setRecords: (records: RecordItem[]) => void;
}) {
  return (
    <div className="page-view">
      <div className="page-intro">
        <span className="tiny-label">KAYIT ARŞİVİ</span>
        <h2>
          Geçmiş, geleceği
          <br />
          <em>anlamak</em> için.
        </h2>
        <p>
          Gerçek kayıtların, tahminlerden ayrı ve yalnızca senin görebileceğin
          şekilde tutulur.
        </p>
      </div>
      <div className="history-list surface">
        {records
          .slice()
          .reverse()
          .map((record, index) => {
            const date = parseDate(record.date);
            const next = records.find(item => item.date > record.date);
            const cycle = next
              ? Math.round(
                  (parseDate(next.date).getTime() - date.getTime()) / 86400000
                )
              : prediction(records).average;
            return (
              <div className="history-row" key={record.id}>
                <div className="history-date">
                  <span className="history-index">
                    0{records.length - index}
                  </span>
                  <div>
                    <strong>{pretty(date)}</strong>
                    <span>Gerçek adet kaydı</span>
                  </div>
                </div>
                <div className="history-metric">
                  <strong>{record.length} gün</strong>
                  <span>adet süresi</span>
                </div>
                <div className="history-metric">
                  <strong>{cycle} gün</strong>
                  <span>döngü</span>
                </div>
                <button
                  className="delete-button"
                  aria-label="Kaydı sil"
                  onClick={() => {
                    setRecords(records.filter(item => item.id !== record.id));
                    toast.success("Kayıt silindi");
                  }}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}

function InsightsView({ records }: { records: RecordItem[] }) {
  const p = prediction(records);
  const cycleLengths = records
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(1)
    .map((record, index, sorted) =>
      Math.round(
        (parseDate(record.date).getTime() -
          parseDate(sorted[index].date).getTime()) /
          86400000
      )
    );
  const bars = cycleLengths.slice(-6);
  const personal = useMemo(
    () =>
      buildPersonalInsights(
        records.map(record => record.date),
        getDailyLogs<DailyLog>()
      ),
    [records]
  );
  const frequent = useMemo(
    () => mostFrequentSymptoms(getDailyLogs<DailyLog>()),
    [records]
  );
  return (
    <div className="page-view">
      <div className="page-intro split-intro">
        <div>
          <span className="tiny-label">DÖNGÜLERİNİN RİTMİ</span>
          <h2>
            Veri var.
            <br />
            <em>Yargı yok.</em>
          </h2>
        </div>
        <p>
          İçgörüler yalnızca kayıtlarını düzenli görmene yardım eder. Vücudun
          bir grafik değildir; değişkenlik doğaldır.
        </p>
      </div>
      <div className="insight-grid">
        <div className="surface big-stat">
          <span className="tiny-label">AĞIRLIKLI ORTALAMA</span>
          <strong>
            {p.average}
            <small> gün</small>
          </strong>
          <div className="trend">
            <TrendingUp size={15} /> son döngüler dengeli
          </div>
        </div>
        <div className="surface chart-card">
          <div className="section-top">
            <div>
              <span className="tiny-label">SON 6 DÖNGÜ</span>
              <h3>Uzunluk değişimi</h3>
            </div>
            <span className="chart-range">15 — 45 gün</span>
          </div>
          {bars.length ? (
            <div className="bar-chart">
              {bars.map((value, index) => (
                <div className="bar-wrap" key={index}>
                  <div
                    className="bar"
                    style={{ height: `${Math.max(28, value * 2.4)}px` }}
                  >
                    <span>{value}</span>
                  </div>
                  <small>
                    {index === bars.length - 1
                      ? "şimdi"
                      : `${bars.length - index}.`}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-insight">
              Daha fazla istatistik görmek için birkaç döngü daha kaydet.
            </div>
          )}
        </div>
        <div className="surface insight-note">
          <Sparkles size={20} />
          <h3>Bir not düşelim</h3>
          <p>
            Son döngülerin arasında küçük farklılıklar var. Bu, verinin
            bozulduğu değil, bedeninin değişken olduğu anlamına gelebilir.
          </p>
        </div>
      </div>
      <PremiumInsightsGate>
        <div className="personal-insights">
          <div>
            <span className="tiny-label">KİŞİSEL İÇGÖRÜLER</span>
            {personal.length ? (
              personal.map(insight => <p key={insight.kind}>{insight.text}</p>)
            ) : (
              <p>İçgörüler için birkaç döngü ve günlük kayıt daha gerekiyor.</p>
            )}
          </div>
          {frequent.length > 0 && (
            <div>
              <span className="tiny-label">EN SIK BELİRTİLER</span>
              <p>
                {frequent
                  .map(item => `${item.label} ${item.count} kayıt`)
                  .join(" · ")}
              </p>
            </div>
          )}
        </div>
      </PremiumInsightsGate>
      <p className="disclaimer">
        Bu bilgiler tıbbi değerlendirme yerine geçmez. Tahmini ovülasyon
        bilgilendirme amaçlıdır ve gebelikten korunma yöntemi olarak
        kullanılmamalıdır.
      </p>
    </div>
  );
}

function NativeSettingsPanel() {
  const { adConsent, showAdPrivacyOptions } = useMonetization();
  const [native] = useState(isNativePlatform());
  const [biometricAvailable, setBiometricAvailable] = useState<
    "available" | "unavailable" | "not-enrolled" | "unknown"
  >("unknown");
  const [biometricEnabled, setBiometricEnabled] = useState(() =>
    Boolean((getPreferences() as UserPreferencesWithLock).biometricLockEnabled)
  );
  const [notificationState, setNotificationState] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [showNotificationIntro, setShowNotificationIntro] = useState(false);
  useEffect(() => {
    if (!native) return;
    void checkBiometricAvailability().then(setBiometricAvailable);
    void getNotificationPermission().then(setNotificationState);
  }, [native]);
  const toggleBiometric = async () => {
    if (biometricEnabled) {
      setBiometricEnabled(false);
      savePreferences({
        ...getPreferences(),
        biometricLockEnabled: false,
      } as UserPreferencesWithLock);
      window.dispatchEvent(new Event("luna-biometric-lock-change"));
      return;
    }
    const enabled = await enableBiometricLock();
    if (!enabled) {
      toast.error(
        biometricAvailable === "unavailable"
          ? "Bu cihazda biyometrik doğrulama kullanılamıyor."
          : "Biyometrik doğrulama tamamlanmadı."
      );
      return;
    }
    setBiometricEnabled(true);
    savePreferences({
      ...getPreferences(),
      biometricLockEnabled: true,
    } as UserPreferencesWithLock);
    window.dispatchEvent(new Event("luna-biometric-lock-change"));
    toast.success("Uygulama kilidi etkinleştirildi.");
  };
  const enableNotifications = async () => {
    if (notificationState === "prompt" && !showNotificationIntro) {
      setShowNotificationIntro(true);
      return;
    }
    setShowNotificationIntro(false);
    const permission = await requestNotificationPermission();
    setNotificationState(permission);
    if (permission === "granted") {
      savePreferences({ ...getPreferences(), notificationEnabled: true });
      toast.success(
        native
          ? "Cihaz bildirimleri etkinleştirildi."
          : "Tarayıcı bildirimleri etkinleştirildi."
      );
    } else {
      savePreferences({ ...getPreferences(), notificationEnabled: false });
      toast.error(
        "Bildirim izni kapalı. Cihaz ayarlarından Luna bildirimlerine izin verebilirsin."
      );
    }
  };
  if (!native)
    return (
      <div className="settings-group native-settings-note">
        <span className="tiny-label">MOBİL ÖZELLİKLER</span>
        <div className="privacy-panel">
          <LockKeyhole size={22} />
          <div>
            <strong>Mobil uygulamada bildirim planlama etkinleşir.</strong>
            <p>
              Web sürümünde hatırlatma tercihi saklanır; native bildirim,
              biyometrik kilit ve güvenli depolama Capacitor uygulamasında
              kullanılır.
            </p>
          </div>
        </div>
      </div>
    );
  return (
    <>
      <div className="settings-group">
        <span className="tiny-label">MOBİL GİZLİLİK</span>
        <div className="setting-row">
          <div className="setting-icon">
            <Cloud size={17} />
          </div>
          <div>
            <strong>Yerel bildirimler</strong>
            <span>
              {notificationState === "denied"
                ? "Bildirim izni kapalı"
                : notificationState === "granted"
                  ? "Cihazda planlanır"
                  : "İzin bekleniyor"}
            </span>
          </div>
          <button
            className="toggle"
            aria-label="Yerel bildirimleri etkinleştir"
            onClick={enableNotifications}
          >
            <span className={notificationState === "granted" ? "on" : ""} />
          </button>
        </div>
        <div className="setting-row">
          <div className="setting-icon">
            <LockKeyhole size={17} />
          </div>
          <div>
            <strong>Uygulamayı biyometrik kilitle koru</strong>
            <span>
              {biometricAvailable === "unavailable"
                ? "Bu cihazda biyometrik doğrulama kullanılamıyor."
                : biometricAvailable === "not-enrolled"
                  ? "Cihaz ayarlarından parmak izi ekle."
                  : biometricEnabled
                    ? "Açılışta doğrulama istenir"
                    : "Kapalı"}
            </span>
          </div>
          <button
            className="toggle"
            disabled={biometricAvailable !== "available"}
            aria-label="Biyometrik uygulama kilidini değiştir"
            onClick={toggleBiometric}
          >
            <span className={biometricEnabled ? "on" : ""} />
          </button>
        </div>
        {isAndroid() && adConsent.privacyOptionsRequired && (
          <div className="setting-row">
            <div className="setting-icon">
              <LockKeyhole size={17} />
            </div>
            <div>
              <strong>Reklam gizlilik seçenekleri</strong>
              <span>
                Reklam tercihlerini mağazanın consent ekranında yönet.
              </span>
            </div>
            <button
              className="text-link"
              onClick={() => void showAdPrivacyOptions()}
            >
              Aç
            </button>
          </div>
        )}
      </div>
      {showNotificationIntro && (
        <ConfirmDialog
          open
          title="Cihazında hatırlat"
          description="Luna, yaklaşan tahmini dönemini cihazında hatırlatabilir. Bildirim verileri cihazında planlanır."
          confirmLabel="İzin iste"
          onConfirm={() => void enableNotifications()}
          onCancel={() => setShowNotificationIntro(false)}
        />
      )}{" "}
    </>
  );
}

type UserPreferencesWithLock = ReturnType<typeof getPreferences> & {
  biometricLockEnabled?: boolean;
};

function SettingsView({
  dark,
  setDark,
  setRecords,
  setOnboarded,
}: {
  dark: boolean;
  setDark: (value: boolean) => void;
  setRecords: (records: RecordItem[]) => void;
  setOnboarded: (value: boolean) => void;
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const clearDeviceData = () => {
    clearAllData();
    setRecords([]);
    setOnboarded(false);
    setConfirmClear(false);
    toast.success("Tüm yerel sağlık verilerin temizlendi");
  };
  return (
    <div className="page-view">
      <div className="page-intro">
        <span className="tiny-label">KONTROL SENDE</span>
        <h2>
          Alanını
          <br />
          <em>kendin kur.</em>
        </h2>
        <p>
          Luna Cycle’ın temel ayarları bu cihazda saklanır. Burada yaptığın
          değişiklikler başka yere gitmez.
        </p>
      </div>
      <div className="settings-layout">
        <LunaPlusPanel />
        <div className="settings-group">
          <span className="tiny-label">GÖRÜNÜM</span>
          <div className="setting-row">
            <div className="setting-icon">
              <Sun size={17} />
            </div>
            <div>
              <strong>Renk modu</strong>
              <span>{dark ? "Gece paleti" : "Gündüz paleti"}</span>
            </div>
            <button
              className="toggle"
              aria-label="Renk modunu değiştir"
              onClick={() => {
                const next = !dark;
                setDark(next);
                const nextTheme = next ? "dark" : "light";
                savePreferences({ ...getPreferences(), theme: nextTheme });
                window.dispatchEvent(
                  new CustomEvent("luna-theme-change", { detail: nextTheme })
                );
              }}
            >
              <span className={dark ? "on" : ""} />
            </button>
          </div>
          <ThemeSelector />
        </div>
        <div className="settings-group">
          <span className="tiny-label">GİZLİLİK</span>
          <div className="privacy-panel">
            <LockKeyhole size={22} />
            <div>
              <strong>Verilerin cihazında</strong>
              <p>
                Adet döngüsü ve kişisel sağlık kayıtların bir sunucuya
                gönderilmez.
              </p>
            </div>
          </div>
          <button className="danger-row" onClick={() => setConfirmClear(true)}>
            <Trash2 size={17} /> Tüm yerel kayıtları sil
          </button>
        </div>
        <NativeSettingsPanel />
        <PreferenceControls />
        <DataTools setRecords={setRecords} />
      </div>
      <ConfirmDialog
        open={confirmClear}
        eyebrow="GİZLİLİK MERKEZİ"
        title="Tüm yerel kayıtlar silinsin mi?"
        description="Adet dönemleri, günlük kayıtlar ve tercihler bu cihazdan kalıcı olarak silinecek. Bu işlem geri alınamaz."
        confirmLabel="Tümünü Sil"
        destructive
        onConfirm={clearDeviceData}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}

function ImportConfirmDialog({
  onCancel,
  onConfirm,
  busy,
}: {
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  const firstRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    firstRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        onCancel();
        return;
      }
      if (event.key === "Tab") {
        const dialog = firstRef.current?.closest("[role=dialog]");
        const focusable = dialog
          ? Array.from(
              dialog.querySelectorAll<HTMLElement>(
                "button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)"
              )
            )
          : [];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);
  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="record-modal import-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-dialog-title"
        aria-describedby="import-dialog-description"
      >
        <div className="modal-heading">
          <div>
            <span className="tiny-label">GİZLİLİK MERKEZİ</span>
            <h3 id="import-dialog-title">Yedeği geri yükle</h3>
          </div>
          <button
            className="icon-button"
            aria-label="İçe aktarmayı kapat"
            onClick={onCancel}
            disabled={busy}
          >
            ×
          </button>
        </div>
        <p id="import-dialog-description" className="import-warning">
          Bu işlem mevcut Luna Cycle kayıtlarının üzerine yazacaktır. Devam
          etmek istiyor musun?
        </p>
        <p className="modal-note">
          Mevcut adet ve günlük kayıtların, seçtiğin yedekteki verilerle
          değiştirilecektir.
        </p>
        <div className="modal-actions">
          <button
            ref={firstRef}
            className="ghost-button"
            onClick={onCancel}
            disabled={busy}
          >
            İptal
          </button>
          <button className="danger-solid" onClick={onConfirm} disabled={busy}>
            {busy ? "Geri yükleniyor…" : "Yedeği Geri Yükle"}
          </button>
        </div>
      </section>
    </div>
  );
}

function DataTools({
  setRecords,
}: {
  setRecords: (records: RecordItem[]) => void;
}) {
  const [pendingRaw, setPendingRaw] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };
  const download = async () => {
    const raw = exportBackup();
    const date = iso(startOfToday());
    if (isNativePlatform()) {
      toast.info(
        "Bu dosya adet ve günlük sağlık kayıtlarını içerir. Yalnızca güvendiğin bir yerde sakla veya paylaş."
      );
      const shared = await exportNativeBackup(raw, date);
      if (shared) toast.success("Yedek paylaşım ekranı açıldı");
      else
        toast.error("Yedek dışa aktarılamadı. Dosya paylaşımı kullanılamıyor.");
      return;
    }
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `luna-cycle-backup-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Yedek dosyası indirildi");
  };
  const importNative = async () => {
    const result = await importNativeBackup();
    if (result === "imported") {
      setRecords(
        getPeriodRecords().map(item => ({
          id: Number(item.id) || Date.now(),
          date: item.startDate,
          endDate: item.endDate,
          length: item.length ?? 5,
        }))
      );
      toast.success("Yedek başarıyla geri yüklendi.");
    } else if (result === "invalid")
      toast.error("Bu dosya geçerli bir Luna yedeği değil.");
  };
  const importFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result);
      try {
        validateBackup(raw);
        setPendingRaw(raw);
      } catch {
        resetInput();
        toast.error("Bu dosya geçerli bir Luna yedeği değil");
      }
    };
    reader.readAsText(file);
  };
  const cancelImport = () => {
    setPendingRaw(null);
    setBusy(false);
    resetInput();
  };
  const confirmImport = () => {
    if (!pendingRaw || busy) return;
    setBusy(true);
    try {
      importBackup(pendingRaw);
      const next = getPeriodRecords().map(item => ({
        id: Number(item.id) || Date.now(),
        date: item.startDate,
        endDate: item.endDate,
        length: item.length ?? 5,
      }));
      setRecords(next);
      toast.success("Yedek başarıyla geri yüklendi.");
      cancelImport();
    } catch {
      setBusy(false);
      resetInput();
      toast.error("Yedek geri yüklenemedi. Mevcut verilerin korunuyor.");
    }
  };
  return (
    <div className="settings-group">
      <span className="tiny-label">GİZLİLİK MERKEZİ</span>
      <div className="privacy-panel">
        <LockKeyhole size={22} />
        <div>
          <strong>Sağlık verisi sunucuya gönderimi: Yok</strong>
          <p>
            Adet ve semptom kayıtların cihazında tutulur; analytics olaylarına
            veya reklam isteklerine eklenmez.
          </p>
        </div>
      </div>
      <div className="data-actions">
        <button className="secondary-button" onClick={download}>
          JSON dışa aktar
        </button>
        {isNativePlatform() && (
          <button
            className="secondary-button"
            onClick={() => void importNative()}
          >
            Yedek seç
          </button>
        )}
        <label className="import-button">
          Yedek içe aktar
          <input
            ref={inputRef}
            type="file"
            accept="application/json"
            onChange={event => importFile(event.target.files?.[0])}
          />
        </label>
      </div>
      {pendingRaw && (
        <ImportConfirmDialog
          onCancel={cancelImport}
          onConfirm={confirmImport}
          busy={busy}
        />
      )}
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<Tab>("home");
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, [active]);
  const [biometricLockEnabled, setBiometricLockEnabled] = useState(() =>
    Boolean((getPreferences() as UserPreferencesWithLock).biometricLockEnabled)
  );
  const lifecycle = useNativeLifecycle({
    biometricLockEnabled,
    onBack: () => {
      if (active !== "home") {
        setActive("home");
        return true;
      }
      return false;
    },
  });
  useEffect(() => {
    const onBiometricLockChange = () =>
      setBiometricLockEnabled(
        Boolean(
          (getPreferences() as UserPreferencesWithLock).biometricLockEnabled
        )
      );
    window.addEventListener(
      "luna-biometric-lock-change",
      onBiometricLockChange
    );
    return () =>
      window.removeEventListener(
        "luna-biometric-lock-change",
        onBiometricLockChange
      );
  }, []);
  const [dark, setDark] = useState(() => {
    const theme = getPreferences().theme ?? "system";
    return (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches === true)
    );
  });
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const theme = getPreferences().theme ?? "system";
      setDark(theme === "dark" || (theme === "system" && media.matches));
    };
    const onThemeChange = () => apply();
    const onSystemChange = () => {
      if ((getPreferences().theme ?? "system") === "system")
        setDark(media.matches);
    };
    apply();
    window.addEventListener("luna-theme-change", onThemeChange);
    media.addEventListener?.("change", onSystemChange);
    return () => {
      window.removeEventListener("luna-theme-change", onThemeChange);
      media.removeEventListener?.("change", onSystemChange);
    };
  }, []);
  const [onboarded, setOnboarded] = useState(
    () => getPreferences().onboardingCompleted
  );
  const [records, setRecords] = useState<RecordItem[]>(() => {
    try {
      return getPeriodRecords().map(item => ({
        id: Number(item.id) || Date.now(),
        date: item.startDate,
        endDate: item.endDate,
        length: item.length ?? 5,
      }));
    } catch {
      return initialRecords;
    }
  });
  const saveRecords = (next: RecordItem[]) => {
    setRecords(next);
    savePeriodRecords(
      next.map(item => ({
        id: String(item.id),
        startDate: item.date,
        endDate:
          item.endDate ?? iso(addDays(parseDate(item.date), item.length - 1)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        length: item.length,
      }))
    );
    const nextPrediction = prediction(next);
    void syncCycleReminder(nextPrediction.next, getPreferences());
  };
  const add = () => setRecordModalOpen(true);
  const view = (() => {
    if (active === "calendar")
      return <CalendarView records={records} setRecords={saveRecords} />;
    if (active === "history")
      return <HistoryView records={records} setRecords={saveRecords} />;
    if (active === "insights") return <InsightsView records={records} />;
    if (active === "settings")
      return (
        <SettingsView
          dark={dark}
          setDark={setDark}
          setRecords={saveRecords}
          setOnboarded={setOnboarded}
        />
      );
    return <HomeView records={records} setActive={setActive} />;
  })();
  if (!onboarded)
    return (
      <Onboarding
        onDone={setup => {
          if (setup) {
            const record = {
              id: String(Date.now()),
              startDate: setup.startDate,
              endDate: iso(
                addDays(parseDate(setup.startDate), setup.periodLength - 1)
              ),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              length: setup.periodLength,
            };
            savePeriodRecords([record]);
            savePreferences({
              ...getPreferences(),
              onboardingCompleted: true,
              averageCycleLength: setup.cycleLength,
              averagePeriodLength: setup.periodLength,
            });
            setRecords([
              {
                id: Number(record.id),
                date: record.startDate,
                endDate: record.endDate,
                length: record.length,
              },
            ]);
          } else
            savePreferences({ ...getPreferences(), onboardingCompleted: true });
          setOnboarded(true);
        }}
      />
    );
  return (
    <>
      <div className={`app-shell ${dark ? "dark-mode" : ""}`}>
        <Nav active={active} setActive={setActive} />
        <main className="main-stage">
          <Header active={active} onAdd={add} />
          {view}
          <footer className="app-footer">
            {active === "home" && <PrivacySafeAdSlot slot="home_footer" />}
            {active === "insights" && (
              <PrivacySafeAdSlot slot="insights_footer" />
            )}
            <span>v1.0 · Tasarım gereği özel</span>
            <span>
              <LockKeyhole size={13} /> kayıtların cihazında kalır
            </span>
          </footer>
        </main>
        <div className="mobile-nav">
          {(
            [
              ["home", HomeIcon],
              ["calendar", CalendarDays],
              ["insights", Sparkles],
              ["settings", Settings],
            ] as [Tab, typeof HomeIcon][]
          ).map(([id, Icon]) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => setActive(id)}
            >
              <Icon size={19} />
              <span>
                {id === "home"
                  ? "Ana"
                  : id === "calendar"
                    ? "Takvim"
                    : id === "insights"
                      ? "İçgörü"
                      : "Ayarlar"}
              </span>
            </button>
          ))}
        </div>
      </div>
      {recordModalOpen && (
        <CalendarRecordModal
          open
          mode="edit"
          selectedDate={startOfToday()}
          records={records}
          onClose={() => setRecordModalOpen(false)}
          onSave={next => {
            saveRecords(next);
            setRecordModalOpen(false);
          }}
          onDelete={next => {
            saveRecords(next);
            setRecordModalOpen(false);
          }}
        />
      )}
      {(lifecycle.privacyHidden || lifecycle.locked) && (
        <div
          className="native-privacy-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="native-lock-title"
        >
          <div className="native-lock-card">
            <span className="tiny-label">LUNA CYCLE</span>
            <LockKeyhole size={28} />
            <h2 id="native-lock-title">
              {lifecycle.locked
                ? "Verilerini açmak için doğrula"
                : "Özel alanın gizlendi"}
            </h2>
            {lifecycle.locked && (
              <button
                className="primary-solid"
                onClick={() => void lifecycle.unlock()}
              >
                Kilidi Aç
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
