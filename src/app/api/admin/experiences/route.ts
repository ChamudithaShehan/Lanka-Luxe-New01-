import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";
import crypto from "crypto";

const expSchema = z.object({
  title: z.object({
    en: z.string().min(1).max(255),
    ko: z.string().optional().default(""),
  }),
  text: z.object({
    en: z.string().optional().default(""),
    ko: z.string().optional().default(""),
  }),
  image: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json();
    const result = expSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid experience data", details: result.error.errors },
        { status: 400 }
      );
    }

    const data = result.data;
    const slug = data.title.en.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const existing = await prisma.experience.findFirst({
      where: { OR: [{ slug }, { titleEn: data.title.en }] },
    });
    const id = existing ? existing.id : `exp_${crypto.randomUUID()}`;

    const saved = await prisma.experience.upsert({
      where: { slug: existing ? existing.slug : slug },
      create: {
        id,
        slug,
        titleEn: data.title.en,
        titleKo: data.title.ko || data.title.en,
        category: "Bespoke",
        duration: "Full Day",
        location: "Sri Lanka",
        image: data.image,
        descriptionEn: data.text.en,
        descriptionKo: data.text.ko,
        highlights: "[]",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      update: {
        titleEn: data.title.en,
        titleKo: data.title.ko || data.title.en,
        image: data.image,
        descriptionEn: data.text.en,
        descriptionKo: data.text.ko,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, experience: saved });
  } catch (error) {
    console.error("Admin save experience error:", error);
    return NextResponse.json(
      { error: "Failed to save experience" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await prisma.experience.deleteMany({ where: { titleEn: title } });
    return NextResponse.json({ success: true, message: "Experience deleted" });
  } catch (error) {
    console.error("Admin delete experience error:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
