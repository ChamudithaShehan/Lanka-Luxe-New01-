import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import {
  img,
  tours,
  tourFilters,
  whyUs,
  experiences,
  testimonials,
  posts,
  golfCourses,
  contact,
} from "@/data/site";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { TourCard } from "@/components/TourCard";
import { ExperienceCard } from "@/components/ExperienceCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { BlogCard } from "@/components/BlogCard";
import { InteractiveSriLankaMap } from "@/components/InteractiveSriLankaMap";
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
import { motion } from "motion/react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const [selectedCategory, setSelectedCategory] = useState("All");

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
    <div className="relative min-h-screen bg-[#F9FAFB] text-slate-800 selection:bg-[#22A2BD] selection:text-white">
      {/* 1. HERO SECTION (MATCHING REFERENCE DESIGN WITH ARCH/CAPSULE PHOTO MOSAIC & FLIGHT PATHS) */}
      <section className="relative min-h-[95vh] lg:min-h-screen flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0B1A30] text-white overflow-hidden">
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#22A2BD]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-[#1E7B9E]/10 rounded-full blur-[160px] pointer-events-none" />

        {/* Faint World Map Vector Silhouette Background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center overflow-hidden">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full object-cover scale-110"
            fill="currentColor"
          >
            {/* Stylized World Continents Background */}
            <path
              d="M150,120 Q180,100 220,130 Q250,150 240,200 Q200,240 170,220 Q140,180 150,120 Z 
                 M200,260 Q240,280 230,360 Q210,420 180,390 Q170,320 200,260 Z
                 M480,100 Q540,90 580,140 Q550,180 500,160 Q460,130 480,100 Z
                 M490,200 Q550,210 560,300 Q530,380 480,350 Q450,270 490,200 Z
                 M620,110 Q750,80 820,140 Q800,240 700,220 Q630,170 620,110 Z
                 M750,280 Q840,290 820,380 Q760,400 730,340 Q720,300 750,280 Z"
              className="text-[#38BDF8]"
            />
          </svg>
        </div>

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
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#22A2BD]">
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
                  DISCOVER THE <br />
                  WORLD{" "}
                  <span className="text-[#22A2BD] font-normal italic font-sans lowercase">
                    {lang === "ko" ? "프라이빗 가이드와 함께." : "with our guide."}
                  </span>
                </h1>
              </Reveal>

              {/* Body Text */}
              <Reveal variant="fade-up" delay={0.25}>
                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-md">
                  {lang === "ko"
                    ? "숨겨진 명소부터 유네스코 유적, 챔피언십 골프장까지 전문 가이드와 함께 나만의 특별한 스리랑카 여정을 완성하세요."
                    : "Turn your dream destinations into reality with our expert guidance. From hidden gems to iconic landmarks, we create personalized journeys just for you."}
                </p>
              </Reveal>

              {/* Action Button Matching Reference */}
              <Reveal variant="fade-up" delay={0.35}>
                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link
                    to="/tours"
                    className="inline-flex items-center justify-between sm:justify-start gap-4 pl-6 pr-2 py-2 rounded-full bg-white text-[#081A33] font-semibold text-sm hover:bg-slate-100 hover:shadow-xl transition-all duration-300 shadow-md group cursor-pointer w-fit"
                  >
                    <span>{lang === "ko" ? "투어 둘러보기" : "View tours"}</span>
                    <span className="w-10 h-10 rounded-full bg-[#22A2BD] text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
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
                  <div className="w-7 h-7 rounded-full bg-[#22A2BD]/20 text-[#22A2BD] flex items-center justify-center font-bold text-xs shrink-0">
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
                <div className="space-y-3 sm:space-y-4">
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
                </div>

                {/* Column 2 (Center - Offset / Arch Top Shapes) */}
                <div className="space-y-3 sm:space-y-4 -translate-y-4 sm:-translate-y-6">
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
                </div>

                {/* Column 3 (Right) */}
                <div className="space-y-3 sm:space-y-4">
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
                      alt="Yala Leopard Safari Jeep"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DISCOVER THE WORLD (REFERENCE IMAGE SECTION) */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left Images Composite */}
          <div className="lg:col-span-6 relative">
            <Reveal variant="slide-right" once={false}>
              <div className="flex gap-4 sm:gap-6 items-center justify-center lg:justify-start">
                <div className="w-1/2 max-w-[280px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] -translate-y-6">
                  <img src={img.train} alt="Traveler cheering" className="w-full h-full object-cover" />
                </div>
                <div className="w-1/2 max-w-[280px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] translate-y-6">
                  <img src={img.resort} alt="Luggage setup" className="w-full h-full object-cover" />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6 text-left relative pt-10 lg:pt-0">
            <Reveal variant="slide-left" once={false}>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#22A2BD]">
                {lang === "ko" ? "스리랑카 럭셔리 여행" : "LANKA LUXE TRAVEL"}
              </span>
              
              <h2 className="text-4xl sm:text-5xl lg:text-[4rem] font-display font-medium text-[#081A33] leading-[1.05] mt-4 mb-6">
                Discover the world <br className="hidden xl:block" />
                <span className="text-[#22A2BD]">with our guide</span>
              </h2>
              
              <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed mb-8 max-w-lg">
                {lang === "ko" 
                  ? "편안하고 잊지 못할 경험으로 가득한 여행. 저희와 함께 다음 모험을 준비하세요!" 
                  : "Discover the world with comfort and unforgettable experiences. Let us guide your next adventure!"}
              </p>

              {/* 4 Icons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#22A2BD]/10 flex items-center justify-center text-[#22A2BD] shrink-0">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">Global Destinations</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#22A2BD]/10 flex items-center justify-center text-[#22A2BD] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">Expert Guidance</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#22A2BD]/10 flex items-center justify-center text-[#22A2BD] shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-[#081A33]">Safe Travels</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#22A2BD]/10 flex items-center justify-center text-[#22A2BD] shrink-0">
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
                  to="/tours"
                  className="inline-flex items-center justify-between gap-4 pl-7 pr-1.5 py-1.5 rounded-full bg-[#22A2BD] text-white font-bold text-sm hover:bg-[#1c8aa1] transition-all duration-300 shadow-[0_8px_20px_rgba(34,162,189,0.3)] group w-fit"
                >
                  <span>Read more</span>
                  <span className="w-9 h-9 rounded-full bg-white text-[#22A2BD] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1 shrink-0">
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

      {/* 3. FEATURED DESTINATIONS (STICKY SCROLL LAYOUT WITH SIDE ANIMATIONS) */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-x-clip">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative">
          {/* Left Title Area (Sticky, Slide from Left) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <Reveal variant="slide-left" once={false} className="space-y-5 text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1E7B9E]">
                CHOOSE YOUR PLACE
              </span>

              <h2 className="text-4xl sm:text-5xl font-display font-medium text-[#081A33] leading-tight">
                Discover dream <br />
                <span className="text-[#1E7B9E]">destinations</span>
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
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1E7B9E]">
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
                    <MapPin className="w-4 h-4 text-[#1E7B9E]" />
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
              Curated <span className="text-[#1E7B9E]">Journeys</span>
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
                  ? "bg-[#1E7B9E] text-white shadow-sm"
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
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1E7B9E]">
                  {t("golf.eyebrow")}
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-medium text-[#081A33] leading-tight">
                  Play the World's Most Scenic{" "}
                  <span className="text-[#1E7B9E]">Golf Journey.</span>
                </h2>

                <p className="text-base text-slate-600 leading-relaxed">
                  {t("golf.text")}
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-medium flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#1E7B9E] shrink-0" />
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
                  <div className="text-xs font-semibold text-[#1E7B9E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
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
                    to="/golf"
                    className="text-[#1E7B9E] hover:underline font-semibold"
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
                Signature <span className="text-[#1E7B9E]">Experiences</span>
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
              Why Travel With <span className="text-[#1E7B9E]">Lanka Luxe?</span>
            </>
          }
          subtitle={
            lang === "ko"
              ? "스리랑카 현지 아틀리에만의 차별화된 전문성과 품격을 약속드립니다."
              : "Every element of your trip is overseen by senior specialists based in Colombo and Seoul."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {whyUs.map((pillar) => (
            <Reveal key={pillar.no} variant="fade-up">
              <div className="p-8 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                <div>
                  <span className="font-display text-4xl font-bold text-[#1E7B9E]/30 block mb-4">
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
                Guest <span className="text-[#1E7B9E]">Stories</span>
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
              The <span className="text-[#1E7B9E]">Journal</span>
            </>
          }
          subtitle={
            lang === "ko"
              ? "스리랑카 골프 팁, 숙소 가이드, 문화 이야기 등 현지 전문가가 전하는 칼럼입니다."
              : "Letters, insider insights and travel guides quietly written by our Colombo team."
          }
          action={
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E7B9E] text-white text-xs font-semibold hover:bg-[#156380] transition-colors shadow-sm"
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
                Let's Plan Your <span className="text-[#1E7B9E]">Journey</span>
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
