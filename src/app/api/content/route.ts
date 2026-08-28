import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const defaultSettings = {
  brandName: "Lanka Luxe Journeys",
  founderName: "Iroshan Jayawickrame",
  founderTitle: "Founder & Licensed Tourist Guide",
  licenseNumber: "C-1734",
  experienceYears: "10+",
  founderBio: {
    en: "Lanka Luxe Journeys is a Sri Lanka based luxury travel company founded by Iroshan Jayawickrame, a professional tourist guide with more than 10 years of experience in the tourism industry.",
    ko: "Lanka Luxe Journeys는 10년 이상의 관광 업계 경력을 가진 공인 전문 가이드 이로샨 자야위크라마가 설립한 스리랑카 럭셔리 여행사입니다.",
  },
  founderQualifications: [
    "SLTDA National Tourist Guide Licence No: C-1734",
    "Diploma in Archaeology — University of Kelaniya",
  ],
  heroHeadline1: { en: "Curated Luxury Journeys", ko: "품격 있는 맞춤 럭셔리 여정" },
  heroHeadline2: { en: "Across Ceylon's Finest Horizons", ko: "스리랑카의 숨겨진 보석을 만나다" },
  heroSubtitle: {
    en: "Bespoke itineraries, championship golf escapes, and private wildlife safaris orchestrated by SLTDA licensed specialists.",
    ko: "10년 경력의 공인 전문 가이드(SLTDA C-1734)가 설계하는 프라이빗 럭셔리 투어.",
  },
};

export async function GET() {
  try {
    // 1. Query Tours (Newest / recently updated first)
    const dbTours = await prisma.tour.findMany({ orderBy: { updatedAt: "desc" } });
    const tours = dbTours.map((t) => {
      let itineraryParsed: any[] = [];
      let inclusionsParsed: string[] = [];
      let exclusionsParsed: string[] = [];
      let hotelsParsed: string[] = [];
      let categoriesParsed: string[] = [];

      try {
        if (t.itinerary) itineraryParsed = JSON.parse(t.itinerary);
      } catch {}
      try {
        if (t.inclusions) inclusionsParsed = JSON.parse(t.inclusions);
      } catch {}
      try {
        if (t.exclusions) exclusionsParsed = JSON.parse(t.exclusions);
      } catch {}
      try {
        if (t.hotels) hotelsParsed = JSON.parse(t.hotels);
      } catch {}
      try {
        if (t.categories) categoriesParsed = JSON.parse(t.categories);
      } catch {}

      const days = parseInt(t.duration?.replace(/\D/g, "") || "8") || (t.nights ? t.nights + 1 : 8);
      const locations = itineraryParsed.map((item) => item.title || item.location).filter(Boolean);

      const gallery = [
        t.image,
        "https://images.unsplash.com/photo-1588820358172-e16e457e937d?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1589309736404-2e142a2acdf0?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop",
      ];

      return {
        slug: t.slug,
        name: { en: t.nameEn, ko: t.nameKo || t.nameEn },
        category: t.category,
        categories: categoriesParsed.length > 0 ? categoriesParsed : [t.category],
        days,
        price: t.price,
        image: t.image,
        gallery,
        locations: locations.length > 0 ? locations : ["Colombo", "Kandy", "Nuwara Eliya", "Galle"],
        short: { en: t.shortEn || "", ko: t.shortKo || "" },
        overview: { en: t.overviewEn || "", ko: t.overviewKo || "" },
        itinerary: itineraryParsed,
        included: inclusionsParsed,
        excluded: exclusionsParsed,
        hotels: hotelsParsed,
        transport: "Private Luxury Air-Conditioned Vehicle with SLTDA Licensed Chauffeur-Guide",
        optional: ["Helicopter Transfers", "Hot Air Balloon Flight", "Private Whale Watching Yacht"],
      };
    });

    // 2. Query Golf Courses
    const dbGolf = await prisma.golfCourse.findMany({ orderBy: { updatedAt: "desc" } });
    const golfCourses = dbGolf.map((g) => {
      let featuresParsed: string[] = [];
      try {
        if (g.features) featuresParsed = JSON.parse(g.features);
      } catch {}

      return {
        slug: g.slug,
        name: g.name,
        location: g.location,
        image: g.image,
        holes: g.holes,
        par: g.par || 72,
        nights: g.nights || 2,
        rounds: g.rounds || 1,
        hotel: g.hotelPairing || "Luxury Golf Resort & Spa",
        hotelPairing: g.hotelPairing || "Luxury Golf Resort & Spa",
        text: { en: g.textEn || "", ko: g.textKo || "" },
        features: featuresParsed,
      };
    });

    // 3. Query Destinations
    const dbDest = await prisma.destination.findMany({ orderBy: { updatedAt: "desc" } });
    const destinations = dbDest.map((d) => {
      let highlightsParsed: string[] = [];
      try {
        if (d.highlights) highlightsParsed = JSON.parse(d.highlights);
      } catch {}

      return {
        slug: d.slug,
        name: { en: d.nameEn, ko: d.nameKo || d.nameEn },
        region: d.region,
        image: d.image,
        short: { en: d.shortEn || "", ko: d.shortKo || "" },
        long: { en: d.descriptionEn || d.shortEn || "", ko: d.descriptionKo || d.shortKo || "" },
        best: highlightsParsed,
        stay: d.duration || "2–3 nights",
        x: d.mapX || 50,
        y: d.mapY || 50,
      };
    });

    // 4. Query Signature Experiences
    const dbExp = await prisma.experience.findMany({ orderBy: { updatedAt: "desc" } });
    const experiences = dbExp.map((e) => {
      let highlightsParsed: string[] = [];
      try {
        if (e.highlights) highlightsParsed = JSON.parse(e.highlights);
      } catch {}

      return {
        slug: e.slug,
        title: { en: e.titleEn, ko: e.titleKo || e.titleEn },
        text: { en: e.descriptionEn || "", ko: e.descriptionKo || "" },
        description: { en: e.descriptionEn || "", ko: e.descriptionKo || "" },
        category: e.category,
        duration: e.duration,
        location: e.location,
        image: e.image,
        highlights: highlightsParsed,
      };
    });

    // 5. Query Journal / Blog Posts
    const dbPosts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
    const posts = dbPosts.map((p) => ({
      slug: p.slug,
      title: { en: p.titleEn, ko: p.titleKo || p.titleEn },
      category: p.category,
      date: p.publishedAt || new Date().toISOString().split("T")[0],
      excerpt: { en: p.excerptEn || "", ko: p.excerptKo || "" },
      image: p.image,
    }));

    // 6. Inquiries are NOT returned here — they are PII (personal data).
    // The admin panel fetches them from the auth-protected GET /api/inquiries endpoint.
    const inquiries: never[] = [];

    // 7. Query Settings
    const settingsRows = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, any> = {};
    settingsRows.forEach((r) => {
      try {
        settingsMap[r.key] = JSON.parse(r.value);
      } catch {
        settingsMap[r.key] = r.value;
      }
    });

    const siteSettings = settingsMap["global_site_settings"] || defaultSettings;
    const contact = settingsMap["global_contact"] || {
      phone: "+94 77 123 4567",
      email: "concierge@lankaluxejourneys.com",
      whatsapp: "+94771234567",
      kakao: "lankaluxe",
      address: "Colombo, Sri Lanka",
    };
    const whyUs = settingsMap["global_why_us"] || [];
    const rawTestimonials = settingsMap["global_testimonials"] || [];
    const testimonials = rawTestimonials.map((t: any) => ({
      id: t.id || String(Math.random()),
      name: t.name || t.author || "Guest Traveler",
      country: t.country || "International",
      trip: t.trip || t.role || "Curated Private Tour",
      quote: t.quote || t.text || { en: "An extraordinary journey with Lanka Luxe.", ko: "잊지 못할 최고의 여정이었습니다." },
      image: t.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150",
    }));

    const team = settingsMap["global_team"] || [];

    const dbGallery = await prisma.galleryItem.findMany({
      orderBy: { order: "asc" },
    });
    const gallery = dbGallery.map((item) => ({
      id: item.id,
      title: { en: item.titleEn, ko: item.titleKo || item.titleEn },
      category: item.category,
      image: item.image,
      location: item.location || "",
      featured: item.featured,
      order: item.order,
    }));

    const response = NextResponse.json({
      tours,
      golfCourses,
      destinations,
      experiences,
      posts,
      inquiries,
      siteSettings,
      contact,
      whyUs,
      testimonials,
      team,
      gallery,
    });

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  } catch (error) {
    console.error("Content API Error:", error);
    const response = NextResponse.json({
      tours: [],
      golfCourses: [],
      destinations: [],
      experiences: [],
      posts: [],
      siteSettings: defaultSettings,
      contact: {},
      whyUs: [],
      testimonials: [],
      team: [],
      gallery: [],
    });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return response;
  }
}
