import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
  replyTo?: string;
}

/**
 * Retrieve active SMTP configuration from database sitesetting or environment variables
 */
export async function getActiveSmtpConfig(): Promise<SmtpConfig | null> {
  try {
    // 1. Check if SMTP configuration exists in database sitesetting
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "smtp_config" },
    });

    if (setting?.value) {
      try {
        const parsed = JSON.parse(setting.value);
        if (parsed.host && parsed.user) {
          return {
            host: parsed.host,
            port: parseInt(parsed.port || "587", 10),
            secure: parsed.secure === true || parsed.secure === "true",
            user: parsed.user,
            pass: parsed.pass || "",
            from: parsed.from || `"Lanka Luxe Journeys" <${parsed.user}>`,
            replyTo: parsed.replyTo || parsed.user,
          };
        }
      } catch {
        // Fall back to env
      }
    }
  } catch {
    // If DB is temporarily unavailable, proceed to env
  }

  // 2. Fall back to environment variables
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user) {
    return null;
  }

  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true" || port === 465;
  const from = process.env.SMTP_FROM || `"Lanka Luxe Journeys" <${user}>`;
  const replyTo = process.env.SMTP_REPLY_TO || user;

  return {
    host,
    port,
    secure,
    user,
    pass: pass || "",
    from,
    replyTo,
  };
}

/**
 * Creates a configured nodemailer transporter
 */
export function createTransporter(config: SmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

/**
 * Verifies SMTP connection handshake
 */
export async function verifySmtpConnection(
  customConfig?: SmtpConfig
): Promise<{ success: boolean; error?: string }> {
  try {
    const config = customConfig || (await getActiveSmtpConfig());
    if (!config) {
      return {
        success: false,
        error: "SMTP configuration is missing. Please configure host and credentials in Admin Settings or .env file.",
      };
    }

    const transporter = createTransporter(config);
    await transporter.verify();
    return { success: true };
  } catch (err: any) {
    console.error("SMTP verification error:", err);
    return {
      success: false,
      error: err.message || "Failed to establish handshake with SMTP server.",
    };
  }
}

/**
 * Formats a luxurious, responsive HTML email for Lanka Luxe Journeys clients
 */
export function generateLuxuryEmailHtml({
  recipientName,
  content,
  subject,
  reference,
  whatsapp,
}: {
  recipientName: string;
  content: string;
  subject: string;
  reference?: string;
  whatsapp?: string;
}): string {
  // Convert newlines into styled HTML paragraphs or line breaks
  const formattedBody = content
    .split("\n\n")
    .map((p) => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.7; color: #2C3E50;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F8F9FA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8F9FA; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(8, 20, 38, 0.08); border: 1px solid #EAECEF;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #081426; padding: 36px 40px; text-align: center; border-bottom: 2px solid #C8A45D;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <span style="font-size: 11px; letter-spacing: 4px; color: #C8A45D; text-transform: uppercase; font-weight: 700; display: block; margin-bottom: 6px;">
                      ✦ BESPOKE PRIVATE JOURNEYS · SRI LANKA ✦
                    </span>
                    <h1 style="margin: 0; font-family: Georgia, serif; font-size: 26px; letter-spacing: 1px; color: #FFFFFF; font-weight: 700;">
                      LANKA LUXE JOURNEYS
                    </h1>
                    <p style="margin: 6px 0 0 0; font-size: 12px; color: #A0B2C6; letter-spacing: 1px;">
                      SLTDA LICENSED TOUR OPERATOR (C-1734)
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Reference Bar (if available) -->
          ${
            reference
              ? `
          <tr>
            <td style="background-color: #F3F6F9; padding: 12px 40px; border-bottom: 1px solid #EAECEF;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 12px; color: #6C7A89;">
                    Inquiry Reference: <strong style="color: #081426; font-family: monospace;">${reference}</strong>
                  </td>
                  <td align="right" style="font-size: 11px; color: #C8A45D; font-weight: 600; text-transform: uppercase;">
                    Private Concierge
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Message Body -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <p style="margin: 0 0 20px 0; font-family: Georgia, serif; font-size: 18px; color: #081426; font-weight: bold;">
                Dear ${recipientName || "Valued Guest"},
              </p>
              
              <div style="color: #2C3E50;">
                ${formattedBody}
              </div>

              <!-- Founder Signature Block -->
              <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #EAECEF;">
                <p style="margin: 0 0 4px 0; font-family: Georgia, serif; font-size: 16px; font-weight: bold; color: #081426;">
                  Warmest regards,
                </p>
                <p style="margin: 0 0 2px 0; font-size: 15px; font-weight: 700; color: #C8A45D;">
                  Iroshan Jayawickrame
                </p>
                <p style="margin: 0; font-size: 12px; color: #6C7A89; line-height: 1.5;">
                  Founder & Senior Private Concierge<br/>
                  Lanka Luxe Journeys · Colombo, Sri Lanka<br/>
                  SLTDA Licensed Chauffeur & Guide (Licence C-1734)
                </p>
              </div>
            </td>
          </tr>

          <!-- Direct Channels Highlight -->
          <tr>
            <td style="background-color: #FAFAF7; padding: 24px 40px; border-top: 1px solid #EAECEF; border-bottom: 1px solid #EAECEF;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 12px; color: #555; line-height: 1.6;">
                    <strong style="color: #081426; font-size: 13px;">Direct Concierge Assistance:</strong><br/>
                    • <strong>WhatsApp:</strong> +94 77 029 4059 / +94 77 123 4567<br/>
                    • <strong>KakaoTalk ID:</strong> @lankaluxe<br/>
                    • <strong>Official Email:</strong> journeys@lankaluxe.com
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #081426; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #788B9E;">
                © 2026 Lanka Luxe Journeys. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 10px; color: #55687D;">
                This private consultation letter was transmitted specifically for ${recipientName}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Sends an email via SMTP
 */
export async function sendSmtpEmail({
  to,
  toName,
  subject,
  content,
  reference,
  customConfig,
}: {
  to: string;
  toName: string;
  subject: string;
  content: string;
  reference?: string;
  customConfig?: SmtpConfig;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const config = customConfig || (await getActiveSmtpConfig());
    if (!config) {
      return {
        success: false,
        error: "SMTP is not configured. Please enter your SMTP server details in Admin Settings or .env file.",
      };
    }

    const transporter = createTransporter(config);

    const html = generateLuxuryEmailHtml({
      recipientName: toName,
      content,
      subject,
      reference,
    });

    const info = await transporter.sendMail({
      from: config.from,
      to: toName ? `"${toName}" <${to}>` : to,
      replyTo: config.replyTo || config.from,
      subject,
      text: content,
      html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: any) {
    console.error("sendSmtpEmail failed:", err);
    return {
      success: false,
      error: err.message || "Failed to send email through SMTP server.",
    };
  }
}
