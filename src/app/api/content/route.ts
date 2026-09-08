import { NextResponse } from "next/server";
import { getLiveContent } from "@/lib/content-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getLiveContent();
    const response = NextResponse.json(data);
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    return response;
  } catch (error) {
    console.error("Failed to fetch public content:", error);
    return NextResponse.json(
      { error: "Failed to load content." },
      { status: 500 }
    );
  }
}
