import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(tours);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tours." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const durationStr = body.duration || (body.days ? `${body.days} Days` : "8 Days");
    const inclusionsArr = body.inclusions || body.included || [];
    const exclusionsArr = body.exclusions || body.excluded || [];

    const tour = await prisma.tour.upsert({
      where: { slug: body.slug },
      update: {
        nameEn: body.name?.en || body.nameEn || "Untitled Tour",
        nameKo: body.name?.ko || body.nameKo || null,
        category: body.category || "Luxury",
        duration: durationStr,
        nights: body.nights ? parseInt(body.nights.toString()) : (body.days ? parseInt(body.days.toString()) - 1 : null),
        price: body.price || "USD 3,500",
        image: body.image || "https://images.unsplash.com/photo-1546708973-c6b75c55c707?q=80&w=1200&auto=format&fit=crop",
        badge: body.badge || null,
        shortEn: body.short?.en || body.shortEn || null,
        shortKo: body.short?.ko || body.shortKo || null,
        overviewEn: body.overview?.en || body.overviewEn || null,
        overviewKo: body.overview?.ko || body.overviewKo || null,
        highlights: JSON.stringify(body.highlights || []),
        inclusions: JSON.stringify(inclusionsArr),
        exclusions: JSON.stringify(exclusionsArr),
        hotels: JSON.stringify(body.hotels || []),
        categories: JSON.stringify(body.categories || [body.category || "Luxury"]),
        itinerary: JSON.stringify(body.itinerary || []),
      },
      create: {
        slug: body.slug,
        nameEn: body.name?.en || body.nameEn || "Untitled Tour",
        nameKo: body.name?.ko || body.nameKo || null,
        category: body.category || "Luxury",
        duration: durationStr,
        nights: body.nights ? parseInt(body.nights.toString()) : (body.days ? parseInt(body.days.toString()) - 1 : null),
        price: body.price || "USD 3,500",
        image: body.image || "https://images.unsplash.com/photo-1546708973-c6b75c55c707?q=80&w=1200&auto=format&fit=crop",
        badge: body.badge || null,
        shortEn: body.short?.en || body.shortEn || null,
        shortKo: body.short?.ko || body.shortKo || null,
        overviewEn: body.overview?.en || body.overviewEn || null,
        overviewKo: body.overview?.ko || body.overviewKo || null,
        highlights: JSON.stringify(body.highlights || []),
        inclusions: JSON.stringify(inclusionsArr),
        exclusions: JSON.stringify(exclusionsArr),
        hotels: JSON.stringify(body.hotels || []),
        categories: JSON.stringify(body.categories || [body.category || "Luxury"]),
        itinerary: JSON.stringify(body.itinerary || []),
      },
    });

    return NextResponse.json({ success: true, tour });
  } catch (error) {
    console.error("Save tour error:", error);
    return NextResponse.json({ error: "Failed to save tour." }, { status: 500 });
  }
}
