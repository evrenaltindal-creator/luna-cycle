// Style: Sessiz Ay Takvimi — reminders are private, local, sparse, and never sent to a server.
import { LocalNotifications } from "@capacitor/local-notifications";
import { isNativePlatform } from "@/platform/platform";
import type { UserPreferences } from "../cycle/cycle.types";
import { t } from "@/i18n";

export type NotificationPermission = "prompt" | "granted" | "denied";
export const LUNA_REMINDER_ID = 21001;

export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (isNativePlatform()) {
    try { const result = await LocalNotifications.checkPermissions(); return result.display === "granted" ? "granted" : result.display === "denied" ? "denied" : "prompt"; } catch { return "denied"; }
  }
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  return Notification.permission === "granted" ? "granted" : Notification.permission === "denied" ? "denied" : "prompt";
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (isNativePlatform()) {
    try { const result = await LocalNotifications.requestPermissions(); return result.display === "granted" ? "granted" : result.display === "denied" ? "denied" : "prompt"; } catch { return "denied"; }
  }
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  try { const result = await Notification.requestPermission(); return result === "granted" ? "granted" : result === "denied" ? "denied" : "prompt"; } catch { return "denied"; }
}

export async function cancelCycleReminders() {
  if (!isNativePlatform()) return;
  try { await LocalNotifications.cancel({ notifications: [{ id: LUNA_REMINDER_ID }] }); } catch { /* native plugin unavailable: web fallback remains safe */ }
}

export async function scheduleCycleReminder(predictedStart: Date, preferences: Pick<UserPreferences, "notificationDaysBefore" | "privateNotificationText">) {
  const reminderDate = new Date(predictedStart); reminderDate.setHours(9, 0, 0, 0); reminderDate.setDate(reminderDate.getDate() - preferences.notificationDaysBefore);
  if (reminderDate.getTime() <= Date.now()) return false;
  const title = t("Luna'dan bir hatırlatman var.");
  const body = preferences.privateNotificationText ? title : t("Yaklaşık adet başlangıç aralığın yaklaşıyor; bu kesin bir tarih değil.");
  if (!isNativePlatform()) return false;
  try { await cancelCycleReminders(); await LocalNotifications.schedule({ notifications: [{ id: LUNA_REMINDER_ID, title, body, isExactNotification: false, schedule: { at: reminderDate, allowWhileIdle: true }, extra: { source: "luna-cycle" } }] }); return true; } catch { return false; }
}

export async function syncCycleReminder(predictedStart: Date | null, preferences: UserPreferences) {
  await cancelCycleReminders();
  if (!predictedStart || !preferences.notificationEnabled) return false;
  const permission = await getNotificationPermission();
  if (permission !== "granted") return false;
  return scheduleCycleReminder(predictedStart, preferences);
}
