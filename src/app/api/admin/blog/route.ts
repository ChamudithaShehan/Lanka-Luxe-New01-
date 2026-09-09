import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";
import crypto from "crypto";

const postSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(1).max(100),
  originalSlug: z.string().optional(),
  title: z.object({
    en: z.string().min(1).max(255),
    ko: z.string().optional().default(""),
  }),
  category: z.string().min(1).max(100),
  date: z.string().optional().default("March 2026"),
  excerpt: z.object({
    en: z.string().optional().default(""),
    ko: z.string().optional().default(""),
  }),
  image: z.string().min(1),
  content: z
    .object({
      en: z.string().optional().default(""),
      ko: z.string().optional().default(""),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid post data", details: result.error.errors },
        { status: 400 }
      );
    }

    const data = result.data;
    const lookupSlug = data.originalSlug || data.slug;
    let existing = null;

    if (lookupSlug) {
      existing = await prisma.blogPost.findUnique({
        where: { slug: lookupSlug },
      });
    }

    if (!existing && data.id) {
      existing = await prisma.blogPost.findUnique({
        where: { id: data.id },
      });
    }

    if (!existing && data.title?.en) {
      existing = await prisma.blogPost.findFirst({
        where: { titleEn: data.title.en },
      });
    }

    if (existing) {
      const saved = await prisma.blogPost.update({
        where: { id: existing.id },
        data: {
          slug: data.slug,
          titleEn: data.title.en,
          titleKo: data.title.ko || data.title.en,
          category: data.category,
          publishedAt: data.date,
          image: data.image,
          excerptEn: data.excerpt.en,
          excerptKo: data.excerpt.ko,
          contentEn: data.content?.en || data.excerpt.en,
          contentKo: data.content?.ko || data.excerpt.ko,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, post: saved });
    } else {
      const id = data.id || `post_${crypto.randomUUID()}`;
      const saved = await prisma.blogPost.create({
        data: {
          id,
          slug: data.slug,
          titleEn: data.title.en,
          titleKo: data.title.ko || data.title.en,
          category: data.category,
          author: "Iroshan Jayawickrame",
          readTime: "5 min read",
          publishedAt: data.date,
          image: data.image,
          excerptEn: data.excerpt.en,
          excerptKo: data.excerpt.ko,
          contentEn: data.content?.en || data.excerpt.en,
          contentKo: data.content?.ko || data.excerpt.ko,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, post: saved });
    }
  } catch (error) {
    console.error("Admin save blog post error:", error);
    return NextResponse.json(
      { error: "Failed to save blog post" },
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

    await prisma.blogPost.delete({ where: { slug } });
    return NextResponse.json({ success: true, message: "Blog post deleted" });
  } catch (error) {
    console.error("Admin delete blog post error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
