import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { verifySmtpConnection, sendSmtpEmail, type SmtpConfig } from "@/lib/mailer";
import { z } from "zod";

const testSmtpSchema = z.object({
  host: z.string().min(1, "SMTP Host is required").trim(),
  port: z.coerce.number().min(1).max(65535),
  secure: z.boolean().default(false),
  user: z.string().min(1, "SMTP Username / Email is required").trim(),
  pass: z.string().default(""),
  from: z.string().optional().default(""),
  testRecipient: z.string().email().optional(),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();

    const body = await req.json();
    const result = testSmtpSchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { host, port, secure, user, pass, from, testRecipient } = result.data;

    const config: SmtpConfig = {
      host,
      port,
      secure,
      user,
      pass,
      from: from || `"Lanka Luxe Journeys" <${user}>`,
    };

    // 1. Test socket handshake / credentials
    const verifyResult = await verifySmtpConnection(config);
    if (!verifyResult.success) {
      return NextResponse.json(
        {
          error:
            verifyResult.error ||
            "Failed to connect to SMTP server. Please check your credentials.",
        },
        { status: 400 }
      );
    }

    // 2. If a test recipient email was provided, send a test email
    if (testRecipient) {
      const sendResult = await sendSmtpEmail({
        to: testRecipient,
        toName: "Lanka Luxe Administrator",
        subject: "Lanka Luxe Journeys — SMTP Test Verification",
        content:
          "This is an automated verification transmission from Lanka Luxe Journeys. Your SMTP email configuration has connected successfully and is ready to dispatch bespoke travel itineraries.",
        customConfig: config,
      });

      if (!sendResult.success) {
        return NextResponse.json(
          {
            error: `Connection succeeded, but test email delivery failed: ${sendResult.error}`,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `SMTP handshake verified and test email sent to ${testRecipient}!`,
      });
    }

    return NextResponse.json({
      success: true,
      message: "SMTP handshake verified successfully! Connection established.",
    });
  } catch (err: any) {
    if (err.message?.includes("Admin authentication required")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: err.message || "Failed to test SMTP settings" },
      { status: 500 }
    );
  }
}
