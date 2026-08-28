"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { useContentStore } from "@/lib/content-store";
import { tourFilters, isCategoryMatch } from "@/data/site";
import { TourCard } from "@/components/TourCard";
import { LuxuryButton } from "@/components/LuxuryButton";
import { Reveal } from "@/components/Reveal";
import { Search, Sparkles, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export default function ToursPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const { tours, isLoaded } = useContentStore();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === "All") return lang === "ko" ? "전체 보기" : "All Journeys";
    if (lang === "ko") {
      switch (cat) {
        case "Signature Journeys":
        case "Luxury":
          return "시그니처 여정";
        case "Golf & Leisure":
        case "Golf":
          return "골프 & 휴양";
        case "Wildlife & Nature":
        case "Wildlife":
          return "사파리 & 야생";
        case "Culture & Heritage":
        case "Culture":
          return "문화 & 유산";
        case "Honeymoon & Romance":
        case "Honeymoon":
          return "허니문 & 로맨스";
        case "Wellness & Ayurveda":
        case "Wellness":
          return "웰니스 & 아유르베다";
        case "Family & Group":
        case "Family":
          return "가족 & 그룹";
        default:
          return cat;
      }
    }
    return cat;
  };

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesCategory = isCategoryMatch(tour, selectedCategory);

      const nameMatch =
        tl(tour.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tour.locations &&
          tour.locations.some((loc) =>
            loc.toLowerCase().includes(searchQuery.toLowerCase()),
          ));

      return matchesCategory && (searchQuery ? nameMatch : true);
    });
  }, [tours, selectedCategory, searchQuery, tl]);

  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE);

  const paginatedTours = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTours.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTours, currentPage]);

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <Reveal variant="fade-up">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] mb-3 font-semibold">
            <Link href="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span>{t("nav.tours")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-4">
            Signature Luxury <span className="text-[#C8A45D]">Journeys.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-2xl leading-relaxed mb-8">
            {lang === "ko"
              ? "스리랑카 전역을 잇는 9가지 시그니처 럭셔리 일정입니다. 모든 일정은 고객님의 희망에 따라 자유롭게 변경 가능합니다."
              : "Nine private routes spanning colonial tea estates, championship links, leopard reserves and coastal ramparts. Fully bespoke and customizable."}
          </p>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  lang === "ko"
                    ? "투어 이름 또는 방문지(콜롬보, 시기리야, 캔디 등) 검색..."
                    : "Search by journey name or destination (e.g. Sigiriya, Golf, Yala)..."
                }
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#081A33] placeholder:text-slate-400 focus:border-[#C8A45D] focus:bg-white outline-none"
              />
            </div>

            {/* Filter Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#C8A45D] shrink-0 mr-1 hidden sm:inline" />
              {tourFilters.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#0B1F3A] text-white shadow-sm"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Tours Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        {!isLoaded && tours.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
            <div className="w-8 h-8 border-2 border-[#C8A45D] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Loading Luxury Journeys...
            </p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-lg text-slate-500 font-normal mb-4">
              {lang === "ko"
                ? "검색 조건에 맞는 일정이 없습니다."
                : "No journeys match your current filter."}
            </p>
            <button
              onClick={() => {
                handleCategoryChange("All");
                setSearchQuery("");
              }}
              className="text-xs uppercase tracking-widest text-[#C8A45D] underline font-semibold cursor-pointer"
            >
              {lang === "ko" ? "전체 목록 보기" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {paginatedTours.map((tour) => (
                <Reveal key={tour.slug} variant="fade-up">
                  <TourCard tour={tour} />
                </Reveal>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#0B1F3A] text-white shadow-md"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Bespoke Custom Itinerary Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8A45D]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D]">
                {lang === "ko" ? "100% 맞춤 여행 설계" : "Completely Tailor-Made"}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#081A33]">
              {lang === "ko"
                ? "원하시는 코스가 없으신가요? 백지에서 직접 설계해 드립니다."
                : "Looking for a completely custom Sri Lanka route?"}
            </h3>
            <p className="text-sm text-slate-500 font-normal max-w-xl leading-relaxed">
              {lang === "ko"
                ? "일정, 예산, 희망 명소를 말씀해 주시면 전담 여행 디자이너가 48시간 이내에 전용 제안서를 작성해 드립니다."
                : "Tell us your wish list, preferred travel pace, or special milestones. We will write an exclusive itinerary from a blank page."}
            </p>
          </div>

          <LuxuryButton
            variant="pill"
            size="lg"
            onClick={() => openInquiry({ interest: "custom" })}
            withArrow
            className="shrink-0"
          >
            {t("cta.custom")}
          </LuxuryButton>
        </div>
      </section>
    </div>
  );
}
