"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { useContentStore } from "@/lib/content-store";
import { img } from "@/data/site";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import {
  Award,
  ShieldCheck,
  HeartHandshake,
  Compass,
  MapPin,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Globe2,
  Flag,
  FileCheck,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const { golfCourses, siteSettings } = useContentStore();

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* 1. Hero Header & Company Description (Card A) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <Reveal variant="fade-up">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] mb-3 font-semibold">
            <Link href="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span>{t("nav.about")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            {lang === "ko" ? (
              <>
                스리랑카 현지 전문가와 함께하는 <span className="text-[#C8A45D]">프라이빗 맞춤 여행</span>
              </>
            ) : (
              <>
                Discover Sri Lanka With <span className="text-[#C8A45D]">A Local Expert.</span>
              </>
            )}
          </h1>

          <div className="max-w-4xl space-y-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            <p>
              {lang === "ko"
                ? "Lanka Luxe Journeys는 10년 이상의 스리랑카 관광 업계 경력을 가진 전문 관광 가이드 이로샨 자야위크라마(Iroshan Jayawickrame)가 설립한 스리랑카 현지 프라이빗 여행사입니다."
                : "Lanka Luxe Journeys is a Sri Lanka-based private travel company founded by Iroshan Jayawickrame, a professional tourist guide with more than 10 years of experience in Sri Lankan tourism."}
            </p>
            <p className="text-sm sm:text-base text-slate-500">
              {lang === "ko"
                ? "켈라니야 대학교 고고학 대학원(PGIAR)의 고고학 및 문화 관광 디플로마(Diploma in Archaeology & Culture Tourism)와 글로벌 여행객을 안내해 온 풍부한 전문 경험을 바탕으로, 이로샨은 깊이 있는 현지 지식과 문화적 이해, 정성 어린 1:1 맞춤 서비스를 결합하여 스리랑카 전역에서 뜻깊은 여정을 선사합니다."
                : "With a Diploma in Archaeology & Culture Tourism and professional experience guiding international travellers, Iroshan brings together local knowledge, cultural understanding and personal service to create meaningful journeys across Sri Lanka."}
            </p>
            <p className="text-sm sm:text-base text-slate-500 font-medium text-[#C8A45D]">
              {lang === "ko"
                ? "유네스코 문화유산과 야생 사파리부터 고산 차밭, 에메랄드빛 해변, 골프 휴양과 아유르베다 웰니스까지, 모든 여정은 고객님의 관심사와 여행 속도, 취향에 맞춰 정성껏 설계됩니다."
                : "From heritage and wildlife to tea country, beaches, golf and wellness, each journey is thoughtfully designed around your interests, pace and travel style."}
            </p>
          </div>
        </Reveal>
      </section>

      {/* 2. My Story / Personal Intro (Card D) & Founder Profile */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Iroshan Photo Card */}
          <div className="lg:col-span-5">
            <Reveal variant="slide-left">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] group">
                <img
                  src={img.iroshan}
                  alt="Iroshan Jayawickrame - Founder of Lanka Luxe Journeys"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081A33]/90 via-[#081A33]/30 to-transparent opacity-95" />
                <div className="absolute bottom-6 left-6 right-6 text-white p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-semibold text-[#C8A45D] uppercase tracking-widest mb-1">
                    {lang === "ko" ? "창립자 & 공인 가이드" : "Founder & Licensed Guide"}
                  </p>
                  <h4 className="text-xl font-bold font-display text-white">
                    Iroshan Jayawickrame
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    10+ Years in Sri Lankan Tourism · SLTDA Registered Guide C-1734 · Diploma in Archaeology & Culture Tourism
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Personal Management</span>
                    <span className="text-[#C8A45D]">English & Korean</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Personal Intro Story & Archaeology Heritage */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <Reveal variant="slide-right">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D] block mb-2">
                {lang === "ko" ? "창립자 인사말" : "My Story / Personal Intro"}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-[#081A33] leading-tight">
                {lang === "ko"
                  ? "스리랑카의 아름다움과 깊은 유산을 전합니다"
                  : "Welcoming You to Sri Lanka with Heart & Heritage"}
              </h2>
              <div className="w-12 h-1 bg-[#C8A45D] rounded-full my-4"></div>
              
              <div className="text-base text-slate-600 font-normal leading-relaxed space-y-4">
                <p>
                  {lang === "ko"
                    ? "안녕하세요, Lanka Luxe Journeys의 창립자 이로샨 자야위크라마(Iroshan Jayawickrame)입니다. 10년 이상의 관광 업계 경력을 바탕으로 전 세계 여행객들을 맞이하며 제 조국 스리랑카의 아름다움과 문화, 따뜻한 환대를 전해올 수 있었던 것은 저에게 큰 영광이었습니다."
                    : "I am Iroshan Jayawickrame, the founder of Lanka Luxe Journeys. With more than 10 years of experience in the tourism industry, I have had the privilege of welcoming travelers from around the world and showing them the beauty, culture and hospitality of my country."}
                </p>
                <p>
                  {lang === "ko"
                    ? "켈라니야 대학교 고고학 대학원 디플로마 배경을 통해 스리랑카의 유구한 역사와 찬란한 문화유산을 더욱 깊이 있고 의미 있게 공유해 드립니다."
                    : "My background in archaeology allows me to share the rich history and heritage of Sri Lanka in a deeper and more meaningful way."}
                </p>
                <p>
                  {lang === "ko"
                    ? "전문적이고 개인 맞춤형이며 잊지 못할 여정을 누리실 수 있도록, 모든 일정을 제가 직접 기획하고 총괄 관리합니다."
                    : "I personally design and manage every journey to ensure you receive a professional, personal and memorable experience."}
                </p>
              </div>

              {/* Trust & License Card (Card F) */}
              <div className="p-5 rounded-2xl bg-white border border-[#C8A45D]/30 shadow-sm flex items-start gap-4 mt-6">
                <div className="w-10 h-10 rounded-full bg-[#C8A45D]/15 text-[#C8A45D] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#081A33]">
                    {lang === "ko" ? "공식 등록 및 공인 라이선스 여행 서비스" : "Trust & License Information"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    <strong>Registered Tourist Guide</strong> – Sri Lanka Tourism Development Authority (SLTDA)<br />
                    <strong>Guide Licence No:</strong> C-1734
                  </p>
                  <p className="text-xs text-[#C8A45D] font-medium mt-1">
                    {lang === "ko"
                      ? "고객님의 안전과 편안함, 최고의 만족이 언제나 저의 최우선 순위입니다."
                      : "Your safety, comfort and satisfaction are always my top priority."}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Qualifications & Professional Details (Card B) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D] block mb-2">
            {lang === "ko" ? "전문 자격 및 경력" : "Professional Credentials"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#081A33]">
            {lang === "ko" ? "검증된 전문성과 자격 사항" : "My Qualifications & Professional Details"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Reveal variant="fade-up" delay={0.05}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">10+ Years of Tourism Experience</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "스리랑카 관광 및 럭셔리 여행 분야에서 10년 이상의 풍부한 필드 경험을 보유하고 있습니다."
                  : "Over a decade of hands-on experience welcoming luxury, golf and cultural travelers from across the globe."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.1}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">SLTDA Registered Tourist Guide</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                <strong>Guide Licence No: C-1734</strong><br />
                {lang === "ko"
                  ? "스리랑카 관광개발청(SLTDA)에 공식 등록된 공인 전문 관광 가이드입니다."
                  : "Fully registered and licensed by the Sri Lanka Tourism Development Authority (SLTDA)."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.15}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">Diploma in Archaeology & Culture Tourism</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                <strong>Postgraduate Institute of Archaeology, University of Kelaniya</strong><br />
                {lang === "ko"
                  ? "켈라니야 대학교 고고학 대학원(PGIAR)의 고고학 및 문화 관광 디플로마 과정을 수료하여 학술적 깊이가 있는 풍부한 문화유산 해설을 제공합니다."
                  : "Postgraduate Institute of Archaeology, University of Kelaniya, bringing authentic academic insights and cultural depth to your journeys."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.2}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">English & Korean Support</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "영어와 한국어로 직접 소통하며 한국인 및 글로벌 고객이 스리랑카에서 더욱 편안하고 매끄러운 여행을 즐기실 수 있도록 돕습니다."
                  : "I communicate personally in English and Korean, helping Korean and international guests enjoy a smoother and more comfortable journey in Sri Lanka."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.25}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">Culture & Wildlife Expertise</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "유네스코 고대 유적지, 국립공원 야생 사파리, 고산 홍차 힐스 및 웰니스 힐링 여행 설계에 정통합니다."
                  : "Specialized in ancient archaeological heritage, wildlife safaris, tea plantation highlands and rejuvenating wellness."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.3}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Flag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">Golf Travel in Sri Lanka</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "한국인 및 글로벌 여행객을 위한 프라이빗 골프 여정으로, 골프장 예약, 숙소, 차량 및 관광을 고객의 선호에 맞춰 정성껏 준비합니다."
                  : "Private golf journeys for Korean and international travellers, including golf-course reservations, accommodation, transportation and sightseeing according to your preferences."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Our Service Philosophy (Card E) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D] block mb-2">
            {lang === "ko" ? "서비스 철학" : "Our Service Philosophy"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#081A33] mb-4">
            {lang === "ko" ? "신뢰와 정성으로 완성하는 여정" : "Crafted With Integrity & Excellence"}
          </h2>
          <div className="inline-block px-6 py-2 rounded-full bg-[#081A33] text-white text-xs sm:text-sm font-medium tracking-wide">
            {lang === "ko"
              ? "“우리는 단순히 여행을 계획하지 않습니다. 스리랑카에서 잊지 못할 추억을 빚어냅니다.”"
              : "“We don't just plan your trip, we craft your unforgettable memories in Sri Lanka.”"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Reveal variant="fade-up" delay={0.1}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "1. 개인 맞춤형 수제 여행" : "1. Personalized & Tailor-made Journeys"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "정형화된 패키지가 아닌, 고객의 속도, 취향, 예산에 맞추어 처음부터 새롭게 맞춤 설계합니다."
                  : "No fixed departures or rigid schedules. Every itinerary is crafted exclusively to suit your personal style and rhythm."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.2}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "2. 엄선된 경험과 신뢰할 수 있는 서비스" : "2. Carefully Selected Experiences & Services"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "엄선된 호텔, 운송 파트너 및 로컬 체험 제공업체와 협력하여 편안하고 기억에 남는 여정을 완성합니다."
                  : "We work with carefully selected hotels, transportation providers and local experiences to create comfortable and memorable journeys."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.3}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "3. 공인 관광 전문가 및 전용 차량 배차" : "3. Registered Sri Lankan Tourism Professional"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "SLTDA 공식 등록 가이드(C-1734) 자격을 갖추고 있으며, 일정과 인원수, 편의 요구에 맞춰 쾌적한 전용 차량을 어레인지합니다."
                  : "SLTDA Registered Guide – C-1734. Private transportation can be arranged according to your itinerary, group size and comfort requirements."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.4}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "4. 진정한 현지 로컬 체험" : "4. Authentic Local Experiences"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "일반 관광객이 닿지 못하는 숨은 명소와 현지인의 따뜻한 문화를 진정성 있게 연결합니다."
                  : "Discover hidden gems, genuine cultural connections, and deeper historic stories not found in guidebooks."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.5}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "5. 지속 가능하고 책임감 있는 여행" : "5. Sustainable & Responsible Tourism"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "스리랑카의 자연 환경과 유적을 보존하고 지역 사회와 상생하는 품격 있는 여행을 실천합니다."
                  : "Honoring wildlife habitats, empowering local artisans, and preserving the island's pristine heritage."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.6}>
            <div className="bg-[#081A33] text-white p-7 rounded-3xl shadow-sm border border-white/10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/20 text-[#C8A45D] flex items-center justify-center mb-5">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {lang === "ko" ? "6. 한국어 & 영어 1:1 케어" : "6. English & Korean Support"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === "ko"
                    ? "영어와 한국어로 직접 소통하며 한국인 및 글로벌 고객이 스리랑카에서 더욱 편안하고 매끄러운 여행을 즐기실 수 있도록 돕습니다."
                    : "I communicate personally in English and Korean, helping Korean and international guests enjoy a smoother and more comfortable journey in Sri Lanka."}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Golf Tourism Section (Card C) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]">
                {lang === "ko" ? "스리랑카 골프 여행" : "GOLF TRAVEL IN SRI LANKA"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-medium text-[#081A33] leading-tight">
                {lang === "ko"
                  ? "스리랑카 골프 여행 (Golf Travel in Sri Lanka)"
                  : "Golf Travel in Sri Lanka"}
              </h2>
              <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3">
                <p>
                  {lang === "ko"
                    ? "골프, 빼어난 자연경관, 문화유산과 따뜻한 환대의 특별한 조합을 통해 스리랑카를 발견해 보세요."
                    : "Discover Sri Lanka through a unique combination of golf, scenery, culture and hospitality."}
                </p>
                <p>
                  {lang === "ko"
                    ? "골프장 예약, 숙소, 차량 및 고객의 선호에 맞춘 관광을 포함하여 한국인 및 글로벌 여행객을 위한 프라이빗 골프 여정을 정성껏 어레인지합니다."
                    : "We arrange private golf journeys for Korean and international travellers, including golf-course reservations, accommodation, transportation and sightseeing according to your preferences."}
                </p>
                <p className="text-xs sm:text-sm text-slate-500">
                  {lang === "ko"
                    ? "일정과 선호도에 따라 골프장 예약, 전용 차량 및 여행 지원이 맞춤 제공되며, 한국어 및 영어 소통이 가능합니다."
                    : "Golf-course reservations, transportation and travel support can be arranged according to your itinerary and preferences. Korean and English communication available."}
                </p>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#081A33] mb-3">
                  {lang === "ko" ? "스리랑카 주요 골프 코스:" : "Sri Lanka Golf Courses:"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Royal Colombo Golf Club</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Victoria Golf Resort (Kandy)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Nuwara Eliya Golf Club</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Shangri-La Golf Resort Hambantota</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Eagles' Golf Links</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <LuxuryButton variant="pill" href="/golf" withArrow>
                  {t("cta.golf")}
                </LuxuryButton>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-md aspect-[4/3]">
                <img
                  src={img.golf}
                  alt="Victoria Golf Club Sri Lanka"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 8. Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D] block mb-2">
            Begin Your Story
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#081A33] mb-4">
            {lang === "ko"
              ? "스리랑카 현지 전문가와 상담을 시작해 보세요."
              : "Let's Plan Your Sri Lankan Journey"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal mb-8 max-w-lg mx-auto leading-relaxed">
            {lang === "ko"
              ? "원하시는 여행 일정과 관심사, 선호하는 여행 스타일을 알려주세요. 문의 내용을 직접 검토한 후 가능한 한 신속하게 맞춤 제안을 준비해 드리겠습니다."
              : "Tell me about your travel dates, interests and preferred style of travel. Your enquiry will be personally reviewed and we will respond as soon as possible."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LuxuryButton variant="pill" size="lg" onClick={() => openInquiry()} withArrow>
              {t("cta.plan")}
            </LuxuryButton>
            <LuxuryButton variant="outline" size="lg" href="/contact">
              {t("nav.contact")}
            </LuxuryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
