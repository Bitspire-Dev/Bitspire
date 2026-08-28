import { Resend } from 'resend';
import {
  validateContactPayload,
  validateAttachment,
  sanitizeFilename,
  isRateLimited,
  formatContactEmail,
  MAX_ATTACHMENTS,
  MAX_FILE_SIZE,
  getMessages,
  type ContactAttachment,
} from '@/lib/contact';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }
  return headers.get('x-real-ip') ?? 'unknown';
}

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);

  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: 'Invalid form data' }, { status: 400 });
  }

  const locale = getString(formData, 'locale') || 'pl';
  const labels = getMessages(locale);

  const payload = {
    name: getString(formData, 'name'),
    email: getString(formData, 'email'),
    subject: getString(formData, 'subject'),
    message: getString(formData, 'message'),
  };

  const { valid, errors } = validateContactPayload(payload, locale);

  if (!valid) {
    return Response.json({ error: 'Validation failed', errors }, { status: 400 });
  }

  // --- Parse & validate attachments -----------------------------------------

  const fileEntries = formData.getAll('file').filter(f => f instanceof File) as File[];
  const attachments: ContactAttachment[] = [];

  if (fileEntries.length > MAX_ATTACHMENTS) {
    return Response.json({ error: labels.tooManyFiles }, { status: 400 });
  }

  for (const file of fileEntries) {
    // Skip empty file inputs (browser may send an empty File object)
    if (file.size === 0 && file.name === '') continue;

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: labels.fileTooLarge, filename: file.name }, { status: 413 });
    }

    const metaCheck = validateAttachment(
      { name: file.name, type: file.type, size: file.size },
      locale
    );

    if (!metaCheck.valid) {
      return Response.json(
        { error: metaCheck.error ?? labels.fileTypeNotAllowed, filename: file.name },
        { status: 400 }
      );
    }

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const content = buffer.toString('base64');
      const filename = sanitizeFilename(file.name);

      attachments.push({
        filename,
        content,
        contentType: file.type,
      });
    } catch (err) {
      console.error('Failed to process attachment:', err);
      return Response.json({ error: 'Failed to process attachment' }, { status: 500 });
    }
  }

  // --- Send email via Resend -------------------------------------------------

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return Response.json({ error: 'Email service not configured' }, { status: 500 });
  }

  try {
    const resend = new Resend(apiKey);
    const email = formatContactEmail(payload, locale, attachments);

    const { data, error } = await resend.emails.send(email);

    if (error) {
      console.error('Resend error:', error);
      return Response.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return Response.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error('Unexpected error sending email:', err);
    return Response.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
