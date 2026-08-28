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

    const updated = await prisma.inquiry.update({
      where: { reference: id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes: notes ? sanitizeInput(notes) : null }),
      },
    });

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

    await prisma.inquiry.delete({
      where: { reference: id },
    });
    return NextResponse.json({ success: true, message: "Inquiry removed." });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return NextResponse.json({ error: "Failed to delete inquiry." }, { status: 500 });
  }
}