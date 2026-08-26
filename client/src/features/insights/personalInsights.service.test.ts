import { describe, expect, it } from "vitest";
import { buildPersonalInsights, mostFrequentSymptoms } from "./personalInsights.service";
import type { DailyLog } from "../symptoms/symptom.types";
const log = (date: string, patch: Partial<DailyLog>): DailyLog => ({ id: date, date, createdAt: date, updatedAt: date, ...patch });

describe("personal insights", () => {
  it("yetersiz cycle verisinde insight üretmez", () => { expect(buildPersonalInsights(["2026-01-01", "2026-01-29"], [])).toEqual([]); });
  it("pre-period şişkinlik, kramp, mood ve energy pattern’lerini yeterli örnekle üretir", () => {
    const starts = ["2026-01-01", "2026-02-01", "2026-03-04"];
    const logs = starts.flatMap((start) => { const d = new Date(`${start}T12:00:00`); d.setDate(d.getDate() - 2); const pre = d.toISOString().slice(0, 10); return [log(pre, { symptoms: ["bloating"], mood: ["sensitive"], energy: "low" }), log(start, { cramps: "mild" })]; });
    const text = buildPersonalInsights(starts, logs).map((item) => item.text).join(" ");
    expect(text).toContain("şişkinlik"); expect(text).toContain("Kramp"); expect(text).toContain("Hassas"); expect(text).toContain("Enerji");
  });
  it("tekil semptomu sık pattern olarak göstermez", () => { const starts = ["2026-01-01", "2026-02-01", "2026-03-04"]; expect(buildPersonalInsights(starts, [log("2026-03-02", { symptoms: ["bloating"] })])).toEqual([]); });
  it("en sık semptomları gerçek loglardan sayar", () => { const logs = [log("2026-01-01", { symptoms: ["bloating", "headache"] }), log("2026-01-02", { symptoms: ["bloating"] })]; expect(mostFrequentSymptoms(logs)[0]).toMatchObject({ key: "bloating", count: 2 }); });
});
