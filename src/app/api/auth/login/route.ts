import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword, signToken } from "@/lib/auth";
import { loginRateLimiter, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimitKey = `login:${ip}`;

    // 1. Check rate limit
    const rateLimit = await loginRateLimiter.check(rateLimitKey);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.retryAfterSeconds.toString(),
          },
        },
      );
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
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

    // Auto-create default admin user on first boot if DB is completely empty
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

    // Compare bcrypt password hash
    const valid = await comparePassword(password, user.passwordHash);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 },
      );
    }

    // Reset rate limiter on successful authentication
    await loginRateLimiter.reset(rateLimitKey);

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