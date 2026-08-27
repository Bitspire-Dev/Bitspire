import { Resend } from 'resend';
import { validateContactPayload, isRateLimited, formatContactEmail } from '@/lib/contact';

function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid body' }, { status: 400 });
  }

  const payload = {
    name:
      typeof (body as Record<string, unknown>)?.name === 'string'
        ? ((body as Record<string, unknown>).name as string)
        : '',
    email:
      typeof (body as Record<string, unknown>)?.email === 'string'
        ? ((body as Record<string, unknown>).email as string)
        : '',
    subject:
      typeof (body as Record<string, unknown>)?.subject === 'string'
        ? ((body as Record<string, unknown>).subject as string)
        : '',
    message:
      typeof (body as Record<string, unknown>)?.message === 'string'
        ? ((body as Record<string, unknown>).message as string)
        : '',
  };

  const locale =
    typeof (body as Record<string, unknown>)?.locale === 'string'
      ? ((body as Record<string, unknown>).locale as string)
      : 'pl';
  const { valid, errors } = validateContactPayload(payload, locale);

  if (!valid) {
    return Response.json({ error: 'Validation failed', errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return Response.json({ error: 'Email service not configured' }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const email = formatContactEmail(payload, locale);

  const { data, error } = await resend.emails.send(email);

  if (error) {
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return Response.json({ ok: true, id: data?.id });
}
