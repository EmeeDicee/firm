"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "./providers";
import { usePathname } from "next/navigation";
import ActivityBot from "@/components/global/ActivityBot";
import LiveChatWidget from "@/components/LiveChatWidget";
import { Toaster } from "react-hot-toast"; // ✅ Add this

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const hideNavbar = isDashboard || isAdmin;
  const showActivityBot = !(isDashboard || isAdmin);
  const showChatWidget = !(isDashboard || isAdmin);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/brand/logo.svg?v=1" as="image" type="image/svg+xml" />
        <link rel="icon" href="/brand/logo.svg?v=1" type="image/svg+xml" />
      </head>
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <Providers enableTranslation={!isAdmin}>
          {!hideNavbar && <Navbar />}
          <main className="pt-16">{children}</main>
          {!hideNavbar && <Footer />}
          {showActivityBot && <ActivityBot />}
          {showChatWidget && <LiveChatWidget />}
          <Toaster position="top-center" reverseOrder={false} /> {/* ✅ Toast here */}
        </Providers>
      </body>
    </html>
  );
}
