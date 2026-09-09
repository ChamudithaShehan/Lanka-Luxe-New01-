"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useContentStore } from "@/lib/content-store";
import { DestinationCard } from "@/components/DestinationCard";
import { SectionHeader } from "@/components/SectionHeader";
import { LuxuryButton } from "@/components/LuxuryButton";
import { Reveal } from "@/components/Reveal";
import { Pagination } from "@/components/Pagination";
import { useInquiry } from "@/lib/inquiry-context";

export default function DestinationsPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const { destinations, isLoaded, dbError } = useContentStore();
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const handleRegionChange = (reg: string) => {
    setSelectedRegion(reg);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedDestinations = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            {lang === "ko" ? (
              <>
                찬란한 <span className="text-[#C8A45D]">스리랑카의 여행지</span>
              </>
            ) : (
              <>
                The Island of <span className="text-[#C8A45D]">Serendipity.</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed mb-8">
            {lang === "ko"
              ? "유네스코 고대 유적지, 안개 낀 고산지대 차밭, 표범이 서식하는 사파리 국립공원, 황금빛 남부 해안까지 — 스리랑카의 보석 같은 여행지들을 만나보세요."
              : "Nine distinctive regions across the teardrop island — fifth-century sky fortresses, 6,000-foot tea estates, leopard reserves, and 17th-century coral-stone ramparts."}
          </p>
        </Reveal>
      </section>

      {/* Destination Grid with Filter */}
      <section id="destinations-directory" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28 scroll-mt-28">
        <SectionHeader
          eyebrow={lang === "ko" ? "여행지 가이드" : "Directory"}
          title={
            lang === "ko" ? (
              <>
                스리랑카 전역 <span className="text-[#C8A45D]">인기 여행지</span>
              </>
            ) : (
              <>
                All Island <span className="text-[#C8A45D]">Destinations</span>
              </>
            )
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
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#081A33] placeholder:text-slate-400 focus:border-[#C8A45D] outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => handleRegionChange(reg)}
              className={`px-5 py-2.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedRegion === reg
                  ? "bg-[#0B1F3A] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {reg === "All"
                ? (lang === "ko" ? "전체 지역" : "All")
                : lang === "ko"
                ? (reg === "Cultural Triangle" ? "문화 삼각지대"
                  : reg === "Hill Country" ? "고산 차밭 지대"
                  : reg === "South Coast" ? "남부 해안"
                  : reg === "West Coast" ? "서부 해안"
                  : reg === "Southern Wilderness" ? "남부 사파리/야생"
                  : reg === "East Coast" ? "동부 해안"
                  : reg)
                : reg}
            </button>
          ))}
        </div>

        {dbError && destinations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100 mb-8">
            <p className="text-lg text-slate-700 font-medium mb-2">
              Content is temporarily unavailable.
            </p>
            <p className="text-sm text-slate-500">
              Please try again later.
            </p>
          </div>
        ) : !isLoaded && destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 mb-8">
            <div className="w-8 h-8 border-2 border-[#C8A45D] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Loading Destinations...
            </p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 mb-8">
            <p className="text-lg text-slate-600 font-medium mb-2">
              {lang === "ko"
                ? "현재 등록된 여행지가 없습니다."
                : "No destinations available yet."}
            </p>
            <p className="text-sm text-slate-400">
              {lang === "ko"
                ? "새로운 여행지가 곧 업데이트됩니다."
                : "New island destinations will be published soon."}
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 mb-8">
            <p className="text-lg text-slate-500 font-normal mb-4">
              {lang === "ko"
                ? "검색 조건에 맞는 여행지가 없습니다."
                : "No destinations match your search."}
            </p>
            <button
              onClick={() => {
                setSelectedRegion("All");
                setSearchQuery("");
              }}
              className="text-xs uppercase tracking-widest text-[#C8A45D] underline font-semibold cursor-pointer"
            >
              {lang === "ko" ? "전체 지역 보기" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedDestinations.map((dest) => (
                <Reveal key={dest.slug} variant="fade-up">
                  <DestinationCard destination={dest} />
                </Reveal>
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filtered.length}
              pageSize={ITEMS_PER_PAGE}
              itemLabel={lang === "ko" ? "여행지" : "destinations"}
              showRange
              scrollToId="destinations-directory"
            />
          </>
        )}
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
