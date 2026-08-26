// Style: Sessiz Ay Takvimi — native backup files are explicit, local, and validated before replacement.
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { isNativePlatform } from "@/platform/platform";
import { importBackup, validateBackup } from "../cycle/cycle.storage";

function decodeBase64(data: string) {
  const binary = atob(data);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function exportNativeBackup(raw: string, date: string) {
  if (!isNativePlatform()) return false;
  const fileName = `luna-cycle-backup-${date}.json`;
  try {
    const result = await Filesystem.writeFile({ path: fileName, data: raw, directory: Directory.Documents, encoding: Encoding.UTF8, recursive: true });
    if (await Share.canShare()) await Share.share({ title: "Luna Cycle yedeği", text: "Bu dosya adet ve günlük sağlık kayıtlarını içerir.", url: result.uri, dialogTitle: "Luna yedeğini paylaş" });
    return true;
  } catch { return false; }
}

export async function importNativeBackup(): Promise<"cancelled" | "invalid" | "imported" | "failed"> {
  if (!isNativePlatform()) return "failed";
  try {
    const result = await FilePicker.pickFiles({ types: ["application/json"], limit: 1, readData: true });
    const file = result.files[0];
    if (!file?.data) return "cancelled";
    const raw = decodeBase64(file.data);
    validateBackup(raw);
    importBackup(raw);
    return "imported";
  } catch (error) {
    if (error instanceof Error && /cancel/i.test(error.message)) return "cancelled";
    return "invalid";
  }
}
