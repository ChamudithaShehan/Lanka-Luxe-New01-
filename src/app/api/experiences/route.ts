import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { experienceInputSchema } from "@/lib/validations/content";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(experiences);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch experiences." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const rawBody = await req.json();
    const validation = experienceInputSchema.safeParse(rawBody);

    if (!validation.success) {
      const details = validation.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Invalid experience data.", details },
        { status: 400 },
      );
    }

    const body = validation.data;
    const descEn = (typeof body.description === "object" ? body.description?.en : body.description) ||
                   (typeof body.text === "object" ? body.text?.en : body.text) ||
                   body.descriptionEn || "Signature luxury experience.";
    const descKo = (typeof body.description === "object" ? body.description?.ko : null) ||
                   (typeof body.text === "object" ? body.text?.ko : null) ||
                   body.descriptionKo || null;

    const experience = await prisma.experience.upsert({
      where: { slug: body.slug },
      update: {
        titleEn: (typeof body.title === "object" ? body.title?.en : body.title) || body.titleEn || "Signature Experience",
        titleKo: (typeof body.title === "object" ? body.title?.ko : null) || body.titleKo || null,
        category: body.category || "Luxury",
        duration: body.duration || "Half Day",
        location: body.location || "Sri Lanka",
        image: body.image || "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1200&auto=format&fit=crop",
        descriptionEn: descEn,
        descriptionKo: descKo,
        highlights: JSON.stringify(body.highlights || []),
      },
      create: {
        slug: body.slug,
        titleEn: (typeof body.title === "object" ? body.title?.en : body.title) || body.titleEn || "Signature Experience",
        titleKo: (typeof body.title === "object" ? body.title?.ko : null) || body.titleKo || null,
        category: body.category || "Luxury",
        duration: body.duration || "Half Day",
        location: body.location || "Sri Lanka",
        image: body.image || "https://images.unsplash.com/photo-1549366021-9f761d450615?q=80&w=1200&auto=format&fit=crop",
        descriptionEn: descEn,
        descriptionKo: descKo,
        highlights: JSON.stringify(body.highlights || []),
      },
    });

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    console.error("Save experience error:", error);
    return NextResponse.json({ error: "Failed to save experience." }, { status: 500 });
  }
}