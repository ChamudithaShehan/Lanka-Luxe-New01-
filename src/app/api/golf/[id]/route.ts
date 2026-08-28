import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await context.params;
    await prisma.golfCourse.delete({ where: { slug: id } });
    return NextResponse.json({ success: true, message: "Golf course removed." });
  } catch (error) {
    console.error("Delete golf course error:", error);
    return NextResponse.json({ error: "Failed to delete golf course." }, { status: 500 });
  }
}