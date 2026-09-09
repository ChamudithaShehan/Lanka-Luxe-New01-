import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
    )
    .trim()
    .toLowerCase(),
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),
});

export async function GET() {
  try {
    await requireAdminSession();

    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin list users error:", error);
    return NextResponse.json(
      { error: "Unauthorized or failed to retrieve admin users." },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();

    const body = await req.json();
    const result = createUserSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, name, password } = result.data;

    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      return NextResponse.json(
        { error: `An administrator with username '${username}' already exists.` },
        { status: 409 }
      );
    }

    // Hash password with 12 salt rounds
    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        name,
        passwordHash,
        role: "admin",
      },
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Admin user '${newUser.username}' created successfully.`,
      user: newUser,
    });
  } catch (error) {
    console.error("Admin create user error:", error);
    return NextResponse.json(
      { error: "Failed to create administrator account." },
      { status: 500 }
    );
  }
}
