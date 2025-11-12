"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getTimePeriod, makeGreeting, resolvedTimeZone, clearGreetingCache } from "@/lib/greeting";

type Weather = { tempC?: number; desc?: string } | null;

export default function InvestorGreeting() {
  const [name, setName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);
  const [period, setPeriod] = useState<ReturnType<typeof getTimePeriod>>(getTimePeriod());
  const [weather, setWeather] = useState<Weather>(null);
  const tz = useMemo(() => resolvedTimeZone(), []);
  const [mounted, setMounted] = useState(false);
  const lastPeriodRef = useRef(period);

  // Fetch investor name securely
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/user/me", { cache: "no-store" });
        const j = await res.json();
        if (!active) return;
        if (res.ok && j?.user?.name) {
          setName(j.user.name as string);
          setError(null);
        } else {
          setName(null);
        }
      } catch (e) {
        setOffline(true);
        setError("Network error");
      }
    })();
    return () => { active = false; };
  }, []);

  // Optional personalized weather (best-effort)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!navigator?.geolocation) return;
        navigator.geolocation.getCurrentPosition(async (pos) => {
          if (cancelled) return;
          const { latitude, longitude } = pos.coords;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`;
          const r = await fetch(url);
          const j = await r.json();
          if (cancelled) return;
          const temp = j?.current?.temperature_2m;
          const code = j?.current?.weathercode;
          const desc = typeof code === "number" ? weatherCodeToText(code) : undefined;
          setWeather({ tempC: typeof temp === "number" ? Math.round(temp) : undefined, desc });
        }, () => { /* ignore permission errors */ });
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  // Recompute period every minute using timezone-aware clock
  useEffect(() => {
    setMounted(true);
    const i = setInterval(() => {
      const next = getTimePeriod(new Date(), tz);
      setPeriod((prev) => {
        lastPeriodRef.current = prev;
        return next;
      });
    }, 60_000);
    return () => clearInterval(i);
  }, [tz]);

  // Compute greeting string with memoization
  const greeting = useMemo(() => {
    clearGreetingCache(); // ensure fresh across period changes
    return makeGreeting(name, new Date(), tz);
  }, [name, tz, period]);

  const showOffline = offline && !error; // show offline dot only when not a hard error
  const isReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none select-none fixed left-1/2 -translate-x-1/2 top-5 z-40"
      style={{ paddingTop: 0 }}
    >
      <div
        className={`inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/30 border border-white/20 backdrop-blur-xl ${mounted ? "lux-fade-in" : ""}`}
      >
        {/* Time-of-day ambient */}
        <div className={`absolute -z-10 inset-0 rounded-2xl overflow-hidden ${ambientClass(period)}`} aria-hidden="true" />

        {/* Greeting text */}
        <div
          className={`text-[24px] sm:text-[26px] md:text-[30px] font-semibold tracking-tight text-white ${isReduced ? "" : "lux-glow"}`}
        >
          <span className="opacity-90 transition-opacity duration-300 ease-in-out">{greeting}</span>
        </div>

        {/* Weather micro-display */}
        {weather?.tempC !== undefined && (
          <div className="text-white/80 text-sm tabular-nums" aria-label="Current temperature">
            {weather.tempC}°C{weather.desc ? ` · ${weather.desc}` : ""}
          </div>
        )}

        {/* Offline indicator */}
        {showOffline && (
          <div title="Offline" aria-label="Offline" className="ml-1 w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.7)]" />
        )}
      </div>

      {/* Fallback banners for error states */}
      {error && (
        <div className="mt-2 text-center text-xs text-white/70">Welcome to your private dashboard</div>
      )}
    </div>
  );
}

function ambientClass(period: ReturnType<typeof getTimePeriod>) {
  switch (period) {
    case "morning":
      return "bg-[radial-gradient(120%_80%_at_10%_10%,rgba(253,230,138,0.18),transparent),radial-gradient(90%_70%_at_90%_10%,rgba(59,130,246,0.15),transparent)]";
    case "afternoon":
      return "bg-[radial-gradient(120%_80%_at_10%_10%,rgba(34,197,94,0.18),transparent),radial-gradient(90%_70%_at_90%_10%,rgba(59,130,246,0.12),transparent)]";
    default:
      return "bg-[radial-gradient(120%_80%_at_10%_10%,rgba(99,102,241,0.18),transparent),radial-gradient(90%_70%_at_90%_10%,rgba(17,24,39,0.35),transparent)]";
  }
}

function weatherCodeToText(code: number): string {
  const map: Record<number, string> = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle",
    53: "Drizzle",
    55: "Drizzle",
    61: "Rain",
    63: "Rain",
    65: "Heavy rain",
    71: "Snow",
    73: "Snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm",
    99: "Thunderstorm",
  };
  return map[code] ?? "";
}