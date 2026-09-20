import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdminSession();

    const [globalSettings, globalContact, smtpSetting] = await Promise.all([
      prisma.siteSetting.findUnique({ where: { key: "global_site_settings" } }),
      prisma.siteSetting.findUnique({ where: { key: "global_contact" } }),
      prisma.siteSetting.findUnique({ where: { key: "smtp_config" } }),
    ]);

    let smtp = null;
    if (smtpSetting?.value) {
      try {
        smtp = JSON.parse(smtpSetting.value);
      } catch {}
    }

    // If no db smtp config, check env vars for defaults (masking password)
    if (!smtp) {
      smtp = {
        host: process.env.SMTP_HOST || "",
        port: process.env.SMTP_PORT || "587",
        secure: process.env.SMTP_SECURE === "true",
        user: process.env.SMTP_USER || "",
        pass: process.env.SMTP_PASS ? "••••••••" : "",
        from: process.env.SMTP_FROM || "",
      };
    }

    return NextResponse.json({
      siteSettings: globalSettings?.value ? JSON.parse(globalSettings.value) : null,
      contact: globalContact?.value ? JSON.parse(globalContact.value) : null,
      smtp,
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();
    const body = await req.json();
    const { siteSettings, contact, smtp } = body;

    const updates = [];

    if (siteSettings) {
      updates.push(
        prisma.siteSetting.upsert({
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
        prisma.siteSetting.upsert({
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

    if (smtp) {
      // If password was masked and unchanged, keep existing password
      let finalSmtp = { ...smtp };
      if (finalSmtp.pass === "••••••••" || !finalSmtp.pass) {
        const existingSmtp = await prisma.siteSetting.findUnique({
          where: { key: "smtp_config" },
        });
        if (existingSmtp?.value) {
          try {
            const parsed = JSON.parse(existingSmtp.value);
            finalSmtp.pass = parsed.pass || process.env.SMTP_PASS || "";
          } catch {}
        } else {
          finalSmtp.pass = process.env.SMTP_PASS || "";
        }
      }

      updates.push(
        prisma.siteSetting.upsert({
          where: { key: "smtp_config" },
          create: {
            id: "setting_smtp_config",
            key: "smtp_config",
            value: JSON.stringify(finalSmtp),
            updatedAt: new Date(),
          },
          update: {
            value: JSON.stringify(finalSmtp),
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
