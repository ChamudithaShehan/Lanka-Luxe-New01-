import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return NextResponse.json(
        { authenticated: false, error: "Not authenticated." },
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
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: "User no longer exists." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("Auth me check error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Failed to verify session." },
      { status: 500 }
    );
  }
}
