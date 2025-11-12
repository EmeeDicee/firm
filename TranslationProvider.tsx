"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createTranslationCache, getInitialLang, isRTL, normalizeLang, writeCookie } from "@/lib/i18n";
import { translateText } from "@/lib/translate";
import { getLocalTranslation } from "@/lib/localTranslations";

type Ctx = {
  lang: string;
  dir: "ltr" | "rtl";
  setLang: (lang: string) => void;
  t: (text: string, opts?: { source?: string }) => Promise<string>;
  cache: ReturnType<typeof createTranslationCache>;
  apiDown: boolean;
};

const TranslationContext = createContext<Ctx | null>(null);

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
}

export default function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<string>(() => getInitialLang());
  const cache = useMemo(() => createTranslationCache(), []);
  const dir = isRTL(lang) ? "rtl" : "ltr";
  const [apiDown, setApiDown] = useState(false);
  const failCountRef = useRef(0);
  const resetTimerRef = useRef<number | null>(null);
  const missingRef = useRef<Set<string>>(new Set());

  function setLang(next: string) {
    const norm = normalizeLang(next);
    setLangState(norm);
    writeCookie("lang", norm);
    try { window.localStorage.setItem("lang", norm); } catch {}
  }

  useEffect(() => {
    // Reflect language and direction on <html>
    try {
      document.documentElement.lang = normalizeLang(lang);
      document.documentElement.dir = dir;
    } catch {}
  }, [lang, dir]);

  // Prefetch dictionary snapshot and seed cache for current language
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/i18n/${normalizeLang(lang)}`, { cache: "force-cache" });
        const j: { dict?: Record<string, string> } = await res.json();
        const entries = Object.entries(j.dict || {});
        entries.forEach(([k, v]) => cache.set(lang, k, v));
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [lang]);

  async function t(text: string, opts?: { source?: string }): Promise<string> {
    const trimmed = (text || "").trim();
    if (!trimmed) return text;
    const cached = cache.get(lang, trimmed);
    if (cached) return cached;
    if (normalizeLang(lang) === "en") return text; // default language, no translation
    // Offline/local fallback when API considered down
    if (apiDown) {
      const local = getLocalTranslation(lang, trimmed);
      const translated = local || text;
      cache.set(lang, trimmed, translated);
      if (!local && translated === text && normalizeLang(lang) !== "en") {
        const key = `${normalizeLang(lang)}|${trimmed}`;
        if (!missingRef.current.has(key)) {
          missingRef.current.add(key);
          fetch("/api/i18n/missing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lang: normalizeLang(lang), text: trimmed, path: typeof window !== "undefined" ? window.location.pathname : undefined }),
          }).catch(() => {});
        }
      }
      return translated;
    }
    const res = await translateText({ text: trimmed, target: normalizeLang(lang), source: opts?.source });
    const translated = res?.translatedText || getLocalTranslation(lang, trimmed) || text;
    cache.set(lang, trimmed, translated);
    // Circuit breaker: mark API down after consecutive failures
    if (!res) {
      failCountRef.current += 1;
      if (failCountRef.current >= 3) {
        setApiDown(true);
        // Auto-reset after 60s to retry
        if (!resetTimerRef.current) {
          resetTimerRef.current = window.setTimeout(() => {
            failCountRef.current = 0;
            setApiDown(false);
            if (resetTimerRef.current) {
              window.clearTimeout(resetTimerRef.current);
            }
            resetTimerRef.current = null;
          }, 60000);
        }
      }
    } else {
      failCountRef.current = 0;
    }
    if (translated === text && normalizeLang(lang) !== "en") {
      const key = `${normalizeLang(lang)}|${trimmed}`;
      if (!missingRef.current.has(key)) {
        missingRef.current.add(key);
        fetch("/api/i18n/missing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang: normalizeLang(lang), text: trimmed, path: typeof window !== "undefined" ? window.location.pathname : undefined }),
        }).catch(() => {});
      }
    }
    return translated;
  }

  const value: Ctx = { lang, dir, setLang, t, cache, apiDown };
  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}