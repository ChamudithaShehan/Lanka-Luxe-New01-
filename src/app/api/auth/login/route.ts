import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSessionToken, getSessionCookieOptions } from "@/lib/auth";
import { loginRateLimiter, getClientIp } from "@/lib/rate-limit";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(100).trim(),
  password: z.string().min(1, "Password is required").max(200),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitCheck = await loginRateLimiter.check(ip);

    if (!limitCheck.success) {
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${limitCheck.retryAfter} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": limitCheck.retryAfter.toString(),
          },
        }
      );
    }

    const body = await req.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid credentials format." },
        { status: 400 }
      );
    }

    const { username, password } = parseResult.data;

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
    });

    if (!user) {
      // Timing attack mitigation: dummy hash compare prevents username enumeration
      await bcrypt.compare(
        password,
        "$2b$12$e8Y5KxJ9M9uEw0zXf9E0u.wD7aIq5YvM6X8jK9P0L1N2O3P4Q5R6S"
      );
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password." },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    loginRateLimiter.reset(ip);

    const sessionToken = await createSessionToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    const cookieOptions = getSessionCookieOptions();

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });

    response.cookies.set({
      ...cookieOptions,
      value: sessionToken,
    });

    return response;
  } catch (error) {
    console.error("Authentication login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during authentication." },
      { status: 500 }
    );
  }
}
