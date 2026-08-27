"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useContentStore } from "@/lib/content-store";
import { DestinationCard } from "@/components/DestinationCard";
import { SectionHeader } from "@/components/SectionHeader";
import { LuxuryButton } from "@/components/LuxuryButton";
import { Reveal } from "@/components/Reveal";
import { useInquiry } from "@/lib/inquiry-context";

export default function DestinationsPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const { destinations } = useContentStore();
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const regions = [
    "All",
    "Cultural Triangle",
    "Hill Country",
    "South Coast",
    "West Coast",
    "Southern Wilderness",
    "East Coast",
  ];

  const filtered = destinations.filter((d) => {
    const matchesRegion =
      selectedRegion === "All" ||
      d.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesSearch =
      tl(d.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.short && tl(d.short).toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

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
            <span>{t("nav.destinations")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            The Island of <span className="text-[#C8A45D]">Serendipity.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed mb-8">
            {lang === "ko"
              ? "유네스코 고대 유적지, 안개 낀 고산지대 차밭, 표범이 서식하는 사파리 국립공원, 황금빛 남부 해안까지 — 스리랑카의 보석 같은 여행지들을 만나보세요."
              : "Nine distinctive regions across the teardrop island — fifth-century sky fortresses, 6,000-foot tea estates, leopard reserves, and 17th-century coral-stone ramparts."}
          </p>
        </Reveal>
      </section>

      {/* Destination Grid with Filter */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <SectionHeader
          eyebrow="Directory"
          title={
            <>
              All Island <span className="text-[#C8A45D]">Destinations</span>
            </>
          }
        />

        {/* Search & Region Filter */}
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder={
              lang === "ko"
                ? "여행지 이름 또는 지역 검색 (예: 시기리야, 갈레, 캔디)..."
                : "Search destinations by name or region (e.g. Sigiriya, Galle)..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#081A33] placeholder:text-slate-400 focus:border-[#C8A45D] outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-5 py-2.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedRegion === reg
                  ? "bg-[#0B1F3A] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {reg}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dest) => (
            <Reveal key={dest.slug} variant="fade-up">
              <DestinationCard destination={dest} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Inquiry Callout */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#081A33] mb-4">
            {lang === "ko"
              ? "어디로 떠나야 할지 고민되시나요?"
              : "Not Sure Which Regions to Combine?"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal mb-8 max-w-lg mx-auto leading-relaxed">
            {lang === "ko"
              ? "여행 기간과 계절에 맞는 최적의 동선을 여행 디자이너가 추천해 드립니다."
              : "Sri Lanka has two distinct seasonal patterns. Our designers know exactly which coast is sunlit and when the tea country is clear."}
          </p>
          <LuxuryButton
            variant="pill"
            size="lg"
            onClick={() => openInquiry({ interest: "custom" })}
            withArrow
          >
            {t("cta.plan")}
          </LuxuryButton>
        </div>
      </section>
    </div>
  );
}
