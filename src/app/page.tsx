"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { useContentStore } from "@/lib/content-store";
import {
  img,
  tourFilters,
} from "@/data/site";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { TourCard } from "@/components/TourCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { BlogCard } from "@/components/BlogCard";
import { InquiryForm } from "@/components/InquiryForm";
import { Counter } from "@/components/Counter";
import {
  Sparkles,
  ArrowRight,
  MapPin,
  Flag,
  CheckCircle2,
  Calendar,
  Star,
  Clock,
  ShieldCheck,
  Award,
  Compass,
  Plane,
  Globe2,
  Users,
  Building2,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

export default function HomePage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const {
    tours,
    experiences,
    posts,
    golfCourses,
    whyUs,
    testimonials,
    siteSettings,
  } = useContentStore();
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Scroll Parallax Hooks for Home Page Photos
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const yHeroCol1 = useTransform(heroProgress, [0, 1], [0, -50]);
  const yHeroCol2 = useTransform(heroProgress, [0, 1], [0, -100]);
  const yHeroCol3 = useTransform(heroProgress, [0, 1], [0, -70]);

  const discoverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: discoverProgress } = useScroll({
    target: discoverRef,
    offset: ["start end", "end start"],
  });
  const yDiscoverTrain = useTransform(discoverProgress, [0, 1], [30, -50]);
  const yDiscoverResort = useTransform(discoverProgress, [0, 1], [60, -75]);

  const whyUsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: whyUsProgress } = useScroll({
    target: whyUsRef,
    offset: ["start end", "end start"],
  });
  const yWhyUsPhoto = useTransform(whyUsProgress, [0, 1], [40, -60]);

  const filteredTours =
    selectedCategory === "All"
      ? tours.slice(0, 6)
      : tours.filter(
        (t) =>
          t.category === selectedCategory ||
          t.categories?.includes(selectedCategory),
      );

  const featuredTour = tours[0];

  return (
    <div className="relative min-h-screen bg-[#F9FAFB] text-slate-800 selection:bg-[#C8A45D] selection:text-white">
      {/* 1. HERO SECTION (MATCHING REFERENCE DESIGN WITH ARCH/CAPSULE PHOTO MOSAIC & FLIGHT PATHS) */}
      <section ref={heroRef} className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0B1A30] text-white overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#C8A45D]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#C8A45D]/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Faint World Map Vector Silhouette Background */}
        {/* Faint World Map Vector Silhouette Background */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url('/world-map.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'invert(1)'
          }}
        />

        {/* Flight Path 1: Dashed Arc with Airplane (Left Bottom to Center) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox="0 0 1400 800"
          fill="none"
        >
          <path
            d="M 280 680 C 420 620, 520 540, 600 460"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            strokeOpacity="0.45"
          />
          <path
            d="M 1150 560 C 1280 440, 1340 320, 1380 340 C 1420 360, 1350 480, 1260 520"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            strokeOpacity="0.4"
          />
        </svg>

        {/* Flying Airplane 1 (Left / Center) */}
        <motion.div
          animate={{ x: [0, 12, 0], y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[38%] bottom-[34%] z-10 pointer-events-none hidden md:block text-white"
        >
          <Plane className="w-8 h-8 rotate-[42deg] fill-white drop-shadow-md text-white" />
        </motion.div>

        {/* Flying Airplane 2 (Far Right) */}
        <motion.div
          animate={{ x: [0, -10, 0], y: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-[8%] bottom-[38%] z-10 pointer-events-none hidden lg:block text-white"
        >
          <Plane className="w-8 h-8 rotate-[-65deg] fill-white drop-shadow-md text-white" />
        </motion.div>

        {/* Twinkling Star Sparkles */}
        <div className="absolute top-[18%] left-[10%] text-white/60 text-xs animate-pulse pointer-events-none">
          ✦
        </div>
        <div className="absolute top-[35%] right-[48%] text-[#38BDF8]/60 text-xs animate-pulse pointer-events-none">
          ✦
        </div>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto w-full z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column (5.5 Cols) */}
            <div className="lg:col-span-5 space-y-6 text-left relative z-20">
              {/* Eyebrow with Compass Icon */}
              <Reveal variant="fade-up" delay={0.05}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#C8A45D]">
                    {lang === "ko" ? "스리랑카 럭셔리 여행 아틀리에" : "LANKA LUXE ATELIER"}
                  </span>
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60">
                    <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                  </div>
                </div>
              </Reveal>

              {/* Main Heading */}
              <Reveal variant="fade-up" delay={0.15}>
                <h1 className="text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-bold text-white leading-[1.05] tracking-tight">
                  DISCOVER SRI LANKA <br />
                  <span className="text-[#C8A45D] font-normal italic font-sans lowercase">
                    {lang === "ko" ? "현지 전문가와 함께." : "with a local expert."}
                  </span>
                </h1>
              </Reveal>

              {/* Body Text */}
              <Reveal variant="fade-up" delay={0.25}>
                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-md">
                  {lang === "ko"
                    ? "나만을 위해 섬세하게 설계된 프라이빗 럭셔리 여정, 진정한 스리랑카를 현지 전문가와 함께 경험하세요."
                    : "Private journeys, authentic experiences and luxury travel, personally crafted around you."}
                </p>
              </Reveal>

              {/* Action Button Matching Reference */}
              <Reveal variant="fade-up" delay={0.35}>
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    href="/tours"
                    className="inline-flex items-center justify-between sm:justify-start gap-4 pl-6 pr-2 py-2 rounded-full bg-white text-[#081A33] font-semibold text-sm hover:bg-slate-100 hover:shadow-xl transition-all duration-300 shadow-md group cursor-pointer w-fit"
                  >
                    <span>{lang === "ko" ? "투어 둘러보기" : "View tours"}</span>
                    <span className="w-10 h-10 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => openInquiry()}
                    className="text-xs font-semibold text-slate-300 hover:text-white uppercase tracking-wider underline cursor-pointer hidden sm:block"
                  >
                    {lang === "ko" ? "맞춤 일정 상담" : "Plan Bespoke Trip"}
                  </button>
                </div>
              </Reveal>

              {/* Korean Traveler Trust Banner */}
              <Reveal variant="fade-up" delay={0.45}>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hidden sm:flex items-center gap-3 max-w-md text-xs text-slate-300">
                  <div className="w-7 h-7 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] flex items-center justify-center font-bold text-xs shrink-0">
                    VIP
                  </div>
                  <div>
                    {lang === "ko" ? (
                      <span>
                        <strong>한국어 1:1 컨시어지</strong> · 전담 의전 기사 & 24시간 실시간 지원
                      </span>
                    ) : (
                      <span>
                        <strong>Dedicated Concierge</strong> · Private luxury chauffeur & 24/7 on-trip care
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Multi-Column Arch & Capsule Image Mosaic (6.5 Cols) */}
            <div className="lg:col-span-7 relative hidden md:block">
              <div className="grid grid-cols-3 gap-3 sm:gap-4.5 max-h-[580px] lg:max-h-[640px] items-center">
                {/* Column 1 (Left) */}
                <motion.div style={{ y: yHeroCol1 }} className="space-y-3 sm:space-y-4">
                  {/* Top Capsule Photo */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative aspect-[3/4] rounded-[2.25rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group"
                  >
                    <img
                      src={img.sigiriya}
                      alt="Sigiriya Sunrise Explorer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </motion.div>

                  {/* Bottom Capsule Photo */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative aspect-[3/4] rounded-[2.25rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group"
                  >
                    <img
                      src={img.beach}
                      alt="Southern Beach Paradise"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </motion.div>
                </motion.div>

                {/* Column 2 (Center - Offset / Arch Top Shapes) */}
                <motion.div style={{ y: yHeroCol2 }} className="space-y-3 sm:space-y-4 -translate-y-4 sm:-translate-y-6">
                  {/* Top Circle / Arch Photo */}
                  <motion.div
                    initial={{ opacity: 0, y: -25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative aspect-square rounded-full overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group"
                  >
                    <img
                      src={img.aerial}
                      alt="Ceylon Coastal Aerial"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>

                  {/* Center Oval / Arch Photo (Key Hero Focus) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.95, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative aspect-[3/4] rounded-[2.5rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl border-2 border-white/20 bg-slate-900 group"
                  >
                    <img
                      src={img.train}
                      alt="Highland Scenic Train & Happy Travelers"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </motion.div>

                  {/* Bottom Arch Photo */}
                  <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative aspect-[3/4] rounded-t-[2.5rem] rounded-b-[2rem] sm:rounded-t-[3.5rem] sm:rounded-b-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group"
                  >
                    <img
                      src={img.resort}
                      alt="Lagoon Sanctuary Villa"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                </motion.div>

                {/* Column 3 (Right) */}
                <motion.div style={{ y: yHeroCol3 }} className="space-y-3 sm:space-y-4">
                  {/* Top Safari/Jeep Photo */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative aspect-[3/4] rounded-[2.25rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group"
                  >
                    <img
                      src={img.wildlife}
                      alt="Yala & Udawalawe Elephant & Wildlife Safari"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </motion.div>

                  {/* Middle Pier/Couple Photo */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative aspect-[3/4] rounded-[2.25rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group"
                  >
                    <img
                      src={img.honeymoon}
                      alt="Private Jetty Ocean Escape"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </motion.div>

                  {/* Bottom Mountain/Golf Photo */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    style={{ willChange: "transform, opacity" }}
                    className="relative aspect-[3/4] rounded-t-[2.25rem] rounded-b-[2rem] sm:rounded-t-[3rem] sm:rounded-b-[2.5rem] overflow-hidden shadow-2xl border border-white/10 bg-slate-900 group"
                  >
                    <img
                      src={img.golf}
                      alt="Victoria Golf Mountain Greens"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DISCOVER THE WORLD (REFERENCE IMAGE SECTION) */}
      <section ref={discoverRef} className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left Images Composite with Scroll-Up Parallax */}
          <div className="lg:col-span-6 relative">
            <Reveal variant="slide-right" once={false}>
              <div className="flex gap-4 sm:gap-6 items-center justify-center lg:justify-start">
                <motion.div
                  style={{ y: yDiscoverTrain }}
                  className="w-1/2 max-w-[280px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] group"
                >
                  <img src={img.train} alt="Traveler cheering" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </motion.div>
                <motion.div
                  style={{ y: yDiscoverResort }}
                  className="w-1/2 max-w-[280px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] group"
                >
                  <img src={img.resort} alt="Luggage setup" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </motion.div>
              </div>
            </Reveal>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6 text-left relative pt-10 lg:pt-0">
            <Reveal variant="slide-left" once={false}>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#C8A45D]">
                {lang === "ko" ? "스리랑카 럭셔리 여행" : "LANKA LUXE TRAVEL"}
              </span>
              
              <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-display font-medium text-[#081A33] leading-[1.05] mt-4 mb-6">
                Discover Sri Lanka <br className="hidden xl:block" />
                <span className="text-[#C8A45D]">{lang === "ko" ? "현지 전문가와 함께" : "with a local expert"}</span>
              </h2>
              
              <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed mb-8 max-w-lg">
                {lang === "ko" 
                  ? "10년 이상의 전문 경험으로 스리랑카에서 잊지 못할 특별한 여정을 만듭니다. 나만을 위해 정성껏 설계된 프라이빗 럭셔리 여행을 경험하세요." 
                  : "10+ years of experience creating memorable journeys in Sri Lanka. Private journeys, authentic experiences and luxury travel, personally crafted around you."}
              </p>

              {/* 4 Icons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#C8A45D]/10 flex items-center justify-center text-[#C8A45D] shrink-0">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">Global Destinations</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#C8A45D]/10 flex items-center justify-center text-[#C8A45D] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">Expert Guidance</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#C8A45D]/10 flex items-center justify-center text-[#C8A45D] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">Safe Travels</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#C8A45D]/10 flex items-center justify-center text-[#C8A45D] shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">Luxury Lodging</span>
                </div>
              </div>

              {/* Stats & Button Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-10 pt-4">
                {/* Avatars & Stat */}
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 shrink-0">
                    <img className="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-sm relative z-30" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64" alt="" />
                    <img className="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-sm relative z-20" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64" alt="" />
                    <img className="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-sm relative z-10" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64" alt="" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#081A33] leading-none flex items-baseline gap-1">
                      <Counter value={9500} />+
                    </div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-1.5">Positive Reviews</div>
                  </div>
                </div>
                
                {/* Button */}
                <Link
                  href="/tours"
                  className="inline-flex items-center justify-between gap-4 pl-7 pr-1.5 py-1.5 rounded-full bg-[#0B1F3A] text-white font-bold text-sm hover:bg-[#08172b] transition-all duration-300 shadow-[0_8px_20px_rgba(11,31,58,0.3)] group w-fit"
                >
                  <span>Read more</span>
                  <span className="w-9 h-9 rounded-full bg-white text-[#C8A45D] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </Reveal>

            {/* Background Watermark */}
            <div className="absolute -bottom-16 right-0 lg:-right-40 pointer-events-none opacity-[0.03] select-none z-[-1]">
              <span className="text-[18vw] lg:text-[14vw] font-display font-black leading-none tracking-tighter whitespace-nowrap text-[#081A33]">
                LANKALUXE
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section ref={whyUsRef} className="py-20 lg:py-28 bg-slate-50 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Side: Photo with Scroll-Up Parallax */}
            <div className="lg:col-span-5">
              <Reveal variant="slide-left">
                <motion.div
                  style={{ y: yWhyUsPhoto }}
                  className="relative rounded-[2.5rem] overflow-hidden border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] group"
                >
                  <img
                    src={img.iroshan}
                    alt="Iroshan Jayawickrame - Explorer & Storyteller"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#081A33]/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                    <p className="text-xs font-semibold text-[#C8A45D] uppercase tracking-widest mb-1">
                      {lang === "ko" ? "창립자 & SLTDA 공인 가이드" : "Founder & Licensed Guide"}
                    </p>
                    <h4 className="text-lg font-bold font-display text-white">
                      Iroshan Jayawickrame
                    </h4>
                    <p className="text-xs text-slate-300">
                      10+ Years Experience · SLTDA Licence: C-1734 · Archaeology (Univ. of Kelaniya)
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            </div>

            {/* Right Side: Text & Why Us Points & About CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <Reveal variant="slide-right">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]">
                  WHY CHOOSE LANKA LUXE
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-[#081A33] leading-tight">
                  {lang === "ko"
                    ? "스리랑카 최고를 경험하는 차별화된 여정"
                    : "Crafting Extraordinary Sri Lankan Journeys"}
                </h2>
                <p className="text-base text-slate-600 leading-relaxed pt-2">
                  {lang === "ko"
                    ? "Lanka Luxe Journeys는 10년 이상의 관광 업계 경력을 가진 공인 전문 가이드 이로샨 자야위크라마(Iroshan Jayawickrame)가 설립한 스리랑카 럭셔리 여행사입니다. 편안함과 진정한 경험, 세심한 1:1 서비스를 소중히 여기는 여행자를 위한 프라이빗 맞춤 여행을 전문으로 합니다."
                    : "Lanka Luxe Journeys is a Sri Lanka based luxury travel company founded by Iroshan Jayawickrame, a professional tourist guide with more than 10 years of experience in the tourism industry. We specialize in private, tailor-made journeys for travelers who value comfort, authentic experiences and personal service."}
                </p>

                {/* 6 Key Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {whyUs.map((item) => (
                    <div
                      key={item.no}
                      className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-start gap-3"
                    >
                      <span className="text-sm font-bold text-[#C8A45D] shrink-0 font-display">
                        {item.no}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-[#081A33] mb-1">
                          {lang === "ko" ? item.title.ko : item.title.en}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {lang === "ko" ? item.text.ko : item.text.en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Go to About Us Button / Section */}
                <div className="pt-6 flex items-center gap-4">
                  <LuxuryButton variant="pill" size="lg" href="/about" withArrow>
                    {lang === "ko" ? "회사 소개 보기" : "Discover Our Story (About Us)"}
                  </LuxuryButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS (STICKY SCROLL LAYOUT WITH SIDE ANIMATIONS) */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-clip">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative">
          {/* Left Title Area (Sticky, Slide from Left) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <Reveal variant="slide-left" once={false} className="space-y-5 text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]">
                CHOOSE YOUR PLACE
              </span>

              <h2 className="text-4xl sm:text-5xl font-display font-medium text-[#081A33] leading-tight">
                Discover dream <br />
                <span className="text-[#C8A45D]">destinations</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "숨겨진 명소부터 상징적인 랜드마크까지, 전문가의 세심한 안내와 함께 잊지 못할 경험으로 나만의 여행을 완성하세요."
                  : "Turn your dream destinations into unforgettable experiences with private guidance. From hidden gems to iconic landmarks, we craft personalized journeys for you."}
              </p>

              <div className="pt-2">
                <LuxuryButton variant="pill" href="/tours" withArrow>
                  {lang === "ko" ? "여행 둘러보기" : "Read more"}
                </LuxuryButton>
              </div>
            </Reveal>
          </div>

          {/* Right Cards Area (Scrolling, Slide from Right) */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {tours.slice(0, 4).map((tour, idx) => (
              <Reveal key={tour.slug} variant="slide-right" once={false} delay={idx * 0.08}>
                <TourCard tour={tour} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ATELIER STORY / THE HOUSE OF LANKA LUXE */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Story */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <Reveal variant="slide-left" once={false}>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]">
                  {t("intro.eyebrow")}
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-[#081A33] leading-tight">
                  {t("intro.title")}
                </h2>

                <p className="text-base text-slate-600 leading-relaxed">
                  {t("intro.text")}
                </p>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {t("intro.text2")}
                </p>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
                  <LuxuryButton variant="pill" href="/about" withArrow>
                    {lang === "ko" ? "아틀리에 소개" : "Read more"}
                  </LuxuryButton>
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-[#C8A45D]" />
                    <span>Galle Face Terrace, Colombo 03</span>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Images Composite */}
            <div className="lg:col-span-6 relative">
              <Reveal variant="slide-right" once={false}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[4/5] rounded-[1.75rem] overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
                    <img
                      src={img.wildlife}
                      alt="Sri Lankan Wildlife Safari"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-[4/5] rounded-[1.75rem] overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] pt-6">
                    <img
                      src={img.galle}
                      alt="Galle Fort Ramparts"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CURATED SIGNATURE JOURNEYS */}
      <section id="journeys" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow={t("journeys.eyebrow")}
          title={
            <>
              Curated <span className="text-[#C8A45D]">Journeys</span>
            </>
          }
          subtitle={
            lang === "ko"
              ? "엄선된 8가지 럭셔리 여정 — 전 일정 프라이빗 차량, 5성급 숙소, 24시간 한국어 컨시어지가 함께합니다."
              : "Eight private luxury itineraries crafted around heritage villas, tea planter estates, wildlife reserves and championship fairways."
          }
        />

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {tourFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${selectedCategory === cat
                  ? "bg-[#0B1F3A] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              {cat === "All" ? t("tours.filterAll") : cat}
            </button>
          ))}
        </div>

        {/* Tour Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTours.map((tour) => (
            <Reveal key={tour.slug} variant="fade-up">
              <TourCard tour={tour} />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 text-center">
          <LuxuryButton variant="pill" href="/tours" size="lg" withArrow>
            {t("cta.viewAll")}
          </LuxuryButton>
        </div>
      </section>

      {/* 5. GOLF HOLIDAYS SPECIALISTS FEATURE */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-7 space-y-6 text-left">
              <Reveal variant="slide-left" once={false}>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]">
                  {t("golf.eyebrow")}
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-[#081A33] leading-tight">
                  Play the World's Most Scenic{" "}
                  <span className="text-[#C8A45D]">Golf Journey.</span>
                </h2>

                <p className="text-base text-slate-600 leading-relaxed">
                  {t("golf.text")}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C8A45D] shrink-0" />
                  <span>
                    {lang === "ko"
                      ? "한국 골프 여행객을 위한 테일러메이드/캘러웨이 최신 클럽 렌탈, 티타임 사전 확정, 전용 밴 차량 제공"
                      : "Confirmed tee times, premium rental sets, dedicated caddies, and Korean/English concierge on the ground."}
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <LuxuryButton variant="pill" href="/golf" withArrow>
                    {t("cta.golf")}
                  </LuxuryButton>
                  <LuxuryButton
                    variant="outline"
                    onClick={() =>
                      openInquiry({
                        tourName: "Ultimate Sri Lanka Golf Escape",
                        interest: "golf",
                      })
                    }
                  >
                    {t("cta.requestGolf")}
                  </LuxuryButton>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal variant="slide-right" once={false}>
                <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] aspect-[4/3]">
                  <img
                    src={img.golf}
                    alt="Victoria Golf Resort Sri Lanka"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </Reveal>
            </div>
          </div>

          {/* Quick 3-course preview snippet */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {golfCourses.slice(0, 3).map((gc) => (
              <div
                key={gc.name}
                className="p-7 rounded-[1.75rem] bg-slate-50 border border-slate-100 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-[#C8A45D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Flag className="w-3.5 h-3.5" />
                    <span>{gc.holes}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#081A33] mb-2 leading-snug">
                    {gc.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6 font-normal">
                    {tl(gc.text)}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600 font-medium">
                  <span>{gc.location}</span>
                  <Link
                    href="/golf"
                    className="text-[#C8A45D] hover:underline font-semibold"
                  >
                    {lang === "ko" ? "골프 안내 →" : "Read more →"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 7. SIGNATURE LUXURY EXPERIENCES */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow={t("exp.eyebrow")}
            title={
              <>
                Signature <span className="text-[#C8A45D]">Experiences</span>
              </>
            }
            subtitle={
              lang === "ko"
                ? "일반 관광객이 닿지 못하는 프라이빗한 순간들을 준비해 드립니다."
                : "Quiet, unhurried moments arranged with private access across the island."
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {experiences.map((exp, idx) => (
              <Reveal key={idx} variant="fade-up" delay={idx * 0.1}>
                <ExperienceCard experience={exp} index={idx} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. WHY TRAVEL WITH US — 6 PILLARS */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow={t("why.eyebrow")}
          title={
            <>
              Why Travel With <span className="text-[#C8A45D]">Lanka Luxe?</span>
            </>
          }
          subtitle={
            lang === "ko"
              ? "여행 중 스리랑카 현지에서 세심한 지원을 제공하며, 영어와 한국어로 원활하고 편안하게 소통합니다."
              : "Personal service and local support in Sri Lanka during your journey. I personally communicate in English and Korean to ensure a smooth and comfortable experience."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyUs.map((pillar) => (
            <Reveal key={pillar.no} variant="fade-up">
              <div className="p-8 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                <div>
                  <span className="font-display text-4xl font-bold text-[#C8A45D]/30 block mb-4">
                    {pillar.no}
                  </span>
                  <h3 className="text-xl font-bold text-[#081A33] mb-3">
                    {tl(pillar.title)}
                  </h3>
                  <p className="text-sm text-slate-500 font-normal leading-relaxed">
                    {tl(pillar.text)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 9. TESTIMONIALS & GUEST STORIES */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow={t("reviews.eyebrow")}
            title={
              <>
                Guest <span className="text-[#C8A45D]">Stories</span>
              </>
            }
            subtitle={
              lang === "ko"
                ? "세계 각국에서 저희와 함께 특별한 스리랑카 여행을 마친 고객들의 실제 이야기입니다."
                : "Honest words from golfers, honeymooners, and luxury travellers across the globe."
            }
          />

          <div className="flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 gap-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:snap-none md:pb-0 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {testimonials.map((test, idx) => (
              <Reveal key={idx} variant="fade-up" delay={idx * 0.1} className="w-[85vw] sm:w-[60vw] md:w-auto shrink-0 snap-center">
                <TestimonialCard testimonial={test} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. THE JOURNAL / LATEST STORIES */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Editorial"
          title={
            <>
              The <span className="text-[#C8A45D]">Journal</span>
            </>
          }
          subtitle={
            lang === "ko"
              ? "스리랑카 골프 팁, 숙소 가이드, 문화 이야기 등 현지 전문가가 전하는 칼럼입니다."
              : "Letters, insider insights and travel guides quietly written by our Colombo team."
          }
          action={
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#08172b] transition-colors shadow-sm"
            >
              <span>{lang === "ko" ? "저널 전체보기" : "View All"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <Reveal key={post.slug} variant="fade-up">
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 11. BESPOKE INQUIRY & TRIP BUILDER FORM */}
      <section id="inquiry" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow={t("contact.eyebrow")}
            title={
              <>
                Let's Plan Your <span className="text-[#C8A45D]">Journey</span>
              </>
            }
            subtitle={t("contact.reassure")}
          />

          <Reveal variant="scale">
            <InquiryForm variant="light" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
