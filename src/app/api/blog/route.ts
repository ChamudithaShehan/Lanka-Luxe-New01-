import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { blogPostInputSchema } from "@/lib/validations/content";

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
    const rawBody = await req.json();
    const validation = blogPostInputSchema.safeParse(rawBody);

    if (!validation.success) {
      const details = validation.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Invalid blog post data.", details },
        { status: 400 },
      );
    }

    const body = validation.data;
    const pubDate = body.publishedAt || body.date || new Date().toISOString().split("T")[0];

    const post = await prisma.blogPost.upsert({
      where: { slug: body.slug },
      update: {
        titleEn: (typeof body.title === "object" ? body.title?.en : body.title) || body.titleEn || "Journal Entry",
        titleKo: (typeof body.title === "object" ? body.title?.ko : null) || body.titleKo || null,
        category: body.category || "Luxury Travel",
        author: body.author || "Iroshan Jayawickrame",
        readTime: body.readTime || "5 min read",
        publishedAt: pubDate,
        image: body.image || "https://images.unsplash.com/photo-1546708973-c6b75c55c707?q=80&w=1200&auto=format&fit=crop",
        excerptEn: (typeof body.excerpt === "object" ? body.excerpt?.en : body.excerpt) || body.excerptEn || "",
        excerptKo: (typeof body.excerpt === "object" ? body.excerpt?.ko : null) || body.excerptKo || null,
        contentEn: (typeof body.content === "object" ? body.content?.en : body.content) || body.contentEn || null,
        contentKo: (typeof body.content === "object" ? body.content?.ko : null) || body.contentKo || null,
      },
      create: {
        slug: body.slug,
        titleEn: (typeof body.title === "object" ? body.title?.en : body.title) || body.titleEn || "Journal Entry",
        titleKo: (typeof body.title === "object" ? body.title?.ko : null) || body.titleKo || null,
        category: body.category || "Luxury Travel",
        author: body.author || "Iroshan Jayawickrame",
        readTime: body.readTime || "5 min read",
        publishedAt: pubDate,
        image: body.image || "https://images.unsplash.com/photo-1546708973-c6b75c55c707?q=80&w=1200&auto=format&fit=crop",
        excerptEn: (typeof body.excerpt === "object" ? body.excerpt?.en : body.excerpt) || body.excerptEn || "",
        excerptKo: (typeof body.excerpt === "object" ? body.excerpt?.ko : null) || body.excerptKo || null,
        contentEn: (typeof body.content === "object" ? body.content?.en : body.content) || body.contentEn || null,
        contentKo: (typeof body.content === "object" ? body.content?.ko : null) || body.contentKo || null,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Save blog post error:", error);
    return NextResponse.json({ error: "Failed to save blog post." }, { status: 500 });
  }
}