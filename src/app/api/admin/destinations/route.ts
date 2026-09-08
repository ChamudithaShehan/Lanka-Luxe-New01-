import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";
import crypto from "crypto";

const destSchema = z.object({
  slug: z.string().min(1).max(100),
  name: z.object({
    en: z.string().min(1).max(255),
    ko: z.string().optional().default(""),
  }),
  region: z.string().min(1).max(100),
  image: z.string().min(1),
  short: z.object({
    en: z.string().optional().default(""),
    ko: z.string().optional().default(""),
  }),
  long: z.object({
    en: z.string().optional().default(""),
    ko: z.string().optional().default(""),
  }),
  best: z.array(z.string()).optional().default([]),
  stay: z.string().optional().default("2–3 nights"),
  x: z.number().optional().default(50),
  y: z.number().optional().default(50),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json();
    const result = destSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid destination data", details: result.error.errors },
        { status: 400 }
      );
    }

    const data = result.data;
    const existing = await prisma.destination.findUnique({
      where: { slug: data.slug },
    });
    const id = existing ? existing.id : `dest_${crypto.randomUUID()}`;

    const saved = await prisma.destination.upsert({
      where: { slug: data.slug },
      create: {
        id,
        slug: data.slug,
        nameEn: data.name.en,
        nameKo: data.name.ko || data.name.en,
        region: data.region,
        duration: data.stay,
        image: data.image,
        shortEn: data.short.en,
        shortKo: data.short.ko,
        descriptionEn: data.long.en,
        descriptionKo: data.long.ko,
        highlights: JSON.stringify(data.best),
        mapX: data.x,
        mapY: data.y,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        nameEn: data.name.en,
        nameKo: data.name.ko || data.name.en,
        region: data.region,
        duration: data.stay,
        image: data.image,
        shortEn: data.short.en,
        shortKo: data.short.ko,
        descriptionEn: data.long.en,
        descriptionKo: data.long.ko,
        highlights: JSON.stringify(data.best),
        mapX: data.x,
        mapY: data.y,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, destination: saved });
  } catch (error) {
    console.error("Admin save destination error:", error);
    return NextResponse.json(
      { error: "Failed to save destination" },
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

    await prisma.destination.delete({ where: { slug } });
    return NextResponse.json({ success: true, message: "Destination deleted" });
  } catch (error) {
    console.error("Admin delete destination error:", error);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}
