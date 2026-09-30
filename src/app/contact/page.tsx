"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useContentStore } from "@/lib/content-store";
import { img } from "@/data/site";
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

export default function ContactPage() {
  const { t, lang } = useI18n();
  const { contact } = useContentStore();
  const safeContact = contact || {
    phone: "",
    email: "",
    whatsapp: "",
    kakao: "",
    address: "",
  };
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
          ? "전용 기사 및 차량은 어떻게 준비되나요?"
          : "What vehicles and private transportation are arranged?",
      a:
        lang === "ko"
          ? "고객님의 여행 일정과 인원수, 편의 요구에 맞춰 쾌적하고 안전한 전용 차량(세단, 프리미엄 밴, 미니코치)과 숙련된 기사를 배차합니다. SLTDA 공인 가이드(C-1734)로서 여행 전 일정 동안 편안하고 안전한 이동을 보장합니다."
          : "Private transportation can be arranged according to your itinerary, group size and comfort requirements using clean, air-conditioned vehicles and experienced local drivers.",
    },
    {
      q:
        lang === "ko"
          ? "한국어 상담 및 현지 지원이 가능한가요?"
          : "Is English and Korean language support available?",
      a:
        lang === "ko"
          ? "네, Lanka Luxe Journeys는 창립자이자 SLTDA 공인 가이드(C-1734)인 이로샨 자야위크라마(Iroshan Jayawickrame)가 직접 관리합니다. 영어와 한국어로 소통하며, 여행 상담부터 일정 조율, 현지 맞춤 지원까지 편안하게 소통하실 수 있습니다."
          : "Yes. I communicate personally in English and Korean, helping Korean and international guests enjoy a smoother and more comfortable journey in Sri Lanka.",
    },
  ];

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
            <span>{t("nav.contact")}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-medium text-[#081A33] leading-tight mb-6">
            {lang === "ko" ? (
              <>
                스리랑카 맞춤 여행 문의 · <span className="text-[#C8A45D]">Plan Your Journey</span>
              </>
            ) : (
              <>
                Let's Plan Your <span className="text-[#C8A45D]">Sri Lankan Journey.</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-500 font-normal max-w-3xl leading-relaxed">
            {lang === "ko"
              ? "원하시는 여행 일정과 관심사, 선호하는 여행 스타일을 알려주세요. 문의 내용을 직접 검토한 후 가능한 한 신속하게 맞춤 제안을 드리겠습니다."
              : "Tell me about your travel dates, interests and preferred style of travel. I will personally review your request and prepare a tailored recommendation for your journey. Your enquiry will be personally reviewed and we will respond as soon as possible."}
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
                {lang === "ko" ? "직접 문의 및 상담" : "Personal Travel Support"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                {lang === "ko"
                  ? "빠른 상담이나 직접 문의는 WhatsApp 또는 카카오톡으로 언제든 편하게 연락 주실 수 있습니다."
                  : "Reach out directly via WhatsApp or KakaoTalk for personalized travel consultation and local advice."}
              </p>

              <div className="space-y-4 pt-2 text-xs">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${safeContact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#25D366] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33] group-hover:text-[#25D366] transition-colors">
                      Contact Us · WhatsApp
                    </div>
                    <div className="text-slate-500">{safeContact.phone}</div>
                  </div>
                </a>

                {/* KakaoTalk */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
                    K
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33]">문의하기 · KakaoTalk</div>
                    <div className="text-slate-500">ID: <strong className="text-[#081A33]">{safeContact.kakao}</strong></div>
                  </div>
                </div>

                {/* Phone */}
                <a
                  href={`tel:${safeContact.phone}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#C8A45D] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33] group-hover:text-[#C8A45D] transition-colors">
                      Telephone
                    </div>
                    <div className="text-slate-500">{safeContact.phone}</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${safeContact.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#C8A45D] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33] group-hover:text-[#C8A45D] transition-colors">
                      Email
                    </div>
                    <div className="text-slate-500">{safeContact.email}</div>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-[#C8A45D]/10 text-[#C8A45D] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-[#081A33]">Colombo Headquarters</div>
                    <div className="text-slate-500">{safeContact.address}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form (Right 7 Cols) */}
          <div className="lg:col-span-7">
            <Reveal variant="fade-up">
              <Suspense fallback={<InquiryForm variant="light" />}>
                <ContactInquiryForm />
              </Suspense>
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

function ContactInquiryForm() {
  const searchParams = useSearchParams();
  const tour = searchParams.get("tour") || searchParams.get("package") || undefined;
  return (
    <InquiryForm
      variant="light"
      initialTour={tour}
      isLocked={Boolean(tour)}
    />
  );
}
