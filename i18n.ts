export const rtlLanguages = new Set([
  "ar", // Arabic
  "he", // Hebrew
  "fa", // Persian (Farsi)
  "ur", // Urdu
]);

export function normalizeLang(input?: string | null): string {
  const s = (input || "en").toLowerCase();
  // Prefer primary subtag: e.g., "en-US" -> "en"
  const code = s.split(/[-_]/)[0];
  return code || "en";
}

export function isRTL(lang?: string | null): boolean {
  return rtlLanguages.has(normalizeLang(lang));
}

export function getBrowserLang(): string {
  if (typeof navigator !== "undefined") {
    const langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean) as string[];
    return normalizeLang(langs[0] || "en");
  }
  return "en";
}

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function writeCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

export function getInitialLang(): string {
  // Order: cookie -> localStorage -> browser
  if (typeof window !== "undefined") {
    const fromCookie = readCookie("lang");
    if (fromCookie) return normalizeLang(fromCookie);
    try {
      const fromLS = window.localStorage.getItem("lang");
      if (fromLS) return normalizeLang(fromLS);
    } catch {}
  }
  return getBrowserLang();
}

export type TranslationCache = {
  get: (lang: string, text: string) => string | undefined;
  set: (lang: string, text: string, translated: string) => void;
};

export function createTranslationCache(): TranslationCache {
  const mem = new Map<string, string>();
  function key(lang: string, text: string) {
    return `${normalizeLang(lang)}|${text}`;
  }
  return {
    get(lang, text) {
      const k = key(lang, text);
      if (mem.has(k)) return mem.get(k);
      try {
        const raw = typeof window !== "undefined" ? window.localStorage.getItem(`t:${k}`) : null;
        if (raw) return raw;
      } catch {}
      return undefined;
    },
    set(lang, text, translated) {
      const k = key(lang, text);
      mem.set(k, translated);
      try {
        if (typeof window !== "undefined") window.localStorage.setItem(`t:${k}`, translated);
      } catch {}
    },
  };
}