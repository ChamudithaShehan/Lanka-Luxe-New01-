import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    await requireAdminSession();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "0");

    let inquiries;
    let paginationMeta = undefined;

    if (page > 0 && limit > 0) {
      const [total, items] = await Promise.all([
        prisma.inquiry.count(),
        prisma.inquiry.findMany({
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);
      inquiries = items;
      paginationMeta = {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
    } else {
      inquiries = await prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
      });
    }

    const mapped = inquiries.map((inq) => {
      const rawStatus = (inq.status || "new").toLowerCase().replace(/\s+/g, "_");
      const normalizedStatus = (
        ["new", "in_progress", "contacted", "booked", "archived"].includes(rawStatus)
          ? rawStatus
          : "new"
      ) as "new" | "in_progress" | "contacted" | "booked" | "archived";

      return {
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
        status: normalizedStatus,
        notes: inq.notes || "",
        reference: inq.reference,
      };
    });

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[INQUIRY QUERY] GET /api/admin/inquiries - Returned ${mapped.length} records from MySQL at ${new Date().toISOString()}`
      );
    }

    const response = NextResponse.json({
      inquiries: mapped,
      ...(paginationMeta ? { pagination: paginationMeta } : {}),
    });
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    return response;
  } catch {
    return NextResponse.json(
      { error: "Unauthorized access to inquiries" },
      { status: 401 }
    );
  }
}
