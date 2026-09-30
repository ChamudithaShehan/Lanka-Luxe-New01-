"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useI18n, getCategoryLabel } from "@/lib/i18n";
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
  MessageSquare,
} from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

const KakaoIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 3c-5.52 0-10 3.51-10 7.84 0 2.77 1.76 5.2 4.43 6.64-.17.65-.63 2.37-.67 2.53-.05.18.06.18.15.12.11-.08 1.83-1.22 2.6-1.74 1.12.31 2.3.49 3.49.49 5.52 0 10-3.51 10-7.84C22 6.51 17.52 3 12 3z" />
  </svg>
);

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
    contact,
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

  const activeWhyUs = whyUs.length > 0 ? whyUs : [
    {
      no: "01",
      title: { en: "Personalized & Tailor-Made Journeys", ko: "맞춤형 프라이빗 여정" },
      text: {
        en: "Every journey is carefully planned around your interests, pace and travel style.",
        ko: "정해진 패키지가 아닌, 고객의 관심사와 여행 속도, 스타일에 맞춰 처음부터 정성껏 설계합니다.",
      },
    },
    {
      no: "02",
      title: { en: "10+ Years in Sri Lankan Tourism", ko: "10년 이상의 스리랑카 관광 전문성" },
      text: {
        en: "10+ years of professional experience welcoming international travellers to Sri Lanka.",
        ko: "10년 이상의 전문적인 필드 경험으로 스리랑카에서 가장 신뢰할 수 있는 여정을 안내합니다.",
      },
    },
    {
      no: "03",
      title: { en: "Golf Travel in Sri Lanka", ko: "스리랑카 골프 여행" },
      text: {
        en: "Discover Sri Lanka through a unique combination of golf, scenery, culture and hospitality. We arrange private golf journeys for Korean and international travellers.",
        ko: "골프, 천혜의 자연경관, 유구한 문화와 환대의 조화. 한국인 및 글로벌 고객을 위한 골프장 예약 및 맞춤 여정을 조율합니다.",
      },
    },
    {
      no: "04",
      title: { en: "Carefully Selected Experiences & Services", ko: "엄선된 특별한 경험 & 서비스" },
      text: {
        en: "We work with carefully selected hotels, transportation providers and local experiences to create comfortable and memorable journeys.",
        ko: "엄선된 호텔, 신뢰할 수 있는 운송 파트너 및 로컬 체험과 협력하여 편안하고 기억에 남는 여정을 만듭니다.",
      },
    },
    {
      no: "05",
      title: { en: "Registered Sri Lankan Tourism Professional", ko: "스리랑카 관광청 공식 등록 전문가" },
      text: {
        en: "SLTDA Registered Guide – C-1734. Private transportation can be arranged according to your itinerary, group size and comfort requirements.",
        ko: "SLTDA 공인 가이드 – C-1734. 여행 일정, 인원 및 편안함 요구사항에 맞추어 프라이빗 전용 차량을 조율해 드립니다.",
      },
    },
    {
      no: "06",
      title: { en: "English & Korean Support", ko: "영어 & 한국어 소통 지원" },
      text: {
        en: "I communicate personally in English and Korean, helping Korean and international guests enjoy a smoother and more comfortable journey in Sri Lanka.",
        ko: "영어와 한국어로 직접 소통하여 한국인 및 글로벌 고객님들이 스리랑카에서 더욱 원활하고 편안한 여행을 누리실 수 있도록 돕습니다.",
      },
    },
  ];

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
                    {lang === "ko" ? "스리랑카 프라이빗 여행" : "LANKA LUXE JOURNEYS"}
                  </span>
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60">
                    <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                  </div>
                </div>
              </Reveal>

              {/* Main Heading */}
              <Reveal variant="fade-up" delay={0.15}>
                <h1 className="text-4xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-bold text-white leading-[1.05] tracking-tight">
                  {lang === "ko" ? "스리랑카를 발견하다" : "DISCOVER SRI LANKA"} <br />
                  <span className="text-[#C8A45D] font-normal font-sans">
                    {lang === "ko" ? "현지 전문가와 함께" : "WITH A LOCAL EXPERT"}
                  </span>
                </h1>
              </Reveal>

              {/* Body Text */}
              <Reveal variant="fade-up" delay={0.25}>
                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-md">
                  {lang === "ko"
                    ? "나만을 위해 세심하게 설계된 프라이빗 맞춤 여정, 진정한 로컬 경험과 정성껏 기획된 여행."
                    : "Private journeys, authentic experiences and thoughtfully crafted travel, personally designed around you."}
                </p>
              </Reveal>

              {/* Action Buttons & Direct Messaging */}
              <Reveal variant="fade-up" delay={0.35}>
                <div className="pt-4 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3">
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
                      className="px-5 py-2.5 rounded-full border border-white/20 text-xs font-semibold text-white hover:bg-white/10 uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {lang === "ko" ? "맞춤 일정 상담" : "Plan Your Journey"}
                    </button>
                  </div>

                  {/* Direct WhatsApp & KakaoTalk Quick Links */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <a
                      href={`https://pf.kakao.com/${(contact?.kakao || "@lankaluxe").replace("@", "_")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEE500] text-[#381E1F] font-bold text-xs hover:bg-[#ebd400] transition-colors shadow-sm"
                    >
                      <KakaoIcon className="w-3.5 h-3.5" />
                      <span>{lang === "ko" ? "문의하기 · KakaoTalk" : "KakaoTalk · 문의하기"}</span>
                    </a>

                    <a
                      href={`https://wa.me/${contact?.whatsapp || "94771234567"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25D366] text-white font-bold text-xs hover:bg-[#20ba59] transition-colors shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-white" />
                      <span>Contact Us · WhatsApp</span>
                    </a>
                  </div>
                </div>
              </Reveal>

              {/* Personal Travel Support Trust Banner */}
              <Reveal variant="fade-up" delay={0.45}>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-3 max-w-md text-xs text-slate-300">
                  <div className="w-7 h-7 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] flex items-center justify-center font-bold text-xs shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="leading-snug">
                    {lang === "ko" ? (
                      <span>
                        <strong>개인 맞춤 여행 지원</strong> · 전용 차량 · 현지 전문성
                      </span>
                    ) : (
                      <span>
                        Personal Travel Support · Private Transportation · Local Expertise
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
                      fetchPriority="high"
                      decoding="sync"
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
                {lang === "ko" ? "스리랑카를 발견하다" : "Discover Sri Lanka"} <br className="hidden xl:block" />
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
                  <span className="text-sm font-semibold text-[#081A33]">
                    {lang === "ko" ? "스리랑카 전문성" : "Sri Lanka Expertise"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#C8A45D]/10 flex items-center justify-center text-[#C8A45D] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">
                    {lang === "ko" ? "전문가 가이드" : "Expert Guidance"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#C8A45D]/10 flex items-center justify-center text-[#C8A45D] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">
                    {lang === "ko" ? "신뢰할 수 있는 현지 가이드" : "Trusted Local Guidance"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#C8A45D]/10 flex items-center justify-center text-[#C8A45D] shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">
                    {lang === "ko" ? "엄선된 숙소" : "Carefully Selected Stays"}
                  </span>
                </div>
              </div>

              {/* Stats & Button Row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-8 pt-4">
                {/* Official Licensing Credential Badge */}
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#C8A45D]/15 text-[#C8A45D] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#081A33] leading-snug">
                      SLTDA Registered Guide (C-1734)
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                      {lang === "ko" ? "10년+ 스리랑카 관광 전문성" : "10+ Years in Sri Lankan Tourism"}
                    </div>
                  </div>
                </div>
                
                {/* Button */}
                <Link
                  href="/tours"
                  className="inline-flex items-center justify-between gap-4 pl-7 pr-1.5 py-1.5 rounded-full bg-[#0B1F3A] text-white font-bold text-sm hover:bg-[#08172b] transition-all duration-300 shadow-[0_8px_20px_rgba(11,31,58,0.3)] group w-fit"
                >
                  <span>{lang === "ko" ? "자세히 보기" : "Read more"}</span>
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
                      {lang === "ko" ? "창립자 & 공인 가이드" : "Founder & Licensed Guide"}
                    </p>
                    <h4 className="text-lg font-bold font-display text-white">
                      Iroshan Jayawickrame
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      10+ Years in Sri Lankan Tourism · SLTDA Registered Guide C-1734 · Diploma in Archaeology & Culture Tourism
                    </p>
                  </div>
                </motion.div>
              </Reveal>
            </div>

            {/* Right Side: Text & Why Us Points & About CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <Reveal variant="slide-right">
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]">
                  {lang === "ko" ? "란카 럭스를 선택하는 이유" : "WHY CHOOSE LANKA LUXE"}
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-[#081A33] leading-tight">
                  {lang === "ko"
                    ? "스리랑카 최고를 경험하는 차별화된 여정"
                    : "Crafting Extraordinary Sri Lankan Journeys"}
                </h2>
                <p className="text-base text-slate-600 leading-relaxed pt-2">
                  {lang === "ko"
                    ? "Lanka Luxe Journeys는 10년 이상의 스리랑카 관광 업계 경력을 가진 공인 전문 가이드 이로샨 자야위크라마(Iroshan Jayawickrame)가 설립한 스리랑카 현지 프라이빗 여행사입니다. 고고학 & 문화관광 디플로마(Diploma in Archaeology & Culture Tourism)와 해외 여행자들을 안내해 온 전문 경험을 바탕으로, 이로샨은 풍부한 현지 지식, 문화적 이해, 그리고 세심한 1:1 맞춤 서비스를 결합하여 스리랑카 전역에서 의미 있는 여정을 선사합니다. 문화유산과 야생 사파리부터 고산지대 차밭, 해변, 골프 및 웰니스까지, 모든 여정은 고객님의 관심사, 여행 속도와 스타일에 맞춰 정성껏 설계됩니다."
                    : "Lanka Luxe Journeys is a Sri Lanka-based private travel company founded by Iroshan Jayawickrame, a professional tourist guide with more than 10 years of experience in Sri Lankan tourism. With a Diploma in Archaeology & Culture Tourism and professional experience guiding international travellers, Iroshan brings together local knowledge, cultural understanding and personal service to create meaningful journeys across Sri Lanka. From heritage and wildlife to tea country, beaches, golf and wellness, each journey is thoughtfully designed around your interests, pace and travel style."}
                </p>

                {/* 6 Key Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  {activeWhyUs.map((item) => (
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
                {lang === "ko" ? "원하는 여행지를 선택하세요" : "CHOOSE YOUR PLACE"}
              </span>

              <h2 className="text-4xl sm:text-5xl font-display font-medium text-[#081A33] leading-tight">
                {lang === "ko" ? (
                  <>
                    꿈꿔온 <br />
                    <span className="text-[#C8A45D]">여행지를 만나다</span>
                  </>
                ) : (
                  <>
                    Discover dream <br />
                    <span className="text-[#C8A45D]">destinations</span>
                  </>
                )}
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
            {tours.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-base text-slate-500 font-medium">
                  {lang === "ko" ? "등록된 투어 일정이 아직 없습니다." : "No journeys available yet."}
                </p>
              </div>
            ) : (
              tours.slice(0, 4).map((tour, idx) => (
                <Reveal key={tour.slug} variant="slide-right" once={false} delay={idx * 0.08}>
                  <TourCard tour={tour} />
                </Reveal>
              ))
            )}
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
            lang === "ko" ? (
              <>
                엄선된 <span className="text-[#C8A45D]">프라이빗 스리랑카 여정</span>
              </>
            ) : (
              <>
                A Collection of <span className="text-[#C8A45D]">Private Sri Lankan Journeys</span>
              </>
            )
          }
          subtitle={
            lang === "ko"
              ? "문화유산과 야생 사파리부터 골프, 웰니스와 아름다운 해변까지, 세심하게 기획된 프라이빗 일정으로 스리랑카를 탐험하세요."
              : "From cultural heritage and wildlife to golf, wellness and the coast, explore Sri Lanka through thoughtfully designed private itineraries."
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
              {cat === "All" ? t("tours.filterAll") : getCategoryLabel(cat, lang)}
            </button>
          ))}
        </div>

        {/* Tour Grid */}
        {filteredTours.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 max-w-md mx-auto shadow-sm">
            <Compass className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base text-slate-500 font-medium">
              {lang === "ko" ? "등록된 투어 일정이 아직 없습니다." : "No tours available yet."}
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {filteredTours.map((tour) => (
              <Reveal
                key={tour.slug}
                variant="fade-up"
                className="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col"
              >
                <TourCard tour={tour} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}

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
                  {lang === "ko" ? "스리랑카 골프 여행" : "Golf Travel in Sri Lanka"}
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-[#081A33] leading-tight">
                  {lang === "ko" ? (
                    <>
                      골프, 자연과 문화가 어우러진{" "}
                      <span className="text-[#C8A45D]">스리랑카 여정.</span>
                    </>
                  ) : (
                    <>
                      Discover Sri Lanka Through{" "}
                      <span className="text-[#C8A45D]">Golf, Scenery & Culture.</span>
                    </>
                  )}
                </h2>

                <p className="text-base text-slate-600 leading-relaxed">
                  {lang === "ko"
                    ? "골프, 천혜의 자연경관, 유구한 문화와 따뜻한 환대의 조화 속에서 스리랑카를 발견하세요. 한국인 및 글로벌 여행객을 위한 프라이빗 골프 여정을 제공하며, 선호하시는 일정에 맞춘 골프장 예약, 안락한 숙소, 전용 차량 및 관광 일정을 조율해 드립니다."
                    : "Discover Sri Lanka through a unique combination of golf, scenery, culture and hospitality. We arrange private golf journeys for Korean and international travellers, including golf-course reservations, accommodation, transportation and sightseeing according to your preferences."}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C8A45D] shrink-0" />
                  <span>
                    {lang === "ko"
                      ? "골프장 예약, 교통편 및 여행 지원은 고객님의 일정과 선호도에 맞춰 조율해 드립니다. 한국어 및 영어 소통 가능."
                      : "Golf-course reservations, transportation and travel support can be arranged according to your itinerary and preferences. Korean and English communication available."}
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
          {golfCourses.length > 0 && (
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
          )}
        </div>
      </section>

      {/* 6. KOREAN-FRIENDLY SRI LANKA TRAVEL SECTION */}
      <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 lg:p-16 rounded-[2.5rem] bg-[#0B1A30] text-white shadow-2xl relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A45D]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-[90px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A45D]/20 text-[#C8A45D] text-xs font-bold uppercase tracking-wider">
                  <span>🇰🇷</span>
                  <span>{lang === "ko" ? "한국인 맞춤 특화 서비스" : "Korean-Friendly Sri Lanka Travel"}</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-white leading-tight">
                  {lang === "ko" ? (
                    <>
                      한국인 여행객을 위한 <br />
                      <span className="text-[#C8A45D]">스리랑카 맞춤 여행</span>
                    </>
                  ) : (
                    <>
                      Korean-Friendly <br />
                      <span className="text-[#C8A45D]">Sri Lanka Travel</span>
                    </>
                  )}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
                  {lang === "ko"
                    ? "한국어 직접 소통 지원, 안락한 전용 차량, 깊이 있는 문화 체험, 골프 휴양과 한국 여행자의 취향에 최적화된 프라이빗 맞춤 일정을 제공합니다."
                    : "Korean-speaking support, private transportation, cultural experiences, golf holidays and tailor-made journeys designed for Korean travellers."}
                </p>

                {/* 4 Feature Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D] shrink-0" />
                    <span>{lang === "ko" ? "한국어 직접 소통 및 현지 지원" : "Korean-speaking direct support"}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D] shrink-0" />
                    <span>{lang === "ko" ? "일정별 안락한 전용 차량 배정" : "Private comfortable transportation"}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D] shrink-0" />
                    <span>{lang === "ko" ? "고고학 전문 문화 & 유산 해설" : "Archaeology & cultural guidance"}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D] shrink-0" />
                    <span>{lang === "ko" ? "스리랑카 명문 골프 코스 조율" : "Tailored golf holidays & reservations"}</span>
                  </div>
                </div>

                {/* Contact Buttons as requested in item 26 */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href={`https://pf.kakao.com/${(contact?.kakao || "@lankaluxe").replace("@", "_")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#FEE500] text-[#381E1F] font-bold text-xs sm:text-sm hover:bg-[#ebd400] transition-colors shadow-lg cursor-pointer"
                  >
                    <KakaoIcon className="w-4 h-4" />
                    <span>{lang === "ko" ? "문의하기 · KakaoTalk" : "KakaoTalk · 문의하기"}</span>
                  </a>

                  <a
                    href={`https://wa.me/${contact?.whatsapp || "94771234567"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs sm:text-sm hover:bg-[#20ba59] transition-colors shadow-lg cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                    <span>Contact Us · WhatsApp</span>
                  </a>

                  <LuxuryButton
                    variant="outline-light"
                    size="md"
                    onClick={() => openInquiry({ interest: "custom" })}
                  >
                    {lang === "ko" ? "맞춤 일정 상담" : "Plan Bespoke Journey"}
                  </LuxuryButton>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-[4/3]">
                  <img
                    src={img.culture}
                    alt="Cultural & Golf Travel Sri Lanka for Korean Travelers"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* 7. SIGNATURE LUXURY EXPERIENCES */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow={t("exp.eyebrow")}
            title={
              lang === "ko" ? (
                <>
                  스리랑카 전역에서 <span className="text-[#C8A45D]">엄선된 특별한 경험</span>
                </>
              ) : (
                <>
                  Thoughtfully Selected <span className="text-[#C8A45D]">Experiences Across Sri Lanka</span>
                </>
              )
            }
            subtitle={
              lang === "ko"
                ? "스리랑카 전역에서 정성스럽게 엄선한 특별한 로컬 경험을 편안하게 즐기실 수 있도록 준비해 드립니다."
                : "Quiet, unhurried moments thoughtfully selected across the island."
            }
          />

          {experiences.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100 max-w-md mx-auto">
              <p className="text-base text-slate-500 font-medium">
                {lang === "ko" ? "등록된 시그니처 체험이 아직 없습니다." : "No signature experiences available yet."}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {experiences.map((exp, idx) => (
                <Reveal
                  key={idx}
                  variant="fade-up"
                  delay={idx * 0.1}
                  className="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] flex flex-col"
                >
                  <ExperienceCard experience={exp} index={idx} className="h-full" />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 8. WHY TRAVEL WITH US — 6 PILLARS */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow={t("why.eyebrow")}
          title={
            lang === "ko" ? (
              <>
                왜 <span className="text-[#C8A45D]">란카 럭스</span>인가요?
              </>
            ) : (
              <>
                Why Travel With <span className="text-[#C8A45D]">Lanka Luxe?</span>
              </>
            )
          }
          subtitle={
            lang === "ko"
              ? "스리랑카 관광청 공인 가이드의 전문성과 10년 이상의 경험으로 신뢰할 수 있는 여정을 선사합니다."
              : "Personal service and local guidance in Sri Lanka during your journey, communicating personally in English and Korean."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeWhyUs.map((pillar) => (
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

      {/* 9. TESTIMONIALS & GUEST STORIES (Only shown when genuine verified customer reviews are available) */}
      {testimonials.length > 0 && (
        <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto">
            <SectionHeader
              eyebrow={t("reviews.eyebrow")}
              title={
                lang === "ko" ? (
                  <>
                    여행자들의 <span className="text-[#C8A45D]">후기</span>
                  </>
                ) : (
                  <>
                    Guest <span className="text-[#C8A45D]">Stories</span>
                  </>
                )
              }
              subtitle={
                lang === "ko"
                  ? "Lanka Luxe Journeys와 함께한 여행자분들의 이야기입니다."
                  : "Words from travellers who explored Sri Lanka with Lanka Luxe Journeys."
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
      )}

      {/* 10. THE JOURNAL / LATEST STORIES */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          eyebrow={lang === "ko" ? "스리랑카 여행 저널" : "Sri Lanka Travel Journal"}
          title={
            lang === "ko" ? (
              <>
                스리랑카 <span className="text-[#C8A45D]">여행 저널</span>
              </>
            ) : (
              <>
                Sri Lanka <span className="text-[#C8A45D]">Travel Journal</span>
              </>
            )
          }
          subtitle={
            lang === "ko"
              ? "스리랑카를 발견하는 데 도움이 되는 여행 가이드, 문화적 통찰과 실용적인 정보입니다."
              : "Travel guides, cultural insights and practical information to help you discover Sri Lanka."
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

        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 max-w-md mx-auto shadow-sm">
            <p className="text-base text-slate-500 font-medium">
              {lang === "ko" ? "등록된 저널 칼럼이 아직 없습니다." : "No journal articles published yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <Reveal key={post.slug} variant="fade-up">
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* 11. BESPOKE INQUIRY & TRIP BUILDER FORM */}
      <section id="inquiry" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            eyebrow={t("contact.eyebrow")}
            title={
              lang === "ko" ? (
                <>
                  스리랑카 맞춤 여행을 <span className="text-[#C8A45D]">함께 계획해 보세요</span>
                </>
              ) : (
                <>
                  Let’s Plan Your <span className="text-[#C8A45D]">Sri Lankan Journey</span>
                </>
              )
            }
            subtitle={
              lang === "ko"
                ? "여행 일정, 관심사, 선호하시는 여행 스타일을 알려주시면 직접 검토한 후 고객님만을 위한 맞춤 제안을 준비해 드리겠습니다. 문의 내용은 신속하고 정성껏 답변 드리겠습니다."
                : "Tell me about your travel dates, interests and preferred style of travel. I will personally review your request and prepare a tailored recommendation for your journey. Your enquiry will be personally reviewed and we will respond as soon as possible."
            }
          />

          {/* Direct WhatsApp & KakaoTalk Consultation Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a
              href={`https://pf.kakao.com/${(contact?.kakao || "@lankaluxe").replace("@", "_")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#FEE500] text-[#381E1F] font-bold text-xs sm:text-sm hover:bg-[#ebd400] transition-colors shadow-sm cursor-pointer"
            >
              <KakaoIcon className="w-4 h-4" />
              <span>{lang === "ko" ? "문의하기 · KakaoTalk" : "KakaoTalk · 문의하기"}</span>
            </a>

            <a
              href={`https://wa.me/${contact?.whatsapp || "94771234567"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#25D366] text-white font-bold text-xs sm:text-sm hover:bg-[#20ba59] transition-colors shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Contact Us · WhatsApp</span>
            </a>
          </div>

          <Reveal variant="scale">
            <InquiryForm variant="light" />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
