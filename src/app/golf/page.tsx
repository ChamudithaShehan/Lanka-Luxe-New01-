"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { useContentStore } from "@/lib/content-store";
import { img } from "@/data/site";
import { GolfCourseCard } from "@/components/GolfCourseCard";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { TourCard } from "@/components/TourCard";
import {
  Flag,
  Briefcase,
  Award,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function GolfPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const { golfCourses, tours, isLoaded, dbError } = useContentStore();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGolfCourses = golfCourses.filter((course) => {
    const nameMatch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
    const locMatch = course.location.toLowerCase().includes(searchQuery.toLowerCase());
    const hotelMatch = course.hotel ? course.hotel.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const textMatch = course.text ? tl(course.text).toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return searchQuery ? (nameMatch || locMatch || hotelMatch || textMatch) : true;
  });

  const golfTour = tours.find((t) => t.slug === "ultimate-sri-lanka-golf-escape");

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <Reveal variant="fade-up">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] mb-3 font-semibold">
            <Link href="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span>{t("nav.golf")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            {lang === "ko" ? (
              <>
                스리랑카 골프 여행 · <span className="text-[#C8A45D]">Golf Travel in Sri Lanka</span>
              </>
            ) : (
              <>
                Golf Travel in <span className="text-[#C8A45D]">Sri Lanka.</span>
              </>
            )}
          </h1>

          <div className="text-base sm:text-lg text-slate-600 font-normal max-w-3xl leading-relaxed mb-8 space-y-3">
            <p>
              {lang === "ko"
                ? "골프, 빼어난 자연경관, 문화유산과 따뜻한 환대의 특별한 조합을 통해 스리랑카를 발견해 보세요."
                : "Discover Sri Lanka through a unique combination of golf, scenery, culture and hospitality."}
            </p>
            <p className="text-sm sm:text-base text-slate-500">
              {lang === "ko"
                ? "골프장 예약, 숙소, 교통 및 고객의 선호에 맞춘 관광을 포함하여 한국인 및 글로벌 여행객을 위한 프라이빗 골프 여정을 정성껏 어레인지합니다."
                : "We arrange private golf journeys for Korean and international travellers, including golf-course reservations, accommodation, transportation and sightseeing according to your preferences."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <LuxuryButton
              variant="pill"
              size="lg"
              onClick={() =>
                openInquiry({
                  tourName: "Ultimate Sri Lanka Golf Escape",
                  interest: "golf",
                })
              }
              withArrow
            >
              {t("cta.requestGolf")}
            </LuxuryButton>
            <LuxuryButton variant="outline" size="lg" href="#courses">
              {lang === "ko" ? "5대 코스 둘러보기" : "Explore The 5 Courses"}
            </LuxuryButton>
          </div>
        </Reveal>
      </section>

      {/* 4 Pillars of Golf Support */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-4">
                <Flag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-1">
                {lang === "ko" ? "골프장 예약 지원" : "Course Reservations"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "일정과 선호도에 맞춰 골프장 예약 및 캐디, 카트 배정을 맞춤형으로 준비해 드립니다."
                  : "Golf-course reservations, transportation and travel support arranged according to your itinerary and preferences."}
              </p>
            </div>
          </div>

          <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-1">
                {lang === "ko" ? "편안한 전용 차량" : "Private Transportation"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "골프백 수납과 동행 인원수에 맞춘 쾌적한 전용 차량과 기사를 일정에 맞춰 배차합니다."
                  : "Comfortable private transportation arranged according to your itinerary, group size and golf luggage requirements."}
              </p>
            </div>
          </div>

          <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-1">
                {lang === "ko" ? "클럽 렌탈 & 장비 지원" : "Club Rental Assistance"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "무거운 골프백 운반 없이도 현지 클럽하우스 렌탈 및 장비 지원을 사전에 조율해 드립니다."
                  : "Quality club rentals and course equipment support coordinated on request for a lighter journey."}
              </p>
            </div>
          </div>

          <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-1">
                {lang === "ko" ? "한국어 & 영어 소통" : "English & Korean Support"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "영어와 한국어로 직접 소통하며 한국인 및 글로벌 고객이 스리랑카에서 편안한 골프 여정을 즐기시도록 돕습니다."
                  : "I communicate personally in English and Korean, helping guests enjoy a smoother and more comfortable golf holiday."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Golf Tour Spotlight */}
      {golfTour && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
          <div className="mb-6">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]">
              {lang === "ko" ? "추천 골프 패키지" : "FEATURED GOLF PACKAGE"}
            </span>
          </div>
          <TourCard tour={golfTour} variant="horizontal" />
        </section>
      )}

      {/* The 5 Championship Courses Showcase */}
      <section id="courses" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <SectionHeader
          eyebrow={lang === "ko" ? "챔피언십 코스" : "Championship Venues"}
          title={
            lang === "ko" ? (
              <>
                스리랑카 <span className="text-[#C8A45D]">5대 챔피언십 코스</span>
              </>
            ) : (
              <>
                Sri Lanka's <span className="text-[#C8A45D]">5 Championship Courses</span>
              </>
            )
          }
          subtitle={
            lang === "ko"
              ? "각 코스의 특징과 추천 숙소를 확인하세요."
              : "Explore the distinctive personality, heritage, and luxury lodging of each course."
          }
        />

        {/* Search Golf Courses */}
        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder={
              lang === "ko"
                ? "골프장 이름, 위치, 호텔 검색..."
                : "Search championship courses by name, region, hotel..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#081A33] placeholder:text-slate-400 focus:border-[#C8A45D] outline-none shadow-sm"
          />
        </div>

        {dbError && golfCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100">
            <p className="text-lg text-slate-700 font-medium mb-2">
              Content is temporarily unavailable.
            </p>
            <p className="text-sm text-slate-500">
              Please try again later.
            </p>
          </div>
        ) : !isLoaded && golfCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
            <div className="w-8 h-8 border-2 border-[#C8A45D] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Loading Championship Courses...
            </p>
          </div>
        ) : golfCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-lg text-slate-600 font-medium mb-2">
              {lang === "ko"
                ? "현재 등록된 골프 코스가 없습니다."
                : "No golf courses available yet."}
            </p>
            <p className="text-sm text-slate-400">
              {lang === "ko"
                ? "챔피언십 코스 정보가 곧 추가될 예정입니다."
                : "Championship golf courses will be published soon."}
            </p>
          </div>
        ) : filteredGolfCourses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-lg text-slate-500 font-normal mb-4">
              {lang === "ko"
                ? "검색 조건에 맞는 골프 코스가 없습니다."
                : "No golf courses match your search."}
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs uppercase tracking-widest text-[#C8A45D] underline font-semibold cursor-pointer"
            >
              {lang === "ko" ? "전체 코스 보기" : "Reset Search"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGolfCourses.map((course) => (
              <Reveal key={course.name} variant="fade-up">
                <GolfCourseCard course={course} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Golf FAQ & Booking CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D] block mb-2">
            {lang === "ko" ? "골프 단체 맞춤 투어" : "Custom Golf Groups"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#081A33] mb-4">
            {lang === "ko"
              ? "골프 여행 맞춤 견적 & 문의"
              : "Private Golf Groups & Custom Travel"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal mb-8 max-w-lg mx-auto leading-relaxed">
            {lang === "ko"
              ? "원하시는 골프 코스와 일정, 동행 인원수를 알려주세요. 문의 내용을 직접 검토한 후 가능한 한 신속하게 맞춤 제안을 드립니다."
              : "Tell me about your travel dates, courses and group size. Your enquiry will be personally reviewed and we will respond as soon as possible."}
          </p>
          <LuxuryButton
            variant="pill"
            size="lg"
            onClick={() =>
              openInquiry({
                interest: "golf",
              })
            }
            withArrow
          >
            {t("cta.requestGolf")}
          </LuxuryButton>
        </div>
      </section>
    </div>
  );
}
