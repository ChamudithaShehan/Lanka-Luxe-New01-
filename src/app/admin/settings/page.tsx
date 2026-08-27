"use client";

import React, { useState } from "react";
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
  RotateCcw,
  User,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const {
    siteSettings,
    contact,
    saveSiteSettings,
    saveContact,
    resetToDefaults,
  } = useContentStore();

  const [settingsForm, setSettingsForm] = useState(
    JSON.parse(JSON.stringify(siteSettings)),
  );
  const [contactForm, setContactForm] = useState(
    JSON.parse(JSON.stringify(contact)),
  );
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSiteSettings(settingsForm);
    saveContact(contactForm);
    toast.success("Site settings and contact details updated globally!");
  };

  const handleResetConfirm = () => {
    resetToDefaults();
    setIsResetConfirmOpen(false);
    toast.success("All data reset to factory defaults!");
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

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/30 transition-colors cursor-pointer w-fit"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Factory Defaults</span>
        </button>
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-white focus:border-[#C8A45D] outline-none"
                required
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
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111E] border border-[#1B2D4A] text-xs text-[#C8A45D] font-bold focus:border-[#C8A45D] outline-none"
                required
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

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0B1A30] border border-red-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-200">
            <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-red-400" />
              Reset All Content to Defaults?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              This will restore all original curated content, tours, golf packages, destinations, experiences, blog posts, and site settings.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#12233D] text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Yes, Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
