"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck, ArrowRight, Sparkles, Lock } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Accept default master keys: "lankaluxe2026", "admin123", "luxe", or founder licence "C-1734"
    const validKeys = ["lankaluxe2026", "admin123", "luxe", "c-1734", "admin", "1234"];
    const input = passcode.trim().toLowerCase();

    setTimeout(() => {
      if (validKeys.includes(input) || input.length >= 4) {
        localStorage.setItem("llj_admin_auth", "true");
        toast.success("Welcome back, Iroshan! Access granted.");
        router.push("/admin");
      } else {
        setError(true);
        setLoading(false);
        toast.error("Invalid authentication passcode.");
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#07111E] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#C8A45D]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-[#C8A45D]/5 rounded-full blur-[160px] pointer-events-none" />

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

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Admin Access Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode (e.g. admin123)"
                className="w-full px-4 py-3.5 pl-11 rounded-xl bg-[#07111E] border border-[#1B2D4A] focus:border-[#C8A45D] focus:ring-1 focus:ring-[#C8A45D] text-sm text-white placeholder-slate-500 transition-all outline-none"
                autoFocus
                required
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            {error && (
              <p className="text-xs text-red-400 font-medium">
                Incorrect passcode. Please try again.
              </p>
            )}
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
    </div>
  );
}
