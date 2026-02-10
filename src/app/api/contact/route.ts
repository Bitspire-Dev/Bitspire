import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { kv } from "@vercel/kv";

const contactSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  message: z.string().trim().min(1),
  subject: z.string().optional().default("General Inquiry"),
  formName: z.string().optional(),
  company: z.string().optional(), // honeypot
});

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SEC = 10 * 60;
const isProduction = process.env.NODE_ENV === "production";

let cachedResend: Resend | null = null;
const memoryRateLimitMap = new Map<string, { count: number; resetAt: number }>();

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

function memoryRateLimit(ip: string) {
  const now = Date.now();
  const entry = memoryRateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    memoryRateLimitMap.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_SEC * 1000,
    });
    return { success: true, resetAt: now + RATE_LIMIT_WINDOW_SEC * 1000 };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { success: false, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { success: true, resetAt: entry.resetAt };
}

async function kvRateLimit(ip: string) {
  const key = `bitspire:contact:rl:${ip}`;
  const count = await kv.incr(key);

  if (count === 1) {
    await kv.expire(key, RATE_LIMIT_WINDOW_SEC);
  }

  const ttl = await kv.ttl(key);
  const resetAt = Date.now() + Math.max(ttl, 0) * 1000;

  return { success: count <= RATE_LIMIT_MAX, resetAt };
}

async function checkRateLimit(ip: string) {
  const hasKvConfig = Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );

  if (!hasKvConfig) {
    if (isProduction) {
      throw new Error(
        "Missing KV_REST_API_URL or KV_REST_API_TOKEN in production."
      );
    }

    return memoryRateLimit(ip);
  }

  return kvRateLimit(ip);
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  try {
    const { success, resetAt } = await checkRateLimit(ip);
    if (!success) {
      return NextResponse.json(
        { ok: false, error: "Rate limit exceeded", resetAt },
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
