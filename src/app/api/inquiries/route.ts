import { NextRequest, NextResponse } from "next/server";
<<<<<<< Updated upstream
import { prisma } from "@/lib/prisma";
import { sanitizeInput } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";
import { inquiryRateLimiter, getClientIp } from "@/lib/rate-limit";
import { createInquirySchema } from "@/lib/validations/inquiry";

// GET all inquiries (Admin protected)
export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Fetch inquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries." }, { status: 500 });
  }
}

// POST new lead (Public inquiry submission with rate limiting and honeypot spam protection)
export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate limiting: 5 submissions per 10 minutes
    const ip = getClientIp(req);
    const rateLimit = await inquiryRateLimiter.check(`inquiry:${ip}`);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many inquiry submissions. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfterSeconds.toString(),
          },
        },
      );
    }

    const rawBody = await req.json();

    // 2. Schema Validation using Zod
    const validation = createInquirySchema.safeParse(rawBody);
    if (!validation.success) {
      const details = validation.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Invalid inquiry submission data.", details },
        { status: 400 },
      );
    }

    const body = validation.data;

    // 3. Honeypot check: If bot filled the hidden "website" field, return fake success without saving
    if (body.website && body.website.trim().length > 0) {
      const fakeUuid = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
      return NextResponse.json({
        success: true,
        reference: `LLJ-${new Date().getFullYear()}-${fakeUuid}`,
      });
    }

    // 4. Collision-safe UUID Reference Code
    const uuid = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
    const reference = `LLJ-${new Date().getFullYear()}-${uuid}`;

    const inquiry = await prisma.inquiry.create({
      data: {
        reference,
        name: sanitizeInput(body.name),
        email: sanitizeInput(body.email).toLowerCase(),
        phone: body.phone && body.phone.trim().length > 0 ? sanitizeInput(body.phone) : "Not specified",
        country: body.country ? sanitizeInput(body.country) : null,
        tourSlug: body.tourSlug ? sanitizeInput(body.tourSlug) : null,
        travelers: body.travelers ? sanitizeInput(body.travelers) : null,
        travelDate: body.travelDate ? sanitizeInput(body.travelDate) : null,
        duration: body.duration ? sanitizeInput(body.duration) : null,
        budget: body.budget ? sanitizeInput(body.budget) : null,
        message: body.message ? sanitizeInput(body.message) : null,
        status: "New",
=======
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const inquirySubmissionSchema = z.object({
  name: z.string().min(2, "Name is required").max(100).trim(),
  email: z.string().email("Valid email is required").max(150).trim().toLowerCase(),
  phone: z.string().max(50).optional().default(""),
  country: z.string().max(100).optional().default(""),
  dates: z.string().max(100).optional().default(""),
  travelers: z.string().max(50).optional().default("2"),
  interest: z.string().max(100).optional().default("custom"),
  tour: z.string().max(200).optional().default(""),
  budget: z.string().max(100).optional().default(""),
  message: z.string().max(3000).optional().default(""),
});

// Simple in-memory rate limiting map for customer inquiry submissions (5 per 10 mins per IP)
const ipSubmissionTracker = new Map<string, { count: number; resetTime: number }>();

function checkInquiryRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxSubmissions = 5;

  const record = ipSubmissionTracker.get(ip);
  if (!record || now > record.resetTime) {
    ipSubmissionTracker.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxSubmissions) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    if (!checkInquiryRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const result = inquirySubmissionSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const {
      name,
      email,
      phone,
      country,
      dates,
      travelers,
      interest,
      tour,
      budget,
      message,
    } = result.data;

    const reference = `LLJ-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const id = `inq_${crypto.randomUUID()}`;

    const newInquiry = await prisma.inquiry.create({
      data: {
        id,
        reference,
        name,
        email,
        phone: phone || country || "",
        country,
        tourSlug: tour || interest || "",
        travelers,
        travelDate: dates,
        duration: "",
        budget,
        message,
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
>>>>>>> Stashed changes
      },
    });

    return NextResponse.json({
      success: true,
<<<<<<< Updated upstream
      reference: inquiry.reference,
    });
  } catch (error) {
    console.error("Create inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry submission." },
      { status: 500 },
    );
  }
}
=======
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
>>>>>>> Stashed changes
