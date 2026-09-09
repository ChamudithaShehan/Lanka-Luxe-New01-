import { NextResponse } from "next/server";
import {
  getCurrentSession,
  createSessionToken,
  getSessionCookieOptions,
  COOKIE_NAME,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getCurrentSession();

    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { authenticated: false, error: "Session expired or unauthorized." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        username: true,
        role: true,
        name: true,
      },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { authenticated: false, error: "User no longer exists or lacks admin role." },
        { status: 401 }
      );
    }

    const newSessionToken = await createSessionToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    const cookieOptions = getSessionCookieOptions();

    const response = NextResponse.json({
      success: true,
      authenticated: true,
      user,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000,
      serverTime: Date.now(),
    });

    response.cookies.set({
      ...cookieOptions,
      name: COOKIE_NAME,
      value: newSessionToken,
    });

    return response;
  } catch (error) {
    console.error("Session refresh error:", error);
    return NextResponse.json(
      { error: "Failed to renew session." },
      { status: 500 }
    );
  }
}
