// Style: Sessiz Ay Takvimi — günlük notlar sade, cihaz içi ve kullanıcı dilinde.
export type Flow = "none" | "spotting" | "light" | "medium" | "heavy";
export type Cramp = "none" | "mild" | "medium" | "severe";
export type Energy = "very_low" | "low" | "normal" | "high" | "very_high";
export type MoodKey = "happy" | "calm" | "energetic" | "motivated" | "sensitive" | "emotional" | "stressed" | "anxious" | "sad" | "irritable" | "unfocused";
export interface DailyLog { id: string; date: string; flow?: Flow; cramps?: Cramp; mood?: MoodKey[]; symptoms?: string[]; energy?: Energy; note?: string; createdAt: string; updatedAt: string; }
