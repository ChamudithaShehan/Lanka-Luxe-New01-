import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword, signToken } from "@/lib/auth";

// Simple in-memory rate limiter: max 5 attempts per 15 minutes per IP
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true; // allowed
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return false; // blocked
  }

  entry.count += 1;
  return true; // allowed
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again in 15 minutes." },
        { status: 429 },
      );
    }

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

    // Auto-create the default admin user on first boot (only if DB is empty)
    if (!user && (cleanUsername === "admin" || cleanUsername === "iroshan")) {
      const userCount = await prisma.user.count();
      if (userCount === 0) {
        const defaultPass = process.env.ADMIN_DEFAULT_PASSWORD;
        if (!defaultPass) {
          return NextResponse.json(
            { error: "Server not configured. Set ADMIN_DEFAULT_PASSWORD in environment." },
            { status: 500 },
          );
        }
        // Only auto-create if the submitted password matches the env var
        if (password !== defaultPass) {
          return NextResponse.json(
            { error: "Invalid username or password." },
            { status: 401 },
          );
        }
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

    // Compare bcrypt password hash — no backdoors
    const valid = await comparePassword(password, user.passwordHash);

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

    // Set HTTP-only secure cookie
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

