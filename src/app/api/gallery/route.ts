import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { galleryItemInputSchema } from "@/lib/validations/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
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

    return NextResponse.json(gallery);
  } catch (error) {
    console.error("Fetch gallery error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const rawBody = await req.json();

    // Check if updating entire array (reorder / batch)
    if (Array.isArray(rawBody)) {
      await prisma.$transaction(
        rawBody.map((item, index) =>
          prisma.galleryItem.update({
            where: { id: item.id },
            data: { order: index },
          })
        )
      );
      return NextResponse.json({ success: true });
    }

    const validation = galleryItemInputSchema.safeParse(rawBody);
    if (!validation.success) {
      const details = validation.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Invalid gallery data.", details },
        { status: 400 },
      );
    }

    const body = validation.data;
    const titleEn =
      (typeof body.title === "object" ? body.title?.en : body.title) ||
      body.titleEn ||
      "Ceylon Luxury Moment";
    const titleKo =
      (typeof body.title === "object" ? body.title?.ko : null) ||
      body.titleKo ||
      titleEn;

    let parsedOrder = 0;
    if (typeof body.order === "number") {
      parsedOrder = body.order;
    } else if (body.order) {
      parsedOrder = parseInt(body.order, 10) || 0;
    }

    const dbItem = await prisma.galleryItem.upsert({
      where: { id: body.id },
      update: {
        titleEn,
        titleKo,
        category: body.category || "Luxury Resorts",
        image: body.image,
        location: body.location || null,
        featured: body.featured !== undefined ? Boolean(body.featured) : true,
        order: parsedOrder,
      },
      create: {
        id: body.id,
        titleEn,
        titleKo,
        category: body.category || "Luxury Resorts",
        image: body.image,
        location: body.location || null,
        featured: body.featured !== undefined ? Boolean(body.featured) : true,
        order: parsedOrder,
      },
    });

    const itemFormatted = {
      id: dbItem.id,
      title: { en: dbItem.titleEn, ko: dbItem.titleKo || dbItem.titleEn },
      category: dbItem.category,
      image: dbItem.image,
      location: dbItem.location || "",
      featured: dbItem.featured,
      order: dbItem.order,
    };

    return NextResponse.json({ success: true, item: itemFormatted });
  } catch (error) {
    console.error("Save gallery error:", error);
    return NextResponse.json({ error: "Failed to save gallery item." }, { status: 500 });
  }
}
