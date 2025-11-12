"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CallToAction() {
  const router = useRouter();

  return (
    <section
      className="relative bg-gradient-to-br from-black via-gray-900 to-black text-white py-24 overflow-hidden"
    >
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ scale: 1.02 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        style={{
          background:
            "radial-gradient(1200px 600px at 50% 100%, rgba(147,51,234,0.35), transparent 70%), radial-gradient(800px 400px at 0% 0%, rgba(59,130,246,0.25), transparent 70%)",
        }}
      ></motion.div>

      <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Start Growing Your Wealth Today
        </motion.h2>

        <motion.p
          className="text-lg text-gray-300 mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Join thousands of investors using Keylite to achieve financial freedom with smart, secure investments.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
          onClick={() => router.push("/auth/signup")}
        >
          Get Started Now
        </motion.button>

        {/* Floating glow effect */}
        <motion.div
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-purple-500 rounded-full blur-[120px] opacity-20"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        ></motion.div>
      </div>
    </section>
  );
}
