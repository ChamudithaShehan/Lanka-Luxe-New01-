import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { img, team } from "@/data/site";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { Award, ShieldCheck, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Lanka Luxe Journeys" },
      {
        name: "description",
        content:
          "Meet the curators and founders behind Lanka Luxe Journeys — a Colombo-based private travel atelier designing bespoke itineraries across Sri Lanka.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, tl, lang } = useI18n();
  const { openInquiry } = useInquiry();

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Hero Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <Reveal variant="fade-up">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#1E7B9E] mb-3 font-semibold">
            <Link to="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span>{t("nav.about")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            The Private Travel Atelier of <span className="text-[#1E7B9E]">Sri Lanka.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed">
            {lang === "ko"
              ? "콜롬보와 서울을 기반으로, 가장 품격 있고 세심한 스리랑카 맞춤 여정을 설계하는 여행 전문가 그룹입니다."
              : "Founded on Galle Face Terrace in Colombo, Lanka Luxe Journeys exists to design singular Sri Lankan travel for guests who value nuance, discretion and authentic beauty."}
          </p>
        </Reveal>
      </section>

      {/* Atelier Story Composite */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-left">
            <Reveal variant="slide-left">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#1E7B9E]">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#081A33] leading-tight">
                {lang === "ko"
                  ? "정형화된 패키지가 아닌, 한 사람만을 위한 여정"
                  : "We Do Not Sell Fixed Tours. We Write Itineraries."}
              </h2>

              <p className="text-base text-slate-600 font-normal leading-relaxed">
                {lang === "ko"
                  ? "저희는 뻔한 단체 관광을 진행하지 않습니다. 고객 한 분 한 분의 취향, 속도, 동행자의 특성에 맞춰 출발일과 동선, 숙소, 차량, 가이드를 백지에서부터 설계합니다."
                  : "Every journey begins with a conversation. We ask about your preferred pace, what you enjoy having for breakfast, whether you'd like your tee times at sunrise or late afternoon, and which wildlife encounters matter most."}
              </p>

              <p className="text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "18년간 쌓아온 스리랑카 전역의 특급 호텔, 개인 빌라, 챔피언십 골프장, 국립공원 내추럴리스트와의 끈끈한 네트워크를 통해 차원이 다른 특별함을 선사합니다."
                  : "Because our team lives and works here, we have personal relationships with every general manager, golf secretary, and chief naturalist on the island. When our guests arrive, they are welcomed as old friends."}
              </p>

              <div className="pt-4 grid grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="text-[#1E7B9E] font-display text-3xl font-bold mb-1">
                    18 Years
                  </div>
                  <div className="text-slate-500 font-medium">Luxury Hospitality Legacy</div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="text-[#1E7B9E] font-display text-3xl font-bold mb-1">
                    100%
                  </div>
                  <div className="text-slate-500 font-medium">Private & Bespoke Routes</div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal variant="slide-right">
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
                <img
                  src={img.resort}
                  alt="Lanka Luxe Atelier Luxury Escape"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Leadership & Curators Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100 mb-28">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="The Curators"
            title={
              <>
                Meet Our <span className="text-[#1E7B9E]">Specialists</span>
              </>
            }
            subtitle={
              lang === "ko"
                ? "각 분야 최고의 전문가들이 고객님의 일정을 직접 전담합니다."
                : "The journey designers, golf directors, and naturalists overseeing your stay."
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <Reveal key={member.name} variant="fade-up" delay={i * 0.1}>
                <div className="p-6 rounded-[1.75rem] bg-[#F9FAFB] border border-slate-100 hover:shadow-md transition-all duration-300 flex flex-col h-full group">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-slate-200">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#081A33] mb-1">{member.name}</h3>
                  <div className="text-xs text-[#1E7B9E] font-semibold uppercase tracking-wider mb-3">
                    {tl(member.role)}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed flex-1">
                    {tl(member.bio)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Hotels & Estates Network */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <SectionHeader
          eyebrow="Sanctuaries"
          title={
            <>
              Handpicked <span className="text-[#1E7B9E]">Partner Estates</span>
            </>
          }
          subtitle={
            lang === "ko"
              ? "저희가 직접 투숙하고 검증한 스리랑카 최고의 호텔 및 리조트 컬렉션입니다."
              : "Where our guests rest — colonial tea planter bungalows, cliffside sanctuaries, and private tented suites."
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          {[
            { name: "Ceylon Tea Trails", loc: "Hatton" },
            { name: "Cape Weligama", loc: "Weligama" },
            { name: "Wild Coast Tented", loc: "Yala" },
            { name: "Water Garden", loc: "Sigiriya" },
            { name: "Shangri-La", loc: "Colombo & Hambantota" },
            { name: "Amangalla", loc: "Galle Fort" },
          ].map((hotel, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-center items-center hover:border-slate-300 transition-colors"
            >
              <Award className="w-6 h-6 text-[#1E7B9E] mb-2" />
              <div className="text-sm font-bold text-[#081A33] mb-1">{hotel.name}</div>
              <div className="text-xs text-slate-400 font-normal">{hotel.loc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1E7B9E] block mb-2">
            Begin Your Story
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#081A33] mb-4">
            {lang === "ko"
              ? "스리랑카 전문가와 상담을 시작해 보세요."
              : "Speak With a Journey Designer Today."}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal mb-8 max-w-lg mx-auto leading-relaxed">
            {lang === "ko"
              ? "원하시는 여행 일정과 선호 사항을 알려주시면 24시간 이내에 맞춤 제안서를 준비해 드립니다."
              : "No obligations. Tell us how you dream of experiencing Sri Lanka and we will prepare a bespoke itinerary draft within 24 hours."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <LuxuryButton variant="pill" size="lg" onClick={() => openInquiry()} withArrow>
              {t("cta.plan")}
            </LuxuryButton>
            <LuxuryButton variant="outline" size="lg" href="/contact">
              {t("nav.contact")}
            </LuxuryButton>
          </div>
        </div>
      </section>
    </div>
  );
}
