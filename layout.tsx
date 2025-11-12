"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import MobileTabbar from "@/components/dashboard/MobileTabbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  // Protect dashboard routes
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="h-screen w-full grid place-items-center bg-gradient-to-br from-[#0b0b0b] to-black text-white">
        <div className="animate-pulse text-sm opacity-70">Loading your dashboard…</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-[radial-gradient(1200px_800px_at_80%_-10%,rgba(59,130,246,0.20),transparent),radial-gradient(1000px_700px_at_-10%_120%,rgba(168,85,247,0.18),transparent)] text-white">
      <div className="flex h-full">
        {/* Desktop sidebar */}
        <Sidebar className="hidden md:flex" />

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="relative flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 pb-24">
            {children}
          </main>
        </div>
      </div>

      {/* iOS-style tab bar on mobile */}
      <MobileTabbar />
    </div>
  );
}
