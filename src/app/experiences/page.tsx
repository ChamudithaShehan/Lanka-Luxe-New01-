"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { useContentStore } from "@/lib/content-store";
import { LuxuryButton } from "@/components/LuxuryButton";
import { Reveal } from "@/components/Reveal";
import { Pagination } from "@/components/Pagination";
import { Sparkles } from "lucide-react";

export default function ExperiencesPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const { experiences, isLoaded, dbError } = useContentStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  const filteredExperiences = experiences.filter((exp) => {
    const titleMatch = tl(exp.title).toLowerCase().includes(searchQuery.toLowerCase());
    const textMatch = exp.text ? tl(exp.text).toLowerCase().includes(searchQuery.toLowerCase()) : false;
    const descMatch = exp.description ? tl(exp.description).toLowerCase().includes(searchQuery.toLowerCase()) : false;
    return searchQuery ? (titleMatch || textMatch || descMatch) : true;
  });

  const totalPages = Math.ceil(filteredExperiences.length / ITEMS_PER_PAGE);
  const paginatedExperiences = filteredExperiences.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
            <span>{t("nav.experiences")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            {lang === "ko" ? (
              <>
                스리랑카에서 만나는 <span className="text-[#C8A45D]">특별한 시그니처 체험</span>
              </>
            ) : (
              <>
                Extraordinary Island <span className="text-[#C8A45D]">Immersions.</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed mb-8">
            {lang === "ko"
              ? "프라이빗 야생 사파리부터 고산지대 기차 여행, 차밭 방갈로와 바다 위 아유르베다까지 — 잊지 못할 스리랑카만의 순간들을 만듭니다."
              : "Private naturalists in the leopard reserves, reserved observation carriages through cloud forests, and dinner served alone on candlelit beaches."}
          </p>

          {/* Search Box */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder={
                lang === "ko"
                  ? "경험 또는 테마 검색 (예: 사파리, 열차, 아유르베다)..."
                  : "Search experiences (e.g. Safari, Train, Catamaran, Tea)..."
              }
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs text-[#081A33] placeholder:text-slate-400 focus:border-[#C8A45D] outline-none shadow-sm"
            />
          </div>
        </Reveal>
      </section>

      {/* In-Depth Experience Cards */}
      <section id="experiences-list" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 mb-28 scroll-mt-28">
        {dbError && experiences.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100">
            <p className="text-lg text-slate-700 font-medium mb-2">
              Content is temporarily unavailable.
            </p>
            <p className="text-sm text-slate-500">
              Please try again later.
            </p>
          </div>
        ) : !isLoaded && experiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
            <div className="w-8 h-8 border-2 border-[#C8A45D] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Loading Immersions...
            </p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-lg text-slate-600 font-medium mb-2">
              {lang === "ko"
                ? "현재 등록된 체험 프로그램이 없습니다."
                : "No signature experiences available yet."}
            </p>
            <p className="text-sm text-slate-400">
              {lang === "ko"
                ? "새로운 프라이빗 체험이 곧 추가될 예정입니다."
                : "New curated experiences will be published soon."}
            </p>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-lg text-slate-500 font-normal mb-4">
              {lang === "ko"
                ? "검색 조건에 맞는 체험이 없습니다."
                : "No experiences match your search."}
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs uppercase tracking-widest text-[#C8A45D] underline font-semibold cursor-pointer"
            >
              {lang === "ko" ? "전체 체험 보기" : "Reset Search"}
            </button>
          </div>
        ) : (
          <>
            {paginatedExperiences.map((exp, idx) => {
              const globalIdx = (currentPage - 1) * ITEMS_PER_PAGE + idx;
              const isEven = globalIdx % 2 === 0;

              return (
                <div
                  key={exp.slug || globalIdx}
                  className="p-8 sm:p-10 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] hover:shadow-md transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Visual */}
                    <div
                      className={`lg:col-span-6 ${
                        isEven ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <div className="relative aspect-[16/10] rounded-[1.75rem] overflow-hidden bg-slate-100 shadow-sm group">
                        <img
                          src={exp.image}
                          alt={tl(exp.title)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C8A45D]" />
                            Experience 0{globalIdx + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Narrative */}
                    <div
                      className={`lg:col-span-6 space-y-5 text-left ${
                        isEven ? "lg:order-2" : "lg:order-1"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D] block mb-1">
                          {lang === "ko" ? "시그니처 체험" : "Signature Immersion"}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#081A33] leading-tight">
                          {tl(exp.title)}
                        </h2>
                      </div>

                      <p className="text-base text-slate-500 font-normal leading-relaxed">
                        {tl(exp.text)}
                      </p>

                      <div className="pt-2 flex flex-wrap gap-4">
                        <LuxuryButton
                          variant="pill"
                          onClick={() =>
                            openInquiry({
                              tourName: `Experience: ${tl(exp.title)}`,
                              interest: "custom",
                            })
                          }
                          withArrow
                        >
                          {lang === "ko" ? "이 체험 예약 문의" : "Inquire About This"}
                        </LuxuryButton>

                        <LuxuryButton variant="outline" href="/tours">
                          {lang === "ko" ? "포함 투어 보기" : "View Related Tours"}
                        </LuxuryButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredExperiences.length}
              pageSize={ITEMS_PER_PAGE}
              itemLabel={lang === "ko" ? "체험" : "experiences"}
              showRange
              scrollToId="experiences-list"
            />
          </>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#081A33] mb-4">
            {lang === "ko"
              ? "나만의 특별한 액티비티를 더해보세요"
              : "Want to Combine Multiple Experiences?"}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal mb-8 max-w-lg mx-auto leading-relaxed">
            {lang === "ko"
              ? "골프와 야생 사파리, 웰니스 스파를 한 여정에 담아 최적의 동선으로 연결해 드립니다."
              : "We seamlessly weave helicopter transfers, private game drives and luxury villa stays into a harmonious rhythm."}
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
