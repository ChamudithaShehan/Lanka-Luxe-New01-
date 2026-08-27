import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sanitizeInput, getAuthSession } from "@/lib/auth";

// GET all inquiries (Admin protected)
export async function GET(req: NextRequest) {
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

// POST new lead (Public inquiry submission)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      country,
      tourSlug,
      travelers,
      travelDate,
      duration,
      budget,
      message,
    } = body;

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 },
      );
    }

    const reference = `LLJ-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;

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

    return NextResponse.json({
      success: true,
      reference: inquiry.reference,
      inquiry,
    });
  } catch (error) {
    console.error("Create inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to process inquiry submission." },
      { status: 500 },
    );
  }
}
