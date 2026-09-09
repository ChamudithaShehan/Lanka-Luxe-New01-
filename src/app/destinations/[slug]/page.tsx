import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DestinationDetailClient } from "./DestinationDetailClient";

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

  let title = "Sri Lanka Luxury Destination Guide | Lanka Luxe Journeys";
  let description =
    "Curated luxury destination guides, recommended stays, and signature experiences across Ceylon.";
  let imageUrl = "https://images.unsplash.com/photo-1588820358172-e16e457e937d?q=80&w=1200&auto=format&fit=crop";

  try {
    const dbDest = await prisma.destination.findUnique({
      where: { slug: cleanSlug },
    });

    if (dbDest) {
      title = `${sanitizeMetaText(dbDest.nameEn)} | Lanka Luxe Journeys`;
      description =
        sanitizeMetaText(dbDest.shortEn) ||
        sanitizeMetaText(dbDest.descriptionEn) ||
        description;
      if (dbDest.image && dbDest.image.startsWith("https://")) {
        imageUrl = dbDest.image;
      }
    }
  } catch (err) {
    console.warn("Failed to query destination metadata from MySQL database:", err);
  }

  const canonicalUrl = `/destinations/${cleanSlug}`;

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
      type: "website",
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

export default function DestinationPage() {
  return <DestinationDetailClient />;
}
