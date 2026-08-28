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
    await prisma.experience.delete({ where: { slug: id } });
    return NextResponse.json({ success: true, message: "Experience removed." });
  } catch (error) {
    console.error("Delete experience error:", error);
    return NextResponse.json({ error: "Failed to delete experience." }, { status: 500 });
  }
}