import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TourDetailClient } from "./TourDetailClient";

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

  let title = "Luxury Sri Lanka Tour Itinerary | Lanka Luxe Journeys";
  let description =
    "Explore bespoke private journeys, heritage luxury stays, and curated Sri Lankan expeditions.";
  let imageUrl = "https://images.unsplash.com/photo-1546708973-c6b75c55c707?q=80&w=1200&auto=format&fit=crop";

  try {
    const dbTour = await prisma.tour.findUnique({
      where: { slug: cleanSlug },
    });

    if (dbTour) {
      title = `${sanitizeMetaText(dbTour.nameEn)} | Lanka Luxe Journeys`;
      description =
        sanitizeMetaText(dbTour.shortEn) ||
        sanitizeMetaText(dbTour.overviewEn) ||
        description;
      if (dbTour.image && dbTour.image.startsWith("https://")) {
        imageUrl = dbTour.image;
      }
    }
  } catch (err) {
    console.warn("Failed to query tour metadata from MySQL database:", err);
  }

  const canonicalUrl = `/tours/${cleanSlug}`;

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

export default function TourPage() {
  return <TourDetailClient />;
}
