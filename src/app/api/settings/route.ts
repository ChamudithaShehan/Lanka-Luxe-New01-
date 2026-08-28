import { requireAuth } from "@/lib/api-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { settingsInputSchema } from "@/lib/validations/content";

export async function GET() {
  try {
    const rows = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, any> = {};
    rows.forEach((r) => {
      try {
        settingsMap[r.key] = JSON.parse(r.value);
      } catch {
        settingsMap[r.key] = r.value;
      }
    });
    return NextResponse.json(settingsMap);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const rawBody = await req.json();
    const validation = settingsInputSchema.safeParse(rawBody);

    if (!validation.success) {
      const details = validation.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Invalid settings data.", details },
        { status: 400 },
      );
    }

    const body = validation.data;
    const { siteSettings, contact, whyUs, testimonials, team, gallery } = body;

    if (siteSettings) {
      await prisma.siteSetting.upsert({
        where: { key: "global_site_settings" },
        update: { value: JSON.stringify(siteSettings) },
        create: { key: "global_site_settings", value: JSON.stringify(siteSettings) },
      });
    }

    if (contact) {
      await prisma.siteSetting.upsert({
        where: { key: "global_contact" },
        update: { value: JSON.stringify(contact) },
        create: { key: "global_contact", value: JSON.stringify(contact) },
      });
    }

    if (whyUs) {
      await prisma.siteSetting.upsert({
        where: { key: "global_why_us" },
        update: { value: JSON.stringify(whyUs) },
        create: { key: "global_why_us", value: JSON.stringify(whyUs) },
      });
    }

    if (testimonials) {
      await prisma.siteSetting.upsert({
        where: { key: "global_testimonials" },
        update: { value: JSON.stringify(testimonials) },
        create: { key: "global_testimonials", value: JSON.stringify(testimonials) },
      });
    }

    if (team) {
      await prisma.siteSetting.upsert({
        where: { key: "global_team" },
        update: { value: JSON.stringify(team) },
        create: { key: "global_team", value: JSON.stringify(team) },
      });
    }

    if (gallery) {
      await prisma.siteSetting.upsert({
        where: { key: "global_gallery" },
        update: { value: JSON.stringify(gallery) },
        create: { key: "global_gallery", value: JSON.stringify(gallery) },
      });
    }

    return NextResponse.json({ success: true, message: "Settings saved to database." });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
  }
}