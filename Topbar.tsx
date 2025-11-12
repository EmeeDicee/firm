"use client";

import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, LogOut, Check, User2 } from "lucide-react";
import io from "socket.io-client";
import { cn } from "@/lib/cn";
import Image from "next/image";
import LanguageSwitcher from "@/components/global/LanguageSwitcher";

export default function Topbar() {
  const { data: session } = useSession();
  const avatarBlur = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<Array<{ id: string; title: string; message: string; createdAt: string; read: boolean }>>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const avatarSeed = encodeURIComponent(session?.user?.email || "guest@keylite");

  // Load notifications
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        const j = await res.json();
        if (res.ok) setNotifs(j.notifications || []);
      } catch {}
    })();
  }, []);

  // Subscribe to real-time notifications
  useEffect(() => {
    const uid = session?.user?.id;
    if (!uid) return;
    const sock = io({ path: "/api/socket" });
    sock.emit("joinUser", uid);
    sock.on("notification:new", (n: { id: string; title: string; message: string; createdAt: string }) => {
      setNotifs((arr) => [ { ...n, read: false }, ...arr ]);
    });
    return () => { sock.off("notification:new"); sock.close(); };
  }, [session?.user?.id]);

  return (
    <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-10 backdrop-blur-xl bg-gradient-to-r from-black/40 via-black/30 to-black/40 border-b border-white/10">
      {/* Search Bar */}
      <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 border border-white/10 min-w-[260px] shadow-inner">
        <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-70">
          <path
            fill="currentColor"
            d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 0 0 1.48-5.34C15.17 5.59 12.53 3 9.5 3S3.83 5.59 3.83 8.39 6.47 13.78 9.5 13.78c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 19.49L21.49 18zM9.5 12.28c-2.14 0-3.89-1.75-3.89-3.89s1.75-3.89 3.89-3.89 3.89 1.75 3.89 3.89-1.75 3.89-3.89 3.89z"
          />
        </svg>
        <input
          placeholder="Search…"
          className="bg-transparent outline-none text-sm placeholder:text-white/50 w-full"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Language selector */}
        <div className="hidden sm:block" aria-label="Language">
          <LanguageSwitcher compact />
        </div>
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {notifs.some(n => !n.read) && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 ring-2 ring-black" />
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-black/70 backdrop-blur-2xl border border-white/10 shadow-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="font-semibold text-sm">Notifications</div>
                  <button onClick={async () => { await fetch('/api/notifications/read-all', { method: 'POST' }); setNotifs(arr => arr.map(a => ({ ...a, read: true }))); }} className="text-xs inline-flex items-center gap-1 text-gray-300 hover:text-white">
                    <Check className="h-4 w-4" /> Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifs.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-white/60">No notifications</div>
                  ) : notifs.map(n => (
                    <div key={n.id} className="px-4 py-3 text-sm hover:bg-white/5 cursor-pointer">
                      <div className="font-medium">{n.title}</div>
                      <div className="text-xs text-white/70">{n.message}</div>
                      <div className="text-[10px] text-white/50 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-3 rounded-2xl px-2 py-1 hover:bg-white/5"
          >
          <Image
            src={
              session?.user?.image ||
              `https://api.dicebear.com/8.x/avataaars/svg?radius=50&seed=${avatarSeed}`
            }
            alt="User avatar"
            width={36}
            height={36}
            priority
            placeholder="blur"
            blurDataURL={avatarBlur}
            className="w-9 h-9 rounded-full border border-white/20"
          />

            <div className="hidden sm:block text-left">
              <div className="text-xs text-white/60">Signed in</div>
              <div className="text-sm font-semibold truncate max-w-[160px]">
                {session?.user?.email}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16 }}
                className={cn(
                  "absolute right-0 mt-2 w-64 rounded-2xl overflow-hidden",
                  "bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl"
                )}
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="text-sm font-bold">
                    {session?.user?.name || "Keylite User"}
                  </div>
                  <div className="text-xs text-white/60 truncate">
                    {session?.user?.email}
                  </div>
                </div>

                <div className="p-1">
                  <DropdownItem
                    href="/dashboard/profile"
                    icon={<User2 size={16} />}
                  >
                    Profile
                  </DropdownItem>
                  <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-2 text-sm"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function DropdownItem({
  children,
  href,
  icon,
}: {
  children: React.ReactNode;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="px-3 py-2.5 rounded-xl hover:bg-white/10 flex items-center gap-2 text-sm"
    >
      {icon}
      {children}
    </a>
  );
}
// End of file