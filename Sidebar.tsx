"use client";

import Link from "next/link";
import Logo from "@/components/global/Logo";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  Home,
  Wallet,
  CreditCard,
  User2,
  MessageSquareText,
} from "lucide-react";

const nav = [
  { label: "Overview", href: "/dashboard", Icon: Home },
  { label: "Investments", href: "/dashboard/investments", Icon: Wallet },
  { label: "Withdraw", href: "/dashboard/withdraw", Icon: CreditCard },
  { label: "Profile", href: "/dashboard/profile", Icon: User2 },
  { label: "Support", href: "/dashboard/support", Icon: MessageSquareText },
];

export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-72 shrink-0 h-full flex-col p-4 backdrop-blur-xl bg-white/[0.04] border-r border-white/10",
        "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]",
        "rounded-tr-2xl rounded-br-2xl",
        className
      )}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="w-9 h-9 rounded-2xl overflow-hidden ring-1 ring-white/15 bg-white/5 grid place-items-center">
          <Logo size={36} ariaLabel="Keylite Trade logo" />
        </div>
        <div className="text-xl font-extrabold tracking-tight">
          Keylite <span className="text-white/60">Trade</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-3" />

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-2">
        {nav.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="block">
              <div className="relative">
                {active && (
                  <motion.div
                    layoutId="activeLink"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/15"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <div
                  className={cn(
                    "relative z-10 flex items-center gap-3 px-3 py-3 rounded-xl",
                    "hover:bg-white/5 transition-colors"
                  )}
                >
                  <Icon size={18} className="opacity-90" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Tiny footer */}
      <div className="mt-auto text-[11px] text-white/50 px-2">
        <div className="opacity-70">v1.0 • Dashboard</div>
        <div className="opacity-50">Secure • Encrypted</div>
      </div>
    </aside>
  );
}
