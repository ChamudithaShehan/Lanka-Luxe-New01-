import { z } from "zod";

export const tourInputSchema = z.object({
  slug: z
    .string({ required_error: "Tour slug is required." })
    .min(2, "Slug must be at least 2 characters.")
    .max(120, "Slug cannot exceed 120 characters.")
    .regex(/^[a-z0-9-]+$/i, "Slug may only contain letters, numbers, and hyphens."),
  name: z.union([z.string(), z.object({ en: z.string().optional(), ko: z.string().optional() })]).optional(),
  nameEn: z.string().max(255).optional(),
  nameKo: z.string().max(255).optional().nullable(),
  category: z.string().max(100).optional(),
  duration: z.string().max(100).optional(),
  nights: z.union([z.number(), z.string()]).optional().nullable(),
  days: z.union([z.number(), z.string()]).optional().nullable(),
  price: z.string().max(100).optional(),
  image: z.string().max(1000).optional(),
  badge: z.string().max(100).optional().nullable(),
  short: z.any().optional(),
  shortEn: z.string().max(2000).optional().nullable(),
  shortKo: z.string().max(2000).optional().nullable(),
  overview: z.any().optional(),
  overviewEn: z.string().max(5000).optional().nullable(),
  overviewKo: z.string().max(5000).optional().nullable(),
  highlights: z.any().optional(),
  inclusions: z.any().optional(),
  included: z.any().optional(),
  exclusions: z.any().optional(),
  excluded: z.any().optional(),
  hotels: z.any().optional(),
  categories: z.any().optional(),
  itinerary: z.any().optional(),
});

export const golfCourseInputSchema = z.object({
  slug: z
    .string({ required_error: "Golf course slug is required." })
    .min(2, "Slug must be at least 2 characters.")
    .max(120, "Slug cannot exceed 120 characters.")
    .regex(/^[a-z0-9-]+$/i, "Slug may only contain letters, numbers, and hyphens."),
  name: z.string().max(255).optional(),
  location: z.string().max(255).optional(),
  holes: z.union([z.number(), z.string()]).optional(),
  par: z.union([z.number(), z.string()]).optional(),
  duration: z.string().max(100).optional(),
  rounds: z.union([z.number(), z.string()]).optional(),
  nights: z.union([z.number(), z.string()]).optional(),
  image: z.string().max(1000).optional(),
  text: z.any().optional(),
  textEn: z.string().max(5000).optional(),
  textKo: z.string().max(5000).optional().nullable(),
  hotel: z.string().max(255).optional().nullable(),
  hotelPairing: z.string().max(255).optional().nullable(),
  features: z.any().optional(),
});

export const destinationInputSchema = z.object({
  slug: z
    .string({ required_error: "Destination slug is required." })
    .min(2, "Slug must be at least 2 characters.")
    .max(120, "Slug cannot exceed 120 characters.")
    .regex(/^[a-z0-9-]+$/i, "Slug may only contain letters, numbers, and hyphens."),
  name: z.union([z.string(), z.object({ en: z.string().optional(), ko: z.string().optional() })]).optional(),
  nameEn: z.string().max(255).optional(),
  nameKo: z.string().max(255).optional().nullable(),
  region: z.string().max(100).optional(),
  duration: z.string().max(100).optional(),
  stay: z.string().max(100).optional(),
  image: z.string().max(1000).optional(),
  short: z.any().optional(),
  shortEn: z.string().max(2000).optional(),
  shortKo: z.string().max(2000).optional().nullable(),
  description: z.any().optional(),
  descriptionEn: z.string().max(5000).optional().nullable(),
  descriptionKo: z.string().max(5000).optional().nullable(),
  long: z.any().optional(),
  highlights: z.any().optional(),
  best: z.any().optional(),
  x: z.union([z.number(), z.string()]).optional(),
  y: z.union([z.number(), z.string()]).optional(),
  mapX: z.union([z.number(), z.string()]).optional(),
  mapY: z.union([z.number(), z.string()]).optional(),
  mapCoordinates: z.any().optional(),
});

export const experienceInputSchema = z.object({
  slug: z
    .string({ required_error: "Experience slug is required." })
    .min(2, "Slug must be at least 2 characters.")
    .max(120, "Slug cannot exceed 120 characters.")
    .regex(/^[a-z0-9-]+$/i, "Slug may only contain letters, numbers, and hyphens."),
  title: z.union([z.string(), z.object({ en: z.string().optional(), ko: z.string().optional() })]).optional(),
  titleEn: z.string().max(255).optional(),
  titleKo: z.string().max(255).optional().nullable(),
  category: z.string().max(100).optional(),
  duration: z.string().max(100).optional(),
  location: z.string().max(255).optional(),
  image: z.string().max(1000).optional(),
  text: z.any().optional(),
  description: z.any().optional(),
  descriptionEn: z.string().max(5000).optional(),
  descriptionKo: z.string().max(5000).optional().nullable(),
  highlights: z.any().optional(),
});

export const blogPostInputSchema = z.object({
  slug: z
    .string({ required_error: "Blog post slug is required." })
    .min(2, "Slug must be at least 2 characters.")
    .max(120, "Slug cannot exceed 120 characters.")
    .regex(/^[a-z0-9-]+$/i, "Slug may only contain letters, numbers, and hyphens."),
  title: z.union([z.string(), z.object({ en: z.string().optional(), ko: z.string().optional() })]).optional(),
  titleEn: z.string().max(255).optional(),
  titleKo: z.string().max(255).optional().nullable(),
  category: z.string().max(100).optional(),
  author: z.string().max(150).optional(),
  readTime: z.string().max(50).optional(),
  publishedAt: z.string().max(50).optional(),
  date: z.string().max(50).optional(),
  image: z.string().max(1000).optional(),
  excerpt: z.any().optional(),
  excerptEn: z.string().max(2000).optional(),
  excerptKo: z.string().max(2000).optional().nullable(),
  content: z.any().optional(),
  contentEn: z.string().max(50000).optional().nullable(),
  contentKo: z.string().max(50000).optional().nullable(),
});

export const galleryItemInputSchema = z.object({
  id: z.string().min(1, "Gallery item ID is required.").max(120),
  title: z.union([z.string(), z.object({ en: z.string().optional(), ko: z.string().optional() })]).optional(),
  titleEn: z.string().max(255).optional(),
  titleKo: z.string().max(255).optional().nullable(),
  category: z.string().max(100).optional(),
  image: z.string().min(1, "Image URL is required.").max(2000),
  location: z.string().max(200).optional().nullable(),
  featured: z.boolean().optional(),
  order: z.union([z.number(), z.string()]).optional(),
});

export const settingsInputSchema = z.object({
  siteSettings: z.record(z.any()).optional(),
  contact: z.record(z.any()).optional(),
  whyUs: z.array(z.any()).optional(),
  testimonials: z.array(z.any()).optional(),
  team: z.array(z.any()).optional(),
  gallery: z.array(z.any()).optional(),
});