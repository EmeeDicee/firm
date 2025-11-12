"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, Check } from "lucide-react";

type Notice = {
  id: string;
  title: string;
  body: string;
  ts: number;
};

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notice[]>([]);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Pull from ActivityBot log if available
  useEffect(() => {
    const load = () => {
      const raw = localStorage.getItem("keylite_activity_log");
      if (raw) {
        try {
          const arr = JSON.parse(raw) as any[];
          const translated: Notice[] = arr.slice(-20).reverse().map((e, idx) => ({
            id: e.id || String(idx),
            title: e.type?.toUpperCase?.() ?? "Activity",
            body: e.text ?? "",
            ts: e.ts ?? Date.now(),
          }));
          setItems(translated);
        } catch {}
      }
    };
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  // click outside to close
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!btnRef.current) return;
      const panel = document.getElementById("notif-panel");
      if (!panel) return;
      if (!btnRef.current.contains(e.target as Node) && !panel.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const unread = items.length;

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={() => setOpen(v => !v)}
        className="relative h-11 w-11 grid place-items-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-rose-500 ring-2 ring-[#0b0b0b]" />
        )}
      </button>

      {open && (
        <div
          id="notif-panel"
          className="absolute right-0 mt-2 w-[22rem] rounded-2xl border border-white/10 bg-[#0c0c0c]/95 backdrop-blur shadow-xl overflow-hidden z-50"
        >
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="font-semibold">Notifications</div>
            <button
              onClick={() => setItems([])}
              className="text-xs inline-flex items-center gap-1 text-gray-300 hover:text-white"
            >
              <Check className="h-4 w-4" /> Mark all read
            </button>
          </div>
          <div className="max-h-80 overflow-auto divide-y divide-white/10">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-gray-400">No new notifications</div>
            ) : items.map(n => (
              <div key={n.id} className="px-4 py-3">
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-gray-400">{n.body}</div>
                <div className="text-[10px] text-gray-500 mt-1">{new Date(n.ts).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
