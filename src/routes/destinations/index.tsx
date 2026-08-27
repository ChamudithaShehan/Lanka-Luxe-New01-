import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { destinations } from "@/data/site";
import { DestinationCard } from "@/components/DestinationCard";
import { InteractiveSriLankaMap } from "@/components/InteractiveSriLankaMap";
import { SectionHeader } from "@/components/SectionHeader";
import { LuxuryButton } from "@/components/LuxuryButton";
import { Reveal } from "@/components/Reveal";
import { useInquiry } from "@/lib/inquiry-context";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Sri Lanka Destinations Guide | Lanka Luxe Journeys" },
      {
        name: "description",
        content:
          "Explore the regions of Sri Lanka: Colombo, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala, Galle, Bentota and Trincomalee.",
      },
    ],
  }),
  component: DestinationsIndexPage,
});

function DestinationsIndexPage() {
  const { t, lang } = useI18n();
  const { openInquiry } = useInquiry();
  const [selectedRegion, setSelectedRegion] = useState("All");

  const regions = [
    "All",
    "Cultural Triangle",
    "Hill Country",
    "South Coast",
    "West Coast",
    "Southern Wilderness",
    "East Coast",
  ];

  const filtered =
    selectedRegion === "All"
      ? destinations
      : destinations.filter((d) =>
          d.region.toLowerCase().includes(selectedRegion.toLowerCase()),
        );

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
            <span>{t("nav.destinations")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            The Island of <span className="text-[#1E7B9E]">Serendipity.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed mb-8">
            {lang === "ko"
              ? "유네스코 고대 유적지, 안개 낀 고산지대 차밭, 표범이 서식하는 사파리 국립공원, 황금빛 남부 해안까지 — 스리랑카의 보석 같은 여행지들을 만나보세요."
              : "Nine distinctive regions across the teardrop island — fifth-century sky fortresses, 6,000-foot tea estates, leopard reserves, and 17th-century coral-stone ramparts."}
          </p>
        </Reveal>
      </section>

      {/* Interactive Map Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <SectionHeader
          eyebrow="Interactive Atlas"
          title={
            <>
              Interactive Island <span className="text-[#1E7B9E]">Map</span>
            </>
          }
          subtitle={
            lang === "ko"
              ? "지도의 각 지역 핀을 선택하여 대표 명소와 추천 체류 기간을 확인하세요."
              : "Hover and click pins across the island to inspect highlights and travel pairings."
          }
        />
        <InteractiveSriLankaMap />
      </section>

      {/* Destination Grid with Filter */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <SectionHeader
          eyebrow="Directory"
          title={
            <>
              All Island <span className="text-[#1E7B9E]">Destinations</span>
            </>
          }
        />

        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-5 py-2.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedRegion === reg
                  ? "bg-[#1E7B9E] text-white shadow-sm"
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
