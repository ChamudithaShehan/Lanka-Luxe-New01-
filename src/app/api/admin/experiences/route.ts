import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";
import crypto from "crypto";

const expSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  originalSlug: z.string().optional(),
  title: z.object({
    en: z.string().min(1).max(255),
    ko: z.string().optional().default(""),
  }),
  text: z
    .object({
      en: z.string().optional().default(""),
      ko: z.string().optional().default(""),
    })
    .optional(),
  description: z
    .object({
      en: z.string().optional().default(""),
      ko: z.string().optional().default(""),
    })
    .optional(),
  image: z.string().min(1),
  category: z.string().optional().default("Bespoke"),
  duration: z.string().optional().default("Full Day"),
  location: z.string().optional().default("Sri Lanka"),
  highlights: z.array(z.string()).optional().default([]),
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
    const lookupSlug = data.originalSlug || data.slug;
    let existing = null;

    if (lookupSlug) {
      existing = await prisma.experience.findUnique({
        where: { slug: lookupSlug },
      });
    }

    if (!existing && data.id) {
      existing = await prisma.experience.findUnique({
        where: { id: data.id },
      });
    }

    if (!existing && data.title?.en) {
      existing = await prisma.experience.findFirst({
        where: { titleEn: data.title.en },
      });
    }

    const descEn = data.text?.en || data.description?.en || "";
    const descKo = data.text?.ko || data.description?.ko || "";

    if (existing) {
      // Update the existing record cleanly by primary key
      const targetSlug =
        data.slug?.trim() ||
        existing.slug ||
        data.title.en
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

      const saved = await prisma.experience.update({
        where: { id: existing.id },
        data: {
          slug: targetSlug,
          titleEn: data.title.en,
          titleKo: data.title.ko || data.title.en,
          category: data.category || existing.category || "Bespoke",
          duration: data.duration || existing.duration || "Full Day",
          location: data.location || existing.location || "Sri Lanka",
          image: data.image,
          descriptionEn: descEn,
          descriptionKo: descKo,
          highlights: JSON.stringify(data.highlights || []),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, experience: saved });
    } else {
      // Create new record
      const slug =
        data.slug?.trim() ||
        data.title.en
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
      const id = data.id || `exp_${crypto.randomUUID()}`;

      const saved = await prisma.experience.create({
        data: {
          id,
          slug,
          titleEn: data.title.en,
          titleKo: data.title.ko || data.title.en,
          category: data.category || "Bespoke",
          duration: data.duration || "Full Day",
          location: data.location || "Sri Lanka",
          image: data.image,
          descriptionEn: descEn,
          descriptionKo: descKo,
          highlights: JSON.stringify(data.highlights || []),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, experience: saved });
    }
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
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");
    const title = searchParams.get("title");

    if (!slug && !id && !title) {
      return NextResponse.json(
        { error: "Experience slug, id, or title is required" },
        { status: 400 }
      );
    }

    if (id) {
      await prisma.experience.deleteMany({ where: { id } });
    } else if (slug) {
      await prisma.experience.deleteMany({ where: { slug } });
    } else if (title) {
      await prisma.experience.deleteMany({ where: { titleEn: title } });
    }

    return NextResponse.json({ success: true, message: "Experience deleted" });
  } catch (error) {
    console.error("Admin delete experience error:", error);
    return NextResponse.json(
      { error: "Failed to delete experience" },
      { status: 500 }
    );
  }
}
