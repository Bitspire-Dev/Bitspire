export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES = {
  pl: {
    required: 'To pole jest wymagane',
    invalidEmail: 'Podaj prawidłowy adres e-mail',
  },
  en: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
  },
} as const;

export function validateContactPayload(
  payload: Partial<ContactPayload>,
  locale: string
): { valid: boolean; errors: ContactErrors } {
  const labels = MESSAGES[locale as keyof typeof MESSAGES] ?? MESSAGES.pl;
  const errors: ContactErrors = {};

  if (!payload.name?.trim()) errors.name = labels.required;

  if (!payload.email?.trim()) errors.email = labels.required;
  else if (!EMAIL_REGEX.test(payload.email)) errors.email = labels.invalidEmail;

  if (!payload.subject?.trim()) errors.subject = labels.required;
  if (!payload.message?.trim()) errors.message = labels.required;

  return { valid: Object.keys(errors).length === 0, errors };
}

const attempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  record.count += 1;
  return record.count > RATE_LIMIT_ATTEMPTS;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface ContactEmail {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}

export function formatContactEmail(payload: ContactPayload, locale: string): ContactEmail {
  const from = process.env.RESEND_FROM_EMAIL ?? 'Bitspire <kontakt@bitspire.pl>';
  const to = process.env.RESEND_TO_EMAIL ?? 'kontakt@bitspire.pl';
  const prefix = locale === 'pl' ? 'Formularz kontaktowy' : 'Contact form';
  const subject = `[${prefix}] ${payload.subject}`;

  const text = [
    `Imię / Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Temat / Subject: ${payload.subject}`,
    '',
    payload.message,
  ].join('\n');

  const html = `<p><strong>Imię / Name:</strong> ${escapeHtml(payload.name)}</p>
<p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
<p><strong>Temat / Subject:</strong> ${escapeHtml(payload.subject)}</p>
<hr/>
<p>${escapeHtml(payload.message).replace(/\n/g, '<br/>')}</p>`;

  return { from, to, replyTo: payload.email, subject, text, html };
}
