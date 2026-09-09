import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters")
    .max(100, "New password must not exceed 100 characters"),
  confirmPassword: z.string(),
  targetUserId: z.string().optional(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirmation do not match.",
  path: ["confirmPassword"],
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdminSession();
    const body = await req.json();

    const result = changePasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword, targetUserId } = result.data;
    const isSelfChange = !targetUserId || targetUserId === session.userId;

    if (isSelfChange) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change your password." },
          { status: 400 }
        );
      }

      const currentUser = await prisma.user.findUnique({
        where: { id: session.userId },
      });

      if (!currentUser) {
        return NextResponse.json(
          { error: "Current user account not found." },
          { status: 404 }
        );
      }

      const isCurrentValid = await bcrypt.compare(
        currentPassword,
        currentUser.passwordHash
      );

      if (!isCurrentValid) {
        return NextResponse.json(
          { error: "Current password does not match. Please verify and try again." },
          { status: 400 }
        );
      }

      const isSamePassword = await bcrypt.compare(
        newPassword,
        currentUser.passwordHash
      );

      if (isSamePassword) {
        return NextResponse.json(
          { error: "New password cannot be identical to your current password." },
          { status: 400 }
        );
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: session.userId },
        data: { passwordHash: newPasswordHash },
      });

      return NextResponse.json({
        success: true,
        message: "Your password has been changed successfully.",
      });
    } else {
      // Admin resetting another admin's password
      const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
      });

      if (!targetUser) {
        return NextResponse.json(
          { error: "Target administrator account not found." },
          { status: 404 }
        );
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id: targetUserId },
        data: { passwordHash: newPasswordHash },
      });

      return NextResponse.json({
        success: true,
        message: `Password for administrator '${targetUser.username}' has been updated.`,
      });
    }
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 500 }
    );
  }
}
