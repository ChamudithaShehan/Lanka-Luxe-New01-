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
  userId: string;
  username: string;
  role: string;
}

/**
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
  } catch {
    return null;
  }
}

/**
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