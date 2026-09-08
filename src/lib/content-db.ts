import { prisma } from "@/lib/prisma";
import type {
  Tour,
  GolfCourse,
  Destination,
  Experience,
  Post,
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

export async function getLiveContent() {
  try {
    const [toursDb, golfDb, destsDb, expsDb, postsDb, settingsDb] =
      await Promise.all([
        prisma.tour.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.golfcourse.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.destination.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.experience.findMany({ orderBy: { createdAt: "asc" } }),
        prisma.blogpost.findMany({ orderBy: { createdAt: "desc" } }),
        prisma.sitesetting.findMany(),
      ]);

    const tours: Tour[] = toursDb.map((t) => {
      const parsedItinerary = safeJsonParse(t.itinerary, []);
      const parsedInclusions = safeJsonParse(t.inclusions, []);
      const parsedExclusions = safeJsonParse(t.exclusions, []);
      const parsedHotels = safeJsonParse(t.hotels, []);
      const parsedCategories = safeJsonParse(t.categories, [t.category]);
      const days = parseInt(t.duration?.replace(/\D/g, "") || "1") || (t.nights ? t.nights + 1 : 1);

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
      name: g.name,
      location: g.location,
      image: g.image,
      holes: `${g.holes} holes · Par ${g.par}`,
      nights: g.nights,
      rounds: g.rounds,
      hotel: g.hotelPairing || "",
      text: { en: g.textEn, ko: g.textKo || g.textEn },
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
      title: { en: e.titleEn, ko: e.titleKo || e.titleEn },
      text: { en: e.descriptionEn, ko: e.descriptionKo || e.descriptionEn },
      image: e.image,
    }));

    const posts: Post[] = postsDb.map((p) => ({
      slug: p.slug,
      title: { en: p.titleEn, ko: p.titleKo || p.titleEn },
      category: p.category,
      date: p.publishedAt || "March 2026",
      excerpt: { en: p.excerptEn, ko: p.excerptKo || p.excerptEn },
      image: p.image,
    }));

    let siteSettings: SiteSettings | null = null;
    let contactInfo: any = null;

    for (const s of settingsDb) {
      if (s.key === "global_site_settings") {
        siteSettings = safeJsonParse(s.value, null);
      } else if (s.key === "global_contact") {
        contactInfo = safeJsonParse(s.value, null);
      }
    }

    return {
      tours: tours.length ? tours : null,
      golfCourses: golfCourses.length ? golfCourses : null,
      destinations: destinations.length ? destinations : null,
      experiences: experiences.length ? experiences : null,
      posts: posts.length ? posts : null,
      siteSettings,
      contact: contactInfo,
    };
  } catch (error) {
    console.error("Error fetching live content from database:", error);
    return {
      tours: null,
      golfCourses: null,
      destinations: null,
      experiences: null,
      posts: null,
      siteSettings: null,
      contact: null,
    };
  }
}
