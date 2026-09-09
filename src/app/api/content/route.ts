import { NextResponse } from "next/server";
import { getLiveContent } from "@/lib/content-db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const data = await getLiveContent();
    const response = NextResponse.json(data);
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    return response;
  } catch (error: any) {
    // Log technical error securely on the server side
    console.error("Database connection error in /api/content:", error?.message || error);

    // Never leak database credentials, connection strings, or internal stack traces to the client
    const response = NextResponse.json(
      {
        error: "Content is temporarily unavailable. Please try again later.",
        dbConnected: false,
        tours: [],
        golfCourses: [],
        destinations: [],
        experiences: [],
        posts: [],
        gallery: [],
        whyUs: [],
        testimonials: [],
        team: [],
        siteSettings: null,
        contact: null,
      },
      { status: 503 }
    );
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    return response;
  }
}
