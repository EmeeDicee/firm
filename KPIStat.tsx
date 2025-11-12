"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";

export default function KPIStat({
  icon,
  label,
  value,
  prefix,
  tooltip,
  currency = "USD",
  format = "currency",
  decimals = 2,
  gradient = "from-blue-500 to-purple-600",
}: {
  icon: ReactNode;
  label: string;
  value: number;
  prefix?: string;
  tooltip?: string;
  currency?: string;
  format?: "currency" | "number";
  decimals?: number;
  gradient?: string;
}) {
  const mv = useMotionValue(0);
  const formatter = new Intl.NumberFormat(undefined, {
    style: format === "currency" ? "currency" : "decimal",
    currency: format === "currency" ? currency : undefined,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const shown = useTransform(mv, (v) =>
    (prefix ?? "") + formatter.format(v)
  );

  // Fit number inside the right-hand box by auto-scaling font size
  const containerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState<number>(24);

  const fitNumber = () => {
    const cont = containerRef.current;
    const num = numberRef.current;
    if (!cont || !num) return;
    const BASE = 24; // px
    const MIN = 14; // px
    // Reset to base size before measuring
    num.style.fontSize = `${BASE}px`;
    const contWidth = cont.offsetWidth;
    const textWidth = num.scrollWidth;
    if (!contWidth || !textWidth) return;
    const padding = 6;
    if (textWidth <= contWidth - padding) {
      setFontSize(BASE);
    } else {
      const ratio = (contWidth - padding) / textWidth;
      const next = Math.max(MIN, Math.floor(BASE * Math.min(1, ratio)));
      setFontSize(next);
    }
  };

  useLayoutEffect(() => {
    fitNumber();
    // Re-fit shortly after to account for animation settling
    const t = setTimeout(fitNumber, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, currency, format]);

  useEffect(() => {
    const cont = containerRef.current;
    if (!cont) return;
    const ro = new ResizeObserver(() => fitNumber());
    ro.observe(cont);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.2, ease: "easeOut" });
    return () => controls.stop();
  }, [value, mv]);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur">
      <div className={`absolute -top-8 -right-10 h-36 w-36 blur-2xl rounded-full bg-gradient-to-br ${gradient} opacity-30`} />
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 text-gray-300 min-w-0">
            <div className="h-9 w-9 grid place-items-center rounded-2xl bg-white/10 border border-white/10">
              {icon}
            </div>
            <span className="text-sm truncate" title={tooltip}>{label}</span>
          </div>
          <div className="text-right min-w-0" ref={containerRef}>
            <motion.div
              ref={numberRef}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.1 }}
              className="font-extrabold tracking-tight whitespace-nowrap"
            >
              {shown}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
