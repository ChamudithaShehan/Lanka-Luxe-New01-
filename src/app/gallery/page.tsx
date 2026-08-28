"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useContentStore } from "@/lib/content-store";
import { useInquiry } from "@/lib/inquiry-context";
import { galleryCategories, type GalleryItem } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { LuxuryButton } from "@/components/LuxuryButton";
import {
  Sparkles,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Camera,
  ArrowRight,
} from "lucide-react";

export default function GalleryPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const { gallery } = useContentStore();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(
    null,
  );

  const filteredItems = gallery.filter((item) => {
    if (selectedCategory === "All") return true;
    return item.category === selectedCategory;
  });

  const activePhoto =
    activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handlePrev = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev! > 0 ? prev! - 1 : filteredItems.length - 1,
    );
  }, [activeLightboxIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) =>
      prev! < filteredItems.length - 1 ? prev! + 1 : 0,
    );
  }, [activeLightboxIndex, filteredItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeLightboxIndex === null) return;
      if (e.key === "Escape") setActiveLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeLightboxIndex, handlePrev, handleNext]);

  const getCategoryLabel = (cat: string) => {
    if (cat === "All") return t("gallery.all");
    if (cat === "Luxury Resorts") return t("gallery.resorts");
    if (cat === "Heritage & Culture") return t("gallery.heritage");
    if (cat === "Wildlife & Safari") return t("gallery.wildlife");
    if (cat === "Coastal & Beaches") return t("gallery.beaches");
    if (cat === "Highlands & Tea") return t("gallery.highlands");
    if (cat === "Scenic Golf") return t("gallery.golf");
    return cat;
  };

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Header & Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <Reveal variant="fade-up">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] mb-3 font-semibold">
            <Link href="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span>{t("nav.gallery")}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A45D]/10 text-[#C8A45D] text-xs font-semibold uppercase tracking-wider mb-4">
                <Camera className="w-3.5 h-3.5" />
                <span>{t("gallery.eyebrow")}</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight">
                {lang === "ko" ? (
                  <>
                    사진으로 만나는 <span className="text-[#C8A45D]">스리랑카.</span>
                  </>
                ) : (
                  <>
                    Ceylon in <span className="text-[#C8A45D]">Focus.</span>
                  </>
                )}
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-500 font-normal max-w-xl leading-relaxed">
              {t("gallery.subtitle")}
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-200/80">
            {galleryCategories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setActiveLightboxIndex(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-[#081A33] text-[#C8A45D] shadow-md scale-105"
                      : "bg-white text-slate-600 hover:text-[#081A33] hover:bg-slate-100/80 border border-slate-200"
                  }`}
                >
                  {getCategoryLabel(category)}
                </button>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* Gallery Photo Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium text-base">
              {lang === "ko"
                ? "해당 카테고리에 사진이 없습니다."
                : "No photos available in this category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => setActiveLightboxIndex(idx)}
                className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:border-[#C8A45D]/40 transition-all duration-500 cursor-pointer flex flex-col justify-between"
              >
                {/* Photo Image Frame */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={tl(item.title)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081A33]/80 via-transparent to-black/20 opacity-40 group-hover:opacity-80 transition-opacity duration-500" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#C8A45D]" />
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>

                  {/* Hover Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                    <div className="w-12 h-12 rounded-full bg-[#C8A45D] text-[#081A33] flex items-center justify-center shadow-2xl">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Location Tag */}
                  {item.location && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-xs text-white bg-[#081A33]/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A45D]" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>

                {/* Card Caption */}
                <div className="p-6">
                  <h3 className="font-display text-lg font-semibold text-[#081A33] group-hover:text-[#C8A45D] transition-colors leading-snug">
                    {tl(item.title)}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Interactive Fullscreen Lightbox */}
      {activePhoto && activeLightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-[#07111E]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in">
          {/* Lightbox Top Bar */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest text-[#C8A45D] font-bold">
                {String(activeLightboxIndex + 1).padStart(2, "0")} /{" "}
                {String(filteredItems.length).padStart(2, "0")}
              </span>
              <span className="text-white/30 hidden sm:inline">•</span>
              <span className="text-xs text-slate-300 hidden sm:inline font-medium">
                {getCategoryLabel(activePhoto.category)}
              </span>
            </div>

            <button
              onClick={() => setActiveLightboxIndex(null)}
              aria-label="Close Lightbox"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Main Image & Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Left Arrow */}
            <button
              onClick={handlePrev}
              aria-label="Previous Image"
              className="absolute left-2 sm:left-6 z-10 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#C8A45D] text-white hover:text-[#081A33] backdrop-blur-md transition-all shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Photo */}
            <div className="max-w-5xl max-h-[75vh] w-full flex items-center justify-center p-2">
              <img
                key={activePhoto.id || activePhoto.image}
                src={activePhoto.image}
                alt={tl(activePhoto.title)}
                className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300 animate-fade-in"
              />
            </div>

            {/* Right Arrow */}
            <button
              onClick={handleNext}
              aria-label="Next Image"
              className="absolute right-2 sm:right-6 z-10 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#C8A45D] text-white hover:text-[#081A33] backdrop-blur-md transition-all shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Bottom Info */}
          <div className="max-w-4xl mx-auto text-center space-y-2 z-10">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-wide">
              {tl(activePhoto.title)}
            </h2>
            {activePhoto.location && (
              <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-[#C8A45D]" />
                <span>{activePhoto.location}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-[2.5rem] bg-[#0B1A30] text-white p-8 sm:p-14 overflow-hidden border border-[#1B2D4A] shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A45D]/10 text-[#C8A45D] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{lang === "ko" ? "나만의 맞춤 여정" : "Bespoke Itineraries"}</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-light leading-tight">
              {lang === "ko" ? (
                <>
                  사진 속 스리랑카를 <span className="text-[#C8A45D] font-medium">직접 경험해 보세요.</span>
                </>
              ) : (
                <>
                  Turn These Moments Into <span className="text-[#C8A45D] font-medium">Your Reality.</span>
                </>
              )}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
              {lang === "ko"
                ? "10년 경력의 공인 전문 가이드가 사진 속 아름다운 명소들을 담은 완벽한 프라이빗 여행을 기획해 드립니다."
                : "Every photograph represents an experience personally orchestrated by SLTDA licensed guides. Speak with our concierge to craft your itinerary."}
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <LuxuryButton
                variant="gold"
                onClick={() => openInquiry({ interest: "custom" })}
                withArrow
              >
                {t("cta.plan")}
              </LuxuryButton>

              <Link
                href="/tours"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>{t("cta.explore")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
