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
  "hero.label": "Luxury Travel • Sri Lanka",
  "hero.title1": "DISCOVER SRI LANKA",
  "hero.title2": "with a local expert.",
  "hero.text":
    "Private journeys, authentic experiences and luxury travel, personally crafted around you.",
  "intro.eyebrow": "About Lanka Luxe Journeys",
  "intro.title": "Private Journeys, Personally Crafted.",
  "intro.text":
    "Lanka Luxe Journeys is a Sri Lanka based luxury travel company founded by Iroshan Jayawickrame, a professional tourist guide with more than 10 years of experience in the tourism industry. We specialize in private, tailor-made journeys for travelers who value comfort, authentic experiences and personal service.",
  "intro.text2":
    "From cultural exploration to wildlife, tea country, beaches, golf and wellness, every journey is carefully planned to match your interests and travel style. With local knowledge, attention to detail and a passion for Sri Lanka, our goal is to create meaningful and unforgettable experiences for every guest.",
  "why.eyebrow": "Our Philosophy",
  "why.title1": "Why Travel With",
  "why.title2": "Lanka Luxe Journeys?",
  "journeys.eyebrow": "Curated Collection",
  "journeys.title": "Signature Journeys",
  "journeys.from": "From",
  "golf.eyebrow": "Golf Tourism Specialists",
  "golf.title": "Play the World's Most Scenic Golf Journey.",
  "golf.text":
    "Sri Lanka is a hidden gem for golf lovers. Play on world-class golf courses surrounded by breathtaking landscapes, enjoy warm hospitality and discover the beauty of our island. We specialize in golf holidays for Korean and international guests, including tee time reservations, comfortable stays and luxury transport.",
  "exp.eyebrow": "Immersion",
  "exp.title": "Luxury Experiences",
  "dest.eyebrow": "The Island",
  "dest.title": "Explore Sri Lanka",
  "dest.best": "Best Experiences",
  "dest.stay": "Recommended stay",
  "reviews.eyebrow": "Guest Stories",
  "reviews.title": "Travellers Who Trusted Us",
  "custom.title1": "Your Sri Lanka.",
  "custom.title2": "Your Journey.",
  "custom.text":
    "Tell us how you want to travel and our experts will create a personalized Sri Lankan experience exclusively for you.",
  "contact.eyebrow": "Contact",
  "contact.title1": "Let's Plan",
  "contact.title2": "Your Sri Lankan Journey.",
  "contact.reassure":
    "Our travel specialists will get back to you with a personalized recommendation within 24 hours.",
  "form.name": "Full Name",
  "form.email": "Email",
  "form.country": "Country",
  "form.dates": "Travel Dates",
  "form.travelers": "Number of Travelers",
  "form.interest": "Interested In",
  "form.message": "Message",
  "form.submit": "Send Inquiry",
  "form.sent": "Thank you — your inquiry has been received.",
  "form.sentDesc": "A Lanka Luxe specialist will contact you shortly.",
  "interest.golf": "Golf Holiday",
  "interest.luxury": "Luxury Tour",
  "interest.wildlife": "Wildlife",
  "interest.honeymoon": "Honeymoon",
  "interest.family": "Family Holiday",
  "interest.custom": "Custom Journey",
  "footer.desc":
    "Lanka Luxe Journeys is a Sri Lanka based luxury travel company founded by Iroshan Jayawickrame, a professional tourist guide with more than 10 years of experience in the tourism industry (SLTDA Licence: C-1734).",
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
  "blog.title": "The Journal",
  "blog.featured": "Featured",
  "blog.read": "Read Article",
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
  "hero.label": "럭셔리 여행 • 스리랑카",
  "hero.title1": "스리랑카를",
  "hero.title2": "현지 전문가와 함께.",
  "hero.text":
    "나만을 위해 섬세하게 설계된 프라이빗 럭셔리 여정, 진정한 스리랑카를 현지 전문가와 함께 경험하세요.",
  "intro.eyebrow": "랑카 룩스 저니스 소개",
  "intro.title": "나만을 위한 특별한 맞춤 여정.",
  "intro.text":
    "Lanka Luxe Journeys는 10년 이상의 관광 업계 경력을 가진 공인 전문 가이드 이로샨 자야위크라마(Iroshan Jayawickrame)가 설립한 스리랑카 럭셔리 여행사입니다. 편안함과 진정한 경험, 세심한 1:1 서비스를 소중히 여기는 여행자를 위한 프라이빗 맞춤 여행을 전문으로 합니다.",
  "intro.text2":
    "문화 유적 탐방부터 야생 사파리, 차밭, 해변, 골프 및 웰니스까지 고객의 관심사와 여행 스타일에 맞춰 세심하게 기획합니다. 현지 전문성과 디테일에 대한 집념으로 모든 고객에게 잊지 못할 감동을 선사합니다.",
  "why.eyebrow": "저희의 약속",
  "why.title1": "왜",
  "why.title2": "Lanka Luxe Journeys 인가요?",
  "journeys.eyebrow": "엄선된 컬렉션",
  "journeys.title": "시그니처 여행",
  "journeys.from": "시작가",
  "golf.eyebrow": "골프 여행 전문",
  "golf.title": "세계에서 가장 아름다운 골프 여정.",
  "golf.text":
    "스리랑카는 골프 애호가를 위한 숨겨진 보석입니다. 숨 막히는 자연경관 속 세계적인 수준의 코스에서 플레이하고, 따뜻한 환대와 함께 섬의 아름다움을 발견하세요. 티타임 예약부터 안락한 숙소, 최고급 전용 차량까지 한국인 및 글로벌 고객을 위한 프리미엄 골프 휴양을 전문으로 합니다.",
  "exp.eyebrow": "몰입",
  "exp.title": "럭셔리 체험",
  "dest.eyebrow": "더 아일랜드",
  "dest.title": "스리랑카 탐험",
  "dest.best": "추천 체험",
  "dest.stay": "권장 체류",
  "reviews.eyebrow": "고객 후기",
  "reviews.title": "저희를 믿어주신 분들",
  "custom.title1": "당신의 스리랑카.",
  "custom.title2": "당신의 여정.",
  "custom.text":
    "원하시는 여행 스타일을 알려주시면 전문가가 고객만을 위한 맞춤 일정을 만들어 드립니다.",
  "contact.eyebrow": "문의",
  "contact.title1": "스리랑카 여행을",
  "contact.title2": "함께 계획해요.",
  "contact.reassure": "여행 전문가가 24시간 이내에 맞춤 제안을 보내드립니다.",
  "form.name": "성함",
  "form.email": "이메일",
  "form.country": "국가",
  "form.dates": "여행 일정",
  "form.travelers": "인원 수",
  "form.interest": "관심 분야",
  "form.message": "메시지",
  "form.submit": "문의 보내기",
  "form.sent": "감사합니다 — 문의가 접수되었습니다.",
  "form.sentDesc": "담당 전문가가 곧 연락드리겠습니다.",
  "interest.golf": "골프 여행",
  "interest.luxury": "럭셔리 투어",
  "interest.wildlife": "야생동물",
  "interest.honeymoon": "허니문",
  "interest.family": "가족 여행",
  "interest.custom": "맞춤 여행",
  "footer.desc":
    "Lanka Luxe Journeys는 10년 이상의 관광 업계 경력을 가진 전문 관광 가이드 이로샨 자야위크라마가 설립한 스리랑카 럭셔리 여행사입니다 (SLTDA 등록 번호: C-1734).",
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
  "blog.title": "저널",
  "blog.featured": "추천 기사",
  "blog.read": "기사 읽기",
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
