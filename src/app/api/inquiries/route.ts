import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sanitizeInput } from "@/lib/auth";
import { inquiryRateLimiter, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";

const inquirySubmissionSchema = z.object({
  name: z.string().min(2, "Name is required (minimum 2 characters)").max(100).trim(),
  email: z.string().email("Valid email address is required").max(150).trim().toLowerCase(),
  phone: z.string().max(50).optional().default(""),
  country: z.string().max(100).optional().default(""),
  dates: z.string().max(100).optional().default(""),
  travelers: z.string().max(50).optional().default("2"),
  interest: z.string().max(100).optional().default("custom"),
  tour: z.string().max(200).optional().default(""),
  budget: z.string().max(100).optional().default(""),
  message: z.string().max(3000).optional().default(""),
  website: z.string().max(100).optional().default(""), // Honeypot
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitCheck = await inquiryRateLimiter.check(ip);

    if (!limitCheck.success) {
      return NextResponse.json(
        {
          error: `Too many submissions. Please try again in ${limitCheck.retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": limitCheck.retryAfter.toString(),
          },
        }
      );
    }

    const rawBody = await req.json();
    const result = inquirySubmissionSchema.safeParse(rawBody);

    if (!result.success) {
      const errorMsg = result.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const body = result.data;

    // Honeypot spam defense: If bot filled the hidden "website" field, return fake success
    if (body.website && body.website.trim().length > 0) {
      const fakeRef = `LLJ-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
      return NextResponse.json({
        success: true,
        reference: fakeRef,
        createdAt: new Date().toISOString(),
      });
    }

    const reference = `LLJ-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const id = `inq_${crypto.randomUUID()}`;

    const newInquiry = await prisma.inquiry.create({
      data: {
        id,
        reference,
        name: sanitizeInput(body.name),
        email: sanitizeInput(body.email).toLowerCase(),
        phone: sanitizeInput(body.phone || body.country || ""),
        country: body.country ? sanitizeInput(body.country) : null,
        tourSlug: sanitizeInput(body.tour || body.interest || ""),
        travelers: body.travelers ? sanitizeInput(body.travelers) : "2",
        travelDate: body.dates ? sanitizeInput(body.dates) : null,
        duration: "",
        budget: body.budget ? sanitizeInput(body.budget) : null,
        message: body.message ? sanitizeInput(body.message) : null,
        status: "new",
        notes: "",
        source: "Website Form",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        reference: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      reference: newInquiry.reference,
      createdAt: newInquiry.createdAt,
    });
  } catch (error) {
    console.error("Inquiry submission error:", error);
    return NextResponse.json(
      { error: "Failed to process your travel inquiry. Please try again." },
      { status: 500 }
    );
  }
}
