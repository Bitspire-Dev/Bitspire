'use client';

import { useState, type FormEvent } from 'react';
import { GlowButton } from '@/components/animations/glow-button';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/primitives/field';
import { Input } from '@/components/ui/primitives/input';
import { Textarea } from '@/components/ui/primitives/textarea';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { cn } from '@/lib/utils';
import type { PageQuery } from '@tina/__generated__/types';

type Contact = NonNullable<NonNullable<PageQuery['page']>['contact']>;

const DEFAULT_EMAIL = 'kontakt@bitspire.pl';

interface ContactFormProps {
  contact: Contact | null | undefined;
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
    required: 'To pole jest wymagane',
    invalidEmail: 'Podaj prawidłowy adres e-mail',
  },
  en: {
    name: 'Name',
    email: 'Your email',
    subject: 'Subject',
    message: 'Message',
    send: 'Send message',
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
  },
};

export function ContactForm({ contact, locale, className }: ContactFormProps) {
  const ui = UI[locale] ?? UI.pl;
  const to = contact?.email || DEFAULT_EMAIL;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) nextErrors.name = ui.required;
    if (!email.trim()) nextErrors.email = ui.required;
    else if (!validateEmail(email)) nextErrors.email = ui.invalidEmail;
    if (!subject.trim()) nextErrors.subject = ui.required;
    if (!message.trim()) nextErrors.message = ui.required;

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const body = `[${ui.name}: ${name}]\n[${ui.email}: ${email}]\n\n${message}`;
    const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6', className)}>
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
            />
            {errors.message ? <FieldError>{errors.message}</FieldError> : null}
          </FieldContent>
        </Field>
      </FadeIn>

      <FadeIn delay={0.2}>
        <GlowButton type="submit" className="w-full md:w-2/3">
          {ui.send}
        </GlowButton>
      </FadeIn>
    </form>
  );
}
