import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LuxuryButton } from "./LuxuryButton";
import { CheckCircle2, Sparkles, Send } from "lucide-react";
import { contact } from "@/data/site";

interface InquiryFormProps {
  initialTour?: string | undefined;
  initialInterest?: string | undefined;
  className?: string | undefined;
  onSuccess?: (() => void) | undefined;
  variant?: "dark" | "light" | undefined;
}

export function InquiryForm({
  initialTour,
  initialInterest,
  className,
  onSuccess,
  variant = "light",
}: InquiryFormProps) {
  const { t, lang } = useI18n();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    dates: "",
    travelers: "2",
    interest: initialInterest || (initialTour ? "luxury" : "custom"),
    tour: initialTour || "",
    budget: "",
    message: initialTour
      ? `I am interested in learning more and requesting availability for: ${initialTour}.`
      : "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      if (onSuccess) onSuccess();
    }, 1000);
  };

  const isDark = variant === "dark";

  if (status === "success") {
    const whatsappMsg = encodeURIComponent(
      `Hello Lanka Luxe, I just submitted an inquiry for: ${formData.interest} (${formData.name}, ${formData.travelers} travelers, ${formData.dates || "Dates flexible"}).`,
    );

    return (
      <div
        className={`p-8 md:p-12 text-center rounded-[2rem] border ${
          isDark
            ? "bg-navy-2 border-gold/30 text-white"
            : "bg-white border-slate-100 text-[#081A33]"
        } shadow-xl`}
      >
        <div className="w-16 h-16 rounded-full bg-[#1E7B9E]/10 text-[#1E7B9E] mx-auto flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-3">
          {t("form.sent")}
        </h3>
        <p
          className={`text-sm md:text-base max-w-md mx-auto mb-8 ${
            isDark ? "text-mist" : "text-slate-500"
          }`}
        >
          {t("form.sentDesc")} {t("contact.reassure")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <LuxuryButton
            variant="pill"
            href={`https://wa.me/${contact.whatsapp}?text=${whatsappMsg}`}
            isExternal
            withArrow
          >
            {lang === "ko"
              ? "WhatsApp으로 즉시 대화하기"
              : "Chat with Specialist on WhatsApp"}
          </LuxuryButton>
          <button
            onClick={() => setStatus("idle")}
            className={`text-xs uppercase tracking-widest underline ${
              isDark
                ? "text-mist hover:text-white"
                : "text-slate-400 hover:text-slate-700"
            } transition-colors cursor-pointer`}
          >
            {lang === "ko" ? "다른 문의 작성하기" : "Send Another Inquiry"}
          </button>
        </div>
      </div>
    );
  }

  const inputStyles = `w-full px-4 py-3.5 text-sm rounded-xl transition-all duration-200 outline-none ${
    isDark
      ? "bg-navy/80 border border-white/15 text-white placeholder:text-mist/50 focus:border-gold focus:bg-navy focus:ring-1 focus:ring-gold"
      : "bg-slate-50 border border-slate-200 text-[#081A33] placeholder:text-slate-400 focus:border-[#1E7B9E] focus:bg-white focus:ring-1 focus:ring-[#1E7B9E]"
  }`;

  const labelStyles = `block text-xs font-semibold tracking-wider uppercase mb-2 ${
    isDark ? "text-mist" : "text-slate-700"
  }`;

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 sm:p-8 md:p-10 rounded-[2rem] border ${
        isDark
          ? "bg-navy-2/95 border-white/10 shadow-2xl backdrop-blur-sm"
          : "bg-white border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]"
      } ${className || ""}`}
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-4 h-4 text-[#1E7B9E] shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1E7B9E]">
          {lang === "ko" ? "맞춤 여행 상담 예약" : "Bespoke Journey Consultation"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelStyles}>{t("form.name")} *</label>
          <input
            type="text"
            required
            placeholder={lang === "ko" ? "홍길동" : "e.g. Lorde Hastings"}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputStyles}
          />
        </div>

        <div>
          <label className={labelStyles}>{t("form.email")} *</label>
          <input
            type="email"
            required
            placeholder="you@domain.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputStyles}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        <div>
          <label className={labelStyles}>{t("form.country")}</label>
          <input
            type="text"
            placeholder={lang === "ko" ? "대한민국" : "e.g. United Kingdom, Korea"}
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className={inputStyles}
          />
        </div>

        <div>
          <label className={labelStyles}>{t("form.dates")}</label>
          <input
            type="text"
            placeholder={lang === "ko" ? "2026년 10월 중 (10일)" : "e.g. Oct 2026 / 10 Days"}
            value={formData.dates}
            onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
            className={inputStyles}
          />
        </div>

        <div>
          <label className={labelStyles}>{t("form.travelers")}</label>
          <select
            value={formData.travelers}
            onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
            className={inputStyles}
          >
            <option value="1">1 Guest (Solo)</option>
            <option value="2">2 Guests (Couple)</option>
            <option value="3-4">3–4 Guests (Family / Small Group)</option>
            <option value="5-8">5–8 Guests (Golf / Private Group)</option>
            <option value="8+">8+ Guests (Corporate / Charter)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelStyles}>{t("form.interest")}</label>
          <select
            value={formData.interest}
            onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
            className={inputStyles}
          >
            <option value="luxury">{t("interest.luxury")}</option>
            <option value="golf">{t("interest.golf")}</option>
            <option value="wildlife">{t("interest.wildlife")}</option>
            <option value="honeymoon">{t("interest.honeymoon")}</option>
            <option value="family">{t("interest.family")}</option>
            <option value="custom">{t("interest.custom")}</option>
          </select>
        </div>

        <div>
          <label className={labelStyles}>
            {lang === "ko" ? "선호 숙소 등급" : "Preferred Luxury Style"}
          </label>
          <select
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className={inputStyles}
          >
            <option value="ultra">Ultra-Luxury (Aman, Tea Trails, Wild Coast)</option>
            <option value="5star">5-Star Boutique & Heritage Resorts</option>
            <option value="golf-resort">Championship Golf & Spa Resorts</option>
            <option value="bespoke">Bespoke Mix (Villas + Tented Safaris)</option>
          </select>
        </div>
      </div>

      {formData.tour && (
        <div className="mb-5 p-3 rounded-xl bg-[#1E7B9E]/10 border border-[#1E7B9E]/20 text-xs text-[#1E7B9E] flex items-center justify-between">
          <span>
            {lang === "ko" ? "선택한 일정:" : "Selected Journey:"}{" "}
            <strong>{formData.tour}</strong>
          </span>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, tour: "" })}
            className="text-slate-400 hover:text-slate-700 underline ml-2 text-xs"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mb-6">
        <label className={labelStyles}>{t("form.message")}</label>
        <textarea
          rows={3}
          placeholder={
            lang === "ko"
              ? "특별한 기념일, 희망하는 액티비티(빅토리아 골프, 얄라 사파리 등), 선호하는 여행 스타일을 자유롭게 적어주세요."
              : "Tell us about your ideal travel style, preferred pace, must-see highlights (e.g. Victoria Golf tee times, Yala leopards, private helicopter), or any special occasions."
          }
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={inputStyles}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <span
          className={`text-xs ${
            isDark ? "text-mist/60" : "text-slate-400 font-normal"
          }`}
        >
          {lang === "ko"
            ? "🔒 24시간 이내 개인 맞춤 제안서 회신"
            : "🔒 24-hour response with bespoke itinerary draft"}
        </span>

        <LuxuryButton
          type="submit"
          variant="pill"
          size="md"
          disabled={status === "submitting"}
          className="w-full sm:w-auto"
        >
          {status === "submitting" ? (
            <span className="animate-pulse">
              {lang === "ko" ? "전송 중..." : "Sending..."}
            </span>
          ) : (
            t("form.submit")
          )}
        </LuxuryButton>
      </div>
    </form>
  );
}
