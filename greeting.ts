/*
  Time-based greeting utilities with timezone-aware calculations using Intl.DateTimeFormat.
  Boundaries:
  - Morning:   05:00–11:59
  - Afternoon: 12:00–16:59
  - Evening:   17:00–04:59
*/

export type TimePeriod = "morning" | "afternoon" | "evening";

// Memo cache to avoid recomputing greeting text for the same inputs
const cache = new Map<string, string>();

export function resolvedTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function localHour(date: Date, timeZone: string): number {
  // Use Intl to compute hour in target timezone (24h)
  const parts = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone,
  }).formatToParts(date);
  const hourPart = parts.find((p) => p.type === "hour");
  const hour = hourPart ? parseInt(hourPart.value, 10) : date.getUTCHours();
  return Number.isFinite(hour) ? hour : 0;
}

export function getPeriodByHour(hour: number): TimePeriod {
  // Morning: 5–11, Afternoon: 12–16, Evening: 17–4
  if (hour >= 5 && hour <= 11) return "morning";
  if (hour >= 12 && hour <= 16) return "afternoon";
  return "evening"; // 17–23 and 0–4
}

export function getTimePeriod(date: Date = new Date(), tz: string = resolvedTimeZone()): TimePeriod {
  const h = localHour(date, tz);
  return getPeriodByHour(h);
}

export function detectHonorific(name?: string | null): string | null {
  if (!name) return null;
  const trimmed = name.trim();
  // Match common honorifics followed by space or end-of-string, case-insensitive
  const match = /^\s*(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)(?=\s|$)/i.exec(trimmed);
  return match ? match[1] : null;
}

export type SeasonalInfo = {
  label: string;
  emoji?: string;
};

export function seasonalVariation(date: Date = new Date()): SeasonalInfo | null {
  const m = date.getMonth(); // 0-based
  if (m === 11) return { label: "Happy Holidays", emoji: "✨" }; // December
  if (m === 0) return { label: "New Year", emoji: "🎉" };
  if (m === 3) return { label: "Spring Vibes", emoji: "🌸" };
  if (m === 5) return { label: "Summer Glow", emoji: "☀️" };
  if (m === 8) return { label: "Autumn Warmth", emoji: "🍂" };
  return null;
}

export function makeGreeting(name?: string | null, date: Date = new Date(), tz: string = resolvedTimeZone()): string {
  const hour = localHour(date, tz);
  const period = getPeriodByHour(hour);
  const honor = detectHonorific(name);
  const key = `${tz}:${hour}:${name || "_anon"}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const base =
    period === "morning"
      ? "Good morning"
      : period === "afternoon"
      ? "Good afternoon"
      : "Good evening";

  const displayName = name?.trim() || "valued investor";
  const coreName = honor ? displayName.replace(/^\s*(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s*/i, "") : displayName;
  const withHonor = honor ? `${base}, ${honor} ${coreName}` : `${base}, ${displayName}`;

  const season = seasonalVariation(date);
  const result = season ? `${withHonor} · ${season.label}${season.emoji ? " " + season.emoji : ""}` : withHonor;
  cache.set(key, result);
  return result;
}

export function clearGreetingCache(): void { cache.clear(); }

export function periodLabel(period: TimePeriod): string {
  return period === "morning" ? "Good morning" : period === "afternoon" ? "Good afternoon" : "Good evening";
}