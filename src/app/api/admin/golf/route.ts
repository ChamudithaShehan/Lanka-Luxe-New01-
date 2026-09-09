import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";
import crypto from "crypto";

const golfSchema = z.object({
  slug: z.string().optional(),
  originalSlug: z.string().optional(),
  name: z.string().min(1).max(255),
  location: z.string().min(1).max(255),
  image: z.string().min(1),
  holes: z.string().optional().default("18 holes · Par 72"),
  nights: z.number().int().min(1).optional().default(1),
  rounds: z.number().int().min(1).optional().default(1),
  hotel: z.string().optional().default(""),
  text: z.object({
    en: z.string().optional().default(""),
    ko: z.string().optional().default(""),
  }),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json();
    const result = golfSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid golf course data", details: result.error.errors },
        { status: 400 }
      );
    }

    const data = result.data;
    const lookupSlug = data.originalSlug || data.slug;
    let existing = null;

    if (lookupSlug) {
      existing = await prisma.golfCourse.findUnique({
        where: { slug: lookupSlug },
      });
    }

    if (!existing && data.name) {
      existing = await prisma.golfCourse.findFirst({
        where: { name: data.name },
      });
    }

    const holesNum = parseInt(data.holes?.replace(/\D/g, "") || "18") || 18;

    if (existing) {
      const targetSlug = data.slug || existing.slug;
      const saved = await prisma.golfCourse.update({
        where: { id: existing.id },
        data: {
          slug: targetSlug,
          name: data.name,
          location: data.location,
          holes: holesNum,
          duration: `${data.nights} Nights`,
          rounds: data.rounds,
          nights: data.nights,
          image: data.image,
          textEn: data.text.en,
          textKo: data.text.ko,
          hotelPairing: data.hotel,
          features: JSON.stringify([`${holesNum} holes`, data.location]),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, course: saved });
    } else {
      const targetSlug =
        data.slug ||
        data.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      const id = `golf_${crypto.randomUUID()}`;

      const saved = await prisma.golfCourse.create({
        data: {
          id,
          slug: targetSlug,
          name: data.name,
          location: data.location,
          holes: holesNum,
          par: 72,
          duration: `${data.nights} Nights`,
          rounds: data.rounds,
          nights: data.nights,
          image: data.image,
          textEn: data.text.en,
          textKo: data.text.ko,
          hotelPairing: data.hotel,
          features: JSON.stringify([`${holesNum} holes`, data.location]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, course: saved });
    }
  } catch (error) {
    console.error("Admin save golf error:", error);
    return NextResponse.json(
      { error: "Failed to save golf course" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    const slug = searchParams.get("slug");

    if (!name && !slug) {
      return NextResponse.json({ error: "Course slug or name is required" }, { status: 400 });
    }

    if (slug) {
      await prisma.golfCourse.deleteMany({ where: { slug } });
    } else if (name) {
      await prisma.golfCourse.deleteMany({ where: { name } });
    }
    return NextResponse.json({ success: true, message: "Course deleted" });
  } catch (error) {
    console.error("Admin delete golf error:", error);
    return NextResponse.json(
      { error: "Failed to delete golf course" },
      { status: 500 }
    );
  }
}
