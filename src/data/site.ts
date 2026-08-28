import type { Localized } from "@/lib/i18n";

import _sigiriya from "@/assets/sigiriya.jpg";
import _beach from "@/assets/beach.jpg";
import _golf from "@/assets/golf.jpg";
import _golf2 from "@/assets/golf2.jpg";
import _wildlife from "@/assets/wildlife.jpg";
import _tea from "@/assets/tea.jpg";
import _resort from "@/assets/resort.jpg";
import _train from "@/assets/train.jpg";
import _culture from "@/assets/culture.jpg";
import _colombo from "@/assets/colombo.jpg";
import _kandy from "@/assets/kandy.jpg";
import _galle from "@/assets/galle.jpg";
import _ella from "@/assets/ella.jpg";
import _honeymoon from "@/assets/honeymoon.jpg";
import _wellness from "@/assets/wellness.jpg";
import _aerial from "@/assets/aerial.jpg";
import _iroshan from "@/assets/iroshan.jpg";
import _showcase from "@/assets/showcase.jpg";
import _logo from "@/assets/logo.png";

const resolveSrc = (image: any): string =>
  image && typeof image === "object" && "src" in image
    ? image.src
    : String(image || "");

const sigiriya = resolveSrc(_sigiriya);
const beach = resolveSrc(_beach);
const golf = resolveSrc(_golf);
const golf2 = resolveSrc(_golf2);
const wildlife = resolveSrc(_wildlife);
const tea = resolveSrc(_tea);
const resort = resolveSrc(_resort);
const train = resolveSrc(_train);
const culture = resolveSrc(_culture);
const colombo = resolveSrc(_colombo);
const kandy = resolveSrc(_kandy);
const galle = resolveSrc(_galle);
const ella = resolveSrc(_ella);
const honeymoon = resolveSrc(_honeymoon);
const wellness = resolveSrc(_wellness);
const aerial = resolveSrc(_aerial);
const iroshan = resolveSrc(_iroshan);
const showcase = resolveSrc(_showcase);
const logo = resolveSrc(_logo);

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

export const contact: Record<string, string> = {};

export type Feature = { no: string; title: Localized; text: Localized };

export const whyUs: Feature[] = [];

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

export const tours: Tour[] = [];

export const tourFilters = [
  "All",
  "Luxury",
  "Golf",
  "Wildlife",
  "Culture",
  "Honeymoon",
  "Wellness",
  "Family",
  "Custom",
];

/**
 * Universal flexible category matcher.
 * Accurately matches exact strings, short aliases, and semantic equivalents
 * (e.g. 'Honeymoon' <-> 'Honeymoon & Romance', 'Golf' <-> 'Golf & Leisure').
 */
export function isCategoryMatch(
  item: { category?: string; categories?: string[] },
  selectedFilter: string,
): boolean {
  if (!selectedFilter || selectedFilter === "All") return true;

  const normalize = (str?: string) => (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filterNorm = normalize(selectedFilter);
  const itemCats = [item.category, ...(item.categories || [])].filter(Boolean) as string[];

  // 1. Direct normalized match
  if (itemCats.some((c) => normalize(c) === filterNorm)) return true;

  // 2. Keyword & Semantic equivalence mapping
  const keywordGroups = [
    { key: "honeymoon", matches: ["honeymoon", "romance", "couple", "honeymoonromance"] },
    { key: "golf", matches: ["golf", "leisure", "links", "golfleisure", "fairways"] },
    { key: "wildlife", matches: ["wildlife", "safari", "nature", "wildlifenature", "leopard", "animals"] },
    { key: "culture", matches: ["culture", "heritage", "history", "cultureheritage", "kingdom", "temple"] },
    { key: "wellness", matches: ["wellness", "ayurveda", "spa", "yoga", "wellnessayurveda", "retreat"] },
    { key: "luxury", matches: ["luxury", "signature", "bespoke", "signaturejourneys", "grand", "discovery"] },
    { key: "family", matches: ["family", "kids", "group", "familygroup"] },
    { key: "custom", matches: ["custom", "bespoke", "tailor", "custombespoke"] },
    { key: "highlands", matches: ["highlands", "tea", "mountain", "hill", "mist"] },
  ];

  for (const group of keywordGroups) {
    if (group.matches.some((m) => filterNorm.includes(m) || m.includes(filterNorm))) {
      if (
        itemCats.some((cat) => {
          const catNorm = normalize(cat);
          return group.matches.some((m) => catNorm.includes(m) || m.includes(catNorm));
        })
      ) {
        return true;
      }
    }
  }

  // 3. Fallback partial substring check
  return itemCats.some((cat) => {
    const cNorm = normalize(cat);
    return cNorm.includes(filterNorm) || filterNorm.includes(cNorm);
  });
}

export type GolfCourse = {
  slug?: string;
  name: string;
  location: string;
  image: string;
  holes: string | number;
  par?: number;
  duration?: string;
  nights: number;
  rounds: number;
  hotel?: string;
  hotelPairing?: string;
  text: Localized;
  features?: string[];
};

export const golfCourses: GolfCourse[] = [];

export type Experience = {
  slug?: string;
  title: Localized;
  text: Localized;
  description?: Localized;
  image: string;
  category?: string;
  duration?: string;
  location?: string;
  highlights?: string[];
};

export const experiences: Experience[] = [];

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

export const destinations: Destination[] = [];

export type Testimonial = {
  quote: Localized;
  name: string;
  country: string;
  trip: string;
  image: string;
};

export const testimonials: Testimonial[] = [];

export type TeamMember = { name: string; role: Localized; bio: Localized; image: string };

export const team: TeamMember[] = [];

export type Post = {
  slug: string;
  title: Localized;
  category: string;
  date: string;
  excerpt: Localized;
  image: string;
};

export const posts: Post[] = [];

export const blogCategories = [
  "All",
  "Golf in Sri Lanka",
  "Luxury Travel",
  "Sri Lankan Culture",
  "Wildlife",
  "Travel Tips",
  "Korean Travel Guides",
];

export type GalleryItem = {
  id: string;
  title: Localized;
  category: string;
  image: string;
  location?: string;
  featured?: boolean;
  order?: number;
};

export const galleryCategories = [
  "All",
  "Luxury Resorts",
  "Heritage & Culture",
  "Wildlife & Safari",
  "Coastal & Beaches",
  "Highlands & Tea",
  "Scenic Golf",
];

export const defaultGalleryItems: GalleryItem[] = [
  {
    id: "gal-1",
    title: { en: "Private Pool Villa Sanctuary", ko: "프라이빗 풀빌라 휴양 리조트" },
    category: "Luxury Resorts",
    image: img.resort,
    location: "Bentota & Tangalle",
    featured: true,
    order: 1,
  },
  {
    id: "gal-2",
    title: { en: "Sigiriya Ancient Lion Rock Fortress", ko: "시기리야 고대 사자바위 요새" },
    category: "Heritage & Culture",
    image: img.sigiriya,
    location: "Cultural Triangle",
    featured: true,
    order: 2,
  },
  {
    id: "gal-3",
    title: { en: "Emerald Ceylon Tea Country Highlands", ko: "에메랄드빛 실론 고산지대 차밭" },
    category: "Highlands & Tea",
    image: img.tea,
    location: "Nuwara Eliya & Hatton",
    featured: true,
    order: 3,
  },
  {
    id: "gal-4",
    title: { en: "Yala Leopard & Elephant Safari", ko: "얄라 국립공원 표범 & 코끼리 사파리" },
    category: "Wildlife & Safari",
    image: img.wildlife,
    location: "Yala & Wilpattu",
    featured: true,
    order: 4,
  },
  {
    id: "gal-5",
    title: { en: "Golden Sunset on the Southern Coast", ko: "남부 해안의 황금빛 선셋" },
    category: "Coastal & Beaches",
    image: img.beach,
    location: "Mirissa & Weligama",
    featured: true,
    order: 5,
  },
  {
    id: "gal-6",
    title: { en: "Championship Victoria Golf Course", ko: "빅토리아 챔피언십 골프 링크스" },
    category: "Scenic Golf",
    image: img.golf,
    location: "Digana, Kandy",
    featured: true,
    order: 6,
  },
  {
    id: "gal-7",
    title: { en: "Historic Dutch Galle Fort Ramparts", ko: "역사적인 골 포트 네덜란드 요새" },
    category: "Heritage & Culture",
    image: img.galle,
    location: "Galle Southern Province",
    featured: true,
    order: 7,
  },
  {
    id: "gal-8",
    title: { en: "Scenic Train Across Nine Arch Bridge", ko: "나인아치 브릿지 낭만 열차 여정" },
    category: "Highlands & Tea",
    image: img.train,
    location: "Ella Highlands",
    featured: true,
    order: 8,
  },
  {
    id: "gal-9",
    title: { en: "Authentic Ayurvedic Wellness Retreat", ko: "정통 아유르베다 힐링 웰니스" },
    category: "Luxury Resorts",
    image: img.wellness,
    location: "Wadduwa & Beruwala",
    featured: false,
    order: 9,
  },
  {
    id: "gal-10",
    title: { en: "Sacred Temple of the Tooth Relic", ko: "캔디 불치사 성스러운 의식" },
    category: "Heritage & Culture",
    image: img.kandy,
    location: "Kandy",
    featured: false,
    order: 10,
  },
  {
    id: "gal-11",
    title: { en: "Romantic Secluded Coastline Dining", ko: "프라이빗 해변 로맨틱 캔들 디너" },
    category: "Coastal & Beaches",
    image: img.honeymoon,
    location: "Tangalle Coast",
    featured: false,
    order: 11,
  },
  {
    id: "gal-12",
    title: { en: "Aerial Island Coastline & Reefs", ko: "스리랑카 에메랄드빛 해안 항공 뷰" },
    category: "Coastal & Beaches",
    image: img.aerial,
    location: "Southern Ocean Coast",
    featured: false,
    order: 12,
  },
];

