import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "coin-images.coingecko.com",
      "i.pravatar.cc",
      "res.cloudinary.com",
      "api.dicebear.com",
    ],
  },
};

export default nextConfig;
// Note: This is the Next.js configuration file