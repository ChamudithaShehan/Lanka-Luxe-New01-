"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useContentStore } from "@/lib/content-store";
import { blogCategories } from "@/data/site";
import { BlogCard } from "@/components/BlogCard";
import { LuxuryButton } from "@/components/LuxuryButton";
import { Reveal } from "@/components/Reveal";
import { Pagination } from "@/components/Pagination";
import { Calendar, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const { t, tl, lang } = useI18n();
  const { posts, isLoaded, dbError } = useContentStore();
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

  const filteredPosts = posts.filter((p) => {
    const matchesCat =
      selectedCategory === "All" ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(p.category.toLowerCase());
    const matchesSearch =
      tl(p.title).toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt && tl(p.excerpt).toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const featured = posts[0];

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
            <span>{t("nav.blog")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            The Lanka Luxe <span className="text-[#C8A45D]">Journal.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed">
            {lang === "ko"
              ? "스리랑카 5대 골프장 공략법, 한국인 여행자를 위한 실전 팁, 야생 사파리 이야기 등 현지 아틀리에가 전하는 칼럼입니다."
              : "Occasional dispatches, course guides, tea country histories and practical notes for discerning travellers."}
          </p>
        </Reveal>
      </section>

      {/* Featured Article Spotlight */}
      {featured && selectedCategory === "All" && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
          <div className="p-8 sm:p-10 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="relative aspect-[16/10] rounded-[1.75rem] overflow-hidden bg-slate-100 group">
                  <img
                    src={featured.image}
                    alt={tl(featured.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#081A33] shadow-sm">
                      {t("blog.featured")} • {featured.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4 text-left">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
                  <span>{featured.date}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#081A33] leading-snug">
                  <Link
                    href={`/blog/${featured.slug}`}
                    className="hover:text-[#C8A45D] transition-colors"
                  >
                    {tl(featured.title)}
                  </Link>
                </h2>

                <p className="text-sm text-slate-500 font-normal leading-relaxed">
                  {tl(featured.excerpt)}
                </p>

                <div className="pt-2">
                  <LuxuryButton
                    variant="pill"
                    href={`/blog/${featured.slug}`}
                    withArrow
                  >
                    {t("blog.read")}
                  </LuxuryButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Category Tabs & Search Bar */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between mb-6">
          <input
            type="text"
            placeholder={
              lang === "ko"
                ? "칼럼 제목 또는 주제 검색 (예: 골프, 사파리, 럭셔리)..."
                : "Search journal articles (e.g. Golf, Tea, Safari, Tips)..."
            }
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full sm:max-w-xs px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-[#081A33] placeholder:text-slate-400 focus:border-[#C8A45D] outline-none shadow-sm"
          />

          <div className="flex items-center justify-start flex-wrap gap-2 pb-2">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#0B1F3A] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section id="articles-grid" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20 scroll-mt-28">
        {dbError && posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-red-100">
            <p className="text-lg text-slate-700 font-medium mb-2">
              Content is temporarily unavailable.
            </p>
            <p className="text-sm text-slate-500">
              Please try again later.
            </p>
          </div>
        ) : !isLoaded && posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
            <div className="w-8 h-8 border-2 border-[#C8A45D] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Loading Journal Articles...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-lg text-slate-600 font-medium mb-2">
              {lang === "ko"
                ? "현재 등록된 칼럼이 없습니다."
                : "No journal articles published yet."}
            </p>
            <p className="text-sm text-slate-400">
              {lang === "ko"
                ? "새로운 여행 칼럼이 곧 업데이트됩니다."
                : "New luxury travel articles will be published soon."}
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <p className="text-lg text-slate-500 font-normal mb-4">
              {lang === "ko"
                ? "검색 조건에 맞는 칼럼이 없습니다."
                : "No articles match your search."}
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-xs uppercase tracking-widest text-[#C8A45D] underline font-semibold cursor-pointer"
            >
              {lang === "ko" ? "전체 칼럼 보기" : "Reset Filters"}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {paginatedPosts.map((post) => (
                <Reveal key={post.slug} variant="fade-up">
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredPosts.length}
              pageSize={ITEMS_PER_PAGE}
              itemLabel={lang === "ko" ? "칼럼" : "articles"}
              showRange
              scrollToId="articles-grid"
            />
          </>
        )}
      </section>
    </div>
  );
}
