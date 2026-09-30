"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Scalable i18n layer. Add a new language by extending `Lang`,
 * adding it to `LANGUAGES` and providing a dictionary in `dictionaries`.
 */
export const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "ko", label: "한국어", name: "한국어" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

/** Content strings authored per language (data layer). */
export type Localized = Partial<Record<Lang, string>> & { en: string };

const en = {
  "nav.home": "Home",
  "nav.about": "About Us",
  "nav.tours": "Tours",
  "nav.golf": "Golf Holidays",
  "nav.destinations": "Destinations",
  "nav.experiences": "Experiences",
  "nav.blog": "Blog",
  "nav.gallery": "Gallery",
  "nav.contact": "Contact",
  "cta.plan": "Plan Your Journey",
  "cta.explore": "Explore Journeys",
  "cta.custom": "Plan a Custom Trip",
  "cta.exploreJourney": "Explore Journey",
  "cta.createJourney": "Create My Journey",
  "cta.golf": "Explore Golf Holidays",
  "cta.planThis": "Plan This Journey",
  "cta.requestGolf": "Request a Golf Itinerary",
  "cta.viewAll": "View All Journeys",
  "hero.label": "Sri Lanka Private Travel",
  "hero.title1": "DISCOVER SRI LANKA",
  "hero.title2": "WITH A LOCAL EXPERT",
  "hero.text":
    "Private journeys, authentic experiences and thoughtfully crafted travel, personally designed around you.",
  "intro.eyebrow": "About Lanka Luxe Journeys",
  "intro.title": "Private Sri Lankan Journeys, Personally Crafted.",
  "intro.text":
    "Lanka Luxe Journeys is a Sri Lanka-based private travel company founded by Iroshan Jayawickrame, a professional tourist guide with more than 10 years of experience in Sri Lankan tourism.",
  "intro.text2":
    "With a Diploma in Archaeology & Culture Tourism and professional experience guiding international travellers, Iroshan brings together local knowledge, cultural understanding and personal service to create meaningful journeys across Sri Lanka. From heritage and wildlife to tea country, beaches, golf and wellness, each journey is thoughtfully designed around your interests, pace and travel style.",
  "why.eyebrow": "Our Philosophy",
  "why.title1": "Why Travel With",
  "why.title2": "Lanka Luxe Journeys?",
  "journeys.eyebrow": "Curated Collection",
  "journeys.title": "A Collection of Private Sri Lankan Journeys",
  "journeys.from": "From",
  "golf.eyebrow": "Golf Travel in Sri Lanka",
  "golf.title": "Discover Sri Lanka Through Golf, Scenery & Culture.",
  "golf.text":
    "Discover Sri Lanka through a unique combination of golf, scenery, culture and hospitality. We arrange private golf journeys for Korean and international travellers, including golf-course reservations, accommodation, transportation and sightseeing according to your preferences.",
  "exp.eyebrow": "Selected Experiences",
  "exp.title": "Thoughtfully Selected Experiences Across Sri Lanka",
  "dest.eyebrow": "The Island",
  "dest.title": "Explore Sri Lanka",
  "dest.best": "Best Experiences",
  "dest.stay": "Recommended stay",
  "reviews.eyebrow": "Guest Stories",
  "reviews.title": "Travellers Who Trusted Us",
  "custom.title1": "Your Sri Lanka.",
  "custom.title2": "Your Journey.",
  "custom.text":
    "Tell me about your travel dates, interests and preferred style of travel. I will personally review your request and prepare a tailored recommendation for your journey.",
  "contact.eyebrow": "Contact",
  "contact.title1": "Let's Plan",
  "contact.title2": "Your Sri Lankan Journey.",
  "contact.reassure":
    "Tell me about your travel dates, interests and preferred style of travel. I will personally review your request and prepare a tailored recommendation for your journey. Your enquiry will be personally reviewed and we will respond as soon as possible.",
  "form.name": "Full Name",
  "form.email": "Email",
  "form.whatsapp": "WhatsApp Number",
  "form.whatsappPlaceholder": "e.g. +82 10 1234 5678 or +94...",
  "form.kakao": "KakaoTalk ID",
  "form.kakaoPlaceholder": "e.g. your_kakao_id",
  "form.optional": "(Optional)",
  "form.package": "Tour Package",
  "form.packageFixed": "Pre-selected Journey (Fixed)",
  "form.packageFixedHint": "This consultation is dedicated to this specific itinerary and cannot be changed.",
  "form.bespokeCustom": "Custom / Bespoke Itinerary (No specific package)",
  "form.country": "Country",
  "form.dates": "Travel Dates",
  "form.travelers": "Number of Travelers",
  "form.interest": "Interested In",
  "form.message": "Message",
  "form.submit": "Send Inquiry",
  "form.sent": "Thank you — your inquiry has been received.",
  "form.sentDesc": "Your enquiry will be personally reviewed and we will respond as soon as possible.",
  "interest.golf": "Golf Holiday",
  "interest.luxury": "Luxury Tour",
  "interest.wildlife": "Wildlife",
  "interest.honeymoon": "Honeymoon",
  "interest.family": "Family Holiday",
  "interest.custom": "Custom Journey",
  "footer.desc":
    "Private Sri Lankan Journeys, Personally Crafted. Founded by Iroshan Jayawickrame · SLTDA Registered Guide C-1734 · 10+ Years in Sri Lankan Tourism.",
  "footer.explore": "Explore",
  "footer.destinations": "Popular Destinations",
  "footer.categories": "Tour Categories",
  "footer.contact": "Contact",
  "footer.newsletter": "Journal & Offers",
  "footer.newsletterText": "Occasional letters on Sri Lanka, quietly written. No noise.",
  "footer.subscribe": "Subscribe",
  "footer.rights": "© 2026 Lanka Luxe Journeys. All Rights Reserved.",
  "tours.title": "Tour Packages",
  "tours.filterAll": "All Tours",
  "tour.duration": "Duration",
  "tour.locations": "Locations",
  "tour.overview": "Overview",
  "tour.itinerary": "Day-by-Day Itinerary",
  "tour.included": "Included Services",
  "tour.excluded": "Not Included",
  "tour.hotels": "Hotels",
  "tour.transport": "Transport",
  "tour.optional": "Optional Experiences",
  "tour.gallery": "Gallery",
  "blog.title": "Sri Lanka Travel Journal",
  "blog.featured": "Featured",
  "blog.read": "Read Article",
  "gallery.eyebrow": "Visual Chronicles",
  "gallery.title": "Ceylon in Focus",
  "gallery.subtitle": "A curated visual anthology of private pool villas, ancient kingdoms, emerald tea hills, wild safaris and pristine coasts across Sri Lanka.",
  "gallery.all": "All Moments",
  "gallery.resorts": "Luxury Resorts",
  "gallery.heritage": "Heritage & Culture",
  "gallery.wildlife": "Wildlife & Safari",
  "gallery.beaches": "Coastal & Beaches",
  "gallery.highlands": "Highlands & Tea",
  "gallery.golf": "Scenic Golf",
  "gallery.footerLabel": "CEYLON IN FOCUS · EXPLORE OUR GALLERY",
  "gallery.viewAll": "View Full Gallery",
};

type Dict = typeof en;
type Key = keyof Dict;

const ko: Partial<Record<Key, string>> = {
  "nav.home": "홈",
  "nav.about": "회사 소개",
  "nav.tours": "투어",
  "nav.golf": "골프 여행",
  "nav.destinations": "여행지",
  "nav.experiences": "체험",
  "nav.blog": "블로그",
  "nav.gallery": "갤러리",
  "nav.contact": "문의",
  "cta.plan": "여행 계획하기",
  "cta.explore": "여행 둘러보기",
  "cta.custom": "맞춤 여행 문의",
  "cta.exploreJourney": "자세히 보기",
  "cta.createJourney": "나만의 여행 만들기",
  "cta.golf": "골프 여행 보기",
  "cta.planThis": "이 여행 문의하기",
  "cta.requestGolf": "골프 일정 요청하기",
  "cta.viewAll": "전체 여행 보기",
  "hero.label": "스리랑카 프라이빗 여행",
  "hero.title1": "스리랑카를 발견하다",
  "hero.title2": "현지 전문가와 함께.",
  "hero.text":
    "나만을 위해 섬세하게 설계된 프라이빗 맞춤 여정, 진정한 로컬 경험과 정성껏 기획된 여행.",
  "intro.eyebrow": "Lanka Luxe Journeys 소개",
  "intro.title": "정성을 다해 설계하는 프라이빗 스리랑카 여행.",
  "intro.text":
    "Lanka Luxe Journeys는 10년 이상의 스리랑카 관광 업계 경력을 가진 공인 전문 가이드 이로샨 자야위크라마(Iroshan Jayawickrame)가 설립한 스리랑카 현지 프라이빗 여행사입니다.",
  "intro.text2":
    "고고학 & 문화관광 디플로마(Diploma in Archaeology & Culture Tourism)와 해외 여행자들을 안내해 온 전문 경험을 바탕으로, 이로샨은 풍부한 현지 지식, 문화적 이해, 그리고 세심한 1:1 맞춤 서비스를 결합하여 스리랑카 전역에서 의미 있는 여정을 선사합니다. 문화유산과 야생 사파리부터 고산지대 차밭, 해변, 골프 및 웰니스까지 모든 여정은 고객님의 관심사와 여행 속도, 스타일에 맞추어 정성껏 설계됩니다.",
  "why.eyebrow": "저희의 약속",
  "why.title1": "왜",
  "why.title2": "Lanka Luxe Journeys 인가요?",
  "journeys.eyebrow": "엄선된 컬렉션",
  "journeys.title": "엄선된 프라이빗 스리랑카 여정",
  "journeys.from": "시작가",
  "golf.eyebrow": "스리랑카 골프 여행",
  "golf.title": "골프, 천혜의 자연과 문화가 어우러진 여정.",
  "golf.text":
    "골프, 천혜의 자연경관, 유구한 문화와 따뜻한 환대의 조화 속에서 스리랑카를 발견하세요. 한국인 및 글로벌 여행객을 위한 프라이빗 골프 여정을 제공하며, 선호하시는 일정에 맞춘 골프장 예약, 안락한 숙소, 전용 차량 및 관광 일정을 조율해 드립니다.",
  "exp.eyebrow": "엄선된 체험",
  "exp.title": "스리랑카 전역에서 엄선된 특별한 경험",
  "dest.eyebrow": "더 아일랜드",
  "dest.title": "스리랑카 탐험",
  "dest.best": "추천 체험",
  "dest.stay": "권장 체류",
  "reviews.eyebrow": "고객 후기",
  "reviews.title": "저희를 믿어주신 분들",
  "custom.title1": "당신의 스리랑카.",
  "custom.title2": "당신의 여정.",
  "custom.text":
    "여행 일정, 관심사, 선호하시는 여행 스타일을 알려주시면 직접 검토한 후 고객님만을 위한 맞춤 제안을 준비해 드리겠습니다.",
  "contact.eyebrow": "문의",
  "contact.title1": "스리랑카 여행을",
  "contact.title2": "함께 계획해요.",
  "contact.reassure":
    "여행 일정, 관심사, 선호하시는 여행 스타일을 알려주시면 직접 검토한 후 고객님만을 위한 맞춤 제안을 준비해 드리겠습니다. 문의 내용은 신속하고 정성껏 답변 드리겠습니다.",
  "form.name": "성함",
  "form.email": "이메일",
  "form.whatsapp": "WhatsApp 번호",
  "form.whatsappPlaceholder": "예: +82 10 1234 5678 또는 +94...",
  "form.kakao": "카카오톡 ID",
  "form.kakaoPlaceholder": "카카오톡 아이디 입력",
  "form.optional": "(선택)",
  "form.package": "투어 패키지",
  "form.packageFixed": "사전 선택된 여행 일정 (고정)",
  "form.packageFixedHint": "본 상담은 해당 패키지 전용 문의로, 일정이 고정되어 변경할 수 없습니다.",
  "form.bespokeCustom": "맞춤 자유 일정 (특정 패키지 미선택)",
  "form.country": "국가",
  "form.dates": "여행 일정",
  "form.travelers": "인원 수",
  "form.interest": "관심 분야",
  "form.message": "메시지",
  "form.submit": "문의 보내기",
  "form.sent": "감사합니다 — 문의가 접수되었습니다.",
  "form.sentDesc": "문의 내용을 직접 검토한 후 가능한 한 신속하게 답변 드리겠습니다.",
  "interest.golf": "골프 여행",
  "interest.luxury": "럭셔리 투어",
  "interest.wildlife": "야생동물",
  "interest.honeymoon": "허니문",
  "interest.family": "가족 여행",
  "interest.custom": "맞춤 여행",
  "footer.desc":
    "정성을 다해 설계하는 프라이빗 스리랑카 여행. 창립자: 이로샨 자야위크라마 · SLTDA 공인 가이드 C-1734 · 10년 이상의 스리랑카 관광 전문성.",
  "footer.explore": "둘러보기",
  "footer.destinations": "인기 여행지",
  "footer.categories": "투어 카테고리",
  "footer.contact": "연락처",
  "footer.newsletter": "저널 & 프로모션",
  "footer.newsletterText": "스리랑카에 관한 조용한 소식을 가끔 보내드립니다.",
  "footer.subscribe": "구독",
  "footer.rights": "© 2026 Lanka Luxe Journeys. All Rights Reserved.",
  "tours.title": "투어 패키지",
  "tours.filterAll": "전체 투어",
  "tour.duration": "기간",
  "tour.locations": "방문지",
  "tour.overview": "개요",
  "tour.itinerary": "일자별 일정",
  "tour.included": "포함 사항",
  "tour.excluded": "불포함 사항",
  "tour.hotels": "호텔",
  "tour.transport": "차량",
  "tour.optional": "선택 체험",
  "tour.gallery": "갤러리",
  "blog.title": "스리랑카 여행 저널",
  "blog.featured": "추천 기사",
  "blog.read": "기사 읽기",
  "gallery.eyebrow": "사진으로 만나는 실론",
  "gallery.title": "사진으로 만나는 스리랑카",
  "gallery.subtitle": "프라이빗 풀빌라, 고대 유적지, 에메랄드빛 차밭, 야생 사파리와 청정 해변까지 — 스리랑카의 찬란한 순간들을 감상하세요.",
  "gallery.all": "전체 사진",
  "gallery.resorts": "럭셔리 리조트",
  "gallery.heritage": "문화 & 유적",
  "gallery.wildlife": "야생 & 사파리",
  "gallery.beaches": "해변 & 휴양",
  "gallery.highlands": "고산지대 & 차밭",
  "gallery.golf": "시닉 골프",
  "gallery.footerLabel": "사진으로 만나는 스리랑카 · 갤러리 둘러보기",
  "gallery.viewAll": "전체 갤러리 보기",
};

const dictionaries: Record<Lang, Partial<Dict>> = { en, ko };

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: Key) => string;
  tl: (value: Localized | undefined) => string;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("llj-lang");
    if (stored === "en" || stored === "ko") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("llj-lang", l);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (key) => dictionaries[lang]?.[key] ?? en[key],
      tl: (value) => (value ? (value[lang] ?? value.en) : ""),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}

export function getCategoryLabel(cat: string, lang: Lang): string {
  if (!cat) return "";
  if (cat === "All") return lang === "ko" ? "전체 보기" : "All Journeys";
  if (lang === "ko") {
    switch (cat.toLowerCase().trim()) {
      case "signature journeys":
      case "luxury":
        return "시그니처 여정";
      case "golf & leisure":
      case "golf":
        return "골프 & 휴양";
      case "wildlife & nature":
      case "wildlife & safari":
      case "wildlife":
        return "사파리 & 야생";
      case "culture & heritage":
      case "culture":
        return "문화 & 유산";
      case "honeymoon & romance":
      case "honeymoon":
        return "허니문 & 로맨스";
      case "wellness & ayurveda":
      case "wellness":
        return "웰니스 & 아유르베다";
      case "family & group":
      case "family":
        return "가족 & 그룹";
      case "coastal & beaches":
      case "coastal":
      case "beaches":
        return "해변 & 휴양";
      case "highlands & tea":
      case "highlands":
        return "고산지대 & 차밭";
      case "scenic golf":
        return "시닉 골프";
      case "luxury resorts":
        return "럭셔리 리조트";
      default:
        return cat;
    }
  }
  return cat;
}
