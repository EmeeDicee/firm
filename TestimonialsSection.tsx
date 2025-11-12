"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Star } from "lucide-react";

const reviews = [
  "Best platform ever! My assets grew instantly 🚀",
  "The returns are insane! Totally worth it.",
  "Transparent and super easy to use.",
  "My favorite investment platform so far!",
  "Trustworthy and fast withdrawals 🔥",
  "Amazing experience. 10/10 service!",
  "Keylite is the future of trading.",
  "Real profits in less than 24 hours! 💰",
  "Customer support was quick and helpful, answered all my questions.",
  "I was skeptical at first, but now I’m seeing steady gains.",
  "Smooth interface, makes investing less stressful.",
  "Payouts came faster than I expected!",
  "Love how beginner-friendly the app is.",
  "Definitely more reliable than others I’ve tried.",
  "Simple, clear, and it actually works.",
  "Keylite feels safe and transparent, which is rare.",
  "Withdrawals are seamless, no hidden issues.",
  "I’ve recommended this to three friends already.",
  "Finally an investment app that delivers on promises.",
  "Been testing for weeks, and so far no complaints.",
  "This platform changed the way I look at trading.",
  "Profits are consistent and not exaggerated.",
  "Easy to track my growth daily.",
  "Super intuitive dashboard, love the design.",
  "Exactly what I was looking for in an investment tool.",
  "Had one small issue, but support fixed it in minutes.",
  "Legitimately the first platform I trust.",
  "Returns are better than my bank ever offered!",
  "Everything feels professional and secure.",
  "It’s rare to find transparency like this in trading.",
  "Impressed with the speed of transactions.",
  "Honestly, I was surprised at how easy it is to use.",
  "Finally found a platform that respects users.",
  "I’ve had nothing but positive experiences so far.",
  "The tutorial section really helped me get started.",
  "Feels like they actually care about the community.",
  "Made my first withdrawal today, no problems at all.",
  "Not just hype – the results speak for themselves.",
  "A friend recommended it, and I’m glad I listened.",
  "Best customer service I’ve seen in finance apps.",
  "Clear communication, no shady tactics.",
  "I appreciate how transparent the fees are.",
  "Been with them for 3 months, and I’m impressed.",
  "Consistent growth without stress.",
  "Even as a beginner, I feel confident here.",
  "Better returns than I expected in the first week.",
  "So far, everything has been smooth and reliable.",
  "No nonsense, just solid results.",
  "Love that I can withdraw anytime I want.",
  "UI is clean and easy to navigate.",
  "Honestly feels like the future of investing.",
  "I’ve tried others, but this one stands out.",
  "Every transaction has been fast and accurate.",
  "Impressed by how stable the platform is.",
  "I like how simple it is to monitor my funds.",
  "Great for both small and big investments.",
  "The app doesn’t lag at all, which is rare.",
  "Finally, a platform that delivers profits AND trust.",
  "This has been a game changer for me.",
  "I actually look forward to checking my balance now.",
  "Zero complications so far, highly recommend.",
  "Customer support is a big plus here.",
  "The returns are steady, not unrealistic.",
  "I like the security measures they use.",
  "Feels very reliable compared to competitors.",
  "This platform has exceeded my expectations.",
  "I can finally grow my savings without stress.",
  "Transparent, simple, and effective.",
  "I’ve seen consistent results every week.",
  "No glitches or errors, which is rare these days.",
  "The process from signup to trading was effortless.",
  "I feel safe investing here long-term.",
  "Best financial decision I’ve made in a while.",
  "Withdrawals came in faster than I thought possible.",
  "Really glad I gave this platform a try.",
  "Great balance of simplicity and power.",
  "Trustworthy, and that’s what matters most.",
  "So happy I don’t need to stress about scams here.",
  "It’s refreshing to use something that works as advertised.",
  "Feels like the team behind this really knows what they’re doing.",
  "I started small, but now I’m scaling up.",
  "Impressed with how user-friendly everything is.",
  "Finally an app that doesn’t overcomplicate things.",
  "I’ve made steady gains without headaches.",
  "Love the straightforward approach.",
  "This is exactly the kind of platform I needed.",
  "The mobile app is just as good as desktop.",
  "The withdrawals really are fast and smooth.",
  "No hidden fees, no surprises. Just clear investing.",
  "Definitely worth giving a try.",
  "Seeing my balance grow daily is motivating.",
  "Reliable platform with real potential.",
  "The setup was super quick, no hassle.",
  "I was nervous to invest, but glad I did.",
  "Works better than I could’ve hoped for.",
  "Security and speed are both top notch.",
  "I’ve had a positive experience from day one.",
  "Hands down the best platform in this space.",
  "It feels like they actually value customers.",
  "Been stress-free since I joined.",
  "The reviews were right, this platform delivers.",
  "Exactly what I wanted from an investment app.",
  "The profits aren’t exaggerated, they’re real.",
  "Perfect mix of safety and profitability.",
  "Can’t believe I didn’t join earlier.",
  "Super smooth experience start to finish.",
  "10/10 would recommend to anyone."
];


// 📌 base starting reviews and start date
const BASE_COUNT = 12500;
const START_DATE = new Date("2025-01-01T00:00:00Z"); // adjust to your launch date
const RATE = 30; // seconds per new review (1 every 30s)

export default function TestimonialsSection() {
  const [reviewCount, setReviewCount] = useState(BASE_COUNT);
  const [currentReview, setCurrentReview] = useState(reviews[0]);

  useEffect(() => {
    const updateCount = () => {
      const now = new Date();
      const diffInSeconds = Math.floor((now - START_DATE) / 1000);
      const generatedCount = BASE_COUNT + Math.floor(diffInSeconds / RATE);
      setReviewCount(generatedCount);
    };

    updateCount(); // run once on mount
    const interval = setInterval(updateCount, 5000); // update every 5s
    return () => clearInterval(interval);
  }, []);

  // Rotate reviews every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * reviews.length);
      setCurrentReview(reviews[randomIndex]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 bg-black text-white overflow-hidden">
      {/* Background Blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-pink-700 to-red-700 opacity-20 blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-4">
          Loved by{" "}
          <span className="bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text">
            Thousands
          </span>{" "}
          of Investors
        </h2>
        <p className="text-center text-gray-400 mb-10">
          Trusted by real users around the globe with verified ratings
        </p>

        {/* Stats + Animated Stars */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-5xl font-bold"
            >
              {reviewCount.toLocaleString()}
            </motion.div>
            <p className="text-gray-400">Verified Reviews</p>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2, type: "spring" }}
                className="text-yellow-400"
              >
                <Star size={28} fill="gold" />
              </motion.div>
            ))}
            <span className="ml-2 text-gray-400">5.0 Rating</span>
          </div>
        </div>

        {/* Infinite Scroll Reviews */}
        <div className="relative h-32 overflow-hidden flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentReview}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="glass-card px-8 py-6 text-lg font-semibold rounded-xl flex items-center gap-3"
            >
              <CheckCircle className="text-blue-400" size={20} />
              {currentReview}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}