import { NextRequest, NextResponse } from "next/server";
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
      },
    });

    return NextResponse.json({
      success: true,
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