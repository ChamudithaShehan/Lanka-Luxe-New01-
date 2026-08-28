import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.golfCourse.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch golf courses." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const hotelVal = body.hotelPairing || body.hotel || null;
    const course = await prisma.golfCourse.upsert({
      where: { slug: body.slug },
      update: {
        name: body.name || "Championship Golf Course",
        location: body.location || "Sri Lanka",
        holes: parseInt(body.holes?.toString() || "18"),
        par: parseInt(body.par?.toString() || "72"),
        duration: body.duration || "1 Day",
        rounds: parseInt(body.rounds?.toString() || "1"),
        nights: parseInt(body.nights?.toString() || "1"),
        image: body.image || "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop",
        textEn: body.text?.en || body.textEn || "",
        textKo: body.text?.ko || body.textKo || null,
        hotelPairing: hotelVal,
        features: JSON.stringify(body.features || []),
      },
      create: {
        slug: body.slug,
        name: body.name || "Championship Golf Course",
        location: body.location || "Sri Lanka",
        holes: parseInt(body.holes?.toString() || "18"),
        par: parseInt(body.par?.toString() || "72"),
        duration: body.duration || "1 Day",
        rounds: parseInt(body.rounds?.toString() || "1"),
        nights: parseInt(body.nights?.toString() || "1"),
        image: body.image || "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop",
        textEn: body.text?.en || body.textEn || "",
        textKo: body.text?.ko || body.textKo || null,
        hotelPairing: hotelVal,
        features: JSON.stringify(body.features || []),
      },
    });

    return NextResponse.json({ success: true, course });
  } catch (error) {
    console.error("Save golf course error:", error);
    return NextResponse.json({ error: "Failed to save golf course." }, { status: 500 });
  }
}
