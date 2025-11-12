"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, CreditCard, User2, MessageSquareText } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { href: "/dashboard", label: "Overview", Icon: Home },
  { href: "/dashboard/investments", label: "Invest", Icon: Wallet },
  { href: "/dashboard/withdraw", label: "Withdraw", Icon: CreditCard },
  { href: "/dashboard/support", label: "Support", Icon: MessageSquareText },
  { href: "/dashboard/profile", label: "Profile", Icon: User2 },
];

export default function MobileTabbar() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-black/60 backdrop-blur-xl border-t border-white/10">
      <div className="grid grid-cols-5">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className="relative py-2.5 flex flex-col items-center gap-1">
              {active && (
                <motion.span
                  layoutId="tabGlow"
                  className="absolute -top-2 w-10 h-10 rounded-full bg-white/10"
                />
              )}
              <Icon size={18} className={active ? "text-white" : "text-white/70"} />
              <span className={`text-[11px] ${active ? "text-white" : "text-white/70"}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
