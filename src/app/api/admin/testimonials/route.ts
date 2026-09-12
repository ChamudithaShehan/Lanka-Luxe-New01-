import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import type { Testimonial } from "@/data/site";
import crypto from "crypto";

function parseTestimonials(raw: string | null | undefined): Testimonial[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && typeof item === "object")
      .map((t: any, idx: number) => ({
        id: t.id ? String(t.id) : `story_${idx + 1}`,
        name: t.name || t.author || "Guest",
        country: t.country || "International",
        trip: t.trip || t.role || "Bespoke Journey",
        quote: t.quote || t.text || { en: "", ko: "" },
        image:
          t.image ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        rating: typeof t.rating === "number" ? t.rating : 5,
      }));
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "global_testimonials" },
    });
    const testimonials = parseTestimonials(setting?.value);
    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error("Admin GET testimonials error:", error);
    return NextResponse.json(
      { error: "Failed to load testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json();

    // Check if bulk array is provided
    if (Array.isArray(body)) {
      const sanitized = body.map((item: any, idx: number) => ({
        id: item.id || `story_${Date.now()}_${idx}`,
        quote: {
          en: item.quote?.en || "",
          ko: item.quote?.ko || "",
        },
        name: item.name || "Anonymous Guest",
        country: item.country || "International",
        trip: item.trip || "Bespoke Journey",
        image: item.image || "https://i.ibb.co/SXBMzRGY/lanka-luxe-admin-default-exp.jpg",
        rating: typeof item.rating === "number" ? item.rating : 5,
      }));

      await prisma.siteSetting.upsert({
        where: { key: "global_testimonials" },
        create: {
          id: "setting_global_testimonials",
          key: "global_testimonials",
          value: JSON.stringify(sanitized),
          updatedAt: new Date(),
        },
        update: {
          value: JSON.stringify(sanitized),
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({ success: true, testimonials: sanitized });
    }

    const item = body.testimonial || body;
    if (!item || !item.name) {
      return NextResponse.json(
        { error: "Guest name is required" },
        { status: 400 }
      );
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key: "global_testimonials" },
    });
    const testimonials = parseTestimonials(setting?.value);

    const testimonialId = item.id || `story_${Date.now()}_${crypto.randomUUID().slice(0, 6)}`;
    const newOrUpdated: Testimonial = {
      id: testimonialId,
      quote: {
        en: item.quote?.en || "",
        ko: item.quote?.ko || "",
      },
      name: item.name.trim(),
      country: item.country?.trim() || "International",
      trip: item.trip?.trim() || "Bespoke Journey",
      image: item.image?.trim() || "https://i.ibb.co/SXBMzRGY/lanka-luxe-admin-default-exp.jpg",
      rating: typeof item.rating === "number" ? item.rating : 5,
    };

    const existingIndex = testimonials.findIndex(
      (t) => (t && t.id === testimonialId) || (t && t.name === newOrUpdated.name && t.trip === newOrUpdated.trip)
    );

    let updatedList: Testimonial[];
    if (existingIndex >= 0) {
      updatedList = [...testimonials];
      updatedList[existingIndex] = newOrUpdated;
    } else {
      updatedList = [newOrUpdated, ...testimonials];
    }

    await prisma.siteSetting.upsert({
      where: { key: "global_testimonials" },
      create: {
        id: "setting_global_testimonials",
        key: "global_testimonials",
        value: JSON.stringify(updatedList),
        updatedAt: new Date(),
      },
      update: {
        value: JSON.stringify(updatedList),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, testimonial: newOrUpdated, testimonials: updatedList });
  } catch (error) {
    console.error("Admin POST testimonial error:", error);
    return NextResponse.json(
      { error: "Failed to save testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const indexStr = searchParams.get("index");

    if (!id && indexStr === null) {
      return NextResponse.json(
        { error: "Story ID or index is required" },
        { status: 400 }
      );
    }

    const setting = await prisma.siteSetting.findUnique({
      where: { key: "global_testimonials" },
    });
    const testimonials = parseTestimonials(setting?.value);

    let updatedList: Testimonial[];
    if (id) {
      updatedList = testimonials.filter((t) => t && t.id !== id);
    } else {
      const idx = parseInt(indexStr!, 10);
      updatedList = testimonials.filter((_, i) => i !== idx);
    }

    await prisma.siteSetting.upsert({
      where: { key: "global_testimonials" },
      create: {
        id: "setting_global_testimonials",
        key: "global_testimonials",
        value: JSON.stringify(updatedList),
        updatedAt: new Date(),
      },
      update: {
        value: JSON.stringify(updatedList),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Story deleted", testimonials: updatedList });
  } catch (error) {
    console.error("Admin DELETE testimonial error:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
