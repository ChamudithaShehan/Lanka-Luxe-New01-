"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { useContentStore } from "@/lib/content-store";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { TourCard } from "@/components/TourCard";
import { Reveal } from "@/components/Reveal";
import { MapPin, Clock, Sparkles, CheckCircle2 } from "lucide-react";

export default function DestinationDetailPage() {
  const rawParams = useParams();
  const slug = typeof rawParams?.slug === "string" ? rawParams.slug : Array.isArray(rawParams?.slug) ? rawParams.slug[0] : "";
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const { destinations, tours, isLoaded } = useContentStore();

  const dest = destinations.find((d) => d.slug === slug);

  if (!dest && !isLoaded) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-28 px-4 text-center bg-[#F9FAFB] text-slate-800">
        <div className="w-8 h-8 border-2 border-[#C8A45D] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
          Loading Destination Guide...
        </p>
      </div>
    );
  }

  if (!dest) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-28 px-4 text-center bg-[#F9FAFB] text-slate-800">
        <h1 className="text-3xl font-bold mb-4">Destination Not Found</h1>
        <LuxuryButton variant="pill" href="/destinations">
          View All Destinations
        </LuxuryButton>
      </div>
    );
  }

  // Find tours that visit this destination
  const matchedTours = tours.filter((t) =>
    t.locations.some(
      (loc) =>
        loc.toLowerCase().includes(dest.name.en.toLowerCase()) ||
        dest.name.en.toLowerCase().includes(loc.toLowerCase()),
    ),
  );

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] font-semibold">
          <Link href="/" className="hover:underline">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <Link href="/destinations" className="hover:underline">
            {t("nav.destinations")}
          </Link>
          <span>/</span>
          <span className="text-slate-500">{tl(dest.name)}</span>
        </div>
      </div>

      {/* Hero Visual */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative aspect-[21/9] min-h-[300px] rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] mb-8">
          <img
            src={dest.image}
            alt={tl(dest.name)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081A33]/80 via-[#081A33]/20 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <div className="inline-flex items-center gap-1 text-xs text-gold uppercase tracking-widest mb-2 font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{dest.region}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-medium text-white">
                {tl(dest.name)}
              </h1>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 text-slate-800 text-xs backdrop-blur-md font-medium shadow-sm">
              <Clock className="w-4 h-4 text-[#C8A45D]" />
              <span>
                {lang === "ko" ? "권장 체류:" : "Recommended Stay:"}{" "}
                <strong>{dest.stay}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Narrative & Best Experiences */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Story (Left) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
              <h2 className="text-2xl font-bold text-[#081A33] mb-4">
                {lang === "ko" ? "지역 소개" : "Atelier Overview"}
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-4">
                {tl(dest.short)}
              </p>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                {tl(dest.long)}
              </p>
            </div>

            {/* Best Experiences in this destination */}
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-4 h-4 text-[#C8A45D]" />
                <h3 className="text-xl font-bold text-[#081A33]">
                  {lang === "ko"
                    ? `${tl(dest.name)} 대표 추천 체험`
                    : `Signature Experiences in ${tl(dest.name)}`}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dest.best.map((exp, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D] shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 font-medium">{exp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Booking Action */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-7 sm:p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] space-y-6">
              <h3 className="text-xl font-bold text-[#081A33]">
                {lang === "ko"
                  ? `${tl(dest.name)} 포함 맞춤 일정 문의`
                  : `Include ${tl(dest.name)} in Your Journey`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "원하시는 방문지와 숙소 등급을 말씀해 주시면 최적의 동선으로 일정을 짜드립니다."
                  : "Our Colombo travel specialists will integrate this destination smoothly into a private bespoke route."}
              </p>
              <LuxuryButton
                variant="pill"
                size="md"
                className="w-full justify-center"
                onClick={() =>
                  openInquiry({
                    tourName: `Custom Trip including ${tl(dest.name)}`,
                    interest: "custom",
                  })
                }
                withArrow
              >
                {t("cta.planThis")}
              </LuxuryButton>
            </div>
          </div>
        </div>
      </section>

      {/* Journeys that feature this destination */}
      {matchedTours.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/60 pt-16">
          <SectionHeader
            eyebrow="Itineraries"
            title={
              <>
                Signature Journeys Visiting{" "}
                <span className="text-[#C8A45D]">{tl(dest.name)}</span>
              </>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {matchedTours.map((t) => (
              <TourCard key={t.slug} tour={t} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
