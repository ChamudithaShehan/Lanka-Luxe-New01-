"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { useContentStore } from "@/lib/content-store";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { BlogCard } from "@/components/BlogCard";
import { Calendar, User, Sparkles } from "lucide-react";

export default function BlogDetailPage() {
  const rawParams = useParams();
  const slug = typeof rawParams?.slug === "string" ? rawParams.slug : Array.isArray(rawParams?.slug) ? rawParams.slug[0] : "";
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const { posts } = useContentStore();

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-28 px-4 text-center bg-[#F9FAFB] text-slate-800">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <LuxuryButton variant="pill" href="/blog">
          Return to Journal
        </LuxuryButton>
      </div>
    );
  }

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] font-semibold">
          <Link href="/" className="hover:underline">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:underline">
            {t("nav.blog")}
          </Link>
          <span>/</span>
          <span className="text-slate-500 truncate">{post.category}</span>
        </div>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <div className="inline-block text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-100 text-[#C8A45D] mb-4">
            {post.category}
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-medium text-[#081A33] leading-tight mb-6">
            {tl(post.title)}
          </h1>

          <div className="flex items-center justify-center gap-6 text-xs text-slate-400 border-y border-slate-200/80 py-3 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>Lanka Luxe Editorial</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] mb-12 bg-slate-100">
          <img
            src={post.image}
            alt={tl(post.title)}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Editorial Body Content */}
        <div className="max-w-none text-slate-600 font-normal leading-relaxed space-y-6 text-base sm:text-lg mb-16">
          <p className="text-xl sm:text-2xl text-[#081A33] font-medium leading-relaxed italic border-l-4 border-[#C8A45D] pl-6 py-2">
            "{tl(post.excerpt)}"
          </p>

          <p>
            {lang === "ko"
              ? "스리랑카는 면적 대비 세계에서 가장 다채로운 지형과 기후를 품고 있는 섬입니다. 아침에 1879년 식민지풍 골프 클럽에서 티오프를 하고, 오후에는 기차를 타고 해발 1,900m의 서늘한 차밭으로 이동할 수 있습니다."
              : "Sri Lanka has an extraordinary density of microclimates. Within a morning's drive, you can transition from colonial sea-level fairways to tea highlands at 6,200 feet where fires are lit every evening and mist rolls across the greens."}
          </p>

          <h2 className="text-2xl sm:text-3xl font-display font-medium text-[#081A33] pt-6">
            {lang === "ko" ? "현지 전문가의 조언" : "Insider Observations"}
          </h2>

          <p>
            {lang === "ko"
              ? "가장 중요한 것은 '이동의 질'입니다. 뻔한 관광 버스가 아닌 전용 기사가 운전하는 프리미엄 차량으로 이동할 때, 이동 시간 자체가 그림 같은 차밭과 폭포를 감상하는 여유로운 힐링의 시간이 됩니다."
              : "The difference between an ordinary journey and an extraordinary one lies in pacing and private access. Having a dedicated chauffeur-guide who knows when the elephant herds gather at Minneriya or how to secure dawn entry at Sigiriya transforms the entire experience."}
          </p>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs my-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8A45D] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === "ko" ? "아틀리에 팁" : "Atelier Recommendation"}</span>
            </div>
            <p className="text-sm text-slate-700 font-normal">
              {lang === "ko"
                ? "골프와 럭셔리 휴양을 함께 계획하신다면 최소 9~10일 일정을 추천드리며, 빅토리아 골프 리조트와 남부 샹그릴라 코스를 묶는 것이 가장 만족도가 높습니다."
                : "For golf itineraries, we recommend a minimum of 9 to 10 days to comfortably combine Victoria Golf Resort in Digana with the coastal Shangri-La Hambantota links and a safari detour."}
            </p>
          </div>

          <p>
            {lang === "ko"
              ? "스리랑카 럭셔리 여행에 대해 궁금한 점이 있으시다면 언제든 콜롬보 현지 팀에 문의해 주세요. 고객님의 일정에 맞춘 상세한 조언을 드립니다."
              : "Our Colombo team is always on hand to assist with route planning, private helicopter charters, and tee time reservations across the island."}
          </p>
        </div>

        {/* Author Bio & Inquire Box */}
        <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] mb-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D] block mb-1">
              Written by
            </span>
            <div className="text-xl font-bold text-[#081A33]">
              The Curators of Lanka Luxe Journeys
            </div>
            <div className="text-xs text-slate-400">
              Private Travel Atelier • Colombo, Sri Lanka
            </div>
          </div>

          <LuxuryButton
            variant="pill"
            onClick={() =>
              openInquiry({
                tourName: `Inquiry from Article: ${tl(post.title)}`,
                interest: "custom",
              })
            }
            withArrow
          >
            {t("cta.plan")}
          </LuxuryButton>
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 pt-16">
          <SectionHeader
            eyebrow="More From The Journal"
            title={
              <>
                Related <span className="text-[#C8A45D]">Articles</span>
              </>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((r) => (
              <BlogCard key={r.slug} post={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
