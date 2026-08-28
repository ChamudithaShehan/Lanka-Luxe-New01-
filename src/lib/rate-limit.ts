import type { NextRequest } from "next/server";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number; // Unix timestamp in ms
  retryAfterSeconds: number;
}

export interface RateLimiter {
  check(key: string): Promise<RateLimitResult>;
  recordFailure?(key: string): Promise<RateLimitResult>;
  reset(key: string): Promise<void>;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/**
 * In-Memory Sliding Window Rate Limiter.
 *
 * NOTE FOR DISTRIBUTED PRODUCTION DEPLOYMENTS:
 * For multi-region serverless (e.g. Vercel Edge, AWS Lambda) or multi-container clusters,
 * swap this implementation with Upstash Redis (@upstash/ratelimit) or a central Redis store.
 * This in-memory implementation provides reliable protection for single-instance Node.js runtimes
 * and local development with automatic expired key purging.
 */
export class MemoryRateLimiter implements RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private maxAttempts: number;
  private windowMs: number;
  private lastCleanup = Date.now();

  constructor(options: { maxAttempts: number; windowMs: number }) {
    this.maxAttempts = options.maxAttempts;
    this.windowMs = options.windowMs;
  }

  /**
   * Purge expired entries to prevent memory leaks during sustained traffic.
   */
  private cleanup(): void {
    const now = Date.now();
    // Run cleanup at most once per 60 seconds
    if (now - this.lastCleanup < 60000) return;
    this.lastCleanup = now;

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetAt) {
        this.store.delete(key);
      }
    }
  }

  async check(key: string): Promise<RateLimitResult> {
    this.cleanup();
    const now = Date.now();
    let entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      entry = { count: 1, resetAt: now + this.windowMs };
      this.store.set(key, entry);
      return {
        success: true,
        limit: this.maxAttempts,
        remaining: this.maxAttempts - 1,
        resetAt: entry.resetAt,
        retryAfterSeconds: Math.ceil(this.windowMs / 1000),
      };
    }

    if (entry.count >= this.maxAttempts) {
      const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      return {
        success: false,
        limit: this.maxAttempts,
        remaining: 0,
        resetAt: entry.resetAt,
        retryAfterSeconds,
      };
    }

    entry.count += 1;
    const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
    return {
      success: true,
      limit: this.maxAttempts,
      remaining: this.maxAttempts - entry.count,
      resetAt: entry.resetAt,
      retryAfterSeconds,
    };
  }

  async reset(key: string): Promise<void> {
    this.store.delete(key);
  }
}

/**
 * Extracts and sanitizes client IP address from NextRequest.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return firstIp;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

// 1. Login Rate Limiter: 5 attempts per 15 minutes
export const loginRateLimiter = new MemoryRateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

// 2. Inquiry Submission Rate Limiter: 5 submissions per 10 minutes
export const inquiryRateLimiter = new MemoryRateLimiter({
  maxAttempts: 5,
  windowMs: 10 * 60 * 1000, // 10 minutes
});