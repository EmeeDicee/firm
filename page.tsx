"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { COMPANY } from "@/config/company";
import MaskedPhone from "@/components/global/MaskedPhone";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("Please fill out all fields.");
      return;
    }
    setStatus("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-20 px-4 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="w-full h-full bg-gradient-to-r from-blue-900 via-purple-900 to-black opacity-30"
        />
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
          Get in Touch with Us
        </h1>
        <p className="text-gray-400 text-lg">
          Have questions or need help? Our team is always here for you.
        </p>
      </div>

      {/* Contact Info + Form */}
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          <div className="space-y-6 text-gray-300">
            <div className="flex items-center gap-4">
              <MapPin className="text-blue-400" size={24} />
              <p>600 California St, 11th Floor, San Francisco, CA 94108, United States</p>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-green-400" size={24} />
              <MaskedPhone phone={COMPANY.phone} />
            </div>
            <div className="flex items-center gap-4">
              <Mail className="text-purple-400" size={24} />
              <p>support@keylite-trade.com</p>
            </div>
          </div>

          {/* Social Icons */}
          <div className="mt-8 flex gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition">
              <Facebook size={28} />
            </a>
            <a href="#" className="text-gray-400 hover:text-sky-400 transition">
              <Twitter size={28} />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-500 transition">
              <Instagram size={28} />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-600 transition">
              <Linkedin size={28} />
            </a>
          </div>

          {/* Google Map */}
          <div className="mt-8 rounded-xl overflow-hidden border border-white/10">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.01345624562!2d-122.40345208467616!3d37.79217847975608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064d3f4e5d3%3A0xeef98b9155d!2s600%20California%20St%2C%20San%20Francisco%2C%20CA%2094108!5e0!3m2!1sen!2sus!4v1690312345678!5m2!1sen!2sus"
              width="100%"
              height="250"
              className="border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Message</label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-black/40 border border-gray-600 text-white outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {status && <p className="text-sm text-green-400">{status}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}