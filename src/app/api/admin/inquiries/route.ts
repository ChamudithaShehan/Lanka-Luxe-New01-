import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdminSession();

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
    });

    const mapped = inquiries.map((inq) => ({
      id: inq.id,
      createdAt: inq.createdAt.toISOString(),
      name: inq.name,
      email: inq.email,
      country: inq.country || "",
      dates: inq.travelDate || "",
      travelers: inq.travelers || "2",
      interest: inq.tourSlug || "custom",
      tour: inq.tourSlug || "",
      budget: inq.budget || "",
      message: inq.message || "",
      status: (inq.status?.toLowerCase() || "new") as
        | "new"
        | "in_progress"
        | "contacted"
        | "booked"
        | "archived",
      notes: inq.notes || "",
      reference: inq.reference,
    }));

    return NextResponse.json({ inquiries: mapped });
  } catch {
    return NextResponse.json(
      { error: "Unauthorized access to inquiries" },
      { status: 401 }
    );
  }
}
