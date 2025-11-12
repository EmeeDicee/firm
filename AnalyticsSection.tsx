"use client";
import { useState } from "react";
import TradingViewChart from "./TradingViewChart";

const coins = [
  { name: "Bitcoin", symbol: "BTCUSDT" },
  { name: "Ethereum", symbol: "ETHUSDT" },
  { name: "BNB", symbol: "BNBUSDT" },
  { name: "Solana", symbol: "SOLUSDT" },
  { name: "XRP", symbol: "XRPUSDT" },
  { name: "Cardano", symbol: "ADAUSDT" },
  { name: "Dogecoin", symbol: "DOGEUSDT" },
  { name: "Polygon", symbol: "MATICUSDT" },
];

export default function AnalyticsSection() {
  const [selectedCoin, setSelectedCoin] = useState("BTCUSDT");

  return (
    <section className="w-full bg-black text-white py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-10">
          Real-Time Crypto Analytics
        </h2>

        {/* Coin Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {coins.map((coin) => (
            <button
              key={coin.symbol}
              onClick={() => setSelectedCoin(coin.symbol)}
              className={`px-6 py-3 rounded-xl font-semibold transition ${
                selectedCoin === coin.symbol
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {coin.name}
            </button>
          ))}
        </div>

        {/* TradingView Chart */}
        <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-700">
          <TradingViewChart symbol={selectedCoin} height={550} />
        </div>

        {/* Real-Time Stats Placeholder */}
        <div className="mt-8 flex justify-center gap-10 text-center">
          <div>
            <p className="text-3xl font-bold text-green-400">$48,239</p>
            <p className="text-gray-400">Current Price</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-400">+4.2%</p>
            <p className="text-gray-400">24h Change</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-400">$8.2B</p>
            <p className="text-gray-400">24h Volume</p>
          </div>
        </div>
      </div>
    </section>
  );
}
