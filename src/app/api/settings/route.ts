import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  try {
    const body = await req.json();
    const { siteSettings, contact, whyUs, testimonials, team } = body;

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

    return NextResponse.json({ success: true, message: "Settings saved to database." });
  } catch (error) {
    console.error("Save settings error:", error);
    return NextResponse.json({ error: "Failed to save settings." }, { status: 500 });
  }
}
