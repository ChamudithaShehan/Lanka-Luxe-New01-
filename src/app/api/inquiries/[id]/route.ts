import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { sanitizeInput } from "@/lib/auth";
import { updateInquirySchema } from "@/lib/validations/inquiry";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json({ error: "Invalid inquiry reference ID." }, { status: 400 });
    }

    const rawBody = await req.json();
    const validation = updateInquirySchema.safeParse(rawBody);

    if (!validation.success) {
      const details = validation.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Invalid inquiry update data.", details },
        { status: 400 },
      );
    }

    const { status, notes } = validation.data;

    const existing = await prisma.inquiry.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    const beforeCount = await prisma.inquiry.count();

    const updated = await prisma.inquiry.update({
      where: { id: existing.id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes: notes ? sanitizeInput(notes) : null }),
      },
    });

    const afterCount = await prisma.inquiry.count();
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[INQUIRY UPDATE] id=${existing.id} ref=${existing.reference} route=PATCH /api/inquiries/${id} beforeCount=${beforeCount} afterCount=${afterCount} at ${new Date().toISOString()}`
      );
    }

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    console.error("Update inquiry error:", error);
    return NextResponse.json({ error: "Failed to update inquiry." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    if (!id || typeof id !== "string" || id.trim().length === 0) {
      return NextResponse.json({ error: "Invalid inquiry reference ID." }, { status: 400 });
    }

    const existing = await prisma.inquiry.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Inquiry not found." }, { status: 404 });
    }

    const beforeCount = await prisma.inquiry.count();

    await prisma.inquiry.delete({
      where: { id: existing.id },
    });

    const afterCount = await prisma.inquiry.count();
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[INQUIRY DELETE] id=${existing.id} ref=${existing.reference} route=DELETE /api/inquiries/${id} beforeCount=${beforeCount} afterCount=${afterCount} at ${new Date().toISOString()}`
      );
    }

    return NextResponse.json({ success: true, message: "Inquiry removed." });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}