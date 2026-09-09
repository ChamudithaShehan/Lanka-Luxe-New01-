import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdminSession();
    const { id } = await props.params;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // Guard: Prevent deleting own account
    if (session.userId === id) {
      return NextResponse.json(
        { error: "You cannot delete your own administrator account." },
        { status: 400 }
      );
    }

    // Guard: Prevent deleting the last remaining admin
    const totalAdmins = await prisma.user.count({
      where: { role: "admin" },
    });

    if (totalAdmins <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the only remaining administrator account." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Administrator account not found." },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: `Administrator '${targetUser.username}' has been deleted.`,
    });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete administrator account." },
      { status: 500 }
    );
  }
}
