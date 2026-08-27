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
  "hero.title1": "Discover Sri Lanka",
  "hero.title2": "in Extraordinary Style.",
  "hero.text":
    "From world-class golf experiences and private luxury escapes to wildlife adventures and cultural journeys, Lanka Luxe Journeys creates unforgettable travel experiences designed around you.",
  "intro.eyebrow": "The House of Lanka Luxe",
  "intro.title": "Sri Lanka, Curated for You.",
  "intro.text":
    "We are a private travel atelier based in Colombo, designing journeys for discerning travellers who want more than an itinerary. Every route, villa, driver and dinner table is chosen by our own specialists — people who grew up on this island and know which hour the light is best at Sigiriya.",
  "intro.text2":
    "From tee times at Victoria to a private safari breakfast in Yala, we handle every detail quietly in the background so your only responsibility is to enjoy it.",
  "why.eyebrow": "Our Promise",
  "why.title1": "Why Travel With",
  "why.title2": "Lanka Luxe Journeys?",
  "journeys.eyebrow": "Curated Collection",
  "journeys.title": "Signature Journeys",
  "journeys.from": "From",
  "golf.eyebrow": "Golf Travel Specialists",
  "golf.title": "Play the World's Most Scenic Golf Journey.",
  "golf.text":
    "Five championship courses, from colonial fairways in Colombo to highland greens at 6,200 feet and an ocean-side Shangri-La links. Tee times, caddies, clubs and private transfers arranged end to end.",
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
    "A private travel atelier crafting bespoke luxury journeys across Sri Lanka for discerning travellers worldwide.",
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
  "hero.title2": "특별하게 경험하세요.",
  "hero.text":
    "세계적인 수준의 골프 여행부터 프라이빗 럭셔리 휴양, 야생동물 사파리와 문화 여행까지 — Lanka Luxe Journeys는 고객만을 위한 잊지 못할 여정을 설계합니다.",
  "intro.eyebrow": "랑카 룩스 소개",
  "intro.title": "당신을 위해 큐레이팅된 스리랑카.",
  "intro.text":
    "저희는 콜롬보에 기반을 둔 프라이빗 여행 아틀리에입니다. 모든 동선, 숙소, 기사, 식사 자리를 현지 전문가가 직접 선정합니다.",
  "intro.text2":
    "빅토리아 골프장의 티오프 시간부터 얄라의 프라이빗 사파리 조식까지, 모든 세부 사항을 조용히 준비해 드립니다.",
  "why.eyebrow": "저희의 약속",
  "why.title1": "왜",
  "why.title2": "Lanka Luxe Journeys 인가요?",
  "journeys.eyebrow": "엄선된 컬렉션",
  "journeys.title": "시그니처 여행",
  "journeys.from": "시작가",
  "golf.eyebrow": "골프 여행 전문",
  "golf.title": "세계에서 가장 아름다운 골프 여정.",
  "golf.text":
    "콜롬보의 클래식 코스부터 해발 1,900m 고지대 그린, 바다를 낀 샹그릴라 코스까지 5개 챔피언십 코스. 티타임, 캐디, 클럽, 프라이빗 차량까지 모두 준비해 드립니다.",
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
    "전 세계 고객을 위해 스리랑카 맞춤 럭셔리 여행을 설계하는 프라이빗 여행 아틀리에입니다.",
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
