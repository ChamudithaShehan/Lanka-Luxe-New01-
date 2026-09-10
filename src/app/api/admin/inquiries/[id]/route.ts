import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { z } from "zod";

const updateInquirySchema = z.object({
  status: z
    .enum(["new", "in_progress", "contacted", "booked", "archived"])
    .optional(),
  notes: z.string().max(3000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    const body = await req.json();
    const result = updateInquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid inquiry update data" },
        { status: 400 }
      );
    }

    const existing = await prisma.inquiry.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Inquiry record not found." },
        { status: 404 }
      );
    }

    const { status, notes } = result.data;
    const beforeCount = await prisma.inquiry.count();

    const updated = await prisma.inquiry.update({
      where: { id: existing.id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
        updatedAt: new Date(),
      },
    });

    const afterCount = await prisma.inquiry.count();
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[INQUIRY UPDATE] id=${existing.id} ref=${existing.reference} route=PATCH /api/admin/inquiries/${id} beforeCount=${beforeCount} afterCount=${afterCount} at ${new Date().toISOString()}`
      );
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("Update inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
    const { id } = await params;

    const existing = await prisma.inquiry.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Inquiry record not found." },
        { status: 404 }
      );
    }

    const beforeCount = await prisma.inquiry.count();

    await prisma.inquiry.delete({
      where: { id: existing.id },
    });

    const afterCount = await prisma.inquiry.count();
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[INQUIRY DELETE] id=${existing.id} ref=${existing.reference} route=DELETE /api/admin/inquiries/${id} beforeCount=${beforeCount} afterCount=${afterCount} at ${new Date().toISOString()}`
      );
    }

    return NextResponse.json({ success: true, message: "Inquiry deleted" });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
