import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await prisma.blogPost.delete({
      where: { slug: id },
    });
    return NextResponse.json({ success: true, message: "Blog post removed." });
  } catch (error) {
    console.error("Delete blog post error:", error);
    return NextResponse.json({ error: "Failed to delete blog post." }, { status: 500 });
  }
}
