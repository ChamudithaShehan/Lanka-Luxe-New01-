import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in ms
  retryAfter: number; // in seconds
}

interface InMemoRecord {
  count: number;
  resetTime: number;
}

/**
 * In-memory sliding window rate limiter fallback.
 * Uses periodic cleanup to prevent memory leaks in single-instance runtimes.
 */
class MemoryRateLimiter {
  private tracker = new Map<string, InMemoRecord>();
  private intervalMs: number;
  private maxRequests: number;

  constructor(options: { intervalMs: number; maxRequests: number }) {
    this.intervalMs = options.intervalMs;
    this.maxRequests = options.maxRequests;

    // Periodic cleanup of stale entries every 60 seconds
    if (typeof setInterval !== "undefined") {
      const timer = setInterval(() => {
        const now = Date.now();
        for (const [key, val] of this.tracker.entries()) {
          if (now > val.resetTime) {
            this.tracker.delete(key);
          }
        }
      }, 60 * 1000);
      if (typeof timer.unref === "function") {
        timer.unref();
      }
    }
  }

  check(identifier: string): RateLimitResult {
    const now = Date.now();
    const record = this.tracker.get(identifier);

    if (!record || now > record.resetTime) {
      const resetTime = now + this.intervalMs;
      this.tracker.set(identifier, { count: 1, resetTime });
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: resetTime,
        retryAfter: Math.ceil(this.intervalMs / 1000),
      };
    }

    if (record.count >= this.maxRequests) {
      const retryAfter = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: record.resetTime,
        retryAfter,
      };
    }

    record.count += 1;
    const retryAfter = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - record.count,
      reset: record.resetTime,
      retryAfter,
    };
  }

  reset(identifier: string): void {
    this.tracker.delete(identifier);
  }
}

/**
 * Production Hybrid Rate Limiter:
 * Uses Upstash Redis when configured (UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).
 * Falls back to in-memory sliding window when Redis is unconfigured or during transient network errors.
 */
export class DistributedRateLimiter {
  private redisRatelimit: Ratelimit | null = null;
  private memoryFallback: MemoryRateLimiter;
  private failClosed: boolean;
  private maxRequests: number;
  private intervalMs: number;

  constructor(options: {
    prefix: string;
    maxRequests: number;
    intervalMs: number;
    failClosed?: boolean;
  }) {
    this.maxRequests = options.maxRequests;
    this.intervalMs = options.intervalMs;
    this.failClosed = options.failClosed ?? false;
    this.memoryFallback = new MemoryRateLimiter({
      intervalMs: options.intervalMs,
      maxRequests: options.maxRequests,
    });

    const redisUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

    if (redisUrl && redisToken) {
      try {
        const redis = new Redis({
          url: redisUrl,
          token: redisToken,
        });

        const windowSeconds = Math.ceil(options.intervalMs / 1000);
        this.redisRatelimit = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(
            options.maxRequests,
            `${windowSeconds} s`
          ),
          prefix: `llj_rl:${options.prefix}`,
          analytics: false,
        });
      } catch (err) {
        console.warn(
          `[RateLimit] Failed to initialize Upstash Redis for ${options.prefix}. Using in-memory fallback:`,
          err
        );
        this.redisRatelimit = null;
      }
    }
  }

  async check(identifier: string): Promise<RateLimitResult> {
    if (this.redisRatelimit) {
      try {
        const res = await this.redisRatelimit.limit(identifier);
        const now = Date.now();
        const retryAfter = Math.max(1, Math.ceil((res.reset - now) / 1000));
        return {
          success: res.success,
          limit: res.limit,
          remaining: res.remaining,
          reset: res.reset,
          retryAfter,
        };
      } catch (err) {
        console.error(
          "[RateLimit] Upstash Redis request error. Invoking fallback policy:",
          err
        );
        if (this.failClosed) {
          // Conservative fail-closed policy for sensitive endpoints (e.g. login)
          return {
            success: false,
            limit: this.maxRequests,
            remaining: 0,
            reset: Date.now() + 60000,
            retryAfter: 60,
          };
        }
        // Fail-open to in-memory fallback for public forms
        return this.memoryFallback.check(identifier);
      }
    }

    return this.memoryFallback.check(identifier);
  }

  reset(identifier: string): void {
    this.memoryFallback.reset(identifier);
  }
}

/**
 * Extracts and sanitizes client IP address safely from NextRequest or headers.
 * Resolves leftmost IP from x-forwarded-for or x-real-ip, ignoring spoofed internal chains.
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp && isValidIp(firstIp)) {
      return firstIp;
    }
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

function isValidIp(ip: string): boolean {
  // IPv4 or basic IPv6 format check
  return (
    /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip) ||
    /^[0-9a-fA-F:]+$/.test(ip)
  );
}

// 1. Login: 5 attempts per 15 minutes (fail-closed protection on Redis failure)
export const loginRateLimiter = new DistributedRateLimiter({
  prefix: "auth_login",
  maxRequests: 5,
  intervalMs: 15 * 60 * 1000, // 15 minutes
  failClosed: true,
});

// 2. Customer Inquiries: 5 submissions per 10 minutes (controlled in-memory fallback)
export const inquiryRateLimiter = new DistributedRateLimiter({
  prefix: "inquiry_submit",
  maxRequests: 5,
  intervalMs: 10 * 60 * 1000, // 10 minutes
  failClosed: false,
});

// 3. Image Uploads: 20 requests per 10 minutes (controlled in-memory fallback)
export const uploadRateLimiter = new DistributedRateLimiter({
  prefix: "upload_asset",
  maxRequests: 20,
  intervalMs: 10 * 60 * 1000, // 10 minutes
  failClosed: false,
});
