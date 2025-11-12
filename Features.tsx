"use client";
import { motion } from "framer-motion";
import { Shield, Zap, Headphones, BarChart, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: <Shield className="w-8 h-8 text-pink-400" />,
    title: "Bank-Level Security",
    desc: "Your funds are safe with multi-layer encryption & secure wallets.",
  },
  {
    icon: <Zap className="w-8 h-8 text-purple-400" />,
    title: "Lightning Fast",
    desc: "Execute trades in milliseconds with zero delays.",
  },
  {
    icon: <Headphones className="w-8 h-8 text-blue-400" />,
    title: "24/7 Support",
    desc: "Our dedicated team is available anytime for assistance.",
  },
  {
    icon: <BarChart className="w-8 h-8 text-green-400" />,
    title: "Advanced Analytics",
    desc: "Track market trends with real-time analytics.",
  },
  {
    icon: <Lock className="w-8 h-8 text-yellow-400" />,
    title: "Secure Transactions",
    desc: "Industry-grade encryption for every single trade.",
  },
  {
    icon: <Globe className="w-8 h-8 text-red-400" />,
    title: "Global Access",
    desc: "Trade from anywhere in the world at any time.",
  },
];

export default function Features() {
  return (
    <section className="relative w-full py-24 bg-[#0a0a0a] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-red-700 opacity-20 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Why Choose Keylite?</h2>
          <p className="text-gray-300 text-lg">
            Your trusted platform for seamless crypto trading.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card rounded-2xl p-8 flex flex-col items-center text-center hover:scale-105 transition shadow-lg backdrop-blur-xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
