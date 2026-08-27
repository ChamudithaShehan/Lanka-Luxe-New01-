import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword, signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 },
      );
    }

    const cleanUsername = username.trim().toLowerCase();

    // Look up user in SQL database
    let user = await prisma.user.findUnique({
      where: { username: cleanUsername },
    });

    // Auto-create default admin user if database was just initialized
    if (!user && (cleanUsername === "admin" || cleanUsername === "iroshan")) {
      const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
      if (password === defaultPass || password === "lankaluxe2026" || password === "c-1734") {
        const passwordHash = await hashPassword(defaultPass);
        user = await prisma.user.create({
          data: {
            username: cleanUsername,
            passwordHash,
            name: "Iroshan Jayawickrame",
            role: "admin",
          },
        });
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    // Compare bcrypt password hash (or fallback master passkeys for founder convenience)
    const valid =
      (await comparePassword(password, user.passwordHash)) ||
      password === "lankaluxe2026" ||
      password === "admin123" ||
      password === "c-1734";

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    // Sign JWT token
    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    // Set HTTP-only secure cookie for additional security
    response.cookies.set("llj_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 },
    );
  }
}
