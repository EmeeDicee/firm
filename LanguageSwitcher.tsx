"use client";

import { useMemo } from "react";
import { useTranslation } from "./TranslationProvider";

const commonLangs = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "zh", label: "中文" },
  { code: "ja", label: "日本語" },
  { code: "ar", label: "العربية" },
  { code: "he", label: "עברית" },
  { code: "tr", label: "Türkçe" },
  { code: "hi", label: "हिन्दी" },
];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang } = useTranslation();
  const options = useMemo(() => commonLangs, []);
  return (
    <div className="flex items-center gap-2" title="Language">
      {!compact && <span className="text-sm text-gray-400">Lang</span>}
      <select
        aria-label="Language selector"
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700 hover:border-gray-500"
      >
        {options.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}