"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window { TradingView?: any }
}

export default function BtcMiniChart({ symbol = "BTCUSD" }: { symbol?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const scriptId = "tv-miniticker";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://s3.tradingview.com/tv.js";
      s.async = true;
      document.body.appendChild(s);
      s.onload = () => render();
    } else {
      render();
    }

    function render() {
      if (!window.TradingView) return;
      new window.TradingView.widget({
        autosize: true,
        symbol,
        interval: "60",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        hide_top_toolbar: true,
        hide_legend: true,
        withdateranges: false,
        allow_symbol_change: false,
        studies: [],
        container_id: "tv-mini-container",
        locale: "en",
        backgroundColor: "rgba(0,0,0,0)",
      });
    }
  }, [symbol]);

  return <div id="tv-mini-container" ref={ref} className="h-[280px] w-full" />;
}
// Note: TradingView's widget is not very React-friendly, so we use direct DOM manipulation.