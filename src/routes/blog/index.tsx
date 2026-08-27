import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { posts, blogCategories } from "@/data/site";
import { BlogCard } from "@/components/BlogCard";
import { LuxuryButton } from "@/components/LuxuryButton";
import { Reveal } from "@/components/Reveal";
import { Calendar, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "The Journal | Lanka Luxe Journeys" },
      {
        name: "description",
        content:
          "Insider stories, golf guides, wildlife reports and luxury travel advice quietly written by our Colombo team.",
      },
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { t, tl, lang } = useI18n();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const featured = posts[0];

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <Reveal variant="fade-up">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#1E7B9E] mb-3 font-semibold">
            <Link to="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span>{t("nav.blog")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            The Lanka Luxe <span className="text-[#1E7B9E]">Journal.</span>
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
                  <Calendar className="w-3.5 h-3.5 text-[#1E7B9E]" />
                  <span>{featured.date}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#081A33] leading-snug">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: featured.slug }}
                    className="hover:text-[#1E7B9E] transition-colors"
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

      {/* Category Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
        <div className="flex items-center justify-start flex-wrap gap-2 pb-2">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#1E7B9E] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Reveal key={post.slug} variant="fade-up">
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
