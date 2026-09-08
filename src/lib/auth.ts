<<<<<<< Updated upstream
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

/**
 * Validates and retrieves the JWT secret.
 * In production: Throws a fatal server error if missing, empty, or < 32 characters.
 * In development: Uses environment variable or a development fallback with warning.
 */
export function getRequiredJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  const isProduction = process.env.NODE_ENV === "production";

  if (!secret || secret.trim().length === 0) {
    if (isProduction) {
      throw new Error(
        "FATAL SERVER CONFIGURATION ERROR: JWT_SECRET environment variable is missing or empty in production.",
      );
    }
    console.warn(
      "[DEV WARNING] JWT_SECRET is not set in environment. Using development fallback. Set a secure JWT_SECRET in .env.",
    );
    return "dev_fallback_jwt_secret_min_32_characters_long_for_local_testing";
  }

  if (secret.length < 32) {
    if (isProduction) {
      throw new Error(
        "FATAL SERVER CONFIGURATION ERROR: JWT_SECRET must be at least 32 characters long in production.",
      );
    }
    console.warn(
      "[DEV WARNING] JWT_SECRET is shorter than 32 characters. Use a 256-bit+ secure random secret for production.",
    );
  }

  return secret;
}

export interface TokenPayload {
=======
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const COOKIE_NAME = "llj_session";
const SESSION_DURATION = 8 * 60 * 60; // 8 hours in seconds

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing.");
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
>>>>>>> Stashed changes
  userId: string;
  username: string;
  role: string;
}

/**
<<<<<<< Updated upstream
 * Hash password securely with bcrypt (12 rounds salt)
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

/**
 * Compare plain password against bcrypt hash
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Sign JWT token for admin session (valid for 7 days)
 */
export function signToken(payload: TokenPayload): string {
  const secret = getRequiredJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

/**
 * Verify JWT token from request
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const secret = getRequiredJwtSecret();
    return jwt.verify(token, secret) as TokenPayload;
=======
 * Creates a signed JWT session token valid for 8 hours.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secret = getJwtSecret();
  return new SignJWT({ ...payload })
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
      };
    }
    return null;
>>>>>>> Stashed changes
  } catch {
    return null;
  }
}

/**
<<<<<<< Updated upstream
 * Extract and verify authentication from Request (Bearer header or Cookie)
 */
export function getAuthSession(req: NextRequest): TokenPayload | null {
  // 1. Check Authorization header
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const verified = verifyToken(token);
    if (verified) return verified;
  }

  // 2. Check Cookie
  const cookieToken = req.cookies.get("llj_admin_token")?.value;
  if (cookieToken) {
    const verified = verifyToken(cookieToken);
    if (verified) return verified;
  }

  return null;
}

/**
 * Basic HTML/script sanitization to prevent injection
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "")
    .trim();
}
=======
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
>>>>>>> Stashed changes
