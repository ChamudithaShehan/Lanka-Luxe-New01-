import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useInquiry } from "@/lib/inquiry-context";
import { img, team, golfCourses } from "@/data/site";
import { LuxuryButton } from "@/components/LuxuryButton";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import {
  Award,
  ShieldCheck,
  HeartHandshake,
  Compass,
  MapPin,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Globe2,
  Flag,
  FileCheck,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Lanka Luxe Journeys" },
      {
        name: "description",
        content:
          "Lanka Luxe Journeys is a Sri Lanka based luxury travel company founded by Iroshan Jayawickrame (SLTDA Licence: C-1734). 10+ years experience crafting tailor-made private tours, golf holidays, wildlife, and cultural journeys.",
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
      {/* 1. Hero Header & Company Description (Card A) */}
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

          <div className="max-w-4xl space-y-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            <p>
              {lang === "ko"
                ? "Lanka Luxe Journeys는 10년 이상의 관광 업계 경력을 가진 전문 관광 가이드 이로샨 자야위크라마(Iroshan Jayawickrame)가 설립한 스리랑카 현지 럭셔리 맞춤 여행사입니다."
                : "Lanka Luxe Journeys is a Sri Lanka based luxury travel company founded by Iroshan Jayawickrame, a professional tourist guide with more than 10 years of experience in the tourism industry."}
            </p>
            <p className="text-sm sm:text-base text-slate-500">
              {lang === "ko"
                ? "편안함과 진정한 로컬 경험, 세심한 1:1 개인 맞춤 서비스를 중시하는 여행자를 위한 프라이빗 여정을 전문으로 합니다. 문화 탐방부터 야생 사파리, 고산 차밭, 에메랄드빛 해변, 챔피언십 골프와 웰니스 힐링까지, 모든 여정은 고객님의 관심사와 여행 스타일에 맞춰 정성껏 설계됩니다."
                : "We specialize in private, tailor-made journeys for travelers who value comfort, authentic experiences and personal service. From cultural exploration to wildlife, tea country, beaches, golf and wellness, every journey is carefully planned to match your interests and travel style."}
            </p>
            <p className="text-sm sm:text-base text-slate-500 font-medium text-[#C8A45D]">
              {lang === "ko"
                ? "풍부한 현지 지식과 디테일에 대한 세심한 관심, 스리랑카에 대한 깊은 열정으로 모든 고객에게 평생 기억될 특별한 경험을 선사합니다."
                : "With local knowledge, attention to detail and a passion for Sri Lanka, our goal is to create meaningful and unforgettable experiences for every guest."}
            </p>
          </div>
        </Reveal>
      </section>

      {/* 2. My Story / Personal Intro (Card D) & Founder Profile */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Iroshan Photo Card */}
          <div className="lg:col-span-5">
            <Reveal variant="slide-left">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] group">
                <img
                  src={img.iroshan}
                  alt="Iroshan Jayawickrame - Founder of Lanka Luxe Journeys"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#081A33]/90 via-[#081A33]/30 to-transparent opacity-95" />
                <div className="absolute bottom-6 left-6 right-6 text-white p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10">
                  <p className="text-xs font-semibold text-[#C8A45D] uppercase tracking-widest mb-1">
                    {lang === "ko" ? "창립자 & 공인 전문 가이드" : "Founder & Licensed Tourist Guide"}
                  </p>
                  <h4 className="text-xl font-bold font-display text-white">
                    Iroshan Jayawickrame
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    SLTDA Licence: C-1734 · Diploma in Archaeology (Univ. of Kelaniya)
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span>10+ Years Experience</span>
                    <span className="text-[#C8A45D]">English & Korean</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: Personal Intro Story & Archaeology Heritage */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <Reveal variant="slide-right">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D] block mb-2">
                {lang === "ko" ? "창립자 인사말" : "My Story / Personal Intro"}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-medium text-[#081A33] leading-tight">
                {lang === "ko"
                  ? "스리랑카의 아름다움과 깊은 유산을 전합니다"
                  : "Welcoming You to Sri Lanka with Heart & Heritage"}
              </h2>
              <div className="w-12 h-1 bg-[#C8A45D] rounded-full my-4"></div>
              
              <div className="text-base text-slate-600 font-normal leading-relaxed space-y-4">
                <p>
                  {lang === "ko"
                    ? "안녕하세요, Lanka Luxe Journeys의 창립자 이로샨 자야위크라마(Iroshan Jayawickrame)입니다. 10년 이상의 관광 업계 경력을 바탕으로 전 세계 여행객들을 맞이하며 제 조국 스리랑카의 아름다움과 문화, 따뜻한 환대를 전해올 수 있었던 것은 저에게 큰 영광이었습니다."
                    : "I am Iroshan Jayawickrame, the founder of Lanka Luxe Journeys. With more than 10 years of experience in the tourism industry, I have had the privilege of welcoming travelers from around the world and showing them the beauty, culture and hospitality of my country."}
                </p>
                <p>
                  {lang === "ko"
                    ? "켈라니야 대학교 고고학 대학원 디플로마 배경을 통해 스리랑카의 유구한 역사와 찬란한 문화유산을 더욱 깊이 있고 의미 있게 공유해 드립니다."
                    : "My background in archaeology allows me to share the rich history and heritage of Sri Lanka in a deeper and more meaningful way."}
                </p>
                <p>
                  {lang === "ko"
                    ? "전문적이고 개인 맞춤형이며 잊지 못할 여정을 누리실 수 있도록, 모든 일정을 제가 직접 기획하고 총괄 관리합니다."
                    : "I personally design and manage every journey to ensure you receive a professional, personal and memorable experience."}
                </p>
              </div>

              {/* Trust & License Card (Card F) */}
              <div className="p-5 rounded-2xl bg-white border border-[#C8A45D]/30 shadow-sm flex items-start gap-4 mt-6">
                <div className="w-10 h-10 rounded-full bg-[#C8A45D]/15 text-[#C8A45D] flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#081A33]">
                    {lang === "ko" ? "공식 등록 및 공인 라이선스 여행 서비스" : "Trust & License Information"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    <strong>Registered Tourist Guide</strong> – Sri Lanka Tourism Development Authority (SLTDA)<br />
                    <strong>Guide Licence No:</strong> C-1734
                  </p>
                  <p className="text-xs text-[#C8A45D] font-medium mt-1">
                    {lang === "ko"
                      ? "고객님의 안전과 편안함, 최고의 만족이 언제나 저의 최우선 순위입니다."
                      : "Your safety, comfort and satisfaction are always my top priority."}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Qualifications & Professional Details (Card B) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D] block mb-2">
            {lang === "ko" ? "전문 자격 및 경력" : "Professional Credentials"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#081A33]">
            {lang === "ko" ? "검증된 전문성과 자격 사항" : "My Qualifications & Professional Details"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Reveal variant="fade-up" delay={0.05}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">10+ Years of Tourism Experience</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "스리랑카 관광 및 럭셔리 여행 분야에서 10년 이상의 풍부한 필드 경험을 보유하고 있습니다."
                  : "Over a decade of hands-on experience welcoming luxury, golf and cultural travelers from across the globe."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.1}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">SLTDA Registered Tourist Guide</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                <strong>Guide Licence No: C-1734</strong><br />
                {lang === "ko"
                  ? "스리랑카 관광개발청(SLTDA)에 공식 등록된 공인 전문 관광 가이드입니다."
                  : "Fully registered and licensed by the Sri Lanka Tourism Development Authority (SLTDA)."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.15}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">Diploma in Archaeology</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                <strong>University of Kelaniya</strong><br />
                {lang === "ko"
                  ? "켈라니야 대학교 고고학 대학원 디플로마 과정을 통해 역사적 깊이가 있는 해설을 제공합니다."
                  : "Postgraduate Institute of Archaeology, University of Kelaniya, bringing rich historic insights to your journeys."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.2}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">English & Korean Communication</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "영어 및 한국어로 직접 원활하게 소통하며 편안하고 신뢰할 수 있는 안내를 제공합니다."
                  : "I personally communicate in English and Korean to ensure a smooth, comfortable, and seamless experience."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.25}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">Luxury & Culture Specialization</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "럭셔리 맞춤 여행, 유네스코 문화유산 탐방, 야생 사파리 및 힐링 웰니스 관광에 특화되어 있습니다."
                  : "Specialized in luxury travel design, ancient culture, wildlife safaris, tea planter estates and wellness."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.3}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Flag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">Golf Tourism Specialist</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "스리랑카 5대 챔피언십 골프장 티타임 확정, 프리미엄 클럽 렌탈 및 단체 의전 서비스를 제공합니다."
                  : "Specialized in golf holidays for Korean and international guests across all 5 championship venues."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Our Service Philosophy (Card E) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D] block mb-2">
            {lang === "ko" ? "서비스 철학" : "Our Service Philosophy"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-medium text-[#081A33] mb-4">
            {lang === "ko" ? "신뢰와 정성으로 완성하는 여정" : "Crafted With Integrity & Excellence"}
          </h2>
          <div className="inline-block px-6 py-2 rounded-full bg-[#081A33] text-white text-xs sm:text-sm font-medium tracking-wide">
            {lang === "ko"
              ? "“우리는 단순히 여행을 계획하지 않습니다. 스리랑카에서 잊지 못할 추억을 빚어냅니다.”"
              : "“We don't just plan your trip, we craft your unforgettable memories in Sri Lanka.”"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Reveal variant="fade-up" delay={0.1}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "1. 개인 맞춤형 수제 여행" : "1. Personalized & Tailor-made Journeys"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "정형화된 패키지가 아닌, 고객의 속도, 취향, 예산에 맞추어 처음부터 새롭게 맞춤 설계합니다."
                  : "No fixed departures or rigid schedules. Every itinerary is crafted exclusively to suit your personal style and rhythm."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.2}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "2. 엄선된 숙소와 프리미엄 서비스" : "2. Handpicked Experiences & Quality Service"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "제가 직접 투숙하고 검증한 숙소, 체험, 서비스만을 신뢰를 담아 추천합니다."
                  : "I personally inspect and carefully select the experiences, hotels and services I recommend."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.3}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "3. 안락함, 안전 및 신뢰" : "3. Comfort, Safety & Trust"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "SLTDA 공인 자격과 최신형 럭셔리 차량 의전으로 여행의 전 과정을 안전하게 보호합니다."
                  : "Your safety, comfort and satisfaction are always my top priority, supported by registered licensing and private fleets."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.4}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "4. 진정한 현지 로컬 체험" : "4. Authentic Local Experiences"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "일반 관광객이 닿지 못하는 숨은 명소와 현지인의 따뜻한 문화를 진정성 있게 연결합니다."
                  : "Discover hidden gems, genuine cultural connections, and deeper historic stories not found in guidebooks."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.5}>
            <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-100 h-full flex flex-col hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "5. 지속 가능하고 책임감 있는 여행" : "5. Sustainable & Responsible Tourism"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {lang === "ko"
                  ? "스리랑카의 자연 환경과 유적을 보존하고 지역 사회와 상생하는 품격 있는 여행을 실천합니다."
                  : "Honoring wildlife habitats, empowering local artisans, and preserving the island's pristine heritage."}
              </p>
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={0.6}>
            <div className="bg-[#081A33] text-white p-7 rounded-3xl shadow-sm border border-white/10 h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#C8A45D]/20 text-[#C8A45D] flex items-center justify-center mb-5">
                  <Globe2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {lang === "ko" ? "1:1 한국어 & 영어 현지 케어" : "Dedicated Bilingual Care"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === "ko"
                    ? "여행 중 스리랑카 현지에서 세심한 1:1 케어를 제공하며, 영어와 한국어로 원활하고 편안하게 소통합니다."
                    : "Personal service and local support in Sri Lanka during your journey. I personally communicate in English and Korean to ensure a smooth and comfortable experience."}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 5. Golf Tourism Section (Card C) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5 text-left">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A45D]">
                {lang === "ko" ? "골프 관광 특화" : "GOLF TOURISM"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-display font-medium text-[#081A33] leading-tight">
                {lang === "ko"
                  ? "한국인 및 글로벌 여행객을 위한 프리미엄 골프 휴양"
                  : "Golf Tourism (For Korean & International Guests)"}
              </h2>
              <div className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3">
                <p>
                  {lang === "ko"
                    ? "스리랑카는 골프 애호가를 위한 숨겨진 보석입니다. 숨 막히는 자연경관 속 세계적인 수준의 골프 코스에서 플레이하고, 따뜻한 환대와 함께 우리 섬의 아름다움을 발견하세요."
                    : "Sri Lanka is a hidden gem for golf lovers. Play on world-class golf courses surrounded by breathtaking landscapes, enjoy warm hospitality and discover the beauty of our island."}
                </p>
                <p>
                  {lang === "ko"
                    ? "티타임 예약, 편안한 최고급 숙소, 럭셔리 전용 차량을 포함하여 한국인 및 글로벌 고객을 위한 골프 휴양을 전문으로 합니다."
                    : "We specialize in golf holidays for Korean and international guests, including tee time reservations, comfortable stays and luxury transport."}
                </p>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#081A33] mb-3">
                  {lang === "ko" ? "인기 5대 골프 코스:" : "Popular Golf Courses:"}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Colombo Golf Club</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Victoria Golf Club</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Nuwara Eliya Golf Club</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Shangri-La Golf Club Hambantota</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C8A45D]" />
                    <span>Koggala Golf Club</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <LuxuryButton variant="pill" href="/golf" withArrow>
                  {t("cta.golf")}
                </LuxuryButton>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[2rem] overflow-hidden border border-slate-100 shadow-md aspect-[4/3]">
                <img
                  src={img.golf}
                  alt="Victoria Golf Club Sri Lanka"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Leadership & Curators Team */}
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
                ? "스리랑카 현지 전문가들이 고객님의 일정을 직접 전담합니다."
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

      {/* 7. Partner Hotels & Estates Network */}
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
              ? "제가 직접 투숙하고 검증한 스리랑카 최고의 호텔 및 리조트 컬렉션입니다."
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

      {/* 8. Call to Action */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A45D] block mb-2">
            Begin Your Story
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#081A33] mb-4">
            {lang === "ko"
              ? "스리랑카 현지 전문가와 상담을 시작해 보세요."
              : "Speak With Founder Iroshan Jayawickrame Today."}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-normal mb-8 max-w-lg mx-auto leading-relaxed">
            {lang === "ko"
              ? "원하시는 여행 일정과 선호 사항을 알려주시면 24시간 이내에 세심한 맞춤 제안서를 준비해 드립니다."
              : "No obligations. Tell us how you dream of experiencing Sri Lanka and I will personally prepare a bespoke itinerary draft within 24 hours."}
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
