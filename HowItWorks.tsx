"use client";

import { motion } from "framer-motion";
import { UserPlus, DollarSign, TrendingUp, Wallet } from "lucide-react";

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up in seconds and get instant access to your investment dashboard.",
    icon: <UserPlus className="w-8 h-8 text-blue-400" />,
  },
  {
    title: "Choose Investment Plan",
    description: "Select from short-term, long-term, or VIP investment strategies.",
    icon: <DollarSign className="w-8 h-8 text-green-400" />,
  },
  {
    title: "Deposit & Start Earning",
    description: "Invest your funds and watch your earnings grow in real time.",
    icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
  },
  {
    title: "Withdraw Anytime",
    description: "Enjoy instant withdrawals with no hidden charges or delays.",
    icon: <Wallet className="w-8 h-8 text-yellow-400" />,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-6xl mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          How It <span className="text-blue-500">Works</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Start your investment journey in four simple steps.
        </motion.p>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:scale-105 transition-transform"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
// File: src/components/Global/ActivityBot.tsx