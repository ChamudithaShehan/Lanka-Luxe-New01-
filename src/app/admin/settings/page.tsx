"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useContentStore } from "@/lib/content-store";
import {
  Settings,
  ShieldCheck,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Sparkles,
  Check,
  User,
  Award,
  KeyRound,
  Database,
  ArrowRight,
  RefreshCw,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const {
    siteSettings,
    contact,
    saveSiteSettings,
    saveContact,
  } = useContentStore();

  const [settingsForm, setSettingsForm] = useState(
    siteSettings
      ? JSON.parse(JSON.stringify(siteSettings))
      : {
        brandName: "",
        founderName: "",
        founderTitle: "",
        founderBio: { en: "", ko: "" },
        founderQualifications: [],
        licenseNumber: "",
        experienceYears: "",
        heroHeadline1: { en: "", ko: "" },
        heroHeadline2: { en: "", ko: "" },
        heroSubtitle: { en: "", ko: "" },
      }
  );
  const [contactForm, setContactForm] = useState(
    contact
      ? JSON.parse(JSON.stringify(contact))
      : {
        phone: "",
        whatsapp: "",
        kakao: "",
        email: "",
        address: "",
      }
  );

  const [smtpForm, setSmtpForm] = useState({
    host: "",
    port: "587",
    secure: false,
    user: "",
    pass: "",
    from: "",
  });
  const [testRecipient, setTestRecipient] = useState("");
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Load SMTP config from API
  React.useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.smtp) {
          setSmtpForm({
            host: data.smtp.host || "",
            port: String(data.smtp.port || "587"),
            secure: data.smtp.secure === true,
            user: data.smtp.user || "",
            pass: data.smtp.pass || "",
            from: data.smtp.from || "",
          });
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    if (siteSettings) {
      setSettingsForm(JSON.parse(JSON.stringify(siteSettings)));
    }
  }, [siteSettings]);

  React.useEffect(() => {
    if (contact) {
      setContactForm(JSON.parse(JSON.stringify(contact)));
    }
  }, [contact]);

  const handleTestSmtp = async () => {
    if (!smtpForm.host || !smtpForm.user) {
      toast.error("SMTP Host and Username/Email are required to test connection.");
      return;
    }
    setIsTestingSmtp(true);
    setSmtpTestResult(null);
    try {
      const res = await fetch("/api/admin/settings/test-smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...smtpForm,
          port: parseInt(smtpForm.port || "587", 10),
          testRecipient: testRecipient.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSmtpTestResult({
          success: false,
          message: data.error || "Failed to establish handshake with SMTP server.",
        });
        toast.error(data.error || "SMTP connection test failed.");
      } else {
        setSmtpTestResult({
          success: true,
          message: data.message || "SMTP connection verified successfully!",
        });
        toast.success(data.message || "SMTP connection test passed!");
      }
    } catch (err: any) {
      setSmtpTestResult({
        success: false,
        message: err.message || "Network error testing SMTP server.",
      });
      toast.error("Network error testing SMTP.");
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res1 = await saveSiteSettings(settingsForm);
      const res2 = await saveContact(contactForm);

      // Also persist SMTP settings
      const smtpRes = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtp: {
            ...smtpForm,
            port: parseInt(smtpForm.port || "587", 10),
          },
        }),
      });
      const smtpData = await smtpRes.json();

      if (res1.success && res2.success && smtpData.success) {
        toast.success("Site settings, contact channels, and SMTP configuration saved!");
      } else {
        toast.error(
          res1.error || res2.error || smtpData.error || "Failed to update settings in database."
        );
      }
    } catch {
      toast.error("Failed to save settings.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide flex items-center gap-3">
            <Settings className="w-7 h-7 text-[#C8A45D]" />
            Site, Founder & Contact Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1">
            Configure founder credentials (SLTDA Licence C-1734), contact channels, and homepage headlines.
          </p>
        </div>
      </div>

      {/* Security & Database Backup Quick Access Banner */}
      <div className="bg-gradient-to-r from-[#0B1A30] via-[#10223D] to-[#0B1A30] border border-[#C8A45D]/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#C8A45D]/15 text-[#C8A45D]">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>Admin Accounts, Password Management & Database Backups</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#C8A45D]/20 text-[#C8A45D]">
                Security Center
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
              Add new admins, change your login password, or download full database JSON/MySQL backup snapshots.
            </p>
          </div>
        </div>

        <Link
          href="/admin/admins"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-xs shadow-md transition-all self-start sm:self-auto shrink-0"
        >
          <span>Open Security Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Founder & SLTDA Credentials */}
        <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1B2D4A] pb-4">
            <div className="p-2.5 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Founder Credentials & Accreditation
              </h2>
              <p className="text-xs text-slate-400">
                Official tourist guide licence and archaeology background
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Founder Full Name
              </label>
              <input
                type="text"
                value={settingsForm.founderName}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    founderName: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                SLTDA Licence Number
              </label>
              <input
                type="text"
                value={settingsForm.licenseNumber}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    licenseNumber: e.target.value,
                  })
                }
                placeholder="e.g. C-1734"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-[#C8A45D] font-bold focus:border-[#C8A45D] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                required
                disabled
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Guiding Experience
              </label>
              <input
                type="text"
                value={settingsForm.experienceYears}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    experienceYears: e.target.value,
                  })
                }
                placeholder="e.g. 10+"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Professional Title
              </label>
              <input
                type="text"
                value={settingsForm.founderTitle}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    founderTitle: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Founder Bio (English)
              </label>
              <textarea
                rows={4}
                value={settingsForm.founderBio?.en || ""}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    founderBio: {
                      ...settingsForm.founderBio,
                      en: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Founder Bio (Korean)
              </label>
              <textarea
                rows={4}
                value={settingsForm.founderBio?.ko || ""}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    founderBio: {
                      ...settingsForm.founderBio,
                      ko: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none leading-relaxed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Accreditation Bullet Points (Line by line)
            </label>
            <textarea
              rows={4}
              value={settingsForm.founderQualifications?.join("\n") || ""}
              onChange={(e) =>
                setSettingsForm({
                  ...settingsForm,
                  founderQualifications: e.target.value
                    .split("\n")
                    .filter(Boolean),
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-slate-200 focus:border-[#C8A45D] outline-none font-mono"
            />
          </div>
        </div>

        {/* 2. Direct Contact Channels */}
        <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1B2D4A] pb-4">
            <div className="p-2.5 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Contact Channels & Colombo Atelier
              </h2>
              <p className="text-xs text-slate-400">
                Direct phone, WhatsApp, KakaoTalk and physical address
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                WhatsApp Number (No spaces)
              </label>
              <input
                type="text"
                value={contactForm.whatsapp}
                onChange={(e) =>
                  setContactForm({ ...contactForm, whatsapp: e.target.value })
                }
                placeholder="94771234567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-emerald-400 font-semibold focus:border-[#C8A45D] outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Display Phone
              </label>
              <input
                type="text"
                value={contactForm.phone}
                onChange={(e) =>
                  setContactForm({ ...contactForm, phone: e.target.value })
                }
                placeholder="+94 77 123 4567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                KakaoTalk ID
              </label>
              <input
                type="text"
                value={contactForm.kakao}
                onChange={(e) =>
                  setContactForm({ ...contactForm, kakao: e.target.value })
                }
                placeholder="@lankaluxe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-amber-300 font-semibold focus:border-[#C8A45D] outline-none"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Official Email
              </label>
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
                placeholder="journeys@lankaluxe.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Colombo Office Physical Address
            </label>
            <input
              type="text"
              value={contactForm.address}
              onChange={(e) =>
                setContactForm({ ...contactForm, address: e.target.value })
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              required
            />
          </div>
        </div>

        {/* 3. SMTP Email Server Configuration */}
        <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#1B2D4A] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white">
                  SMTP Email Server Configuration
                </h2>
                <p className="text-xs text-slate-400">
                  Configure outgoing SMTP mail server to reply directly to customer inquiries from the CRM dashboard.
                </p>
              </div>
            </div>

            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hidden sm:inline-block">
              Direct SMTP Dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                SMTP Host Server
              </label>
              <input
                type="text"
                value={smtpForm.host}
                onChange={(e) =>
                  setSmtpForm({ ...smtpForm, host: e.target.value })
                }
                placeholder="e.g. smtp.gmail.com or mail.lankaluxe.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                SMTP Port
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={smtpForm.port}
                  onChange={(e) =>
                    setSmtpForm({ ...smtpForm, port: e.target.value })
                  }
                  placeholder="587"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                />
                <label className="flex items-center gap-1.5 text-xs text-slate-300 whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smtpForm.secure}
                    onChange={(e) =>
                      setSmtpForm({ ...smtpForm, secure: e.target.checked })
                    }
                    className="rounded border-[#1B2D4A] text-[#C8A45D] focus:ring-[#C8A45D]"
                  />
                  <span>SSL (465)</span>
                </label>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Sender Name / From Address
              </label>
              <input
                type="text"
                value={smtpForm.from}
                onChange={(e) =>
                  setSmtpForm({ ...smtpForm, from: e.target.value })
                }
                placeholder='"Lanka Luxe Journeys" <journeys@lankaluxe.com>'
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                SMTP Username / Email
              </label>
              <input
                type="text"
                value={smtpForm.user}
                onChange={(e) =>
                  setSmtpForm({ ...smtpForm, user: e.target.value })
                }
                placeholder="journeys@lankaluxe.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                SMTP Password / App Password
              </label>
              <input
                type="password"
                value={smtpForm.pass}
                onChange={(e) =>
                  setSmtpForm({ ...smtpForm, pass: e.target.value })
                }
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none font-mono"
              />
            </div>
          </div>

          {/* Test SMTP Connection Box */}
          <div className="p-4 rounded-xl bg-[#07111E] border border-[#1B2D4A] space-y-3">
            <span className="text-xs font-bold text-[#C8A45D] block">
              Verify SMTP Connection Handshake
            </span>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                value={testRecipient}
                onChange={(e) => setTestRecipient(e.target.value)}
                placeholder="Optional: Send test email to your personal address (e.g. you@domain.com)"
                className="w-full px-3.5 py-2 rounded-xl bg-[#0B1A30] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
              <button
                type="button"
                onClick={handleTestSmtp}
                disabled={isTestingSmtp}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#12233D] hover:bg-[#1B2D4A] text-slate-200 text-xs font-bold border border-[#1B2D4A] hover:border-[#C8A45D]/40 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isTestingSmtp ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C8A45D]" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Test Connection</span>
                  </>
                )}
              </button>
            </div>

            {smtpTestResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  smtpTestResult.success
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border-red-500/30 text-red-300"
                }`}
              >
                {smtpTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                )}
                <span>{smtpTestResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Homepage Hero Copy */}
        <div className="bg-[#0B1A30] border border-[#1B2D4A] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-[#1B2D4A] pb-4">
            <div className="p-2.5 rounded-xl bg-[#C8A45D]/10 text-[#C8A45D]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-white">
                Homepage Hero Copy & Positioning
              </h2>
              <p className="text-xs text-slate-400">
                Main editorial headlines displayed on the home page
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Hero Headline 1 (English)
              </label>
              <input
                type="text"
                value={settingsForm.heroHeadline1?.en || ""}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    heroHeadline1: {
                      ...settingsForm.heroHeadline1,
                      en: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Hero Headline 1 (Korean)
              </label>
              <input
                type="text"
                value={settingsForm.heroHeadline1?.ko || ""}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    heroHeadline1: {
                      ...settingsForm.heroHeadline1,
                      ko: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Hero Headline 2 (English)
              </label>
              <input
                type="text"
                value={settingsForm.heroHeadline2?.en || ""}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    heroHeadline2: {
                      ...settingsForm.heroHeadline2,
                      en: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Hero Headline 2 (Korean)
              </label>
              <input
                type="text"
                value={settingsForm.heroHeadline2?.ko || ""}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    heroHeadline2: {
                      ...settingsForm.heroHeadline2,
                      ko: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Hero Subtitle (English)
              </label>
              <textarea
                rows={3}
                value={settingsForm.heroSubtitle?.en || ""}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    heroSubtitle: {
                      ...settingsForm.heroSubtitle,
                      en: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Hero Subtitle (Korean)
              </label>
              <textarea
                rows={3}
                value={settingsForm.heroSubtitle?.ko || ""}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    heroSubtitle: {
                      ...settingsForm.heroSubtitle,
                      ko: e.target.value,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-[#C8A45D] hover:bg-[#b5924d] text-[#081426] font-bold text-sm shadow-[0_4px_20px_rgba(200,164,93,0.35)] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Global Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
