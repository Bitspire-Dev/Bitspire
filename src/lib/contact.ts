export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export interface ContactAttachment {
  filename: string;
  content: string;
  contentType: string;
}

// --- Limits & whitelists ----------------------------------------------------

/** Max raw file size before base64 encoding. Vercel serverless caps body at
 *  4.5MB; base64 adds ~33% overhead, so 3MB raw → ~4MB encoded is safe. */
export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

/** Max number of attachments per submission. */
export const MAX_ATTACHMENTS = 3;

/** Whitelisted MIME types. Anything else is rejected server-side. */
export const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
]);

/** Whitelisted file extensions (lowercase, with dot). Used as a second check
 *  on top of the MIME type to catch renamed executables. */
export const ALLOWED_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.pdf',
  '.txt',
]);

/** Max lengths for text fields. Prevents memory/bandwidth abuse. */
export const MAX_FIELD_LENGTHS = {
  name: 100,
  email: 254, // RFC 5321 max
  subject: 200,
  message: 5000,
} as const;

// --- Validation -------------------------------------------------------------

// Exclude angle brackets and control chars (\r, \n) to prevent header injection
// via the replyTo address. \r\n in an email header can inject additional headers.
const EMAIL_REGEX = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;

const MESSAGES = {
  pl: {
    required: 'To pole jest wymagane',
    invalidEmail: 'Podaj prawidłowy adres e-mail',
    fieldTooLong: 'Tekst jest za długi',
    fileTooLarge: 'Plik jest za duży. Maksymalny rozmiar to 3 MB.',
    fileTypeNotAllowed: 'Nieobsługiwany typ pliku. Dozwolone: PDF, PNG, JPG, GIF, WEBP, TXT.',
    tooManyFiles: 'Możesz dodać maksymalnie 3 pliki.',
  },
  en: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    fieldTooLong: 'Text is too long',
    fileTooLarge: 'File is too large. Maximum size is 3 MB.',
    fileTypeNotAllowed: 'Unsupported file type. Allowed: PDF, PNG, JPG, GIF, WEBP, TXT.',
    tooManyFiles: 'You can attach up to 3 files.',
  },
} as const;

export type ContactMessages = (typeof MESSAGES)[keyof typeof MESSAGES];

export function getMessages(locale: string): ContactMessages {
  return MESSAGES[locale as keyof typeof MESSAGES] ?? MESSAGES.pl;
}

export function validateContactPayload(
  payload: Partial<ContactPayload>,
  locale: string
): { valid: boolean; errors: ContactErrors } {
  const labels = getMessages(locale);
  const errors: ContactErrors = {};

  if (!payload.name?.trim()) errors.name = labels.required;
  else if (payload.name.length > MAX_FIELD_LENGTHS.name) errors.name = labels.fieldTooLong;

  if (!payload.email?.trim()) errors.email = labels.required;
  else if (!EMAIL_REGEX.test(payload.email)) errors.email = labels.invalidEmail;

  if (!payload.subject?.trim()) errors.subject = labels.required;
  else if (payload.subject.length > MAX_FIELD_LENGTHS.subject) errors.subject = labels.fieldTooLong;

  if (!payload.message?.trim()) errors.message = labels.required;
  else if (payload.message.length > MAX_FIELD_LENGTHS.message)
    errors.message = labels.fieldTooLong;

  return { valid: Object.keys(errors).length === 0, errors };
}

export interface AttachmentMeta {
  name: string;
  type: string;
  size: number;
}

export function validateAttachment(
  file: AttachmentMeta,
  locale: string
): { valid: boolean; error?: string } {
  const labels = getMessages(locale);

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: labels.fileTooLarge };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { valid: false, error: labels.fileTypeNotAllowed };
  }

  const ext = getExtension(file.name);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    return { valid: false, error: labels.fileTypeNotAllowed };
  }

  return { valid: true };
}

/** Strip directory traversal and dangerous characters from a filename.
 *  Resolves to the basename only, caps length to 255 chars. */
export function sanitizeFilename(name: string): string {
  const basename = getBasename(name);
  // Remove any remaining path separators that slipped through (edge cases on
  // different OS path formats) and null bytes.
  const cleaned = basename.replace(/[/\\]/g, '').replace(/\0/g, '');
  return cleaned.slice(0, 255) || 'attachment';
}

/** Extract the basename from a path string (no node:path needed — works in
 *  browser bundles too). Handles both / and \ separators. */
function getBasename(filepath: string): string {
  const lastSep = Math.max(filepath.lastIndexOf('/'), filepath.lastIndexOf('\\'));
  return lastSep >= 0 ? filepath.slice(lastSep + 1) : filepath;
}

/** Extract the lowercase file extension including the dot (e.g. '.pdf').
 *  Returns '' if no extension. Pure string ops — no node:path. */
function getExtension(filename: string): string {
  const basename = getBasename(filename);
  const dotIndex = basename.lastIndexOf('.');
  if (dotIndex <= 0) return '';
  return basename.slice(dotIndex).toLowerCase();
}

// --- Rate limiting (in-memory, best-effort) ---------------------------------

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

// --- Email formatting -------------------------------------------------------

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
  attachments?: ContactAttachment[];
}

export function formatContactEmail(
  payload: ContactPayload,
  locale: string,
  attachments?: ContactAttachment[]
): ContactEmail {
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

  return {
    from,
    to,
    replyTo: payload.email,
    subject,
    text,
    html,
    attachments: attachments?.length ? attachments : undefined,
  };
}
