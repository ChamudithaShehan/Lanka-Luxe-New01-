"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyRound, ShieldCheck, ArrowRight, Lock, Clock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExpired =
    searchParams.get("expired") === "1" ||
    searchParams.get("expired") === "true";
  const fromUrl = searchParams.get("from");

  const [username, setUsername] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: passcode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(true);
        setLoading(false);
        toast.error(data.error || "Invalid credentials.");
        return;
      }

      toast.success(`Welcome back, ${data.user?.name || "Admin"}! Access granted.`);
      const destination =
        fromUrl && fromUrl.startsWith("/admin") && fromUrl !== "/admin/login"
          ? fromUrl
          : "/admin";
      window.location.href = destination;
    } catch {
      setError(true);
      setLoading(false);
      toast.error("An error occurred during authentication.");
    }
  };

  return (
    <div className="w-full max-w-md bg-[#0B1A30]/90 border border-[#1B2D4A] rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md relative z-10">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#C8A45D]/10 border border-[#C8A45D]/30 text-[#C8A45D] mb-2 shadow-[0_0_25px_rgba(200,164,93,0.2)]">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Lanka Luxe Atelier
        </h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#C8A45D] font-medium">
          Administrative Management System
        </p>
      </div>

      {/* Session Expired Security Banner */}
      {isExpired && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3 text-xs leading-relaxed animate-fade-in shadow-lg">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-0.5">
            <span className="font-bold text-amber-300 block text-xs">
              Session Expired
            </span>
            <span className="text-slate-300">
              Your administrative session has timed out or expired. Please sign in again to continue your operations.
            </span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full px-4 py-3.5 pl-11 rounded-xl bg-[#07111E] border border-[#1B2D4A] focus:border-[#C8A45D] focus:ring-1 focus:ring-[#C8A45D] text-sm text-white placeholder-slate-500 transition-all outline-none"
                autoFocus
                required
              />
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3.5 pl-11 rounded-xl bg-[#07111E] border border-[#1B2D4A] focus:border-[#C8A45D] focus:ring-1 focus:ring-[#C8A45D] text-sm text-white placeholder-slate-500 transition-all outline-none"
                required
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {error && (
              <p className="text-xs text-red-400 font-medium pt-1">
                Invalid username or password.
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-sm tracking-wide transition-all shadow-[0_4px_20px_rgba(200,164,93,0.35)] flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? "Authenticating..." : "Unlock Dashboard"}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>

      {/* Security & Credentials Badge */}
      <div className="mt-8 pt-6 border-t border-[#1B2D4A]/60 flex flex-col items-center gap-2 text-[11px] text-slate-400 text-center">
        <div className="flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C8A45D]" />
          <span>SLTDA Registered Guide Operations (C-1734)</span>
        </div>
        <Link
          href="/"
          className="text-xs text-[#C8A45D] hover:underline font-medium mt-1"
        >
          ← Return to public website
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#07111E] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#C8A45D]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-[#C8A45D]/5 rounded-full blur-[160px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md bg-[#0B1A30]/90 border border-[#1B2D4A] rounded-3xl p-8 text-center text-slate-400">
            Loading...
          </div>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
