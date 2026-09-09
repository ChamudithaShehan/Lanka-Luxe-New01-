import type { Localized } from "@/lib/i18n";

// Static UI Image Assets (Brand Logo & Parallax Layout Assets)
const sigiriya = "https://i.ibb.co/35FYNgjq/lanka-luxe-sigiriya.jpg";
const beach = "https://i.ibb.co/prJvzzgt/lanka-luxe-beach.jpg";
const golf = "https://i.ibb.co/fj3tmjt/lanka-luxe-golf.jpg";
const golf2 = "https://i.ibb.co/xVC6Wd0/lanka-luxe-golf2.jpg";
const wildlife = "https://i.ibb.co/jvKrVW8D/lanka-luxe-wildlife.jpg";
const tea = "https://i.ibb.co/TMd6Zqkz/lanka-luxe-tea.jpg";
const resort = "https://i.ibb.co/nNWk4GpK/lanka-luxe-resort.jpg";
const train = "https://i.ibb.co/Pz6kLgJM/lanka-luxe-train.jpg";
const culture = "https://i.ibb.co/rRhsm4Gy/lanka-luxe-culture.jpg";
const colombo = "https://i.ibb.co/7xYY9m0w/lanka-luxe-colombo.jpg";
const kandy = "https://i.ibb.co/XBwSsqz/lanka-luxe-kandy.jpg";
const galle = "https://i.ibb.co/qY3CNC1y/lanka-luxe-galle.jpg";
const ella = "https://i.ibb.co/xqM0mmhW/lanka-luxe-ella.jpg";
const honeymoon = "https://i.ibb.co/MDg8WqyS/lanka-luxe-honeymoon.jpg";
const wellness = "https://i.ibb.co/PGLpPwqb/lanka-luxe-wellness.jpg";
const aerial = "https://i.ibb.co/Kj5wnr6q/lanka-luxe-aerial.jpg";
const iroshan = "https://i.ibb.co/ym9q1F60/lanka-luxe-iroshan.jpg";
const showcase = "https://i.ibb.co/Nd3YXxp9/lanka-luxe-showcase.jpg";
const logo = "https://i.ibb.co/WWH9XpB1/lanka-luxe-logo.png";

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

// ==========================================
// PURE TYPESCRIPT INTERFACES FOR CMS ENTITIES
// ==========================================

export type Feature = {
  no: string;
  title: Localized;
  text: Localized;
};

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

export type Testimonial = {
  quote: Localized;
  name: string;
  country: string;
  trip: string;
  image: string;
};

export type TeamMember = {
  name: string;
  role: Localized;
  bio: Localized;
  image: string;
};

export type Post = {
  slug: string;
  title: Localized;
  category: string;
  date: string;
  excerpt: Localized;
  image: string;
};

export type GalleryItem = {
  id: string;
  title: Localized;
  category: string;
  image: string;
  location?: string;
  featured?: boolean;
  order?: number;
};

// ==========================================
// UI FILTERS & CONSTANTS (NON-DATABASE)
// ==========================================

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

export const blogCategories = [
  "All",
  "Golf in Sri Lanka",
  "Luxury Travel",
  "Sri Lankan Culture",
  "Wildlife",
  "Travel Tips",
  "Korean Travel Guides",
];

export const galleryCategories = [
  "All",
  "Luxury Resorts",
  "Heritage & Culture",
  "Wildlife & Safari",
  "Coastal & Beaches",
  "Highlands & Tea",
  "Scenic Golf",
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

  const normalize = (str?: string) =>
    (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const filterNorm = normalize(selectedFilter);
  const itemCats = [item.category, ...(item.categories || [])].filter(
    Boolean,
  ) as string[];

  // 1. Direct normalized match
  if (itemCats.some((c) => normalize(c) === filterNorm)) return true;

  // 2. Keyword & Semantic equivalence mapping
  const keywordGroups = [
    {
      key: "honeymoon",
      matches: ["honeymoon", "romance", "couple", "honeymoonromance"],
    },
    {
      key: "golf",
      matches: ["golf", "leisure", "links", "golfleisure", "fairways"],
    },
    {
      key: "wildlife",
      matches: [
        "wildlife",
        "safari",
        "nature",
        "wildlifenature",
        "leopard",
        "animals",
      ],
    },
    {
      key: "culture",
      matches: [
        "culture",
        "heritage",
        "history",
        "cultureheritage",
        "kingdom",
        "temple",
      ],
    },
    {
      key: "wellness",
      matches: [
        "wellness",
        "ayurveda",
        "spa",
        "yoga",
        "wellnessayurveda",
        "retreat",
      ],
    },
    {
      key: "luxury",
      matches: [
        "luxury",
        "signature",
        "bespoke",
        "signaturejourneys",
        "grand",
        "discovery",
      ],
    },
    { key: "family", matches: ["family", "kids", "group", "familygroup"] },
    {
      key: "custom",
      matches: ["custom", "bespoke", "tailor", "custombespoke"],
    },
    {
      key: "highlands",
      matches: ["highlands", "tea", "mountain", "hill", "mist"],
    },
  ];

  for (const group of keywordGroups) {
    if (
      group.matches.some(
        (m) => filterNorm.includes(m) || m.includes(filterNorm),
      )
    ) {
      if (
        itemCats.some((cat) => {
          const catNorm = normalize(cat);
          return group.matches.some(
            (m) => catNorm.includes(m) || m.includes(catNorm),
          );
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
