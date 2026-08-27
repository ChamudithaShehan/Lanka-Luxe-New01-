import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { img, team } from "@/data/site";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import { Award, ShieldCheck, HeartHandshake, Compass, MapPin, Calendar } from "lucide-react";

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
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] mb-3 font-semibold">
            <Link to="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span>{t("nav.about")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            The Private Travel Atelier of <span className="text-[#C8A45D]">Sri Lanka.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed">
            {lang === "ko"
              ? "콜롬보와 서울을 기반으로, 가장 품격 있고 세심한 스리랑카 맞춤 여정을 설계하는 여행 전문가 그룹입니다."
              : "Founded on Galle Face Terrace in Colombo, Lanka Luxe Journeys exists to design singular Sri Lankan travel for guests who value nuance, discretion and authentic beauty."}
          </p>
        </Reveal>
      </section>

      {/* Why Choose Us & Storyteller Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Iroshan Photo Card */}
          <div className="lg:col-span-5">
            <Reveal variant="slide-left">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] group">
                <img
                  src={img.iroshan}
                  alt="Iroshan Jayawickrame - Explorer & Storyteller"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081A33]/85 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-6 left-6 right-6 text-white p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-semibold text-[#C8A45D] uppercase tracking-widest mb-1">
                    {lang === "ko" ? "스리랑카 탐험가 & 스토리텔러" : "Explorer & Master Storyteller"}
                  </p>
                  <h4 className="text-xl font-bold font-display text-white">
                    Iroshan Jayawickrame
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    History · Heritage · Hospitality · Storytelling
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Intro & Story */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <Reveal variant="slide-right">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D] block mb-2">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-[#081A33] leading-tight">
                Why Choose Lanka Luxe Journeys?
              </h2>
              <div className="w-12 h-1 bg-[#C8A45D] rounded-full my-4"></div>
              <div className="text-base text-slate-600 font-normal leading-relaxed space-y-5">
                <p>
                  At Lanka Luxe Journeys, we believe that travel is more than visiting places—it's about creating unforgettable memories, discovering authentic cultures, and experiencing Sri Lanka with comfort, style, and confidence.
                </p>
                <p>
                  Whether you're seeking a luxurious holiday, a romantic honeymoon, a family adventure, a golf getaway, or a tailor-made cultural journey, our experienced team is dedicated to designing every detail to match your interests and expectations.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-2 gap-4 text-xs text-slate-700">
                <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="text-[#C8A45D] font-display text-3xl font-bold mb-1">
                    18+ Years
                  </div>
                  <div className="text-slate-500 font-medium">Hospitality & Heritage Legacy</div>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="text-[#C8A45D] font-display text-3xl font-bold mb-1">
                    100%
                  </div>
                  <div className="text-slate-500 font-medium">Bespoke & Tailor-Made</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 Pillars Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D] block mb-2">
            The Lanka Luxe Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#081A33]">
            Crafted With Integrity & Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Reveal variant="fade-up" delay={0.1}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#081A33] mb-3">Personalized Travel Experiences</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                No two travelers are the same. We carefully craft each itinerary to suit your preferences, travel pace, and budget, ensuring a truly personal experience from the moment you arrive until your departure.
              </p>
            </div>
          </Reveal>
          
          <Reveal variant="fade-up" delay={0.2}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#081A33] mb-3">Local Expertise</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                Our in-depth knowledge of Sri Lanka allows us to introduce you to famous landmarks as well as hidden treasures. From ancient heritage sites and lush tea plantations to pristine beaches and breathtaking wildlife, we help you experience the island like a local.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.3}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#081A33] mb-3">Luxury with Authenticity</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                We combine premium comfort with genuine Sri Lankan hospitality. Stay in carefully selected hotels, enjoy exceptional dining, and discover authentic cultural experiences that make your journey truly unique.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.4}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#081A33] mb-3">Professional and Reliable Service</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                From airport transfers to accommodation, guided tours, transportation, and special experiences, we manage every aspect of your trip with professionalism and attention to detail, allowing you to relax and enjoy your holiday.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.5}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#081A33] mb-3">Flexible and Tailor-Made Itineraries</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                Whether you have a few days or several weeks, we create customized travel plans that perfectly fit your schedule and interests. Your journey is designed exclusively for you.
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.6}>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-6">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#081A33] mb-3">Passion for Excellence</h3>
              <p className="text-sm text-slate-500 leading-relaxed flex-1">
                Our commitment is to provide exceptional service, honest advice, and memorable experiences. We value every guest and strive to exceed expectations through personalized care and attention.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Outro Text Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="bg-gradient-to-br from-[#081A33] to-[#0B1F3A] rounded-[2.5rem] p-8 sm:p-14 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C8A45D]/10 rounded-full blur-3xl pointer-events-none"></div>
          <Reveal variant="fade-up">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D] block mb-3">
              Explore With Confidence
            </span>
            <h3 className="text-2xl sm:text-4xl font-display font-medium text-white mb-6 max-w-3xl mx-auto leading-tight">
              Explore Sri Lanka with <span className="text-[#C8A45D] italic font-serif">Confidence</span>
            </h3>
            <p className="text-sm sm:text-base text-slate-300 font-normal max-w-2xl mx-auto leading-relaxed mb-8">
              With Lanka Luxe Journeys, you can travel knowing that every detail has been thoughtfully planned. Our goal is to turn your dream holiday into an extraordinary experience filled with comfort, discovery, and unforgettable moments.
            </p>
            <div className="inline-block px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium text-[#C8A45D]">
              Choose Lanka Luxe Journeys — where luxury meets authentic Sri Lankan experiences.
            </div>
          </Reveal>
        </div>
      </section>

      {/* Leadership & Curators Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-100 mb-28">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="The Curators"
            title={
              <>
                Meet Our <span className="text-[#C8A45D]">Specialists</span>
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
                  <div className="text-xs text-[#C8A45D] font-semibold uppercase tracking-wider mb-3">
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
              Handpicked <span className="text-[#C8A45D]">Partner Estates</span>
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
              <Award className="w-6 h-6 text-[#C8A45D] mb-2" />
              <div className="text-sm font-bold text-[#081A33] mb-1">{hotel.name}</div>
              <div className="text-xs text-slate-400 font-normal">{hotel.loc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D] block mb-2">
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
