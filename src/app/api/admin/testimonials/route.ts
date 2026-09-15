import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import type { Testimonial } from "@/data/site";
import crypto from "crypto";

function formatTestimonial(t: any): Testimonial {
  return {
    id: t.id,
    name: t.name,
    country: t.country,
    trip: t.trip,
    quote: {
      en: t.quoteEn || "",
      ko: t.quoteKo || t.quoteEn || "",
    },
    image: t.image,
    rating: t.rating,
  };
}

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();
    const rows = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    const testimonials = rows.map(formatTestimonial);
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
      for (let i = 0; i < body.length; i++) {
        const item = body[i];
        const id = item.id || `story_${Date.now()}_${i}`;
        const quoteEn = item.quote?.en || (typeof item.quote === "string" ? item.quote : "");
        const quoteKo = item.quote?.ko || null;
        await prisma.testimonial.upsert({
          where: { id },
          create: {
            id,
            name: item.name || "Anonymous Guest",
            country: item.country || "International",
            trip: item.trip || "Bespoke Journey",
            rating: typeof item.rating === "number" ? item.rating : 5,
            image: item.image || "https://i.ibb.co/SXBMzRGY/lanka-luxe-admin-default-exp.jpg",
            quoteEn,
            quoteKo,
            order: i + 1,
          },
          update: {
            name: item.name || "Anonymous Guest",
            country: item.country || "International",
            trip: item.trip || "Bespoke Journey",
            rating: typeof item.rating === "number" ? item.rating : 5,
            image: item.image || "https://i.ibb.co/SXBMzRGY/lanka-luxe-admin-default-exp.jpg",
            quoteEn,
            quoteKo,
            order: i + 1,
          },
        });
      }

      const all = await prisma.testimonial.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });
      return NextResponse.json({ success: true, testimonials: all.map(formatTestimonial) });
    }

    const item = body.testimonial || body;
    if (!item || !item.name?.trim()) {
      return NextResponse.json(
        { error: "Guest name is required" },
        { status: 400 }
      );
    }

    const quoteEn = item.quote?.en || (typeof item.quote === "string" ? item.quote : "");
    const quoteKo = item.quote?.ko || null;
    const name = item.name.trim();
    const country = item.country?.trim() || "International";
    const trip = item.trip?.trim() || "Bespoke Journey";
    const image = item.image?.trim() || "https://i.ibb.co/SXBMzRGY/lanka-luxe-admin-default-exp.jpg";
    const rating = typeof item.rating === "number" ? item.rating : 5;

    let targetId = item.id;
    if (!targetId) {
      // Check if existing record with same name and trip exists
      const existing = await prisma.testimonial.findFirst({
        where: { name, trip },
      });
      if (existing) {
        targetId = existing.id;
      } else {
        targetId = `story_${Date.now()}_${crypto.randomUUID().slice(0, 6)}`;
      }
    }

    const saved = await prisma.testimonial.upsert({
      where: { id: targetId },
      create: {
        id: targetId,
        name,
        country,
        trip,
        rating,
        image,
        quoteEn,
        quoteKo,
      },
      update: {
        name,
        country,
        trip,
        rating,
        image,
        quoteEn,
        quoteKo,
      },
    });

    const all = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      testimonial: formatTestimonial(saved),
      testimonials: all.map(formatTestimonial),
    });
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

    if (id) {
      await prisma.testimonial.delete({
        where: { id },
      }).catch((e) => {
        console.warn("Could not delete testimonial id", id, e?.message);
      });
    } else if (indexStr !== null) {
      const idx = parseInt(indexStr, 10);
      const all = await prisma.testimonial.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      });
      if (all[idx]) {
        await prisma.testimonial.delete({
          where: { id: all[idx].id },
        }).catch((e) => {
          console.warn("Could not delete testimonial at index", idx, e?.message);
        });
      }
    }

    const updated = await prisma.testimonial.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      message: "Story deleted",
      testimonials: updated.map(formatTestimonial),
    });
  } catch (error) {
    console.error("Admin DELETE testimonial error:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
