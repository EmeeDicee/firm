"use client";
import { useEffect, useRef } from "react";

interface TradingViewChartProps {
  symbol: string; // e.g., "BTCUSDT"
  interval?: string; // e.g., "1D", "1H"
  height?: number;
}

export default function TradingViewChart({ symbol, interval = "1D", height = 500 }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `BINANCE:${symbol}`,
      interval: interval,
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1", // 1 = Candlestick
      locale: "en",
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      calendar: true,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [symbol, interval]);

  return (
    <div className="tradingview-widget-container" style={{ height: `${height}px` }}>
      <div ref={containerRef} className="tradingview-widget-container__widget" style={{ height: "100%" }}></div>
    </div>
  );
}
