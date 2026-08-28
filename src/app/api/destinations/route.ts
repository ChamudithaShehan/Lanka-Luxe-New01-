import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { destinationInputSchema } from "@/lib/validations/content";

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(destinations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch destinations." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const rawBody = await req.json();
    const validation = destinationInputSchema.safeParse(rawBody);

    if (!validation.success) {
      const details = validation.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Invalid destination data.", details },
        { status: 400 },
      );
    }

    const body = validation.data;
    const durationStr = body.duration || body.stay || "2-3 Days";
    const highlightsArr = body.highlights || body.best || [];
    const descEn = (typeof body.description === "object" ? body.description?.en : body.description) ||
                   (typeof body.long === "object" ? body.long?.en : body.long) ||
                   body.descriptionEn || null;
    const descKo = (typeof body.description === "object" ? body.description?.ko : null) ||
                   (typeof body.long === "object" ? body.long?.ko : null) ||
                   body.descriptionKo || null;
    const mapXVal = parseFloat((body.x ?? body.mapCoordinates?.x ?? body.mapX ?? 50).toString());
    const mapYVal = parseFloat((body.y ?? body.mapCoordinates?.y ?? body.mapY ?? 50).toString());

    const destination = await prisma.destination.upsert({
      where: { slug: body.slug },
      update: {
        nameEn: (typeof body.name === "object" ? body.name?.en : body.name) || body.nameEn || "Untitled Destination",
        nameKo: (typeof body.name === "object" ? body.name?.ko : null) || body.nameKo || null,
        region: body.region || "Central",
        duration: durationStr,
        image: body.image || "https://images.unsplash.com/photo-1588820358172-e16e457e937d?q=80&w=1200&auto=format&fit=crop",
        shortEn: (typeof body.short === "object" ? body.short?.en : body.short) || body.shortEn || "",
        shortKo: (typeof body.short === "object" ? body.short?.ko : null) || body.shortKo || null,
        descriptionEn: descEn,
        descriptionKo: descKo,
        highlights: JSON.stringify(highlightsArr),
        mapX: mapXVal,
        mapY: mapYVal,
      },
      create: {
        slug: body.slug,
        nameEn: (typeof body.name === "object" ? body.name?.en : body.name) || body.nameEn || "Untitled Destination",
        nameKo: (typeof body.name === "object" ? body.name?.ko : null) || body.nameKo || null,
        region: body.region || "Central",
        duration: durationStr,
        image: body.image || "https://images.unsplash.com/photo-1588820358172-e16e457e937d?q=80&w=1200&auto=format&fit=crop",
        shortEn: (typeof body.short === "object" ? body.short?.en : body.short) || body.shortEn || "",
        shortKo: (typeof body.short === "object" ? body.short?.ko : null) || body.shortKo || null,
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