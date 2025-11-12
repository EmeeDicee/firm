"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Clock, DollarSign, HeadphonesIcon, Zap, Users } from "lucide-react";

const features = [
  {
    title: "Trusted & Secure",
    description: "Your investments are protected with bank-level security and advanced encryption.",
    icon: <ShieldCheck className="w-10 h-10 text-blue-400" />,
  },
  {
    title: "Instant Withdrawals",
    description: "Enjoy fast and hassle-free withdrawals at any time, without extra charges.",
    icon: <Clock className="w-10 h-10 text-green-400" />,
  },
  {
    title: "High ROI",
    description: "Get up to 1000% returns on your investments in short and long-term plans.",
    icon: <DollarSign className="w-10 h-10 text-yellow-400" />,
  },
  {
    title: "24/7 Support",
    description: "Our expert team is always available to assist you with any inquiries.",
    icon: <HeadphonesIcon className="w-10 h-10 text-purple-400" />,
  },
  {
    title: "Lightning Fast",
    description: "Blazing fast transactions powered by cutting-edge financial technology.",
    icon: <Zap className="w-10 h-10 text-pink-400" />,
  },
  {
    title: "Global Community",
    description: "Join thousands of investors from over 120 countries worldwide.",
    icon: <Users className="w-10 h-10 text-cyan-400" />,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-20 bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto text-center px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          Why <span className="text-blue-500">Choose Us?</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Here’s why thousands of investors trust us with their financial growth.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
// File: src/components/home/WhyChooseUs.tsx