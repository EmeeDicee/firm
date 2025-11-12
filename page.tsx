"use client";
import { useState } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) setStatus(data.error || "Unable to register");
    else {
      setStatus("Account created. You can sign in now.");
    }
  }

  return (
    <AuthShell title="Create Your Account" subtitle="Join Keylite Trade in seconds">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Full Name</label>
          <input className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:ring-2 focus:ring-blue-500"
            value={name} onChange={(e)=>setName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:ring-2 focus:ring-blue-500"
            type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Password</label>
          <input className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:ring-2 focus:ring-blue-500"
            type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {status && <p className={`text-sm ${status.startsWith("Account") ? "text-green-400":"text-red-400"}`}>{status}</p>}
        <button className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-95 transition">
          Create Account
        </button>
        <div className="text-sm text-gray-300 text-center">
          Already have an account? <Link href="/auth/login" className="hover:text-white">Sign in</Link>
        </div>
      </form>
    </AuthShell>
  );
}
// Note: This file is for the registration page located at /register