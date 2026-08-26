// Style: Sessiz Ay Takvimi — native health data lives in an in-memory snapshot backed by OS secure storage, never in browser localStorage.
import { SecureStorage } from "@aparajita/capacitor-secure-storage";
import { isNativePlatform, NATIVE_STORAGE_KEY } from "@/platform/platform";

export interface NativeStorageSnapshot {
  periods: unknown[];
  logs: unknown[];
  preferences: Record<string, unknown> | null;
}

const emptySnapshot = (): NativeStorageSnapshot => ({ periods: [], logs: [], preferences: null });
let snapshot: NativeStorageSnapshot = emptySnapshot();
let initialized = false;
let nativeWriteQueue = Promise.resolve();

function normalize(value: unknown): NativeStorageSnapshot {
  if (!value || typeof value !== "object") return emptySnapshot();
  const raw = value as Partial<NativeStorageSnapshot>;
  return {
    periods: Array.isArray(raw.periods) ? raw.periods : [],
    logs: Array.isArray(raw.logs) ? raw.logs : [],
    preferences: raw.preferences && typeof raw.preferences === "object" ? raw.preferences as Record<string, unknown> : null,
  };
}

async function persist() {
  nativeWriteQueue = nativeWriteQueue.then(() => SecureStorage.set(NATIVE_STORAGE_KEY, snapshot as unknown as Record<string, unknown>));
  await nativeWriteQueue;
}

export async function initializeNativeStorage() {
  if (!isNativePlatform() || initialized) return;
  try {
    const stored = await SecureStorage.get(NATIVE_STORAGE_KEY);
    if (stored) snapshot = normalize(stored);
    else await migrateLegacyLocalStorage();
  } catch {
    snapshot = emptySnapshot();
  } finally {
    initialized = true;
  }
}

export async function migrateLegacyLocalStorage() {
  if (!isNativePlatform()) return false;
  const legacy = {
    periods: readLegacy("luna.periods.v1"),
    logs: readLegacy("luna.daily-logs.v1"),
    preferences: readLegacy("luna.preferences.v1"),
  };
  const candidate = normalize({
    periods: unwrapLegacy(legacy.periods),
    logs: unwrapLegacy(legacy.logs),
    preferences: unwrapLegacy(legacy.preferences),
  });
  if (!candidate.periods.length && !candidate.logs.length && !candidate.preferences) return false;
  const previous = snapshot;
  try {
    snapshot = candidate;
    await persist();
    const verified = normalize(await SecureStorage.get(NATIVE_STORAGE_KEY));
    if (JSON.stringify(verified) !== JSON.stringify(candidate)) throw new Error("Migration verification failed");
    localStorage.removeItem("luna.periods.v1");
    localStorage.removeItem("luna.daily-logs.v1");
    localStorage.removeItem("luna.preferences.v1");
    return true;
  } catch {
    snapshot = previous;
    return false;
  }
}

function readLegacy(key: string) {
  try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
}
function unwrapLegacy(value: unknown) { return value && typeof value === "object" && "data" in value ? (value as { data: unknown }).data : value; }

export function nativeSnapshot() { return snapshot; }
export function nativeReplace(next: NativeStorageSnapshot) { snapshot = normalize(next); void persist(); }
export function nativeStorageReady() { return initialized; }
