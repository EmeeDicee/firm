"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ChevronLeft, Search as SearchIcon, Send } from "lucide-react";
import Image from "next/image";
import Logo from "@/components/global/Logo";
import Link from "next/link";
import { toast } from "react-hot-toast";
import io, { Socket } from "socket.io-client";
import dynamic from "next/dynamic";
const ModalViewer = dynamic(() => import("@/components/ui/ModalViewer"), { ssr: false });

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ id: string; role: string; text?: string; translatedText?: string; imageUrl?: string; createdAt: string }>>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [typingAdmin, setTypingAdmin] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [view, setView] = useState<"welcome" | "threads" | "chat" | "help">("welcome");
  const [threads, setThreads] = useState<Array<{ id: string; updatedAt: string; lastMessage?: { text?: string; translatedText?: string; createdAt: string }; unread?: number }>>([]);
  const [helpQuery, setHelpQuery] = useState("");
  const [helpTopics, setHelpTopics] = useState<Array<{ title: string; description: string; category?: string }>>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIdx, setViewerIdx] = useState(0);
  const [viewerImages, setViewerImages] = useState<string[]>([]);

  // Standardized, proofread UI copy
  const STRINGS = {
    header: "Live Support",
    typing: "Support is typing…",
    online: "Online",
    offline: "Offline",
    back: "Back",
    welcomePrompt: "Got a question? We’re here to help.",
    welcomeStatus: "We’ll respond shortly",
    inbox: "Inbox",
    helpCenter: "Help Center",
    newChat: "New chat",
    noConversations: "No conversations yet.",
    send: "Send",
    searchHelp: "Search help topics",
  } as const;

  // Persist draft and selected thread
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem("chat_draft") || "";
      if (savedDraft) setInput(savedDraft);
      const savedThread = localStorage.getItem("chat_thread_id");
      if (savedThread) setThreadId(savedThread);
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem("chat_draft", input); } catch {}
  }, [input]);
  useEffect(() => {
    try { if (threadId) localStorage.setItem("chat_thread_id", threadId); } catch {}
  }, [threadId]);

  // Help topics now loaded from /api/help/topics

  // Ensure thread exists when opening
  useEffect(() => {
    if (!isOpen) return;
    setView("welcome");
    setAuthError(null);
  }, [isOpen]);

  async function ensureThread() {
    if (threadId) return;
    const res = await fetch("/api/support/threads", { method: "POST" });
    const j = await res.json();
    if (!res.ok) { setAuthError(j?.error || "Please log in to chat with support"); return; }
    setThreadId(j.thread.id);
  }

  type InboxItem = { id: string; updatedAt: string; lastMessage?: { text?: string; translatedText?: string; createdAt: string } | null; unread?: number };
  async function loadThreads() {
    const res = await fetch("/api/support/inbox", { cache: "no-store" });
    const j = await res.json();
    if (res.ok) {
      const arr: InboxItem[] = j.threads || [];
      setThreads(arr.map((t) => ({ id: t.id, updatedAt: t.updatedAt, lastMessage: t.lastMessage || undefined, unread: t.unread ?? 0 })));
    }
  }

  async function loadHelp(q: string = "") {
    const res = await fetch(`/api/help/topics${q ? `?q=${encodeURIComponent(q)}` : ""}`, { cache: "no-store" });
    const j = await res.json();
    if (res.ok) setHelpTopics(j.topics || []);
  }

  // Prefill messages from local cache for faster render
  useEffect(() => {
    if (!threadId) return;
    try {
      const saved = localStorage.getItem(`chat_messages_${threadId}`);
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, [threadId]);

  // Load messages
  useEffect(() => {
    if (!threadId) return;
    (async () => {
      const res = await fetch(`/api/support/threads/${threadId}/messages`);
      const j: { messages?: { id: string; role: string; text?: string; translatedText?: string; imageUrl?: string; createdAt: string }[] } = await res.json();
      if (res.ok) setMessages(j.messages || []);
    })();
    if (!socketRef.current) socketRef.current = io({ path: "/api/socket" });
    socketRef.current.emit("join", threadId);
    socketRef.current.on("message:new", (msg: { id: string; role: string; text?: string; translatedText?: string; imageUrl?: string; createdAt: string }) => {
      setMessages((m) => (m.find((x) => x.id === msg.id) ? m : [...m, msg]));
      listRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
    });
    socketRef.current.on("typing", (p: { typing: boolean; isAdmin?: boolean }) => {
      setTypingAdmin(!!p?.typing && !!p?.isAdmin);
    });
    socketRef.current.on("presence", (p: { online: boolean }) => {
      setAdminOnline(!!p?.online);
    });
    return () => {
      socketRef.current?.off("message:new");
      socketRef.current?.off("typing");
      socketRef.current?.off("presence");
    };
  }, [threadId]);

  // Cache messages per thread
  useEffect(() => {
    if (!threadId) return;
    try { localStorage.setItem(`chat_messages_${threadId}`, JSON.stringify(messages)); } catch {}
  }, [messages, threadId]);

  // Mark thread as read when entering chat view
  useEffect(() => {
    (async () => {
      if (view !== "chat" || !threadId) return;
      await fetch(`/api/support/threads/${threadId}/read`, { method: "POST" }).catch(() => {});
      // refresh inbox to update unread badges
      await loadThreads();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, threadId]);

  // Poll typing & presence
  useEffect(() => {
    if (!threadId || !isOpen) return;
    const i = setInterval(async () => {
      const [typingRes, presenceRes] = await Promise.all([
        fetch(`/api/support/threads/${threadId}/typing`),
        fetch(`/api/support/threads/${threadId}/presence`),
      ]);
      const typingJ: { typing?: Array<{ isAdmin: boolean; typing: boolean }> } = await typingRes.json();
      const presenceJ: { presence?: Array<{ isAdmin: boolean; online: boolean }>; lastSeenAt?: string | null } = await presenceRes.json();
      const adminTyping = (typingJ.typing || []).some((t) => t.isAdmin && t.typing);
      setTypingAdmin(adminTyping);
      const online = (presenceJ.presence || []).some((p) => p.isAdmin && p.online);
      setAdminOnline(online);
      setLastSeenAt(presenceJ.lastSeenAt || null);
    }, 2000);
    return () => clearInterval(i);
  }, [threadId, isOpen]);

  const sendTyping = async (typing: boolean) => {
    if (!threadId) return;
    await fetch(`/api/support/threads/${threadId}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ typing }),
    });
  };

  const handleSend = async () => {
    if (!threadId || sending) return;
    const text = input.trim();
    if (!text && !file) return;
    setSending(true);
    try {
      let res;
      if (file) {
        const fd = new FormData();
        fd.append("file", file);
        if (text) fd.append("text", text);
        res = await fetch(`/api/support/threads/${threadId}/messages`, { method: "POST", body: fd });
      } else {
        res = await fetch(`/api/support/threads/${threadId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      }
      const j: { error?: string; message: { id: string; role: string; text?: string; translatedText?: string; imageUrl?: string; createdAt: string } } = await res.json();
      if (!res.ok) throw new Error(j?.error || "Send failed");
      setInput(""); setFile(null);
      setMessages((m) => [...m, j.message]);
      toast.success(j.message.imageUrl ? "Image sent" : "Message sent");
      listRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error";
      setMessages((m) => [...m, { id: Math.random().toString(), role: "SYSTEM", text: msg, createdAt: new Date().toISOString() }]);
    } finally {
      setSending(false);
      sendTyping(false);
    }
  };

  // Dialog semantics and helpers
  const headerId = "chatbox-header";
  const isSeen = (createdAt: string) => {
    if (!lastSeenAt) return false;
    try { return new Date(lastSeenAt).getTime() >= new Date(createdAt).getTime(); } catch { return false; }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </motion.button>

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-4 w-[90vw] sm:right-6 sm:w-[380px] md:w-[420px] bg-black/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 flex flex-col z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby={headerId}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                {view !== "welcome" && (
                  <button className="p-1 rounded hover:bg-white/10" aria-label={STRINGS.back} title={STRINGS.back} onClick={() => setView("welcome")}><ChevronLeft size={18} /></button>
                )}
                <span id={headerId} className="font-semibold">{STRINGS.header}</span>
              </div>
              <span className="text-xs text-white/60">
                {typingAdmin ? STRINGS.typing : adminOnline ? STRINGS.online : STRINGS.offline}
                {lastSeenAt && <span className="ml-1">· Last seen {new Date(lastSeenAt).toLocaleString()}</span>}
              </span>
            </div>

            {/* Content */}
            {view === "welcome" && (
              <div className="p-4 space-y-4">
                <div className="rounded-2xl bg-blue-900/40 border border-blue-400/20 p-6 text-center">
                  <div className="text-sm text-white/80 mb-3">{STRINGS.welcomePrompt}</div>
                  <div className="flex items-center justify-center gap-4">
                    <Logo size={40} ariaLabel="Support avatar" className="rounded-full" />
                    <Image src="/images/team.png" alt="Support team" width={40} height={40} className="rounded-full" />
                    <Logo size={40} ariaLabel="Support avatar" className="rounded-full" />
                  </div>
                  <div className="mt-3 text-xs text-white/60">{STRINGS.welcomeStatus}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/15" onClick={() => { setView("threads"); loadThreads(); }}>{STRINGS.inbox}</button>
                  <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/15" onClick={() => { setView("help"); loadHelp(); }}>{STRINGS.helpCenter}</button>
                </div>
              </div>
            )}

            {view === "threads" && (
              <div className="p-3 overflow-y-auto max-h-72">
                {threads.length === 0 ? (
                  <div className="text-sm text-white/70">{STRINGS.noConversations}</div>
                ) : (
                  <div className="space-y-2">
                    {threads.map((t) => (
                      <button key={t.id} onClick={async () => { setThreadId(t.id); setView("chat"); }} className="w-full text-left rounded p-2 hover:bg-white/10">
                        <div className="text-sm font-medium flex items-center gap-2">Support {t.unread ? <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-red-600/80 text-[11px]">{t.unread}</span> : null}</div>
                        {t.lastMessage && (
                          <div className="text-xs text-white/70 truncate">
                            {(t.lastMessage.translatedText || t.lastMessage.text || "").slice(0, 80)}
                          </div>
                        )}
                        <div className="text-[11px] text-white/50">Updated {new Date(t.updatedAt).toLocaleString()}</div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="mt-3">
                  <button className="px-3 py-2 rounded bg-blue-600/80" onClick={async () => { await ensureThread(); setView("chat"); }}>{STRINGS.newChat}</button>
                </div>
              </div>
            )}

            {view === "help" && (
              <div className="p-3 space-y-2 overflow-y-auto max-h-72">
                {helpTopics
                  .filter((h) => h.title.toLowerCase().includes(helpQuery.toLowerCase()) || h.description.toLowerCase().includes(helpQuery.toLowerCase()) || (h.category||"").toLowerCase().includes(helpQuery.toLowerCase()))
                  .map((h, idx) => (
                    <div key={idx} className="rounded border border-white/10 bg-white/5 p-3">
                      <div className="font-medium">{h.title}</div>
                      <div className="text-sm text-white/70">{h.description}</div>
                      {h.category && <div className="text-[11px] text-white/50 mt-1">{h.category}</div>}
                    </div>
                  ))}
                {helpTopics.length === 0 && (
                  <div className="text-sm text-white/70">No help topics.</div>
                )}
              </div>
            )}

            {view === "chat" && (
              <div ref={listRef} className="flex-1 overflow-y-auto max-h-64 p-4 space-y-3" aria-live="polite">
                {authError && (
                  <div className="p-3 rounded-xl bg-white/10 text-white/80">
                    {authError}. <Link className="underline" href="/auth/login">Log in</Link> to chat.
                  </div>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={`max-w-[75%] p-3 rounded-xl ${m.role === "ADMIN" ? "bg-gray-800 text-gray-200 self-start" : m.role === "USER" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white self-end" : "bg-white/10 text-white/80 self-center"}`}>
                    {m.imageUrl && (
                      <button aria-label="View uploaded image" title="View uploaded image" onClick={() => { setViewerImages([m.imageUrl!]); setViewerIdx(0); setViewerOpen(true); }}>
                        <Image src={m.imageUrl} alt="upload" width={240} height={160} className="rounded mb-2" placeholder="blur" blurDataURL="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" />
                      </button>
                    )}
                    {m.translatedText && <div className="font-medium whitespace-pre-wrap">{m.translatedText}</div>}
                    {m.text && <div className="text-xs italic text-white/70 mt-1">Original: {m.text}</div>}
                    <div className="text-xs text-white/60 mt-1 flex items-center gap-1">
                      <span>{new Date(m.createdAt).toLocaleString()}</span>
                      {m.role === "USER" && (
                        <span aria-label={isSeen(m.createdAt) ? "Seen" : "Delivered"} title={isSeen(m.createdAt) ? "Seen" : "Delivered"}>
                          {isSeen(m.createdAt) ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer: dynamic input / toggles */}
            {view === "chat" ? (
              <div className="p-3 border-t border-gray-800">
                <div className="flex gap-2 items-end">
                  <input
                    type="text"
                    aria-label="Type your message"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); sendTyping(true); }}
                    onBlur={() => sendTyping(false)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message"
                    className="flex-1 bg-black/40 text-white rounded-lg px-3 outline-none"
                  />
                  <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
                  <button
                    onClick={handleSend}
                    aria-label={STRINGS.send}
                    disabled={sending || !!authError}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 rounded-lg hover:scale-105 transition flex items-center gap-1"
                  >
                    {sending ? "Sending…" : <><Send size={16} /> {STRINGS.send}</>}
                  </button>
                </div>
                {typingAdmin && <div className="mt-1 text-xs text-white/60" aria-live="polite">{STRINGS.typing}</div>}
              </div>
            ) : view === "help" ? (
              <div className="p-3 border-t border-gray-800 flex gap-2 items-center">
                <SearchIcon size={16} className="text-white/70" />
                <input
                  type="text"
                  value={helpQuery}
                  onChange={(e) => { setHelpQuery(e.target.value); loadHelp(e.target.value); }}
                  placeholder={STRINGS.searchHelp}
                  className="flex-1 bg-black/40 text-white rounded-lg px-3 outline-none"
                />
              </div>
            ) : (
              <div className="p-3 border-t border-gray-800 flex items-center justify-between text-xs">
                <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/15" onClick={async () => { await ensureThread(); setView("chat"); }}>{STRINGS.newChat}</button>
                <button className="px-3 py-2 rounded bg-white/10 hover:bg-white/15" onClick={() => setView("help")}>{STRINGS.helpCenter}</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {viewerOpen && (
        <ModalViewer images={viewerImages} index={viewerIdx} onClose={() => setViewerOpen(false)} onIndexChange={setViewerIdx} />
      )}
    </>
  );
}
