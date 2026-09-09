import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_NAME = "llj_session";
const SESSION_DURATION = 8 * 60 * 60; // 8 hours in seconds

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === "production";

  if (!secret || secret.trim().length === 0) {
    if (isProduction) {
      throw new Error(
        "FATAL SERVER CONFIGURATION ERROR: JWT_SECRET environment variable is missing in production."
      );
    }
    console.warn(
      "[DEV WARNING] JWT_SECRET is not set in environment. Using fallback for local development."
    );
    return new TextEncoder().encode(
      "lanka_luxe_development_secret_min_32_characters_key_2026"
    );
  }

  if (secret.length < 32 && isProduction) {
    throw new Error(
      "FATAL SERVER CONFIGURATION ERROR: JWT_SECRET must be at least 32 characters in production."
    );
  }

  return new TextEncoder().encode(secret);
}

import crypto from "crypto";
import type { NextRequest } from "next/server";

export interface SessionPayload {
  userId: string;
  username: string;
  role: string;
  expiresAt?: number;
}

export type TokenPayload = SessionPayload;

/**
 * Synchronously verifies a JWT session token with timing-safe HMAC SHA-256
 */
export function verifyToken(token: string): SessionPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const secret =
      process.env.JWT_SECRET ||
      (process.env.NODE_ENV !== "production"
        ? "lanka_luxe_development_secret_min_32_characters_key_2026"
        : "");
    if (!secret) return null;

    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(`${parts[0]}.${parts[1]}`)
      .digest("base64url");

    const sigBuf = Buffer.from(parts[2]);
    const expectedBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);

    if (payload.exp && typeof payload.exp === "number") {
      if (Date.now() / 1000 > payload.exp) return null;
    }

    if (
      typeof payload.userId === "string" &&
      typeof payload.username === "string" &&
      typeof payload.role === "string"
    ) {
      return {
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
        expiresAt: typeof payload.exp === "number" ? payload.exp * 1000 : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Extract and verify authentication from Request (Bearer header or HttpOnly Cookie)
 */
export function getAuthSession(req: NextRequest): SessionPayload | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const session = verifyToken(token);
    if (session && session.role === "admin") return session;
  }

  const sessionCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (sessionCookie) {
    const session = verifyToken(sessionCookie);
    if (session && session.role === "admin") return session;
  }

  const legacyCookie = req.cookies.get("llj_admin_token")?.value;
  if (legacyCookie) {
    const session = verifyToken(legacyCookie);
    if (session && session.role === "admin") return session;
  }

  return null;
}

/**
 * Creates a signed JWT session token valid for 8 hours.
 */
export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  const secret = getJwtSecret();
  // Strip out any previous expiresAt from payload before signing
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expiresAt, ...tokenData } = payload;
  return new SignJWT({ ...tokenData })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secret);
}

/**
 * Verifies a JWT session token and returns the payload if valid.
 */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload.userId === "string" &&
      typeof payload.username === "string" &&
      typeof payload.role === "string"
    ) {
      return {
        userId: payload.userId,
        username: payload.username,
        role: payload.role,
        expiresAt: typeof payload.exp === "number" ? payload.exp * 1000 : undefined,
      };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Reads and verifies the current session from Next.js server cookie store.
 */
export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/**
 * Server guard to ensure the current request is from an authenticated admin.
 * Returns the session if valid, or throws an error response.
 */
export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await getCurrentSession();
  if (!session || session.role !== "admin") {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Cookie options for the HttpOnly session cookie.
 */
export function getSessionCookieOptions(maxAge: number = SESSION_DURATION) {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/**
 * Basic HTML/script sanitization to prevent injection
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/[<>]/g, "").trim();
}
