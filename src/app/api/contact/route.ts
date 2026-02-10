import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  message: z.string().trim().min(1),
  subject: z.string().optional().default("General Inquiry"),
  formName: z.string().optional(),
  company: z.string().optional(), // honeypot
});

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = "10 m";
const isProduction = process.env.NODE_ENV === "production";

let cachedResend: Resend | null = null;
let cachedRatelimit: Ratelimit | null = null;

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

function getRatelimit() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (isProduction) {
      throw new Error(
        "Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in production."
      );
    }

    return null;
  }

  if (!cachedRatelimit) {
    const redis = new Redis({ url, token });
    cachedRatelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(RATE_LIMIT_MAX, RATE_LIMIT_WINDOW),
      analytics: true,
      prefix: "bitspire:contact",
    });
  }

  return cachedRatelimit;
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  try {
    const ratelimit = getRatelimit();

    if (!ratelimit) {
      return NextResponse.json(
        { ok: false, error: "Rate limit not configured" },
        { status: 500 }
      );
    }

    const { success, reset } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded", resetAt: reset },
        { status: 429 }
      );
    }
  } catch (error) {
    console.error("Rate limit error:", error);
    return NextResponse.json(
      { ok: false, error: "Rate limit not configured" },
      { status: 500 }
    );
  }

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
