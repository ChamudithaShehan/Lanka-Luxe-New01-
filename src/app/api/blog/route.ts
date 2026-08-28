import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog posts." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const body = await req.json();
    const pubDate = body.publishedAt || body.date || new Date().toISOString().split("T")[0];

    const post = await prisma.blogPost.upsert({
      where: { slug: body.slug },
      update: {
        titleEn: body.title?.en || body.titleEn || "Journal Entry",
        titleKo: body.title?.ko || body.titleKo || null,
        category: body.category || "Luxury Travel",
        author: body.author || "Iroshan Jayawickrame",
        readTime: body.readTime || "5 min read",
        publishedAt: pubDate,
        image: body.image || "https://images.unsplash.com/photo-1546708973-c6b75c55c707?q=80&w=1200&auto=format&fit=crop",
        excerptEn: body.excerpt?.en || body.excerptEn || "",
        excerptKo: body.excerpt?.ko || body.excerptKo || null,
        contentEn: body.content?.en || body.contentEn || null,
        contentKo: body.content?.ko || body.contentKo || null,
      },
      create: {
        slug: body.slug,
        titleEn: body.title?.en || body.titleEn || "Journal Entry",
        titleKo: body.title?.ko || body.titleKo || null,
        category: body.category || "Luxury Travel",
        author: body.author || "Iroshan Jayawickrame",
        readTime: body.readTime || "5 min read",
        publishedAt: pubDate,
        image: body.image || "https://images.unsplash.com/photo-1546708973-c6b75c55c707?q=80&w=1200&auto=format&fit=crop",
        excerptEn: body.excerpt?.en || body.excerptEn || "",
        excerptKo: body.excerpt?.ko || body.excerptKo || null,
        contentEn: body.content?.en || body.contentEn || null,
        contentKo: body.content?.ko || body.contentKo || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Save blog post error:", error);
    return NextResponse.json({ error: "Failed to save blog post." }, { status: 500 });
  }
}
