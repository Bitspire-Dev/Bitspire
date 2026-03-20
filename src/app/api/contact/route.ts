import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { domainToASCII } from "node:url";

function normalizeEmail(value: string) {
  const trimmed = value.trim();
  const atIndex = trimmed.lastIndexOf("@");

  if (atIndex <= 0 || atIndex >= trimmed.length - 1) {
    return trimmed;
  }

  const localPart = trimmed.slice(0, atIndex);
  const domainPart = trimmed.slice(atIndex + 1);
  const asciiDomain = domainToASCII(domainPart);

  if (!asciiDomain) {
    return trimmed;
  }

  return `${localPart}@${asciiDomain}`;
}

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().transform(normalizeEmail).pipe(z.string().email()),
  message: z.string().trim().min(1),
  subject: z.string().transform(s => s.trim() || "General Inquiry"),
  formName: z.string().optional(),
  company: z.string().optional(), // honeypot
});

const isProduction = process.env.NODE_ENV === "production";

let cachedResend: Resend | null = null;

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable.");
  }

  if (!cachedResend) {
    cachedResend = new Resend(apiKey);
  }

  return cachedResend;
}

function getResendRecipients() {
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_EMAIL;

  if (isProduction && (!from || !to)) {
    throw new Error(
      "Missing CONTACT_FROM or CONTACT_EMAIL environment variables in production."
    );
  }

  return {
    from: from ?? "Bitspire Contact <onboarding@resend.dev>",
    to: [to ?? "delivered@resend.dev"],
  };
}



export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues);
    console.error("Received body:", body);
    return NextResponse.json(
      { ok: false, error: "Invalid form data" },
      { status: 400 }
    );
  }

  if (parsed.data.company && parsed.data.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  try {
    const { name, email, subject, message } = parsed.data;

    const resend = getResendClient();
    const recipients = getResendRecipients();

    await resend.emails.send({
      from: recipients.from,
      to: recipients.to,
      replyTo: email,
      subject: `[Bitspire] Contact: ${subject}`,
      html: `
        <div>
          <h2>New message from ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="margin-top: 20px; padding: 20px; background: #eee;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
