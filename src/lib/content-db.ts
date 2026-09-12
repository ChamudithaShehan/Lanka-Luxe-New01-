import { prisma } from "@/lib/prisma";
import type {
  Tour,
  GolfCourse,
  Destination,
  Experience,
  Post,
  GalleryItem,
  Feature,
  Testimonial,
  TeamMember,
} from "@/data/site";
import type { SiteSettings } from "@/lib/content-store";

function safeJsonParse<T>(val: string | null | undefined, fallback: T): T {
  if (!val) return fallback;
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

export interface LiveContentData {
  dbConnected: boolean;
  tours: Tour[];
  golfCourses: GolfCourse[];
  destinations: Destination[];
  experiences: Experience[];
  posts: Post[];
  gallery: GalleryItem[];
  whyUs: Feature[];
  testimonials: Testimonial[];
  team: TeamMember[];
  siteSettings: SiteSettings | null;
  contact: any | null;
}

/**
 * Fetch all dynamic CMS content directly from MySQL via Prisma.
 * If the MySQL database is unreachable, this function throws an error
 * so that the API layer can respond with a database-unavailable status.
 */
export async function getLiveContent(): Promise<LiveContentData> {
  const [
    toursDb,
    golfDb,
    destsDb,
    expsDb,
    postsDb,
    galleryDb,
    settingsDb,
  ] = await Promise.all([
    prisma.tour.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.golfCourse.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.destination.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.experience.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.galleryItem.findMany({ orderBy: { order: "asc" } }),
    prisma.siteSetting.findMany(),
  ]);

  const tours: Tour[] = toursDb.map((t) => {
    const parsedItinerary = safeJsonParse(t.itinerary, []);
    const parsedInclusions = safeJsonParse(t.inclusions, []);
    const parsedExclusions = safeJsonParse(t.exclusions, []);
    const parsedHotels = safeJsonParse(t.hotels, []);
    const parsedCategories = safeJsonParse(t.categories, [t.category]);
    const days =
      parseInt(t.duration?.replace(/\D/g, "") || "1") ||
      (t.nights ? t.nights + 1 : 1);

    return {
      slug: t.slug,
      name: { en: t.nameEn, ko: t.nameKo || t.nameEn },
      category: t.category,
      categories: parsedCategories,
      days,
      price: t.price,
      image: t.image,
      gallery: [t.image],
      locations: [t.category],
      short: { en: t.shortEn || "", ko: t.shortKo || t.shortEn || "" },
      overview: {
        en: t.overviewEn || "",
        ko: t.overviewKo || t.overviewEn || "",
      },
      itinerary: parsedItinerary,
      included: parsedInclusions,
      excluded: parsedExclusions,
      hotels: parsedHotels,
      transport: "Private chauffeur-guide throughout.",
      optional: [],
    };
  });

  const golfCourses: GolfCourse[] = golfDb.map((g) => ({
    slug: g.slug,
    name: g.name,
    location: g.location,
    image: g.image,
    holes: `${g.holes} holes · Par ${g.par}`,
    nights: g.nights,
    rounds: g.rounds,
    hotel: g.hotelPairing || "",
    hotelPairing: g.hotelPairing || "",
    text: { en: g.textEn, ko: g.textKo || g.textEn },
    features: safeJsonParse(g.features, []),
  }));

  const destinations: Destination[] = destsDb.map((d) => ({
    slug: d.slug,
    name: { en: d.nameEn, ko: d.nameKo || d.nameEn },
    region: d.region,
    image: d.image,
    short: { en: d.shortEn, ko: d.shortKo || d.shortEn },
    long: {
      en: d.descriptionEn || d.shortEn,
      ko: d.descriptionKo || d.shortKo || d.shortEn,
    },
    best: safeJsonParse(d.highlights, []),
    stay: d.duration || "2–3 nights",
    x: d.mapX,
    y: d.mapY,
  }));

  const experiences: Experience[] = expsDb.map((e) => ({
    slug: e.slug,
    title: { en: e.titleEn, ko: e.titleKo || e.titleEn },
    text: { en: e.descriptionEn, ko: e.descriptionKo || e.descriptionEn },
    image: e.image,
    category: e.category,
    duration: e.duration,
    location: e.location,
    highlights: safeJsonParse(e.highlights, []),
  }));

  const posts: Post[] = postsDb.map((p) => ({
    slug: p.slug,
    title: { en: p.titleEn, ko: p.titleKo || p.titleEn },
    category: p.category,
    date: p.publishedAt || "March 2026",
    excerpt: { en: p.excerptEn, ko: p.excerptKo || p.excerptEn },
    image: p.image,
  }));

  const gallery: GalleryItem[] = galleryDb.map((item) => ({
    id: item.id,
    title: { en: item.titleEn, ko: item.titleKo || item.titleEn },
    category: item.category,
    image: item.image,
    location: item.location || "",
    featured: item.featured,
    order: item.order,
  }));

  let siteSettings: SiteSettings | null = null;
  let contactInfo: any = null;
  let whyUs: Feature[] = [];
  let testimonials: Testimonial[] = [];
  let team: TeamMember[] = [];

  for (const s of settingsDb) {
    if (s.key === "global_site_settings") {
      siteSettings = safeJsonParse(s.value, null);
    } else if (s.key === "global_contact") {
      contactInfo = safeJsonParse(s.value, null);
    } else if (s.key === "global_why_us") {
      whyUs = safeJsonParse(s.value, []);
    } else if (s.key === "global_testimonials") {
      const rawTestimonials = safeJsonParse(s.value, []);
      testimonials = Array.isArray(rawTestimonials)
        ? rawTestimonials
            .filter((item) => item && typeof item === "object")
            .map((t: any, idx: number) => ({
              id: t.id ? String(t.id) : `story_${idx + 1}`,
              name: t.name || t.author || "Guest",
              country: t.country || "International",
              trip: t.trip || t.role || "Bespoke Journey",
              quote: t.quote || t.text || { en: "", ko: "" },
              image:
                t.image ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
              rating: typeof t.rating === "number" ? t.rating : 5,
            }))
        : [];
    } else if (s.key === "global_team") {
      team = safeJsonParse(s.value, []);
    }
  }

  return {
    dbConnected: true,
    tours,
    golfCourses,
    destinations,
    experiences,
    posts,
    gallery,
    whyUs,
    testimonials,
    team,
    siteSettings,
    contact: contactInfo,
  };
}
