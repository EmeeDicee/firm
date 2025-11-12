"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "./TranslationProvider";

// Minimal route-based metadata seeds; pages can override by adding data-meta-* attributes.
const titleSeeds: Record<string, string> = {
  "/": "Keylite Trade — Secure Investments & Withdrawals",
  "/about": "About — Keylite Trade",
  "/services": "Services — Keylite Trade",
  "/pricing": "Pricing — Keylite Trade",
  "/contact": "Contact — Keylite Trade",
  "/dashboard": "Dashboard — Keylite Trade",
};

const descriptionSeeds: Record<string, string> = {
  "/": "Invest securely, track performance, and withdraw with confidence on Keylite Trade.",
  "/about": "Learn about Keylite Trade and our commitment to secure investing.",
  "/services": "Explore our investment services and live support.",
  "/pricing": "Transparent pricing and plans tailored to your goals.",
  "/contact": "Get in touch with Keylite Trade support.",
  "/dashboard": "Your live portfolio overview, earnings, deposits and recent activity.",
};

export default function MetaTranslator() {
  const pathname = usePathname() || "/";
  const base = Object.keys(titleSeeds).find((p) => pathname.startsWith(p)) || "/";
  const { t } = useTranslation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const titleElValue = document.querySelector("[data-meta-title]")?.getAttribute("data-meta-title");
      const descElValue = document.querySelector("[data-meta-description]")?.getAttribute("data-meta-description");
      const titleSeed = titleElValue || titleSeeds[base];
      const descSeed = descElValue || descriptionSeeds[base];
      if (!titleSeed && !descSeed) return;
      if (titleSeed) {
        const trTitle = await t(titleSeed).catch(() => titleSeed);
        if (!cancelled) document.title = trTitle || titleSeed;
      }
      if (descSeed) {
        const trDesc = await t(descSeed).catch(() => descSeed);
        if (!cancelled) {
          let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
          if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "description");
            document.head.appendChild(meta);
          }
          meta.setAttribute("content", trDesc || descSeed);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [base, t]);

  return null;
}