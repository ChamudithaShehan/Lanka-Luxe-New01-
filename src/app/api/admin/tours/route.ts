import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";
import crypto from "crypto";

const tourSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).max(100),
  originalSlug: z.string().optional(),
  name: z.object({
    en: z.string().min(1).max(255),
    ko: z.string().optional().default(""),
  }),
  category: z.string().min(1).max(100),
  categories: z.array(z.string()).optional().default([]),
  days: z.number().int().min(1).max(90),
  price: z.string().max(100),
  image: z.string().min(1),
  short: z.object({
    en: z.string().optional().default(""),
    ko: z.string().optional().default(""),
  }),
  overview: z.object({
    en: z.string().optional().default(""),
    ko: z.string().optional().default(""),
  }),
  itinerary: z.array(z.any()).optional().default([]),
  included: z.array(z.string()).optional().default([]),
  excluded: z.array(z.string()).optional().default([]),
  hotels: z.array(z.string()).optional().default([]),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json();
    const result = tourSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid tour data", details: result.error.errors },
        { status: 400 }
      );
    }

    const data = result.data;
    const lookupSlug = data.originalSlug || data.slug;
    let existing = null;

    if (lookupSlug) {
      existing = await prisma.tour.findUnique({ where: { slug: lookupSlug } });
    }

    if (!existing && data.id) {
      existing = await prisma.tour.findUnique({ where: { id: data.id } });
    }

    if (!existing && data.name?.en) {
      existing = await prisma.tour.findFirst({ where: { nameEn: data.name.en } });
    }

    if (existing) {
      const saved = await prisma.tour.update({
        where: { id: existing.id },
        data: {
          slug: data.slug,
          nameEn: data.name.en,
          nameKo: data.name.ko || data.name.en,
          category: data.category,
          categories: JSON.stringify(data.categories),
          duration: `${data.days} Days`,
          nights: Math.max(1, data.days - 1),
          price: data.price,
          image: data.image,
          shortEn: data.short.en,
          shortKo: data.short.ko,
          overviewEn: data.overview.en,
          overviewKo: data.overview.ko,
          itinerary: JSON.stringify(data.itinerary),
          inclusions: JSON.stringify(data.included),
          exclusions: JSON.stringify(data.excluded),
          hotels: JSON.stringify(data.hotels),
          highlights: JSON.stringify(data.included.slice(0, 4)),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, tour: saved });
    } else {
      const id = data.id || `tour_${crypto.randomUUID()}`;
      const saved = await prisma.tour.create({
        data: {
          id,
          slug: data.slug,
          nameEn: data.name.en,
          nameKo: data.name.ko || data.name.en,
          category: data.category,
          categories: JSON.stringify(data.categories),
          duration: `${data.days} Days`,
          nights: Math.max(1, data.days - 1),
          price: data.price,
          image: data.image,
          shortEn: data.short.en,
          shortKo: data.short.ko,
          overviewEn: data.overview.en,
          overviewKo: data.overview.ko,
          itinerary: JSON.stringify(data.itinerary),
          inclusions: JSON.stringify(data.included),
          exclusions: JSON.stringify(data.excluded),
          hotels: JSON.stringify(data.hotels),
          highlights: JSON.stringify(data.included.slice(0, 4)),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, tour: saved });
    }
  } catch (error) {
    console.error("Admin save tour error:", error);
    return NextResponse.json(
      { error: "Failed to save tour" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    await prisma.tour.delete({ where: { slug } });
    return NextResponse.json({ success: true, message: "Tour deleted" });
  } catch (error) {
    console.error("Admin delete tour error:", error);
    return NextResponse.json(
      { error: "Failed to delete tour" },
      { status: 500 }
    );
  }
}
