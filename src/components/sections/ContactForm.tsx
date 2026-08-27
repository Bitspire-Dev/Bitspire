'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/primitives/button';
import { Card, CardContent } from '@/components/ui/primitives/card';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/primitives/field';
import { Input } from '@/components/ui/primitives/input';
import { Textarea } from '@/components/ui/primitives/textarea';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { Link } from '@/i18n/navigation';
import { validateContactPayload } from '@/lib/contact';
import { cn } from '@/lib/utils';

interface ContactFormProps {
  locale: string;
  className?: string;
}

const UI: Record<string, Record<string, string>> = {
  pl: {
    name: 'Imię',
    email: 'Twój e-mail',
    subject: 'Temat',
    message: 'Wiadomość',
    send: 'Wyślij wiadomość',
    sending: 'Wysyłanie...',
    success: 'Wiadomość została wysłana.',
    error: 'Wystąpił błąd. Spróbuj ponownie później.',
    required: 'To pole jest wymagane',
    invalidEmail: 'Podaj prawidłowy adres e-mail',
    privacyNotice: 'Wysyłając wiadomość, akceptujesz',
    privacyLink: 'Politykę prywatności',
  },
  en: {
    name: 'Name',
    email: 'Your email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending...',
    success: 'Message sent successfully.',
    error: 'Something went wrong. Please try again later.',
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    privacyNotice: 'By sending a message, you accept our',
    privacyLink: 'Privacy Policy',
  },
};

export function ContactForm({ locale, className }: ContactFormProps) {
  const ui = UI[locale] ?? UI.pl;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus('idle');

    const { valid, errors: nextErrors } = validateContactPayload(
      { name, email, subject, message },
      locale
    );

    setErrors(nextErrors as Record<string, string>);

    if (!valid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, locale }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setErrors({});
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card variant="glass" className={cn('h-full', className)}>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FadeIn delay={0}>
            <Field>
              <FieldLabel htmlFor="contact-name">{ui.name}</FieldLabel>
              <FieldContent>
                <Input
                  id="contact-name"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  aria-invalid={!!errors.name}
                  className="bg-input/60 backdrop-blur-[2px]"
                />
                {errors.name ? <FieldError>{errors.name}</FieldError> : null}
              </FieldContent>
            </Field>
          </FadeIn>

          <FadeIn delay={0.05}>
            <Field>
              <FieldLabel htmlFor="contact-email">{ui.email}</FieldLabel>
              <FieldContent>
                <Input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: '' }));
                  }}
                  aria-invalid={!!errors.email}
                  className="bg-input/60 backdrop-blur-[2px]"
                />
                {errors.email ? <FieldError>{errors.email}</FieldError> : null}
              </FieldContent>
            </Field>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Field>
              <FieldLabel htmlFor="contact-subject">{ui.subject}</FieldLabel>
              <FieldContent>
                <Input
                  id="contact-subject"
                  value={subject}
                  onChange={e => {
                    setSubject(e.target.value);
                    setErrors(prev => ({ ...prev, subject: '' }));
                  }}
                  aria-invalid={!!errors.subject}
                  className="bg-input/60 backdrop-blur-[2px]"
                />
                {errors.subject ? <FieldError>{errors.subject}</FieldError> : null}
              </FieldContent>
            </Field>
          </FadeIn>

          <FadeIn delay={0.15}>
            <Field>
              <FieldLabel htmlFor="contact-message">{ui.message}</FieldLabel>
              <FieldContent>
                <Textarea
                  id="contact-message"
                  value={message}
                  onChange={e => {
                    setMessage(e.target.value);
                    setErrors(prev => ({ ...prev, message: '' }));
                  }}
                  aria-invalid={!!errors.message}
                  className="min-h-48 bg-input/60 backdrop-blur-[2px]"
                />
                {errors.message ? <FieldError>{errors.message}</FieldError> : null}
              </FieldContent>
            </Field>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? ui.sending : ui.send}
            </Button>
          </FadeIn>

          {submitStatus === 'success' ? (
            <p className="text-center font-sans text-xs text-foreground">{ui.success}</p>
          ) : null}

          {submitStatus === 'error' ? (
            <FieldError className="text-center">{ui.error}</FieldError>
          ) : null}

          <FadeIn delay={0.25}>
            <p className="text-center font-sans text-xs text-muted-foreground">
              {ui.privacyNotice}{' '}
              <Link
                href="/privacy"
                className="text-foreground underline underline-offset-4 transition-colors hover:text-primary"
              >
                {ui.privacyLink}
              </Link>
            </p>
          </FadeIn>
        </form>
      </CardContent>
    </Card>
  );
}
