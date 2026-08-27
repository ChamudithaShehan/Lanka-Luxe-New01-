import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { contact, img } from "@/data/site";
import { InquiryForm } from "@/components/InquiryForm";
import { SectionHeader } from "@/components/SectionHeader";
import { Reveal } from "@/components/Reveal";
import {
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Bespoke Journey Inquiry | Lanka Luxe Journeys" },
      {
        name: "description",
        content:
          "Contact the travel designers at Lanka Luxe Journeys. Inquire about private tours, golf escapes, and custom Sri Lanka itineraries.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t, lang } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q:
        lang === "ko"
          ? "스리랑카를 여행하기 가장 좋은 계절은 언제인가요?"
          : "When is the best time of year to visit Sri Lanka?",
      a:
        lang === "ko"
          ? "스리랑카는 1년 내내 여행하기 좋은 섬입니다. 11월~4월은 서부(콜롬보) 및 남부 해변(갈레, 벤토타, 얄라)이 가장 맑고 쾌적하며, 5월~9월은 동부 해안(트린코말리, 파시키다)이 최고의 시즌입니다. 고산지대 차밭은 연중 온화한 봄 날씨를 유지합니다."
          : "Sri Lanka is a year-round destination with two distinct seasonal patterns. The south and west coasts, along with the cultural triangle, are at their sunniest between November and April. From May to September, the eastern coast (Trincomalee and Pasikudah) offers pristine seas and calm weather.",
    },
    {
      q:
        lang === "ko"
          ? "한국인 여행자 비자(ETA) 절차는 어떻게 되나요?"
          : "How do visas and entry requirements work?",
      a:
        lang === "ko"
          ? "스리랑카 입국 전 온라인 전자여행허가(ETA)를 간단하게 신청하실 수 있습니다. 여권 유효기간은 6개월 이상 남아있어야 하며, 담당 컨시어지가 신청 절차를 친절히 안내해 드립니다."
          : "Most international travellers require an Electronic Travel Authorization (ETA) obtained easily online before departure. Our team provides step-by-step guidance for your visa processing upon booking.",
    },
    {
      q:
        lang === "ko"
          ? "골프 장비(클럽)를 직접 가져가야 하나요, 아니면 대여가 가능한가요?"
          : "Can I rent golf clubs or should I bring my own bag?",
      a:
        lang === "ko"
          ? "두 가지 모두 가능합니다. 본인의 클럽을 지참하실 경우 전용 밴 차량에 넉넉하게 적재하여 이동을 도와드리며, 현지에서 테일러메이드 및 캘러웨이 프리미엄 최신 클럽 세트 대여도 사전 예약해 드립니다."
          : "Both options are seamlessly arranged. If you bring your own clubs, our vehicles are specifically selected with ample baggage capacity for 4–8 golf bags. Alternatively, we provide pre-booked rental sets (TaylorMade and Callaway) at all championship venues.",
    },
    {
      q:
        lang === "ko"
          ? "전용 기사 및 차량은 어떤 등급으로 배정되나요?"
          : "What vehicles and chauffeur-guides are provided?",
      a:
        lang === "ko"
          ? "신형 메르세데스-벤츠 E/V 클래스 또는 토요타 알파드, 프리미엄 하이에이스 밴이 배정됩니다. 전담 기사는 다년간의 VIP 의전 경험과 우수한 영어를 구사하며, 요청 시 한국어 통역 가이드 동행도 가능합니다."
          : "All transfers are carried out in modern luxury fleets — Mercedes V-Class, Toyota Alphard or high-roof executive coaches with air conditioning, onboard Wi-Fi, and certified English/Korean-speaking chauffeur-guides.",
    },
    {
      q:
        lang === "ko"
          ? "한국어 상담 및 현지 한국어 지원이 가능한가요?"
          : "Is Korean language assistance available?",
      a:
        lang === "ko"
          ? "네, Lanka Luxe Journeys는 10년 이상의 경험을 갖춘 창립자 이로샨(Iroshan, SLTDA 라이선스 C-1734) 및 전담 코디네이터가 영어와 한국어로 원활하게 소통하며 24시간 실시간 맞춤 케어 서비스를 제공합니다. 카카오톡 및 WhatsApp, 전화로 언제든 편안하게 상담받으실 수 있습니다."
          : "Yes. Lanka Luxe Journeys founder Iroshan Jayawickrame and our dedicated coordinators personally communicate in both Korean and English, ensuring seamless communication and 24/7 on-the-ground support.",
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#F9FAFB] text-slate-800 min-h-screen">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <Reveal variant="fade-up">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C8A45D] mb-3 font-semibold">
            <Link to="/" className="hover:underline">
              {t("nav.home")}
            </Link>
            <span>/</span>
            <span>{t("nav.contact")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            Begin Planning Your <span className="text-[#C8A45D]">Journey.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed">
            {lang === "ko"
              ? "특별한 스리랑카 여행에 관한 모든 질문을 환영합니다. 전담 여행 디자이너가 24시간 이내에 맞춤 답변과 제안서를 전달해 드립니다."
              : "Tell us about the trip you envision. A dedicated journey designer in Colombo will reply with a thoughtful itinerary outline within 24 hours."}
          </p>
        </Reveal>
      </section>

      {/* Main Grid: Contact Channels (Left) + Form (Right) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Channels Cards (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.06)] space-y-6">
              <h2 className="text-2xl font-bold text-[#081A33] mb-2">
                {lang === "ko" ? "컨시어지 연락처" : "Direct Concierge Access"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "긴급 문의나 빠른 상담은 WhatsApp 또는 카카오톡으로 실시간 연락이 가능합니다."
                  : "For immediate assistance, reach our Colombo concierge team directly via WhatsApp, KakaoTalk or phone."}
              </p>

              <div className="space-y-4 pt-2 text-xs">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#25D366] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33] group-hover:text-[#25D366] transition-colors">
                      WhatsApp Direct Chat
                    </div>
                    <div className="text-slate-500">{contact.phone}</div>
                  </div>
                </a>

                {/* KakaoTalk */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    K
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33]">KakaoTalk (한국어 상담)</div>
                    <div className="text-slate-500">ID: <strong className="text-[#081A33]">{contact.kakao}</strong></div>
                  </div>
                </div>

                {/* Phone */}
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#C8A45D] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33] group-hover:text-[#C8A45D] transition-colors">
                      Telephone
                    </div>
                    <div className="text-slate-500">{contact.phone}</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#C8A45D] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33] group-hover:text-[#C8A45D] transition-colors">
                      Email
                    </div>
                    <div className="text-slate-500">{contact.email}</div>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33]">Colombo Headquarters</div>
                    <div className="text-slate-500">{contact.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <Reveal variant="fade-up">
              <InquiryForm variant="light" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
        <SectionHeader
          eyebrow="FAQ"
          title={
            <>
              Frequently Asked <span className="text-[#C8A45D]">Questions</span>
            </>
          }
          subtitle={
            lang === "ko"
              ? "스리랑카 럭셔리 여행과 골프 투어 준비에 필요한 핵심 안내입니다."
              : "Practical guidance on seasons, visas, golf logistics, and private chauffeur standards."
          }
        />

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-[#C8A45D] shrink-0" />
                    <span className="text-base sm:text-lg text-[#081A33] font-bold">
                      {faq.q}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#C8A45D] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 border-t border-slate-100 text-sm text-slate-500 font-normal leading-relaxed pl-14">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Showcase Visual Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-20">
        <Reveal variant="fade-up">
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.1)] border border-slate-200 group">
            <img
              src={img.showcase}
              alt="Lanka Luxe Journeys - Discover, Experience, Remember"
              className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-700"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
