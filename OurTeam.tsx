"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTwitter, FaLinkedin } from "react-icons/fa";

const teamMembers = [
  {
    name: "Evelyn Carter",
    role: "CEO & Founder",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Evelyn is a visionary leader with 15+ years in fintech and blockchain innovation, driving Keylite's global strategy.",
    twitter: "",
    linkedin: "",
  },
  {
    name: "Liam Johnson",
    role: "Chief Investment Officer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Liam oversees all investment strategies and ensures high ROI for clients through cutting-edge analytics and research.",
    twitter: "",
    linkedin: "",
  },
  {
    name: "Sophia Martinez",
    role: "Head of Risk Management",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Sophia manages Keylite’s risk framework, ensuring security and compliance for all investments worldwide.",
    twitter: "",
    linkedin: "",
  },
  {
    name: "James Walker",
    role: "Chief Technology Officer",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    bio: "James leads the technology team, developing Keylite's advanced trading infrastructure and AI-driven tools.",
    twitter: "",
    linkedin: "",
  },
];

export default function OurTeam() {
  const [selected, setSelected] = useState<any>(null);

  return (
    <section className="py-20 bg-black text-white relative z-10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setSelected(member)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full border-4 border-white/20 mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-300 text-sm">{member.role}</p>
              <div className="flex gap-3 mt-4">
                <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                  <FaTwitter className="text-blue-400 hover:text-blue-300" size={20} />
                </a>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <FaLinkedin className="text-blue-500 hover:text-blue-400" size={20} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal for Bio */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-black rounded-2xl p-8 max-w-lg w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-xl"
              >
                ✕
              </button>
              <div className="flex flex-col items-center text-center">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-28 h-28 rounded-full mb-4 border-4 border-gray-200 object-cover"
                />
                <h3 className="text-2xl font-bold">{selected.name}</h3>
                <p className="text-gray-600 text-sm">{selected.role}</p>
                <p className="mt-4 text-gray-800">{selected.bio}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
// File: src/components/home/OurTeam.tsx