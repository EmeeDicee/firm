"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const plans = [
  {
    name: "Flash Plan",
    roi: 1000, // 1000%
    duration: "1 Day",
    description: "Massive short-term gains for risk-takers.",
  },
  {
    name: "Advanced Plan",
    roi: 1500, // 1500%
    duration: "7 Days",
    description: "Balanced high return for mid-term investors.",
    popular: true,
  },
  {
    name: "Elite Plan",
    roi: 3000, // 3000%
    duration: "30 Days",
    description: "Maximize profit with our top-tier plan.",
  },
];

export default function InvestmentCalculator() {
  const [amount, setAmount] = useState(100);

  return (
    <section className="relative w-full py-24 bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-pink-800 to-red-700 opacity-20 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Choose Your Investment Plan</h2>
          <p className="text-gray-300 text-lg">
            Enter an amount and see your potential earnings instantly.
          </p>
        </div>

        {/* Amount Input */}
        <div className="flex justify-center mb-12">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-72 px-6 py-3 rounded-xl text-black text-lg font-semibold outline-amber-50 border border-gray-300 focus:ring-2 focus:ring-pink-500"
            placeholder="Enter amount"
          />
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const profit = (amount * plan.roi) / 100;
            const total = amount + profit;

            return (
              <motion.div
                key={i}
                className={`relative rounded-2xl p-8 flex flex-col text-center hover:scale-105 transition shadow-xl backdrop-blur-xl bg-white/5 border border-white/10 ${
                  plan.popular ? "border-pink-500 shadow-pink-500/50" : ""
                }`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                {plan.popular && (
                  <span className="absolute -top-4 bg-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-300 text-sm mb-6">{plan.description}</p>
                <p className="text-lg mb-2">
                  ROI: <span className="font-bold text-pink-500">{plan.roi}%</span>
                </p>
                <p className="text-lg mb-6">Duration: {plan.duration}</p>

                <div className="space-y-3 text-left bg-white/10 rounded-xl p-4">
                  <p>
                    Investment: <span className="font-bold">${amount.toFixed(2)}</span>
                  </p>
                  <p>
                    Profit: <span className="font-bold text-green-400">+${profit.toFixed(2)}</span>
                  </p>
                  <p>
                    Total Return: <span className="font-bold text-pink-500">${total.toFixed(2)}</span>
                  </p>
                </div>

                <Link href="/login">
                  <button className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition">
                    Start Investing
                  </button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
