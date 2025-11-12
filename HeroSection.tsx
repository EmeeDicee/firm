"use client";
import { useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useTransform, } from "framer-motion";

function AnimatedNumber({ start, type }: { start: number; type: string }) {
  const count = useMotionValue(start);
  const rounded = useTransform(count, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const update = () => {
      let increment = 0;

      if (type === "users") {
        increment = Math.random() * 3 + 1; // 1 - 4 users
        interval = setTimeout(update, 2000 + Math.random() * 2000); // 2-4s
      } else if (type === "assets") {
        increment = Math.random() * 50 + 500; // $500 - $900
        interval = setTimeout(update, 1500 + Math.random() * 1500); // 1.5-3s
      } else if (type === "trades") {
        increment = Math.random() * 30 + 10; // 10 - 40 trades
        interval = setTimeout(update, 1000 + Math.random() * 2000); // 1-3s
      }

      count.set(count.get() + increment);
    };

    update();
    return () => clearTimeout(interval);
  }, [count, type]);

  return <motion.span>{rounded}</motion.span>;
}


export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#0A0A0A] text-white overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 animate-gradient blur-3xl opacity-30"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left Side */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent">
              Trade Crypto Securely
            </span>
            <br /> with <span className="text-white">Keylite</span>
          </h1>
          <p className="mt-6 text-gray-300 text-lg max-w-xl">
            Unlock the future of trading with <span className="text-white font-semibold">Keylite</span>.
            Lightning-fast transactions, transparent policies, and world-class security.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition text-lg">
              Get Started
            </button>
            <button className="px-8 py-4 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 text-white font-semibold shadow-md hover:bg-white/20 hover:scale-105 transition text-lg">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap gap-6 justify-center md:justify-start">
            <div className="glass-card min-w-[max-content] px-6 py-4">
              <h3 className="text-3xl font-bold">
                <AnimatedNumber start={100291} type="users" />
              </h3>
              <p className="text-gray-300 text-sm">Active Users</p>
            </div>
            <div className="glass-card min-w-[max-content] px-6 py-4">
              <h3 className="text-3xl font-bold">
                $<AnimatedNumber start={10507870} type="assets" />
              </h3>
              <p className="text-gray-300 text-sm">Assets Managed</p>
            </div>
            <div className="glass-card min-w-[max-content] px-6 py-4">
              <h3 className="text-3xl font-bold">
                <AnimatedNumber start={900722} type="trades" />
              </h3>
              <p className="text-gray-300 text-sm">Trades Completed</p>
            </div>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="relative flex-1 flex justify-center items-center">
          <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20"></div>
          <Image
            src="/hero-crypto.png"
            alt="Keylite Team"
            width={550}
            height={550}
            className="relative rounded-3xl shadow-2xl border border-white/10 transform hover:scale-105 transition"
          />
        </div>
      </div>

      {/* Bottom Feature Row */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pb-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="glass-card py-8 px-6">
          <h4 className="text-xl font-bold mb-2">Ultra-Fast Trades</h4>
          <p className="text-gray-300 text-sm">
            Execute trades in milliseconds with industry-leading speed.
          </p>
        </div>
        <div className="glass-card py-8 px-6">
          <h4 className="text-xl font-bold mb-2">Bank-Level Security</h4>
          <p className="text-gray-300 text-sm">
            Your funds are protected with advanced encryption and multi-signature wallets.
          </p>
        </div>
        <div className="glass-card py-8 px-6">
          <h4 className="text-xl font-bold mb-2">24/7 Support</h4>
          <p className="text-gray-300 text-sm">
            Our dedicated team is available anytime to assist you with your needs.
          </p>
        </div>
      </div>
    </section>
  );
}
