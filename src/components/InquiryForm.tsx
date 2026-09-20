"use client";

import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { useContentStore } from "@/lib/content-store";
import { LuxuryButton } from "./LuxuryButton";
import { CheckCircle2, Sparkles, Send, Lock } from "lucide-react";
import { toast } from "sonner";

interface InquiryFormProps {
  initialTour?: string | undefined;
  initialInterest?: string | undefined;
  isLocked?: boolean | undefined;
  className?: string | undefined;
  onSuccess?: (() => void) | undefined;
  variant?: "dark" | "light" | undefined;
}

export function InquiryForm({
  initialTour,
  initialInterest,
  isLocked = Boolean(initialTour),
  className,
  onSuccess,
  variant = "light",
}: InquiryFormProps) {
  const { t, lang } = useI18n();
  const { addInquiry, contact, tours } = useContentStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    kakao: "",
    country: "",
    dates: "",
    travelers: "2",
    interest: initialInterest || (initialTour ? "luxury" : "custom"),
    tour: initialTour || "",
    budget: "",
    message: initialTour
      ? (lang === "ko"
          ? `${initialTour} 일정에 관한 상세 안내 및 견적, 객실 예약 가능 여부를 문의합니다.`
          : `I am interested in learning more and requesting availability for: ${initialTour}.`)
      : "",
    website: "", // Honeypot field for bot spam detection
  });

  useEffect(() => {
    if (initialTour) {
      setFormData((prev) => ({
        ...prev,
        tour: initialTour,
        interest: initialInterest || prev.interest,
        message: prev.message || (
          lang === "ko"
            ? `${initialTour} 일정에 관한 상세 안내 및 견적, 객실 예약 가능 여부를 문의합니다.`
            : `I am interested in learning more and requesting availability for: ${initialTour}.`
        ),
      }));
    }
  }, [initialTour, initialInterest, lang]);

  const [status, setStatus] = useState<"idle" | "submitting" | "success">(
    "idle",
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setStatus("submitting");
    try {
      const submissionData = {
        ...formData,
        tour: (isLocked && initialTour) ? initialTour : formData.tour,
      };

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("idle");
        toast.error(data.error || "Failed to submit inquiry. Please try again.");
        return;
      }

      setStatus("success");
      if (onSuccess) onSuccess();
    } catch {
      setStatus("idle");
      toast.error("Network error. Please try again.");
    }
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
        <div className="w-16 h-16 rounded-full bg-[#C8A45D]/10 text-[#C8A45D] mx-auto flex items-center justify-center mb-6">
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
          {contact?.whatsapp && (
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
          )}
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
      : "bg-slate-50 border border-slate-200 text-[#081A33] placeholder:text-slate-400 focus:border-[#C8A45D] focus:bg-white focus:ring-1 focus:ring-[#C8A45D]"
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
        <Sparkles className="w-4 h-4 text-[#C8A45D] shrink-0" />
        <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D]">
          {lang === "ko" ? "맞춤 여행 상담 예약" : "Bespoke Journey Consultation"}
        </span>
      </div>

      {/* Bot Honeypot field - visually hidden, non-focusable for genuine users */}
      <div
        className="opacity-0 absolute -left-[9999px] top-0 pointer-events-none -z-50 select-none h-0 w-0 overflow-hidden"
        aria-hidden="true"
      >
        <label htmlFor="inq_website_hp">Website (leave empty)</label>
        <input
          id="inq_website_hp"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
        />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={labelStyles}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              {t("form.whatsapp")}{" "}
              <span className="text-[10px] font-normal lowercase tracking-normal opacity-70">
                {t("form.optional")}
              </span>
            </span>
          </label>
          <input
            type="tel"
            placeholder={t("form.whatsappPlaceholder")}
            value={formData.whatsapp}
            onChange={(e) =>
              setFormData({ ...formData, whatsapp: e.target.value })
            }
            className={inputStyles}
          />
        </div>

        <div>
          <label className={labelStyles}>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
              {t("form.kakao")}{" "}
              <span className="text-[10px] font-normal lowercase tracking-normal opacity-70">
                {t("form.optional")}
              </span>
            </span>
          </label>
          <input
            type="text"
            placeholder={t("form.kakaoPlaceholder")}
            value={formData.kakao}
            onChange={(e) =>
              setFormData({ ...formData, kakao: e.target.value })
            }
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
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={formData.dates.includes(" / ") ? formData.dates.split(" / ")[0] : (formData.dates.match(/^\d{4}-\d{2}-\d{2}$/) ? formData.dates : "")}
              onChange={(e) => {
                const currentDuration = formData.dates.includes(" / ") ? formData.dates.split(" / ")[1] : (formData.dates.match(/^\d{4}-\d{2}-\d{2}$/) ? "" : formData.dates);
                const newDate = e.target.value;
                setFormData({
                  ...formData,
                  dates: newDate && currentDuration ? `${newDate} / ${currentDuration}` : newDate || currentDuration
                });
              }}
              className={inputStyles}
            />
            <select
              value={formData.dates.includes(" / ") ? formData.dates.split(" / ")[1] : (formData.dates.match(/^\d{4}-\d{2}-\d{2}$/) ? "" : formData.dates)}
              onChange={(e) => {
                const currentDate = formData.dates.includes(" / ") ? formData.dates.split(" / ")[0] : (formData.dates.match(/^\d{4}-\d{2}-\d{2}$/) ? formData.dates : "");
                const newDuration = e.target.value;
                setFormData({
                  ...formData,
                  dates: currentDate && newDuration ? `${currentDate} / ${newDuration}` : currentDate || newDuration
                });
              }}
              className={inputStyles}
            >
              <option value="">{lang === "ko" ? "기간 선택..." : "Duration..."}</option>
              <option value="1-3 Days">{lang === "ko" ? "1-3일" : "1–3 Days"}</option>
              <option value="4-7 Days">{lang === "ko" ? "4-7일" : "4–7 Days"}</option>
              <option value="8-10 Days">{lang === "ko" ? "8-10일" : "8–10 Days"}</option>
              <option value="11-14 Days">{lang === "ko" ? "11-14일" : "11–14 Days"}</option>
              <option value="15+ Days">{lang === "ko" ? "15일 이상" : "15+ Days"}</option>
              <option value="Flexible">{lang === "ko" ? "일정 유동적" : "Flexible"}</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelStyles}>{t("form.travelers")}</label>
          <select
            value={formData.travelers}
            onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
            className={inputStyles}
          >
            <option value="1">{lang === "ko" ? "1인 (나홀로 여행)" : "1 Guest (Solo)"}</option>
            <option value="2">{lang === "ko" ? "2인 (커플 / 부부)" : "2 Guests (Couple)"}</option>
            <option value="3-4">{lang === "ko" ? "3–4인 (가족 / 소그룹)" : "3–4 Guests (Family / Small Group)"}</option>
            <option value="5-8">{lang === "ko" ? "5–8인 (골프 / 프라이빗 단체)" : "5–8 Guests (Golf / Private Group)"}</option>
            <option value="8+">{lang === "ko" ? "8인 이상 (기업 / 전세 투어)" : "8+ Guests (Corporate / Charter)"}</option>
          </select>
        </div>
      </div>

      {/* Package Selection */}
      {isLocked && (formData.tour || initialTour) ? (
        <div
          className={`mb-5 p-4 rounded-2xl border transition-all ${
            isDark
              ? "bg-navy/90 border-gold/40 shadow-[0_4px_20px_rgba(200,164,93,0.1)]"
              : "bg-gradient-to-r from-[#C8A45D]/15 via-[#C8A45D]/10 to-amber-50/50 border-[#C8A45D]/30 shadow-xs"
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-[#C8A45D]/20 text-[#C8A45D]">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A45D]">
                {t("form.packageFixed")}
              </span>
            </div>
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] border border-[#C8A45D]/30 uppercase tracking-wider">
              {lang === "ko" ? "선택 완료 · 변경 불가" : "Fixed Itinerary"}
            </span>
          </div>
          <div
            className={`text-base sm:text-lg font-bold mb-1 ${
              isDark ? "text-white" : "text-[#081A33]"
            }`}
          >
            {formData.tour || initialTour}
          </div>
          <p
            className={`text-[11px] leading-normal ${
              isDark ? "text-mist/70" : "text-slate-500"
            }`}
          >
            {t("form.packageFixedHint")}
          </p>
        </div>
      ) : (
        <div className="mb-5">
          <label className={labelStyles}>
            {t("form.package")}{" "}
            <span className="text-[10px] font-normal lowercase tracking-normal opacity-70">
              {t("form.optional")}
            </span>
          </label>
          <select
            value={formData.tour}
            onChange={(e) => {
              const selectedTourName = e.target.value;
              setFormData((prev) => ({
                ...prev,
                tour: selectedTourName,
                message:
                  selectedTourName && !prev.message
                    ? lang === "ko"
                      ? `${selectedTourName} 일정에 관한 상세 안내 및 견적, 객실 예약 가능 여부를 문의합니다.`
                      : `I am interested in learning more and requesting availability for: ${selectedTourName}.`
                    : prev.message,
              }));
            }}
            className={inputStyles}
          >
            <option key="bespoke-custom-option" value="">
              {t("form.bespokeCustom")}
            </option>
            {tours.map((tourItem, index) => {
              const name =
                typeof tourItem.name === "object"
                  ? lang === "ko" && tourItem.name.ko
                    ? tourItem.name.ko
                    : tourItem.name.en
                  : tourItem.name;
              const uniqueKey = tourItem.id || tourItem.slug || `tour-item-${index}`;
              return (
                <option key={uniqueKey} value={name}>
                  {name} ({tourItem.days} {lang === "ko" ? "일" : "Days"})
                </option>
              );
            })}
          </select>
        </div>
      )}

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
            <option value="ultra">{lang === "ko" ? "최고급 럭셔리 (아만, 티 트레일스, 와일드 코스트 등)" : "Ultra-Luxury (Aman, Tea Trails, Wild Coast)"}</option>
            <option value="5star">{lang === "ko" ? "5성급 부티크 & 헤리티지 리조트" : "5-Star Boutique & Heritage Resorts"}</option>
            <option value="golf-resort">{lang === "ko" ? "챔피언십 골프 & 스파 리조트" : "Championship Golf & Spa Resorts"}</option>
            <option value="bespoke">{lang === "ko" ? "맞춤형 조합 (프라이빗 빌라 + 텐티드 사파리)" : "Bespoke Mix (Villas + Tented Safaris)"}</option>
          </select>
        </div>
      </div>

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
