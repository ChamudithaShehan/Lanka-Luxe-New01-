import type { Localized } from "@/lib/i18n";

import sigiriya from "@/assets/sigiriya.jpg";
import beach from "@/assets/beach.jpg";
import golf from "@/assets/golf.jpg";
import golf2 from "@/assets/golf2.jpg";
import wildlife from "@/assets/wildlife.jpg";
import tea from "@/assets/tea.jpg";
import resort from "@/assets/resort.jpg";
import train from "@/assets/train.jpg";
import culture from "@/assets/culture.jpg";
import colombo from "@/assets/colombo.jpg";
import kandy from "@/assets/kandy.jpg";
import galle from "@/assets/galle.jpg";
import ella from "@/assets/ella.jpg";
import honeymoon from "@/assets/honeymoon.jpg";
import wellness from "@/assets/wellness.jpg";
import aerial from "@/assets/aerial.jpg";
import iroshan from "@/assets/iroshan.jpg";
import showcase from "@/assets/showcase.jpg";
import logo from "@/assets/logo.png";

export const img = {
  sigiriya,
  beach,
  golf,
  golf2,
  wildlife,
  tea,
  resort,
  train,
  culture,
  colombo,
  kandy,
  galle,
  ella,
  honeymoon,
  wellness,
  aerial,
  iroshan,
  showcase,
  logo,
};

export const contact = {
  phone: "+94 77 123 4567",
  whatsapp: "94771234567",
  kakao: "@lankaluxe",
  email: "journeys@lankaluxe.com",
  address: "No. 42, Galle Face Terrace, Colombo 03, Sri Lanka",
};

export type Feature = { no: string; title: Localized; text: Localized };

export const whyUs: Feature[] = [
  {
    no: "01",
    title: { en: "Personalized & Tailor-Made Journeys", ko: "맞춤형 프라이빗 여정" },
    text: {
      en: "Every journey is carefully planned from a blank page to match your interests, pace and travel style.",
      ko: "정해진 일정 없이 고객의 취향과 속도에 맞추어 처음부터 새롭게 맞춤 설계합니다.",
    },
  },
  {
    no: "02",
    title: { en: "10+ Years Experience", ko: "10년 이상의 전문성" },
    text: {
      en: "10+ years of experience creating memorable journeys in Sri Lanka.",
      ko: "10년 이상의 전문 경험으로 스리랑카에서 잊지 못할 특별한 여정을 만듭니다.",
    },
  },
  {
    no: "03",
    title: { en: "Golf Tourism Specialists", ko: "골프 여행 전문" },
    text: {
      en: "Specializing in golf holidays for Korean and international guests, including tee time reservations, comfortable stays and luxury transport.",
      ko: "한국 및 글로벌 고객을 위한 5대 챔피언십 코스 티타임 예약, 편안한 숙소, 전용 밴 차량까지 완벽하게 제공합니다.",
    },
  },
  {
    no: "04",
    title: { en: "Handpicked Experiences & Hotels", ko: "엄선된 호텔과 특별한 경험" },
    text: {
      en: "I personally inspect and carefully select the experiences, hotels and services I recommend.",
      ko: "제가 직접 투숙하고 엄선한 숙소와 서비스만을 신뢰를 담아 추천합니다.",
    },
  },
  {
    no: "05",
    title: { en: "Comfort, Safety & Trust", ko: "편안함, 안전 및 신뢰" },
    text: {
      en: "Registered and licensed tourism service provider (SLTDA Licence: C-1734) with modern luxury chauffeur fleets and 24/7 dedicated support.",
      ko: "SLTDA 공인 가이드 라이선스(C-1734) 보유 및 최고급 전용 차량 의전으로 안전하고 편안한 여행을 약속합니다.",
    },
  },
  {
    no: "06",
    title: { en: "Personal Service & Local Support", ko: "현지 맞춤 케어 & 소통" },
    text: {
      en: "Personal service and local support in Sri Lanka during your journey. I personally communicate in English and Korean to ensure a smooth and comfortable experience.",
      ko: "여행 중 스리랑카 현지에서 세심한 지원을 제공하며, 영어와 한국어로 원활하고 편안하게 소통합니다.",
    },
  },
];

export type Tour = {
  slug: string;
  name: Localized;
  category: string;
  categories: string[];
  days: number;
  price: string;
  image: string;
  gallery: string[];
  locations: string[];
  short: Localized;
  overview: Localized;
  itinerary: { day: string; title: string; text: string }[];
  included: string[];
  excluded: string[];
  hotels: string[];
  transport: string;
  optional: string[];
};

const baseIncluded = [
  "Private chauffeur-guide and vehicle throughout",
  "Luxury accommodation with daily breakfast",
  "All entrance fees on the itinerary",
  "Airport meet & greet with fast-track assistance",
  "24/7 on-trip concierge in English and Korean",
  "Government taxes and service charges",
];

const baseExcluded = [
  "International flights",
  "Visa fees and travel insurance",
  "Lunches and dinners unless stated",
  "Personal expenses, spa and gratuities",
];

export const tours: Tour[] = [
  {
    slug: "luxury-sri-lanka-discovery",
    name: { en: "Luxury Sri Lanka Discovery", ko: "럭셔리 스리랑카 디스커버리" },
    category: "Luxury",
    categories: ["Luxury", "Culture"],
    days: 12,
    price: "USD 4,850",
    image: resort,
    gallery: [resort, sigiriya, tea, galle, train],
    locations: ["Colombo", "Sigiriya", "Kandy", "Nuwara Eliya", "Galle"],
    short: {
      en: "The grand tour — cultural triangle, hill country and the southern coast, all in private villas and heritage estates.",
      ko: "문화 삼각지대와 고산지대, 남부 해안까지 프라이빗 빌라와 헤리티지 호텔로 잇는 그랜드 투어.",
    },
    overview: {
      en: "Twelve unhurried days across the island's finest addresses. Climb Sigiriya before the crowds, take the observation carriage through tea country, and end with slow days behind the ramparts of Galle Fort.",
      ko: "12일간 섬 최고의 명소를 여유롭게 여행합니다. 이른 아침 시기리야 등반, 차밭을 지나는 기차 여행, 갈레 요새에서의 느긋한 마무리.",
    },
    itinerary: [
      { day: "01", title: "Arrival in Colombo", text: "Private transfer, evening tuk-tuk food trail through Pettah." },
      { day: "02", title: "Colombo to Sigiriya", text: "Dambulla cave temples en route, sunset from the estate pool." },
      { day: "03", title: "Sigiriya Rock", text: "Dawn ascent of the Lion Rock, afternoon village lake canoe." },
      { day: "04", title: "Minneriya", text: "Private jeep safari for the elephant gathering, bush dinner." },
      { day: "05", title: "Kandy", text: "Temple of the Tooth at evening puja, private Kandyan dance." },
      { day: "06", title: "Highland Rail", text: "First-class carriage to Nuwara Eliya, colonial estate check-in." },
      { day: "07", title: "Tea Country", text: "Factory tour with the estate manager, high tea at 6,200 ft." },
      { day: "08", title: "Ella & Yala", text: "Nine Arches Bridge, transfer to a luxury tented camp." },
      { day: "09", title: "Yala Safari", text: "Two game drives in search of the Sri Lankan leopard." },
      { day: "10", title: "Galle", text: "Fort walking tour with a heritage architect, sunset ramparts." },
      { day: "11", title: "Southern Coast", text: "Free day — surf, spa or a private catamaran sail." },
      { day: "12", title: "Departure", text: "Coastal transfer to Bandaranaike International Airport." },
    ],
    included: baseIncluded,
    excluded: baseExcluded,
    hotels: ["Cape Weligama", "Water Garden Sigiriya", "Ceylon Tea Trails", "Amangalla"],
    transport: "Private Mercedes V-Class with chauffeur-guide; first-class rail carriage Kandy–Nanu Oya.",
    optional: ["Helicopter transfer Colombo–Sigiriya", "Private chef dinner on the beach", "Hot air balloon over Dambulla"],
  },
  {
    slug: "ultimate-sri-lanka-golf-escape",
    name: { en: "Ultimate Sri Lanka Golf Escape", ko: "얼티밋 스리랑카 골프 에스케이프" },
    category: "Golf",
    categories: ["Golf", "Luxury"],
    days: 10,
    price: "USD 4,200",
    image: golf,
    gallery: [golf, golf2, tea, resort, colombo],
    locations: ["Colombo", "Digana", "Nuwara Eliya", "Hambantota"],
    short: {
      en: "Four championship courses, five-star stays and a chauffeur between every tee — designed with Korean golf groups in mind.",
      ko: "4개 챔피언십 코스와 5성급 숙소, 전 구간 전용 차량 — 한국 골프 그룹을 위한 일정.",
    },
    overview: {
      en: "Seven rounds across colonial, highland and ocean-side courses. Tee times are confirmed before you fly, caddies and clubs arranged, and every transfer is private. Korean-speaking coordination is available throughout.",
      ko: "콜롬보의 클래식 코스, 고산지대, 바닷가 코스에서 총 7라운드. 티타임은 출발 전 확정되며 캐디와 클럽도 준비됩니다. 한국어 응대 가능.",
    },
    itinerary: [
      { day: "01", title: "Arrival Colombo", text: "Fast-track arrival, welcome dinner at the club." },
      { day: "02", title: "Colombo Golf Club", text: "18 holes on the 1879 layout, afternoon city sights." },
      { day: "03", title: "Colombo", text: "Second round, optional caddie clinic and range session." },
      { day: "04", title: "Victoria Golf Resort", text: "Transfer to Digana, twilight nine beside the reservoir." },
      { day: "05", title: "Victoria", text: "Full 18 with lake views, evening at Kandy's Temple of the Tooth." },
      { day: "06", title: "Nuwara Eliya", text: "Highland round at 6,200 ft, colonial club lunch." },
      { day: "07", title: "To Hambantota", text: "Scenic transfer south, resort spa and practice range." },
      { day: "08", title: "Shangri-La Hambantota", text: "18 holes on the ocean-side course, sunset cocktails." },
      { day: "09", title: "Free / Optional", text: "Yala safari, whale watching or a final relaxed nine." },
      { day: "10", title: "Departure", text: "Private transfer to the airport." },
    ],
    included: [
      "7 rounds with confirmed tee times and green fees",
      "Caddies and golf cart hire",
      "Club rental if required (TaylorMade / Callaway)",
      ...baseIncluded,
    ],
    excluded: baseExcluded,
    hotels: ["Shangri-La Colombo", "Victoria Golf & Country Resort", "Grand Hotel Nuwara Eliya", "Shangri-La Hambantota"],
    transport: "Private coach or Mercedes V-Class with golf bag capacity; all club transfers included.",
    optional: ["Korean-speaking guide throughout", "Additional rounds at Eagles' Catalina", "Yala leopard safari add-on"],
  },
  {
    slug: "wildlife-and-luxury-adventure",
    name: { en: "Wildlife & Luxury Adventure", ko: "야생동물 & 럭셔리 어드벤처" },
    category: "Wildlife",
    categories: ["Wildlife", "Luxury", "Family"],
    days: 8,
    price: "USD 3,450",
    image: wildlife,
    gallery: [wildlife, aerial, tea, beach, sigiriya],
    locations: ["Wilpattu", "Sigiriya", "Yala", "Mirissa"],
    short: {
      en: "Leopards, elephants and blue whales — tracked with private naturalists and slept off in tented luxury.",
      ko: "표범, 코끼리, 대왕고래 — 전문 내추럴리스트와 함께하는 프라이빗 사파리와 럭셔리 텐트 숙박.",
    },
    overview: {
      en: "Three ecosystems in eight days, each with a dedicated naturalist and a private jeep so you never share a sighting.",
      ko: "8일간 세 개의 생태계를 전용 지프와 전담 가이드와 함께 탐험합니다.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Transfer north to Wilpattu, evening briefing with your naturalist." },
      { day: "02", title: "Wilpattu", text: "Full-day safari with bush breakfast among the villus." },
      { day: "03", title: "Sigiriya", text: "Rock fortress at dawn, afternoon at leisure." },
      { day: "04", title: "Minneriya", text: "Elephant gathering by private jeep." },
      { day: "05", title: "Yala", text: "Transfer south, first leopard drive at golden hour." },
      { day: "06", title: "Yala", text: "Dawn and dusk drives, sundowners in the bush." },
      { day: "07", title: "Mirissa", text: "Blue whale expedition by private boat, beach villa." },
      { day: "08", title: "Departure", text: "Coastal transfer to the airport." },
    ],
    included: ["Private jeep safaris with naturalist", "Park entrance fees", ...baseIncluded],
    excluded: baseExcluded,
    hotels: ["Wild Coast Tented Lodge", "Water Garden Sigiriya", "Cape Weligama"],
    transport: "Private vehicle plus dedicated 4x4 safari jeeps in each park.",
    optional: ["Photography hide session", "Private whale-watching charter", "Turtle hatchery evening"],
  },
  {
    slug: "romantic-sri-lanka-honeymoon",
    name: { en: "Romantic Sri Lanka Honeymoon", ko: "로맨틱 스리랑카 허니문" },
    category: "Honeymoon",
    categories: ["Honeymoon", "Luxury", "Wellness"],
    days: 9,
    price: "USD 3,980",
    image: honeymoon,
    gallery: [honeymoon, beach, tea, resort, train],
    locations: ["Kandy", "Ella", "Tangalle", "Bentota"],
    short: {
      en: "Tea bungalows, private plunge pools and dinner alone on the sand — a slow, romantic circuit of the south.",
      ko: "차밭 방갈로, 프라이빗 풀, 모래사장 위 단둘의 저녁 식사 — 남부의 느린 로맨틱 여정.",
    },
    overview: {
      en: "Designed for two. Fewer moves, longer stays, and a handful of quiet surprises we arrange without telling you.",
      ko: "두 사람을 위한 일정. 이동은 적게, 머무름은 길게, 그리고 몇 가지 서프라이즈.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Private transfer to a lakeside Kandy retreat." },
      { day: "02", title: "Kandy", text: "Botanical gardens, evening temple puja." },
      { day: "03", title: "Tea Country", text: "Rail journey to a private tea bungalow with a butler." },
      { day: "04", title: "Ella", text: "Nine Arches Bridge at sunrise, waterfall picnic." },
      { day: "05", title: "Tangalle", text: "Cliffside villa, spa ritual for two." },
      { day: "06", title: "Tangalle", text: "Private beach dinner under lanterns." },
      { day: "07", title: "Bentota", text: "River safari, sunset catamaran." },
      { day: "08", title: "Bentota", text: "Free day, couples ayurveda session." },
      { day: "09", title: "Departure", text: "Airport transfer with late checkout." },
    ],
    included: ["Honeymoon amenities and room upgrades where available", "One private beach dinner", ...baseIncluded],
    excluded: baseExcluded,
    hotels: ["Ceylon Tea Trails", "Amanwella", "Wild Coast Tented Lodge"],
    transport: "Private chauffeur-guide throughout, first-class rail in the hill country.",
    optional: ["Vow renewal on the beach", "Seaplane transfer to Bentota", "Private photographer half-day"],
  },
  {
    slug: "family-island-explorer",
    name: { en: "Family Island Explorer", ko: "패밀리 아일랜드 익스플로러" },
    category: "Family",
    categories: ["Family", "Wildlife", "Culture"],
    days: 10,
    price: "USD 3,150",
    image: train,
    gallery: [train, wildlife, beach, sigiriya, culture],
    locations: ["Negombo", "Sigiriya", "Kandy", "Bentota"],
    short: {
      en: "Elephants, trains, forts and warm shallow water — paced properly for children and grandparents alike.",
      ko: "코끼리, 기차, 요새, 잔잔한 바다 — 아이와 어른 모두에게 알맞은 속도의 여행.",
    },
    overview: {
      en: "Shorter drives, connecting rooms, and activities that keep everyone interested from six to seventy.",
      ko: "짧은 이동, 커넥팅 룸, 전 연령이 즐길 수 있는 액티비티.",
    },
    itinerary: [
      { day: "01", title: "Arrival Negombo", text: "Beachfront resort, easy first night." },
      { day: "02", title: "Sigiriya", text: "Village bullock cart ride and cooking class." },
      { day: "03", title: "Sigiriya", text: "Rock fortress climb, afternoon pool time." },
      { day: "04", title: "Minneriya", text: "Elephant safari by private jeep." },
      { day: "05", title: "Kandy", text: "Temple visit and a spice garden stop." },
      { day: "06", title: "Hill Country", text: "Scenic train ride with the family." },
      { day: "07", title: "Bentota", text: "River safari and turtle hatchery." },
      { day: "08", title: "Bentota", text: "Water sports and beach day." },
      { day: "09", title: "Galle", text: "Fort day trip, ice cream on the ramparts." },
      { day: "10", title: "Departure", text: "Airport transfer." },
    ],
    included: ["Family rooms or connecting rooms", "Child seats and guides trained with children", ...baseIncluded],
    excluded: baseExcluded,
    hotels: ["Jetwing Blue", "Water Garden Sigiriya", "Taj Bentota"],
    transport: "Private van with child seats, family rail carriage reservation.",
    optional: ["Private cricket coaching session", "Kayaking on the Bentota river", "Kids' cooking class"],
  },
  {
    slug: "ayurveda-wellness-retreat",
    name: { en: "Ayurveda & Wellness Retreat", ko: "아유르베다 & 웰니스 리트리트" },
    category: "Wellness",
    categories: ["Wellness", "Luxury"],
    days: 7,
    price: "USD 2,760",
    image: wellness,
    gallery: [wellness, tea, beach, resort, honeymoon],
    locations: ["Beruwala", "Kandy", "Tangalle"],
    short: {
      en: "A physician-led ayurvedic programme, yoga at dawn and a diet designed for your dosha.",
      ko: "전문의가 설계한 아유르베다 프로그램, 새벽 요가, 체질별 식단.",
    },
    overview: {
      en: "Seven days of consultation-led treatment in two of the island's most respected wellness houses.",
      ko: "스리랑카 최고의 웰니스 리조트 두 곳에서 진행되는 7일 프로그램.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Consultation with the resident ayurvedic physician." },
      { day: "02", title: "Programme", text: "Daily abhyanga, yoga and herbal steam." },
      { day: "03", title: "Programme", text: "Shirodhara and meditation by the sea." },
      { day: "04", title: "Kandy", text: "Herbal garden visit and temple meditation." },
      { day: "05", title: "Tangalle", text: "Transfer south, ocean-side treatment pavilion." },
      { day: "06", title: "Tangalle", text: "Closing consultation and personal home plan." },
      { day: "07", title: "Departure", text: "Airport transfer." },
    ],
    included: ["Full ayurvedic treatment programme", "Doctor consultations and dosha diet", ...baseIncluded],
    excluded: baseExcluded,
    hotels: ["Barberyn Reef Ayurveda Resort", "Santani Wellness", "Anantara Peace Haven"],
    transport: "Private chauffeur-guide throughout.",
    optional: ["Extended panchakarma week", "Private yoga instructor", "Silent retreat days"],
  },
  {
    slug: "cultural-triangle-in-depth",
    name: { en: "Cultural Triangle In Depth", ko: "문화 삼각지대 심층 여행" },
    category: "Culture",
    categories: ["Culture", "Luxury"],
    days: 8,
    price: "USD 2,980",
    image: culture,
    gallery: [culture, sigiriya, kandy, tea, colombo],
    locations: ["Anuradhapura", "Polonnaruwa", "Sigiriya", "Kandy"],
    short: {
      en: "Two thousand years of capitals, frescoes and monasteries, read by a resident archaeologist.",
      ko: "2천 년의 고대 수도와 벽화, 사원을 고고학자와 함께 둘러봅니다.",
    },
    overview: {
      en: "A scholarly route through the island's ancient kingdoms with privileged access and early-morning entries.",
      ko: "고대 왕국을 따라가는 학술적 여정. 이른 아침 입장과 특별 접근 포함.",
    },
    itinerary: [
      { day: "01", title: "Arrival", text: "Transfer to Anuradhapura, evening at the sacred Bo tree." },
      { day: "02", title: "Anuradhapura", text: "Full-day with an archaeologist by bicycle and car." },
      { day: "03", title: "Polonnaruwa", text: "Medieval capital, Gal Vihara at first light." },
      { day: "04", title: "Sigiriya", text: "Frescoes and the mirror wall before the heat." },
      { day: "05", title: "Dambulla", text: "Cave temples and a private monk-led meditation." },
      { day: "06", title: "Kandy", text: "Temple of the Tooth, artisan workshops." },
      { day: "07", title: "Kandy", text: "Peradeniya gardens and a Kandyan dance performance." },
      { day: "08", title: "Departure", text: "Transfer to Colombo airport." },
    ],
    included: ["Specialist archaeologist guide", "All UNESCO site fees", ...baseIncluded],
    excluded: baseExcluded,
    hotels: ["Ulagalla Resort", "Water Garden Sigiriya", "Kings Pavilion Kandy"],
    transport: "Private chauffeur-guide throughout.",
    optional: ["Sunrise balloon over the Cultural Triangle", "Private almsgiving ceremony"],
  },
  {
    slug: "bespoke-custom-journey",
    name: { en: "Bespoke Custom Journey", ko: "비스포크 맞춤 여행" },
    category: "Custom",
    categories: ["Custom", "Luxury"],
    days: 14,
    price: "On request",
    image: aerial,
    gallery: [aerial, resort, golf, wildlife, galle],
    locations: ["Anywhere in Sri Lanka"],
    short: {
      en: "Start with a blank page. Tell us the shape of the trip and we will draw it around you.",
      ko: "백지에서 시작합니다. 원하시는 여행의 모습을 알려주세요.",
    },
    overview: {
      en: "Our most requested service. A dedicated designer, unlimited revisions, and a finished itinerary within 48 hours of your brief.",
      ko: "전담 디자이너가 배정되며, 브리핑 후 48시간 이내에 일정안을 보내드립니다.",
    },
    itinerary: [
      { day: "01", title: "Brief", text: "A conversation about how you like to travel." },
      { day: "02", title: "Design", text: "First itinerary draft within 48 hours." },
      { day: "03", title: "Refine", text: "Unlimited revisions until it is right." },
      { day: "04", title: "Travel", text: "Concierge support from arrival to departure." },
    ],
    included: ["Dedicated travel designer", "Fully flexible structure", ...baseIncluded],
    excluded: baseExcluded,
    hotels: ["Chosen with you"],
    transport: "Private, helicopter and seaplane options available.",
    optional: ["Private jet arrival", "Villa buy-outs", "Event and wedding planning"],
  },
];

export const tourFilters = [
  "All",
  "Luxury",
  "Golf",
  "Wildlife",
  "Culture",
  "Honeymoon",
  "Family",
  "Wellness",
  "Custom",
];

export type GolfCourse = {
  name: string;
  location: string;
  image: string;
  holes: string;
  nights: number;
  rounds: number;
  hotel: string;
  text: Localized;
};

export const golfCourses: GolfCourse[] = [
  {
    name: "Colombo Golf Club",
    location: "Colombo",
    image: colombo,
    holes: "18 holes · Par 71",
    nights: 3,
    rounds: 2,
    hotel: "Shangri-La Colombo",
    text: {
      en: "Founded in 1879 and the tenth oldest club outside Britain. Flat, tree-lined and deceptively strategic in the city's heart.",
      ko: "1879년 설립된 영국 외 지역에서 10번째로 오래된 골프 클럽. 도심 속 전략적인 코스.",
    },
  },
  {
    name: "Victoria Golf & Country Resort",
    location: "Digana, Kandy",
    image: golf,
    holes: "18 holes · Par 73",
    nights: 3,
    rounds: 2,
    hotel: "Victoria Golf Resort Chalets",
    text: {
      en: "Ranked among Asia's finest. Fairways fall away toward the Victoria reservoir with the Knuckles range behind.",
      ko: "아시아 최고의 코스 중 하나. 빅토리아 저수지와 너클스 산맥을 배경으로 한 페어웨이.",
    },
  },
  {
    name: "Nuwara Eliya Golf Club",
    location: "Nuwara Eliya",
    image: tea,
    holes: "18 holes · Par 70",
    nights: 2,
    rounds: 1,
    hotel: "Grand Hotel Nuwara Eliya",
    text: {
      en: "An 1889 highland course at 6,200 feet, laid out between pines and eucalyptus in permanent spring weather.",
      ko: "1889년 조성된 해발 1,900m 고산 코스. 소나무와 유칼립투스 사이의 영원한 봄 날씨.",
    },
  },
  {
    name: "Shangri-La Hambantota Golf Resort",
    location: "Hambantota",
    image: golf2,
    holes: "18 holes · Par 70",
    nights: 3,
    rounds: 2,
    hotel: "Shangri-La Hambantota",
    text: {
      en: "The island's only resort course on the ocean, cut through scrub jungle where peacocks outnumber players.",
      ko: "바다를 낀 스리랑카 유일의 리조트 코스. 공작이 뛰노는 자연 그대로의 페어웨이.",
    },
  },
  {
    name: "Eagles' Catalina Golf Course",
    location: "Koggala",
    image: beach,
    holes: "9 holes · Par 36",
    nights: 2,
    rounds: 1,
    hotel: "Cape Weligama",
    text: {
      en: "A relaxed lakeside nine near Galle — the perfect closing round before the southern beaches.",
      ko: "갈레 인근 호숫가 9홀 코스. 남부 해변으로 향하기 전 마지막 라운드로 이상적입니다.",
    },
  },
];

export type Experience = { title: Localized; text: Localized; image: string };

export const experiences: Experience[] = [
  {
    title: { en: "Private Wildlife Safaris", ko: "프라이빗 야생 사파리" },
    text: { en: "Your own jeep, your own naturalist, and a bush breakfast nobody else is invited to.", ko: "전용 지프와 전담 가이드, 그리고 단독 부시 브렉퍼스트." },
    image: wildlife,
  },
  {
    title: { en: "Luxury Train Journeys", ko: "럭셔리 기차 여행" },
    text: { en: "Reserved observation carriages through the tea highlands to Ella.", ko: "차밭을 지나 엘라까지, 예약된 전망 객차." },
    image: train,
  },
  {
    title: { en: "Tea Country Escapes", ko: "차 산지 휴양" },
    text: { en: "Colonial planter bungalows with a butler, a fireplace and 6,000 feet of silence.", ko: "버틀러와 벽난로가 있는 식민지 시대 방갈로." },
    image: tea,
  },
  {
    title: { en: "Private Beach Retreats", ko: "프라이빗 비치 리트리트" },
    text: { en: "Cliffside villas, plunge pools and a stretch of sand with your name on it.", ko: "절벽 위 빌라와 프라이빗 비치." },
    image: beach,
  },
  {
    title: { en: "Cultural Experiences", ko: "문화 체험" },
    text: { en: "Almsgiving at dawn, temple drumming, and dinner in a 400-year-old walauwa.", ko: "새벽 탁발, 사원 북 공연, 400년 된 저택에서의 만찬." },
    image: culture,
  },
  {
    title: { en: "Ayurveda & Wellness", ko: "아유르베다 & 웰니스" },
    text: { en: "Physician-led programmes, dosha-matched menus and yoga above the ocean.", ko: "전문의 프로그램, 체질별 식단, 바다 위 요가." },
    image: wellness,
  },
];

export type Destination = {
  slug: string;
  name: Localized;
  region: string;
  image: string;
  short: Localized;
  long: Localized;
  best: string[];
  stay: string;
  /** approximate position on the stylised map, in % */
  x: number;
  y: number;
};

export const destinations: Destination[] = [
  {
    slug: "colombo",
    name: { en: "Colombo", ko: "콜롬보" },
    region: "West Coast",
    image: colombo,
    short: { en: "The island's cosmopolitan capital — colonial arcades, rooftop bars and a new skyline.", ko: "식민지풍 아케이드와 루프탑 바가 있는 코스모폴리탄 수도." },
    long: { en: "Most journeys begin here. Spend a night before heading inland: a Dutch Hospital dinner, a tuk-tuk food trail through Pettah, and a walk along Galle Face Green as the kites go up.", ko: "대부분의 여정이 시작되는 도시. 더치 호스피탈에서의 저녁, 페타의 길거리 음식 투어, 갈레 페이스 그린 산책." },
    best: ["Pettah street food trail", "Colombo Golf Club round", "Gangaramaya Temple", "Rooftop sunset at Galle Face"],
    stay: "1–2 nights",
    x: 26,
    y: 62,
  },
  {
    slug: "sigiriya",
    name: { en: "Sigiriya", ko: "시기리야" },
    region: "Cultural Triangle",
    image: sigiriya,
    short: { en: "A fifth-century sky palace on a 200-metre rock, surrounded by water gardens.", ko: "물의 정원에 둘러싸인 5세기 바위 궁전." },
    long: { en: "Climb before six and you will have the frescoes and the mirror wall almost to yourself. Below, some of the island's best estate hotels sit in the jungle around Kandalama.", ko: "이른 아침에 오르면 벽화와 미러월을 거의 독차지할 수 있습니다." },
    best: ["Dawn ascent of Lion Rock", "Dambulla cave temples", "Minneriya elephant safari", "Village lake canoe"],
    stay: "2–3 nights",
    x: 52,
    y: 40,
  },
  {
    slug: "kandy",
    name: { en: "Kandy", ko: "캔디" },
    region: "Hill Capital",
    image: kandy,
    short: { en: "The last royal capital, wrapped around a lake and the Temple of the Sacred Tooth Relic.", ko: "호수를 감싼 마지막 왕도이자 불치사가 있는 도시." },
    long: { en: "Evening puja at the Temple of the Tooth is the country's most atmospheric half hour. Stay on the hills above the lake and visit the Peradeniya gardens at opening.", ko: "불치사의 저녁 예불은 스리랑카에서 가장 인상적인 시간입니다." },
    best: ["Temple of the Tooth evening puja", "Peradeniya Botanical Gardens", "Kandyan dance performance", "Victoria golf round"],
    stay: "2 nights",
    x: 52,
    y: 52,
  },
  {
    slug: "nuwara-eliya",
    name: { en: "Nuwara Eliya", ko: "누와라 엘리야" },
    region: "Tea Country",
    image: tea,
    short: { en: "'Little England' at 6,200 feet — tea estates, log fires and an 1889 golf course.", ko: "해발 1,900m의 '리틀 잉글랜드' — 차밭, 벽난로, 1889년 골프 코스." },
    long: { en: "Cool mornings, mist in the valleys and planter bungalows where dinner is announced by a gong. The most restorative two nights on any Sri Lankan itinerary.", ko: "서늘한 아침과 안개 낀 계곡, 그리고 플랜터 방갈로에서의 만찬." },
    best: ["Tea factory with the estate manager", "Highland golf round", "Horton Plains at dawn", "High tea at the Grand"],
    stay: "2 nights",
    x: 55,
    y: 63,
  },
  {
    slug: "ella",
    name: { en: "Ella", ko: "엘라" },
    region: "Hill Country",
    image: ella,
    short: { en: "A green valley town famous for the Nine Arches Bridge and long mountain views.", ko: "나인 아치 브리지와 산 전망으로 유명한 초록빛 계곡 마을." },
    long: { en: "The rail approach from Nanu Oya is the finest train ride in Asia. Walk Little Adam's Peak at sunrise and let the afternoon go slowly.", ko: "나누오야에서 오는 기차 구간은 아시아 최고의 철도 여행입니다." },
    best: ["Nine Arches Bridge", "Little Adam's Peak sunrise", "Observation-carriage rail ride", "Ravana Falls"],
    stay: "2 nights",
    x: 62,
    y: 66,
  },
  {
    slug: "yala",
    name: { en: "Yala", ko: "얄라" },
    region: "Southern Wilderness",
    image: wildlife,
    short: { en: "The world's densest leopard population, plus elephants, sloth bears and tented luxury.", ko: "세계에서 표범 밀도가 가장 높은 국립공원." },
    long: { en: "Two drives a day, one at first light and one at dusk, from a tented camp on the park boundary where the ocean is audible at night.", ko: "새벽과 해질녘 하루 두 번의 게임 드라이브." },
    best: ["Leopard tracking drives", "Bush breakfast", "Kumana bird lagoon", "Sundowners in the wild"],
    stay: "2 nights",
    x: 66,
    y: 79,
  },
  {
    slug: "galle",
    name: { en: "Galle", ko: "갈레" },
    region: "South Coast",
    image: galle,
    short: { en: "A Dutch-built fort of coral stone, now full of galleries, ateliers and quiet hotels.", ko: "산호석으로 지은 네덜란드 요새. 갤러리와 부티크 호텔이 가득합니다." },
    long: { en: "Walk the ramparts at sunset, eat at a Peter Kuruvita table, and sleep inside the walls in a converted merchant house.", ko: "일몰 시간의 성벽 산책과 상인 저택을 개조한 호텔에서의 하룻밤." },
    best: ["Fort walk with a heritage architect", "Rampart sunset", "Gem and jewellery ateliers", "Koggala golf nine"],
    stay: "2–3 nights",
    x: 45,
    y: 86,
  },
  {
    slug: "bentota",
    name: { en: "Bentota", ko: "벤토타" },
    region: "West Coast",
    image: beach,
    short: { en: "Wide golden sand between a river and the sea — the island's classic resort beach.", ko: "강과 바다 사이의 넓은 황금빛 모래사장." },
    long: { en: "Geoffrey Bawa built here for a reason. River safaris in the morning, water sports at noon, and long flat sunsets.", ko: "아침 강 사파리, 낮 수상 스포츠, 그리고 긴 일몰." },
    best: ["Bentota river safari", "Brief Garden by Bawa", "Water sports", "Turtle hatchery"],
    stay: "2–3 nights",
    x: 33,
    y: 76,
  },
  {
    slug: "trincomalee",
    name: { en: "Trincomalee", ko: "트린코말리" },
    region: "East Coast",
    image: aerial,
    short: { en: "Calm turquoise bays, whale season from March, and one of the world's great natural harbours.", ko: "잔잔한 청록빛 해변과 3월부터 시작되는 고래 시즌." },
    long: { en: "The east comes into season when the south turns wet — May to September is the time for Nilaveli, Uppuveli and Pigeon Island.", ko: "남부가 우기일 때 동부는 최적의 시즌입니다." },
    best: ["Pigeon Island snorkelling", "Blue whale season", "Koneswaram Temple", "Nilaveli beach days"],
    stay: "3 nights",
    x: 72,
    y: 30,
  },
];

export type Testimonial = {
  quote: Localized;
  name: string;
  country: string;
  trip: string;
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    quote: {
      en: "Every detail of our Sri Lanka journey was perfectly arranged. From our private driver to the luxury hotels and unforgettable golf experiences, everything exceeded expectations.",
      ko: "스리랑카 여행의 모든 디테일이 완벽하게 준비되어 있었습니다. 전용 기사부터 럭셔리 호텔, 잊지 못할 골프까지 기대 이상이었습니다.",
    },
    name: "Ji-ho Park",
    country: "South Korea",
    trip: "Ultimate Golf Escape · 10 Days",
    image: golf,
  },
  {
    quote: {
      en: "We have travelled with the best agencies in Asia and this was the most thoughtful itinerary we have been given. The tea bungalow alone was worth the flight.",
      ko: "아시아 최고의 여행사들과 함께해 봤지만 가장 세심한 일정이었습니다.",
    },
    name: "Eleanor Whitfield",
    country: "United Kingdom",
    trip: "Luxury Discovery · 12 Days",
    image: tea,
  },
  {
    quote: {
      en: "Two leopards on the first drive, a private beach dinner on our anniversary, and a team that answered every message within minutes.",
      ko: "첫 게임 드라이브에서 표범 두 마리를 봤고, 기념일에는 프라이빗 비치 디너까지 준비되어 있었습니다.",
    },
    name: "Daniel & Rose Carter",
    country: "Australia",
    trip: "Wildlife & Luxury · 8 Days",
    image: wildlife,
  },
  {
    quote: {
      en: "Faultless organisation, excellent German-standard punctuality, and guides who genuinely knew their history. We are already planning the next trip.",
      ko: "완벽한 조직력과 정확한 시간 관리, 그리고 역사에 정통한 가이드.",
    },
    name: "Markus Hoffmann",
    country: "Germany",
    trip: "Cultural Triangle · 8 Days",
    image: sigiriya,
  },
];

export type TeamMember = { name: string; role: Localized; bio: Localized; image: string };

export const team: TeamMember[] = [
  {
    name: "Iroshan Jayawickrame",
    role: { en: "Founder & Licensed Tourist Guide (SLTDA)", ko: "창립자 & SLTDA 공인 관광 가이드" },
    bio: {
      en: "Founder of Lanka Luxe Journeys with 10+ years of experience. SLTDA Guide Licence No: C-1734, Diploma in Archaeology (University of Kelaniya). Specializing in luxury travel, culture, wildlife, golf & wellness.",
      ko: "10년 이상의 관광 분야 경력. SLTDA 공인 가이드(C-1734) 및 켈라니야 대학교 고고학 디플로마. 럭셔리 여행, 문화, 야생, 골프 & 웰니스 전문.",
    },
    image: iroshan,
  },
  {
    name: "Ji-eun Lee",
    role: { en: "Korean Market Coordinator", ko: "한국 시장 코디네이터" },
    bio: { en: "Ensuring flawless communication, itinerary support, and dedicated care for Korean travelers.", ko: "한국인 여행객을 위한 1:1 맞춤 소통과 일정 코디네이션을 지원합니다." },
    image: honeymoon,
  },
  {
    name: "Dinesh Fernando",
    role: { en: "Head of Golf Travel", ko: "골프 여행 총괄" },
    bio: { en: "Single-figure handicap and a personal relationship with every club secretary on the island.", ko: "싱글 핸디캡 골퍼이자 전국 골프장과의 네트워크 보유." },
    image: golf2,
  },
  {
    name: "Amara Perera",
    role: { en: "Wildlife & Wellness Curator", ko: "야생 & 웰니스 큐레이터" },
    bio: { en: "Trained naturalist who still leads a handful of safaris each season.", ko: "정식 내추럴리스트로 매 시즌 직접 사파리를 인솔합니다." },
    image: wildlife,
  },
];

export type Post = {
  slug: string;
  title: Localized;
  category: string;
  date: string;
  excerpt: Localized;
  image: string;
};

export const posts: Post[] = [
  {
    slug: "golf-in-sri-lanka-guide",
    title: { en: "A Golfer's Guide to Sri Lanka's Five Courses", ko: "스리랑카 5대 골프 코스 가이드" },
    category: "Golf in Sri Lanka",
    date: "12 March 2026",
    excerpt: { en: "From an 1879 colonial layout to an ocean-side Shangri-La — what to expect, and when to play.", ko: "1879년 클래식 코스부터 바닷가 샹그릴라까지, 언제 무엇을 플레이할지." },
    image: golf,
  },
  {
    slug: "korean-travellers-sri-lanka",
    title: { en: "Sri Lanka for Korean Travellers: A Practical Guide", ko: "한국인 여행자를 위한 스리랑카 실전 가이드" },
    category: "Korean Travel Guides",
    date: "28 February 2026",
    excerpt: { en: "Flights via Singapore or Dubai, visa steps, Korean-speaking guides and where to find kimchi in Colombo.", ko: "항공편, 비자 절차, 한국어 가이드, 그리고 콜롬보에서 김치를 구할 수 있는 곳." },
    image: colombo,
  },
  {
    slug: "leopards-of-yala",
    title: { en: "Tracking the Leopards of Yala", ko: "얄라의 표범을 찾아서" },
    category: "Wildlife",
    date: "18 February 2026",
    excerpt: { en: "Why the block one boundary at first light gives you the best odds of the season.", ko: "새벽 1구역이 시즌 최고의 확률을 주는 이유." },
    image: wildlife,
  },
  {
    slug: "tea-country-bungalows",
    title: { en: "Sleeping in the Clouds: Tea Country Bungalows", ko: "구름 위에서 잠들다: 차밭 방갈로" },
    category: "Luxury Travel",
    date: "02 February 2026",
    excerpt: { en: "Six planter's bungalows worth rearranging an itinerary for.", ko: "일정을 바꿔서라도 머물 가치가 있는 방갈로 여섯 곳." },
    image: tea,
  },
  {
    slug: "kandy-perahera",
    title: { en: "Inside the Kandy Esala Perahera", ko: "캔디 에살라 페라헤라의 안쪽" },
    category: "Sri Lankan Culture",
    date: "20 January 2026",
    excerpt: { en: "How to see Asia's greatest procession properly — and where to sit.", ko: "아시아 최대의 행렬을 제대로 보는 법." },
    image: culture,
  },
  {
    slug: "packing-for-sri-lanka",
    title: { en: "What to Pack for Two Climates in One Week", ko: "일주일에 두 기후, 무엇을 챙길까" },
    category: "Travel Tips",
    date: "08 January 2026",
    excerpt: { en: "The hill country is cold at night. Almost nobody plans for it.", ko: "고산지대의 밤은 춥습니다. 대부분 준비하지 않죠." },
    image: ella,
  },
];

export const blogCategories = [
  "All",
  "Golf in Sri Lanka",
  "Luxury Travel",
  "Sri Lankan Culture",
  "Wildlife",
  "Travel Tips",
  "Korean Travel Guides",
];
