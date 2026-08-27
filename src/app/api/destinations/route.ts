import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(destinations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch destinations." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const durationStr = body.duration || body.stay || "2-3 Days";
    const highlightsArr = body.highlights || body.best || [];
    const descEn = body.description?.en || body.long?.en || body.descriptionEn || null;
    const descKo = body.description?.ko || body.long?.ko || body.descriptionKo || null;
    const mapXVal = parseFloat((body.x ?? body.mapCoordinates?.x ?? body.mapX ?? 50).toString());
    const mapYVal = parseFloat((body.y ?? body.mapCoordinates?.y ?? body.mapY ?? 50).toString());

    const destination = await prisma.destination.upsert({
      where: { slug: body.slug },
      update: {
        nameEn: body.name?.en || body.nameEn || "Untitled Destination",
        nameKo: body.name?.ko || body.nameKo || null,
        region: body.region || "Central",
        duration: durationStr,
        image: body.image || "https://images.unsplash.com/photo-1588820358172-e16e457e937d?q=80&w=1200&auto=format&fit=crop",
        shortEn: body.short?.en || body.shortEn || "",
        shortKo: body.short?.ko || body.shortKo || null,
        descriptionEn: descEn,
        descriptionKo: descKo,
        highlights: JSON.stringify(highlightsArr),
        mapX: mapXVal,
        mapY: mapYVal,
      },
      create: {
        slug: body.slug,
        nameEn: body.name?.en || body.nameEn || "Untitled Destination",
        nameKo: body.name?.ko || body.nameKo || null,
        region: body.region || "Central",
        duration: durationStr,
        image: body.image || "https://images.unsplash.com/photo-1588820358172-e16e457e937d?q=80&w=1200&auto=format&fit=crop",
        shortEn: body.short?.en || body.shortEn || "",
        shortKo: body.short?.ko || body.shortKo || null,
        descriptionEn: descEn,
        descriptionKo: descKo,
        highlights: JSON.stringify(highlightsArr),
        mapX: mapXVal,
        mapY: mapYVal,
      },
    });

    return NextResponse.json({ success: true, destination });
  } catch (error) {
    console.error("Save destination error:", error);
    return NextResponse.json({ error: "Failed to save destination." }, { status: 500 });
  }
}
