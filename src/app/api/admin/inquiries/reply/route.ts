import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { sendSmtpEmail } from "@/lib/mailer";
import { z } from "zod";

const replySchema = z.object({
  inquiryId: z.string().optional(),
  to: z.string().email("Valid recipient email is required").trim().toLowerCase(),
  toName: z.string().optional().default("Valued Guest"),
  subject: z.string().min(2, "Subject is required").trim(),
  message: z.string().min(5, "Message must be at least 5 characters").trim(),
  updateStatus: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  try {
    await requireAdminSession();

    const body = await req.json();
    const result = replySchema.safeParse(body);

    if (!result.success) {
      const errorMsg = result.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const { inquiryId, to, toName, subject, message, updateStatus } = result.data;

    let reference = undefined;
    let existingInquiry = null;

    if (inquiryId) {
      existingInquiry = await prisma.inquiry.findFirst({
        where: {
          OR: [{ id: inquiryId }, { reference: inquiryId }],
        },
      });
      if (existingInquiry) {
        reference = existingInquiry.reference;
      }
    }

    // Attempt to send email via SMTP
    const mailResult = await sendSmtpEmail({
      to,
      toName,
      subject,
      content: message,
      reference,
    });

    if (!mailResult.success) {
      return NextResponse.json(
        {
          error:
            mailResult.error ||
            "Failed to send email. Please check your SMTP settings.",
        },
        { status: 502 }
      );
    }

    // If linked to an inquiry, update inquiry status and record note
    if (existingInquiry) {
      const dateStr = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const noteEntry = `[SMTP Email Sent on ${dateStr}]: Subject: "${subject}"`;
      const updatedNotes = existingInquiry.notes
        ? `${existingInquiry.notes}\n${noteEntry}`
        : noteEntry;

      const newStatus =
        updateStatus && existingInquiry.status === "new"
          ? "contacted"
          : existingInquiry.status;

      await prisma.inquiry.update({
        where: { id: existingInquiry.id },
        data: {
          status: newStatus,
          notes: updatedNotes,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      messageId: mailResult.messageId,
      message: `Email successfully sent to ${to}`,
    });
  } catch (err: any) {
    if (err.message?.includes("Admin authentication required")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin inquiry reply error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process email reply" },
      { status: 500 }
    );
  }
}
