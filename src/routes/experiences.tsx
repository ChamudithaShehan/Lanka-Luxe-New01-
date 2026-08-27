import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { experiences } from "@/data/site";
import { LuxuryButton } from "@/components/LuxuryButton";
import { Reveal } from "@/components/Reveal";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/experiences")({
  head: () => ({
    meta: [
      { title: "Signature Luxury Experiences | Lanka Luxe Journeys" },
      {
        name: "description",
        content:
          "Private wildlife safaris, reserved highland rail journeys, colonial tea planter bungalows, beach villas, and physician-led ayurveda in Sri Lanka.",
      },
    ],
  }),
  component: ExperiencesPage,
});

function ExperiencesPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();

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
            <span>{t("nav.experiences")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            Extraordinary Island <span className="text-[#1E7B9E]">Immersions.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed mb-8">
            {lang === "ko"
              ? "프라이빗 야생 사파리부터 고산지대 기차 여행, 차밭 방갈로와 바다 위 아유르베다까지 — 잊지 못할 스리랑카만의 순간들을 만듭니다."
              : "Private naturalists in the leopard reserves, reserved observation carriages through cloud forests, and dinner served alone on candlelit beaches."}
          </p>
        </Reveal>
      </section>

      {/* 6 In-Depth Experience Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 mb-28">
        {experiences.map((exp, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
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
                        <Sparkles className="w-3 h-3 text-[#1E7B9E]" />
                        Experience 0{idx + 1}
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
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#1E7B9E] block mb-1">
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
