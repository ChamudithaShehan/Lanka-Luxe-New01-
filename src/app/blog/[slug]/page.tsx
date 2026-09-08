import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { posts as staticPosts } from "@/data/site";
import { BlogDetailClient } from "./BlogDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

function sanitizeMetaText(str: string | null | undefined): string {
  if (!str) return "";
  return str.replace(/[<>"]/g, "").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = typeof slug === "string" ? slug.trim().toLowerCase() : "";

  let title = "Ceylon Journal & Travel Insights | Lanka Luxe Journeys";
  let description =
    "Expert perspectives on Sri Lanka luxury travel, championship golf links, and private expeditions.";
  let imageUrl = "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?q=80&w=1200&auto=format&fit=crop";

  try {
    const dbPost = await prisma.blogPost.findUnique({
      where: { slug: cleanSlug },
    });

    if (dbPost) {
      title = `${sanitizeMetaText(dbPost.titleEn)} | Lanka Luxe Journeys`;
      description =
        sanitizeMetaText(dbPost.excerptEn) ||
        description;
      if (dbPost.image && dbPost.image.startsWith("https://")) {
        imageUrl = dbPost.image;
      }
    } else {
      const fallback = staticPosts.find((p) => p.slug === cleanSlug);
      if (fallback) {
        title = `${sanitizeMetaText(fallback.title.en)} | Lanka Luxe Journeys`;
        description =
          sanitizeMetaText(fallback.excerpt.en) ||
          description;
        if (fallback.image && fallback.image.startsWith("https://")) {
          imageUrl = fallback.image;
        }
      }
    }
  } catch (err) {
    console.warn("Failed to query blog metadata from DB, using fallback:", err);
  }

  const canonicalUrl = `/blog/${cleanSlug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function BlogPage() {
  return <BlogDetailClient />;
}
