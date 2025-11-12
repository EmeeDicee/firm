"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Coin {
  name: string;
  price: number;
  change: number;
}

const PriceTicker = () => {
  const [coins, setCoins] = useState<Coin[]>([
    { name: "BTC/USD", price: 47239.12, change: 0.43 },
    { name: "ETH/USD", price: 35985.42, change: 0.88 },
    { name: "USDT/USD", price: 14700.17, change: 0.99 },
    { name: "BNB/USD", price: 43198.14, change: 0.8 },
    { name: "XRP/USD", price: 20322.24, change: 0.97 },
    { name: "ADA/USD", price: 25980.47, change: -0.66 },
    { name: "DOGE/USD", price: 44942.26, change: -0.74 },
    { name: "SOL/USD", price: 30453.85, change: 0.31 },
    { name: "DOT/USD", price: 24567.41, change: -0.16 },
  ]);

  // Simulate live price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => ({
          ...coin,
          price: parseFloat((coin.price + Math.random() * 100 - 50).toFixed(2)),
          change: parseFloat((coin.change + (Math.random() * 0.5 - 0.25)).toFixed(2)),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-900 text-white py-2 overflow-hidden border-b border-gray-700">
      <div className="flex whitespace-nowrap animate-marquee">
        {coins.map((coin, index) => (
          <div
            key={index}
            className="flex items-center gap-3 text-lg font-medium px-8"
          >
            <span>{coin.name}</span>
            <span>${coin.price.toLocaleString()}</span>
            <span
              className={`flex items-center gap-1 ${
                coin.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {coin.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {coin.change}%
            </span>
          </div>
        ))}
        {/* Duplicate list for seamless loop */}
        {coins.map((coin, index) => (
          <div
            key={`duplicate-${index}`}
            className="flex items-center gap-3 text-lg font-medium px-8"
          >
            <span>{coin.name}</span>
            <span>${coin.price.toLocaleString()}</span>
            <span
              className={`flex items-center gap-1 ${
                coin.change >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {coin.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {coin.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker;
