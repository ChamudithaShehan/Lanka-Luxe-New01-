import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "lanka_luxe_secure_jwt_secret_key_2026_atelier";

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
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify JWT token from request
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
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
