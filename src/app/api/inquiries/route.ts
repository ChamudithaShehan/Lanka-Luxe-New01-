import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeInput } from "@/lib/auth";
import { requireAuth } from "@/lib/api-auth";

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

// POST new lead (Public inquiry submission - no auth required)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, country, tourSlug, travelers, travelDate, duration, budget, message } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 },
      );
    }

    const uuid = crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
    const reference = `LLJ-${new Date().getFullYear()}-${uuid}`;

    const inquiry = await prisma.inquiry.create({
      data: {
        reference,
        name: sanitizeInput(name),
        email: sanitizeInput(email).toLowerCase(),
        phone: sanitizeInput(phone),
        country: country ? sanitizeInput(country) : null,
        tourSlug: tourSlug ? sanitizeInput(tourSlug) : null,
        travelers: travelers ? sanitizeInput(travelers) : null,
        travelDate: travelDate ? sanitizeInput(travelDate) : null,
        duration: duration ? sanitizeInput(duration) : null,
        budget: budget ? sanitizeInput(budget) : null,
        message: message ? sanitizeInput(message) : null,
        status: "New",
      },
    });

    return NextResponse.json({ success: true, reference: inquiry.reference });
  } catch (error) {
    console.error("Create inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry submission." },
      { status: 500 },
    );
  }
}
