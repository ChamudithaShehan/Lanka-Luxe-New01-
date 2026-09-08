import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json();
    const { siteSettings, contact } = body;

    const updates = [];

    if (siteSettings) {
      updates.push(
        prisma.sitesetting.upsert({
          where: { key: "global_site_settings" },
          create: {
            id: "setting_global_site",
            key: "global_site_settings",
            value: JSON.stringify(siteSettings),
            updatedAt: new Date(),
          },
          update: {
            value: JSON.stringify(siteSettings),
            updatedAt: new Date(),
          },
        })
      );
    }

    if (contact) {
      updates.push(
        prisma.sitesetting.upsert({
          where: { key: "global_contact" },
          create: {
            id: "setting_global_contact",
            key: "global_contact",
            value: JSON.stringify(contact),
            updatedAt: new Date(),
          },
          update: {
            value: JSON.stringify(contact),
            updatedAt: new Date(),
          },
        })
      );
    }

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true, message: "Settings saved" });
  } catch (error) {
    console.error("Admin save settings error:", error);
    return NextResponse.json(
      { error: "Failed to save site settings" },
      { status: 500 }
    );
  }
}
