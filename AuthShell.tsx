"use client";
import { motion } from "framer-motion";

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode; }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* animated blobs */}
      <motion.div
        className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-blue-500/20 blur-[120px]"
        animate={{ x: [0, 40, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 w-[520px] h-[520px] rounded-full bg-purple-500/20 blur-[120px]"
        animate={{ x: [0, -40, 20, 0], y: [0, 20, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity }}
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/10 border border-white/15 backdrop-blur-2xl rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.5)] p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {title}
            </h1>
            {subtitle && <p className="text-gray-300 mt-2">{subtitle}</p>}
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
// Note: This component is used as a shell for auth pages like login and register