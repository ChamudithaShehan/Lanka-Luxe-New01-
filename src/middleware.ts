import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "llj_session";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }
  return new TextEncoder().encode(secret);
}

async function verifyToken(token: string) {
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  const payload = sessionCookie ? await verifyToken(sessionCookie) : null;
  const isAuthenticatedAdmin = payload && payload.role === "admin";

  // If already logged in and visiting /admin/login, redirect to /admin
  if (pathname === "/admin/login") {
    if (isAuthenticatedAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Protect /admin routes (except login)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticatedAdmin) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect sensitive API routes
  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/upload")) {
    if (!isAuthenticatedAdmin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/upload/:path*",
  ],
};
