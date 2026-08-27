import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { img, golfCourses, tours } from "@/data/site";
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

export const Route = createFileRoute("/golf")({
  head: () => ({
    meta: [
      { title: "Championship Golf Holidays Sri Lanka | Lanka Luxe Journeys" },
      {
        name: "description",
        content:
          "Play five historic and scenic championship golf courses in Sri Lanka. Confirmed tee times, caddies, luxury transfers and Korean-speaking concierge.",
      },
    ],
  }),
  component: GolfPage,
});

function GolfPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();

  const golfTour = tours.find((t) => t.slug === "ultimate-sri-lanka-golf-escape");

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <Reveal variant="fade-up">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] mb-3 font-semibold">
            <Link to="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span>{t("nav.golf")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            Play Asia's Most Scenic <span className="text-[#C8A45D]">Golf Fairways.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed mb-8">
            {lang === "ko"
              ? "스리랑카는 골프 애호가를 위한 숨겨진 보석입니다. 숨 막히는 자연경관 속 세계적인 수준의 골프 코스에서 플레이하고, 따뜻한 환대와 함께 우리 섬의 아름다움을 발견하세요. 티타임 예약부터 안락한 숙소, 최고급 전용 차량까지 한국인 및 글로벌 고객을 위한 프리미엄 골프 휴양을 전문으로 합니다."
              : "Sri Lanka is a hidden gem for golf lovers. Play on world-class golf courses surrounded by breathtaking landscapes, enjoy warm hospitality and discover the beauty of our island. We specialize in golf holidays for Korean and international guests, including tee time reservations, comfortable stays and luxury transport."}
          </p>

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

      {/* 4 Pillars of Golf Concierge */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-4">
                <Flag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-1">
                {lang === "ko" ? "확정 티타임 & 캐디" : "Confirmed Tee Times"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "출발 전 모든 코스의 티타임과 전담 캐디, 전동 카트가 사전 확정됩니다."
                  : "Guaranteed prime tee times, top-tier caddies and carts pre-booked before you fly."}
              </p>
            </div>
          </div>

          <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-1">
                {lang === "ko" ? "골프백 & 차량 전담 의전" : "Golf Bag Logistics"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "골프백 수납이 완벽한 벤츠·토요타 밴과 전용 기사가 호텔-골프장 간 이동을 책임집니다."
                  : "Mercedes V-Class & luxury coaches with dedicated luggage space for all sets."}
              </p>
            </div>
          </div>

          <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-1">
                {lang === "ko" ? "프리미엄 클럽 렌탈" : "Premium Rental Sets"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "무거운 백 없이도 테일러메이드, 캘러웨이 최신 클럽 세트를 현지에서 대여 가능합니다."
                  : "Latest TaylorMade and Callaway sets available for hire on arrival."}
              </p>
            </div>
          </div>

          <div className="p-7 rounded-[1.75rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-1">
                {lang === "ko" ? "한국어 골프 가이드" : "Korean-Speaking Host"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "체크인, 그늘집, 스코어카드, 저녁 만찬까지 한국어 전담 코디네이터가 케어합니다."
                  : "Dedicated Korean-speaking tour host for groups and club hospitality."}
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
              FEATURED GOLF PACKAGE
            </span>
          </div>
          <TourCard tour={golfTour} variant="horizontal" />
        </section>
      )}

      {/* The 5 Championship Courses Showcase */}
      <section id="courses" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <SectionHeader
          eyebrow="Championship Venues"
          title={
            <>
              Sri Lanka's <span className="text-[#C8A45D]">5 Championship Courses</span>
            </>
          }
          subtitle={
            lang === "ko"
              ? "각 코스의 특징과 추천 숙소를 확인하세요."
              : "Explore the distinctive personality, heritage, and luxury lodging of each course."
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {golfCourses.map((course) => (
            <Reveal key={course.name} variant="fade-up">
              <GolfCourseCard course={course} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Golf FAQ & Booking CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D] block mb-2">
            Custom Golf Groups
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#081A33] mb-4">
            {lang === "ko"
              ? "골프 동호회 & 단체 여행 맞춤 견적"
              : "Private Golf Groups & Custom Tournaments"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal mb-8 max-w-lg mx-auto leading-relaxed">
            {lang === "ko"
              ? "4인~20인 이상 단체 골프 투어, VIP 시상 만찬, 싱글 룸 배정까지 전문 컨시어지가 맞춤 견적을 제공합니다."
              : "From 4-ball buddies' escapes to 24-player club tournaments with gala dinners and luxury villas."}
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
