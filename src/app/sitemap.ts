import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { tours as defaultTours, destinations as defaultDestinations, posts as defaultPosts } from "@/data/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lankaluxe.com";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tours`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/destinations`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/golf`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/experiences`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  let dynamicTours: MetadataRoute.Sitemap = [];
  let dynamicDests: MetadataRoute.Sitemap = [];
  let dynamicPosts: MetadataRoute.Sitemap = [];

  try {
    const [toursDb, destsDb, postsDb] = await Promise.all([
      prisma.tour.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.destination.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.blogpost.findMany({ select: { slug: true, updatedAt: true } }),
    ]);

    const tourSlugs = toursDb.length ? toursDb : defaultTours.map((t) => ({ slug: t.slug, updatedAt: new Date() }));
    const destSlugs = destsDb.length ? destsDb : defaultDestinations.map((d) => ({ slug: d.slug, updatedAt: new Date() }));
    const postSlugs = postsDb.length ? postsDb : defaultPosts.map((p) => ({ slug: p.slug, updatedAt: new Date() }));

    dynamicTours = tourSlugs.map((t) => ({
      url: `${baseUrl}/tours/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly",
      priority: 0.85,
    }));

    dynamicDests = destSlugs.map((d) => ({
      url: `${baseUrl}/destinations/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

    dynamicPosts = postSlugs.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {
    dynamicTours = defaultTours.map((t) => ({
      url: `${baseUrl}/tours/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    }));
    dynamicDests = defaultDestinations.map((d) => ({
      url: `${baseUrl}/destinations/${d.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
    dynamicPosts = defaultPosts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  }

  return [...staticRoutes, ...dynamicTours, ...dynamicDests, ...dynamicPosts];
}
