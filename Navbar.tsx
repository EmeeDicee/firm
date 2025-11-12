"use client";

import Link from "next/link";
import Logo from "@/components/global/Logo";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "@/components/global/LanguageSwitcher";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-lg shadow-lg border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-extrabold text-yellow-400 flex items-center gap-2" aria-label="Go to homepage">
            <Logo size={40} priority ariaLabel="Keylite Trade logo" />
            <span>
              Keylite<span className="text-white">Trade</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-yellow-400 transition">
              Home
            </Link>
            <Link href="/about" className="hover:text-yellow-400 transition">
              About
            </Link>
            <Link href="/services" className="hover:text-yellow-400 transition">
              Services
            </Link>
            <Link href="/pricing" className="hover:text-yellow-400 transition">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-yellow-400 transition">
              Contact
            </Link>

            {/* Buttons */}
            <div className="flex space-x-4 items-center">
              <LanguageSwitcher compact />
              <Link
                href="/auth/login"
                prefetch={false}
                className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                prefetch={false}
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-yellow-400 text-3xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-lg px-6 py-6 space-y-6"
          >
            <Link href="/" className="block text-lg hover:text-yellow-400">
              Home
            </Link>
            <Link href="/about" className="block text-lg hover:text-yellow-400">
              About
            </Link>
            <Link
              href="/services"
              className="block text-lg hover:text-yellow-400"
            >
              Services
            </Link>
            <Link
              href="/pricing"
              className="block text-lg hover:text-yellow-400"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="block text-lg hover:text-yellow-400"
            >
              Contact
            </Link>

            <div className="flex flex-col gap-4">
              <Link
                href="/auth/login"
                prefetch={false}
                className="border border-yellow-400 text-yellow-400 text-center px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-black transition"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                prefetch={false}
                className="bg-yellow-400 text-black text-center px-4 py-2 rounded-lg hover:bg-yellow-500 transition font-semibold"
              >
                Sign Up
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
