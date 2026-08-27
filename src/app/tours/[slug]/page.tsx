"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { tours } from "@/data/site";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TourCard } from "@/components/TourCard";
import {
  Clock,
  MapPin,
  Check,
  X as XIcon,
  Hotel,
  Car,
  Sparkles,
  Calendar,
  ShieldCheck,
  Star,
  ArrowRight,
} from "lucide-react";



export default function TourDetailPage() {
  const rawParams = useParams();
  const slug = typeof rawParams?.slug === "string" ? rawParams.slug : Array.isArray(rawParams?.slug) ? rawParams.slug[0] : "";
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();

  const tour = tours.find((item) => item.slug === slug);
  const [activeImage, setActiveImage] = useState(tour?.image || "");
  const [openDay, setOpenDay] = useState<string | null>("01");

  if (!tour) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-28 px-4 text-center bg-[#F9FAFB] text-slate-800">
        <h1 className="text-3xl font-bold mb-4">Journey Not Found</h1>
        <p className="text-sm text-slate-500 mb-8">
          The requested tour itinerary is currently unavailable.
        </p>
        <LuxuryButton variant="pill" href="/tours">
          View All Journeys
        </LuxuryButton>
      </div>
    );
  }

  const relatedTours = tours
    .filter((t) => t.slug !== tour.slug)
    .slice(0, 3);

  return (
    <div className="pt-28 pb-24 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Breadcrumb & Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] font-semibold">
          <Link href="/" className="hover:underline">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <Link href="/tours" className="hover:underline">
            {t("nav.tours")}
          </Link>
          <span>/</span>
          <span className="text-slate-500 truncate">{tl(tour.name)}</span>
        </div>
      </div>

      {/* Main Tour Hero / Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Visual & Gallery */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-100 bg-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
              <img
                src={activeImage || tour.image}
                alt={tl(tour.name)}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm">
                  {tour.category}
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
              {tour.gallery.map((imgSrc, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(imgSrc)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                    (activeImage || tour.image) === imgSrc
                      ? "border-[#C8A45D] scale-105 shadow-md shadow-[#C8A45D]/20"
                      : "border-slate-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Summary & Sticky Booking Box (Right) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="p-7 sm:p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] space-y-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#C8A45D] font-semibold mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{tour.locations.join(" • ")}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#081A33] leading-snug mb-3">
                  {tl(tour.name)}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                  {tl(tour.short)}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 text-xs">
                <div>
                  <span className="block text-[0.625rem] text-slate-400 uppercase font-semibold mb-1">
                    {t("tour.duration")}
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-[#081A33] text-sm">
                    <Clock className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>
                      {tour.days} {lang === "ko" ? "일" : "Days"}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[0.625rem] text-slate-400 uppercase font-semibold mb-1">
                    {t("journeys.from")}
                  </span>
                  <div className="text-lg font-bold text-[#081A33]">
                    {tour.price}
                  </div>
                </div>
              </div>

              {/* Inclusions summary */}
              <div className="space-y-2 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>Private Chauffeur & Luxury Fleet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>5-Star Boutique & Heritage Stays</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>24/7 Bilingual Concierge (EN / KO)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <LuxuryButton
                  variant="pill"
                  size="md"
                  className="w-full justify-center"
                  onClick={() =>
                    openInquiry({
                      tourName: tl(tour.name),
                      interest: tour.category.toLowerCase(),
                    })
                  }
                  withArrow
                >
                  {t("cta.planThis")}
                </LuxuryButton>

                <p className="text-[0.6875rem] text-center text-slate-400">
                  {lang === "ko"
                    ? "🔒 100% 맞춤 변경 가능 · 24시간 내 회신"
                    : "🔒 100% Customizable Itinerary · No Booking Fees"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview & Itinerary Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Overview */}
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
              <h2 className="text-2xl font-bold text-[#081A33] mb-4">
                {t("tour.overview")}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                {tl(tour.overview)}
              </p>
            </div>

            {/* Day by Day Itinerary */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#081A33]">
                  {t("tour.itinerary")}
                </h2>
                <span className="text-xs font-semibold text-[#C8A45D] uppercase">
                  {tour.days} Days Total
                </span>
              </div>

              <div className="space-y-4">
                {tour.itinerary.map((item) => {
                  const isOpen = openDay === item.day;
                  return (
                    <div
                      key={item.day}
                      className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => setOpenDay(isOpen ? null : item.day)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-[#C8A45D] flex items-center justify-center font-bold text-base shrink-0">
                            {item.day}
                          </span>
                          <div>
                            <span className="text-[0.625rem] font-semibold text-[#C8A45D] uppercase block">
                              Day {item.day}
                            </span>
                            <h3 className="text-base sm:text-lg text-[#081A33] font-bold">
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        <span className="text-[#C8A45D] text-base font-bold">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100 text-sm text-slate-500 font-normal leading-relaxed pl-19">
                          {item.text}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-[#081A33] mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#C8A45D]" />
                  <span>{t("tour.included")}</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                  {tour.included.map((inc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#C8A45D] shrink-0 font-bold">✓</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <XIcon className="w-4 h-4 text-rose-500" />
                  <span>{t("tour.excluded")}</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-500 font-normal">
                  {tour.excluded.map((exc, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 shrink-0">✕</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Accommodations & Transport Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-[#081A33] mb-4 flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-[#C8A45D]" />
                  <span>{t("tour.hotels")}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tour.hotels.map((h, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-[#081A33] mb-4 flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#C8A45D]" />
                  <span>{t("tour.transport")}</span>
                </h3>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {tour.transport}
                </p>
              </div>
            </div>
          </div>

          {/* Right Sidebar Details */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] text-center">
              <ShieldCheck className="w-10 h-10 text-[#C8A45D] mx-auto mb-3" />
              <h3 className="text-xl font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "맞춤 일정 상담" : "Tailor This Route"}
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed mb-6">
                {lang === "ko"
                  ? "숙소를 업그레이드하거나, 일정을 줄이거나 늘릴 수 있습니다. 전문 디자이너와 상의하세요."
                  : "Every day and hotel on this itinerary can be tailored to match your pace and preferences."}
              </p>
              <LuxuryButton
                variant="pill"
                size="md"
                className="w-full justify-center"
                onClick={() =>
                  openInquiry({
                    tourName: tl(tour.name),
                    interest: tour.category.toLowerCase(),
                  })
                }
              >
                {t("cta.custom")}
              </LuxuryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Related Journeys */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/60 pt-16">
        <SectionHeader
          eyebrow="Collection"
          title={
            <>
              Other Curated <span className="text-[#C8A45D]">Journeys</span>
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedTours.map((rel) => (
            <TourCard key={rel.slug} tour={rel} />
          ))}
        </div>
      </section>
    </div>
  );
}
