import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateContactPayload, isRateLimited, formatContactEmail } from '../contact';

describe('validateContactPayload', () => {
  it('passes for a valid payload', () => {
    const result = validateContactPayload(
      { name: 'Jan', email: 'jan@example.com', subject: 'Pytanie', message: 'Treść' },
      'pl'
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it('reports missing fields', () => {
    const result = validateContactPayload({}, 'pl');

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      name: 'To pole jest wymagane',
      email: 'To pole jest wymagane',
      subject: 'To pole jest wymagane',
      message: 'To pole jest wymagane',
    });
  });

  it('reports invalid email', () => {
    const result = validateContactPayload(
      { name: 'Jan', email: 'not-an-email', subject: 'Pytanie', message: 'Treść' },
      'pl'
    );

    expect(result.valid).toBe(false);
    expect(result.errors.email).toBe('Podaj prawidłowy adres e-mail');
  });

  it('uses English messages for en locale', () => {
    const result = validateContactPayload(
      { name: '', email: 'bad', subject: '', message: '' },
      'en'
    );

    expect(result.errors.name).toBe('This field is required');
    expect(result.errors.email).toBe('Please enter a valid email address');
  });
});

describe('isRateLimited', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('allows up to 5 attempts within the window', () => {
    const ip = '192.168.1.1';

    expect(isRateLimited(ip)).toBe(false);
    expect(isRateLimited(ip)).toBe(false);
    expect(isRateLimited(ip)).toBe(false);
    expect(isRateLimited(ip)).toBe(false);
    expect(isRateLimited(ip)).toBe(false);
    expect(isRateLimited(ip)).toBe(true);
  });

  it('resets the counter after the window expires', () => {
    const ip = '192.168.1.2';

    isRateLimited(ip);
    isRateLimited(ip);
    isRateLimited(ip);
    isRateLimited(ip);
    isRateLimited(ip);
    expect(isRateLimited(ip)).toBe(true);

    vi.advanceTimersByTime(15 * 60 * 1000 + 1);

    expect(isRateLimited(ip)).toBe(false);
  });

  it('tracks different IPs independently', () => {
    expect(isRateLimited('10.0.0.1')).toBe(false);
    expect(isRateLimited('10.0.0.2')).toBe(false);
  });
});

describe('formatContactEmail', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_FROM_EMAIL', 'Bitspire <test-from@example.com>');
    vi.stubEnv('RESEND_TO_EMAIL', 'test-to@example.com');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('formats a Polish email with env overrides', () => {
    const email = formatContactEmail(
      { name: 'Jan', email: 'jan@example.com', subject: 'Pytanie', message: 'Cześć' },
      'pl'
    );

    expect(email.from).toBe('Bitspire <test-from@example.com>');
    expect(email.to).toBe('test-to@example.com');
    expect(email.replyTo).toBe('jan@example.com');
    expect(email.subject).toBe('[Formularz kontaktowy] Pytanie');
    expect(email.text).toContain('Imię / Name: Jan');
    expect(email.text).toContain('Email: jan@example.com');
    expect(email.html).toContain('<strong>Imię / Name:</strong> Jan');
  });

  it('formats an English email with the correct subject prefix', () => {
    const email = formatContactEmail(
      { name: 'John', email: 'john@example.com', subject: 'Question', message: 'Hi' },
      'en'
    );

    expect(email.subject).toBe('[Contact form] Question');
  });

  it('escapes HTML in the message body', () => {
    const email = formatContactEmail(
      {
        name: '<b>Jan</b>',
        email: 'jan@example.com',
        subject: 'Test',
        message: '<script>alert(1)</script>',
      },
      'pl'
    );

    expect(email.html).not.toContain('<script>');
    expect(email.html).toContain('&lt;script&gt;');
  });
});
