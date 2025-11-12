"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

const reviews = [
  { name: "James", country: "🇺🇸", text: "Just earned $5,200 in 24hrs! 🔥" },
  { name: "Sophia", country: "🇬🇧", text: "Amazing experience, 1000% ROI!" },
  { name: "Liam", country: "🇨🇦", text: "Fast payout, totally legit!" },
  { name: "Olivia", country: "🇦🇺", text: "Keylite is the best investment!" },
  { name: "Noah", country: "🇳🇬", text: "Earned huge profit today 🚀" },
  { name: "Emma", country: "🇮🇳", text: "Transparent & reliable platform." },
];

export default function PopupReview() {
  const [show, setShow] = useState(false);
  const [currentReview, setCurrentReview] = useState(reviews[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      setCurrentReview(reviews[randomIndex]);
      setShow(true);

      // Hide after 5 seconds
      setTimeout(() => setShow(false), 5000);
    }, 12000); // every 12 seconds, show popup

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className="fixed bottom-6 left-6 bg-black bg-opacity-70 backdrop-blur-md text-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-3 z-50 border border-white/10"
        >
          <CheckCircle size={20} className="text-green-400" />
          <div>
            <p className="text-sm font-semibold flex items-center gap-1">
              {currentReview.name} {currentReview.country}
            </p>
            <p className="text-xs text-gray-300">{currentReview.text}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
