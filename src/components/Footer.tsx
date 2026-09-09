"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useContentStore } from "@/lib/content-store";
import { img } from "@/data/site";
import {
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowUp,
  Lock,
  Camera,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Grid,
} from "lucide-react";

export function Footer() {
  const { t, tl, lang } = useI18n();
  const { siteSettings, contact, gallery } = useContentStore();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [modalCategory, setModalCategory] = useState("All");

  const modalCategories = [
    "All",
    "Luxury Resorts",
    "Heritage & Culture",
    "Wildlife & Safari",
    "Coastal & Beaches",
    "Highlands & Tea",
    "Scenic Golf",
  ];

  const filteredModalItems = (gallery || []).filter((item) => {
    if (modalCategory === "All") return true;
    return item.category === modalCategory;
  });

  const activePhoto =
    activePhotoIndex !== null && activePhotoIndex < filteredModalItems.length
      ? filteredModalItems[activePhotoIndex]
      : null;

  const handleModalPrev = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) =>
      prev! > 0 ? prev! - 1 : filteredModalItems.length - 1,
    );
  };

  const handleModalNext = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) =>
      prev! < filteredModalItems.length - 1 ? prev! + 1 : 0,
    );
  };

  useEffect(() => {
    if (isFullGalleryOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (activePhotoIndex !== null) {
            setActivePhotoIndex(null);
          } else {
            setIsFullGalleryOpen(false);
          }
        } else if (activePhotoIndex !== null) {
          if (e.key === "ArrowLeft") handleModalPrev();
          if (e.key === "ArrowRight") handleModalNext();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isFullGalleryOpen, activePhotoIndex, filteredModalItems.length]);

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail("");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Featured gallery images strictly from MySQL database
  const featured = (gallery || []).filter((item) => item.featured);
  const displayImages = featured.length >= 6 ? featured.slice(0, 6) : (gallery || []).slice(0, 6);

  return (
    <footer className="bg-navy border-t border-white/10 text-white relative z-10 overflow-hidden">
      {/* Top Subscribe Section */}
      <div className="py-24 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-light mb-4">
          {lang === "ko" ? "여행 구독하기" : "SUBSCRIBE TO TRAVEL"}
        </h2>
        <p className="text-lg md:text-xl font-light text-mist mb-12">
          {lang === "ko" ? "특별한 여행 특가를 이메일로 받아보세요!" : "Travel deals to your inbox!"}
        </p>
        
        <form onSubmit={handleSubscribe} className="relative w-full max-w-md mx-auto mb-6 bg-white rounded-full p-1.5 flex shadow-2xl">
          <input
            type="email"
            required
            placeholder={lang === "ko" ? "이메일 주소" : "Email address"}
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="flex-1 bg-transparent px-5 text-navy placeholder:text-navy/50 focus:outline-none text-base font-medium"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center hover:bg-gold hover:text-navy transition-colors shrink-0"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
        
        {subscribed ? (
          <p className="text-sm text-gold animate-fade-in">
            {lang === "ko" ? "구독해 주셔서 감사합니다." : "Thank you for subscribing."}
          </p>
        ) : (
          <p className="text-sm text-mist/60">
            {lang === "ko" ? "당사의 개인정보 보호정책에 따라 정보를 보호합니다." : "We are committed to protecting your privacy policy."}
          </p>
        )}
      </div>

      {/* Dynamic Gallery Showcase Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-24 max-w-[1920px] mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 px-2 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("gallery.footerLabel")}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setModalCategory("All");
                setActivePhotoIndex(null);
                setIsFullGalleryOpen(true);
              }}
              className="text-xs uppercase tracking-[0.15em] text-white/80 hover:text-gold transition-colors font-semibold flex items-center gap-1.5 group cursor-pointer"
            >
              <span>{t("gallery.viewAll")}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="/gallery"
              className="text-xs uppercase tracking-[0.1em] text-mist/60 hover:text-gold transition-colors flex items-center gap-1"
              title={lang === "ko" ? "갤러리 전용 페이지" : "Dedicated Gallery Page"}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayImages.map((item, i) => (
            <button
              type="button"
              key={item.id || i}
              onClick={() => {
                setModalCategory("All");
                const fullIndex = (gallery || []).findIndex((g) => g.id === item.id);
                setActivePhotoIndex(fullIndex !== -1 ? fullIndex : i);
                setIsFullGalleryOpen(true);
              }}
              className="aspect-square rounded-3xl overflow-hidden relative group cursor-pointer shadow-lg block bg-[#0B1A30] border border-white/5 text-left"
            >
              <img 
                src={item.image} 
                alt={tl(item.title) || item.title?.en} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                onError={(e) => {
                  e.currentTarget.src = "/hero-elephant.jpg";
                }}
              />
              <div className="absolute inset-0 bg-[#081A33]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-3 text-center backdrop-blur-xs">
                <Camera className="w-6 h-6 text-gold mb-1.5 scale-75 group-hover:scale-100 transition-transform duration-500" />
                <span className="text-[11px] font-semibold text-white line-clamp-1">
                  {tl(item.title) || item.title?.en}
                </span>
                {item.location && (
                  <span className="text-[9px] text-mist/80 uppercase tracking-wider mt-0.5">
                    {item.location}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative border-t border-white/10 pt-16 pb-12">
        {/* Scroll to Top Button */}
        <button 
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-gold text-navy rounded-full flex items-center justify-center hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(212,175,55,0.3)] transition-all z-20"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* Giant background text */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-[0.03] select-none">
          <span className="text-[18vw] font-display font-bold leading-none tracking-tight whitespace-nowrap text-white translate-y-12">
            LANKALUXE
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Company Description & Trust Badge */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-12 mb-10 border-b border-white/10 text-left">
            <div className="md:col-span-4 flex items-center gap-4">
              <img src={img.logo} alt="Lanka Luxe Journeys Logo" className="h-16 w-auto object-contain bg-white/95 rounded-2xl p-2 shadow-lg" />
              <div>
                <h3 className="font-display text-xl font-bold text-white tracking-wide">Lanka Luxe Journeys</h3>
                <p className="text-xs text-[#C8A45D] font-medium tracking-wider uppercase mt-0.5">
                  {lang === "ko" ? "스리랑카 큐레이티드 럭셔리 여행" : "Curated Luxury Experiences in Sri Lanka"}
                </p>
                <div className="text-[11px] text-mist/70 mt-1">
                  {lang === "ko" ? "스리랑카 관광청(SLTDA) 공인 가이드 라이선스: " : "SLTDA Registered Guide Licence: "}
                  <strong className="text-white">{siteSettings?.licenseNumber || "C-1734"}</strong>
                </div>
              </div>
            </div>

            <div className="md:col-span-8">
              <p className="text-xs sm:text-sm text-mist/80 font-normal leading-relaxed">
                {lang === "ko"
                  ? siteSettings?.founderBio?.ko || "Lanka Luxe Journeys는 10년 이상의 관광 업계 경력을 가진 공인 전문 가이드 이로샨 자야위크라마(Iroshan Jayawickrame)가 설립한 스리랑카 럭셔리 여행사입니다."
                  : siteSettings?.founderBio?.en || "Lanka Luxe Journeys is a Sri Lanka based luxury travel company founded by Iroshan Jayawickrame, a professional tourist guide with more than 10 years of experience in the tourism industry."}
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-xs text-mist/70 text-center lg:text-left order-3 lg:order-1 flex items-center gap-2" suppressHydrationWarning>
              <span>© {new Date().getFullYear()} {siteSettings?.brandName || "Lanka Luxe Journeys"}. All Rights Reserved. · Founder: {siteSettings?.founderName || "Iroshan Jayawickrame"} (SLTDA {siteSettings?.licenseNumber || "C-1734"})</span>
              <Link href="/admin" className="text-mist/30 hover:text-gold transition-colors inline-flex items-center" title="Admin Atelier">
                <Lock className="w-3 h-3" />
              </Link>
            </div>
            
            <nav className="flex flex-wrap items-center justify-center gap-5 md:gap-8 text-xs sm:text-sm text-white font-medium uppercase tracking-[0.15em] order-1 lg:order-2">
              <Link href="/" className="hover:text-gold transition-colors">{t("nav.home")}</Link>
              <Link href="/about" className="hover:text-gold transition-colors">{t("nav.about")}</Link>
              <Link href="/tours" className="hover:text-gold transition-colors">{t("nav.tours")}</Link>
              <Link href="/golf" className="hover:text-gold transition-colors">{t("nav.golf")}</Link>
              <Link href="/destinations" className="hover:text-gold transition-colors">{t("nav.destinations")}</Link>
              <Link href="/experiences" className="hover:text-gold transition-colors">{t("nav.experiences")}</Link>
              <Link href="/gallery" className="hover:text-gold transition-colors">{t("nav.gallery")}</Link>
              <Link href="/blog" className="hover:text-gold transition-colors">{t("nav.blog")}</Link>
              <Link href="/contact" className="hover:text-gold transition-colors">{t("nav.contact")}</Link>
            </nav>

            <div className="flex items-center justify-center gap-3 order-2 lg:order-3">
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-gold hover:text-navy hover:border-gold transition-all">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Full Interactive Gallery Modal — Shown when clicking View Full Gallery or footer photo thumbnails */}
      {isFullGalleryOpen && (
        <div className="fixed inset-0 z-[100] bg-[#07111E]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in text-white overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] flex items-center justify-center font-bold">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-white">
                  {lang === "ko" ? "스리랑카 시그니처 갤러리" : "Moments in Sri Lanka — Entire Gallery"}
                </h3>
                <p className="text-xs text-mist/80">
                  {filteredModalItems.length} {lang === "ko" ? "장의 엄선된 고화질 사진 컬렉션" : "Curated High-Resolution Photographs"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {activePhotoIndex !== null && (
                <button
                  type="button"
                  onClick={() => setActivePhotoIndex(null)}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 text-white transition-colors cursor-pointer"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{lang === "ko" ? "전체 목록 보기" : "Grid View"}</span>
                </button>
              )}
              <Link
                href="/gallery"
                onClick={() => setIsFullGalleryOpen(false)}
                className="px-3.5 py-1.5 rounded-full bg-[#C8A45D] text-[#081A33] hover:bg-[#b5924d] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <span>{lang === "ko" ? "갤러리 페이지" : "Open Gallery Page"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsFullGalleryOpen(false);
                  setActivePhotoIndex(null);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar shrink-0">
            {modalCategories.map((cat) => {
              const isActive = modalCategory === cat;
              const count =
                cat === "All"
                  ? (gallery || []).length
                  : (gallery || []).filter((g) => g.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setModalCategory(cat);
                    setActivePhotoIndex(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#C8A45D] text-[#081A33] font-bold shadow-md scale-105"
                      : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  <span>{getCategoryLabel(cat)}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? "bg-[#081A33] text-[#C8A45D] font-bold" : "bg-white/10 text-mist"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Focused Photo Lightbox Mode */}
          {activePhoto && activePhotoIndex !== null ? (
            <div className="flex-1 flex flex-col justify-between overflow-hidden my-2">
              <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                <button
                  type="button"
                  onClick={handleModalPrev}
                  className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#C8A45D] text-white hover:text-[#081A33] backdrop-blur-md transition-all shadow-xl cursor-pointer"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="max-w-5xl max-h-[60vh] w-full flex items-center justify-center p-2">
                  <img
                    key={activePhoto.id || activePhoto.image}
                    src={activePhoto.image}
                    alt={tl(activePhoto.title) || activePhoto.title?.en}
                    className="max-h-[58vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300 animate-fade-in"
                    onError={(e) => {
                      e.currentTarget.src = "/hero-elephant.jpg";
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleModalNext}
                  className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#C8A45D] text-white hover:text-[#081A33] backdrop-blur-md transition-all shadow-xl cursor-pointer"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Photo Caption & Filmstrip */}
              <div className="shrink-0 pt-2 text-center space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-xs uppercase tracking-widest text-[#C8A45D] font-bold">
                    {String(activePhotoIndex + 1).padStart(2, "0")} / {String(filteredModalItems.length).padStart(2, "0")}
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-xs text-mist font-medium">
                    {getCategoryLabel(activePhoto.category)}
                  </span>
                </div>
                <h4 className="font-display text-lg sm:text-xl font-bold text-white">
                  {tl(activePhoto.title) || activePhoto.title?.en}
                </h4>
                {activePhoto.location && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-mist">
                    <MapPin className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>{activePhoto.location}</span>
                  </div>
                )}

                {/* Filmstrip of Thumbnails */}
                <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 no-scrollbar max-w-3xl mx-auto">
                  {filteredModalItems.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => setActivePhotoIndex(idx)}
                      className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activePhotoIndex === idx
                          ? "border-[#C8A45D] scale-110 shadow-lg"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={item.image}
                        alt={tl(item.title) || item.title?.en}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/hero-elephant.jpg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Full Grid View inside Modal */
            <div className="flex-1 overflow-y-auto pr-1 my-2 no-scrollbar">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 p-1">
                {filteredModalItems.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-[#0B1A30] border border-white/10 hover:border-[#C8A45D] shadow-md hover:shadow-xl transition-all cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={tl(item.title) || item.title?.en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/hero-elephant.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-[#081A33]/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2.5 backdrop-blur-xs">
                      <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C8A45D] text-[#081A33] font-bold w-fit">
                        {getCategoryLabel(item.category)}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-white line-clamp-1">
                          {tl(item.title) || item.title?.en}
                        </p>
                        {item.location && (
                          <p className="text-[10px] text-mist/80 truncate">
                            {item.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </footer>
  );
}
