import { NextRequest, NextResponse } from "next/server";
import { getAuthSession, TokenPayload } from "@/lib/auth";

/**
 * Verify the incoming request carries a valid admin JWT.
 * Returns the decoded session payload on success, or a 401 NextResponse on failure.
 */
export function requireAuth(req: NextRequest): TokenPayload | NextResponse {
  const session = getAuthSession(req);
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Admin access required." },
      { status: 401 },
    );
  }
  return session;
}
