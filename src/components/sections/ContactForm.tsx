'use client';

import { useRef, useState, type ChangeEvent, type FormEvent, type ComponentProps } from 'react';
import { Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/primitives/button';
import { Card, CardContent } from '@/components/ui/primitives/card';
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/primitives/field';
import { Input } from '@/components/ui/primitives/input';
import { Textarea } from '@/components/ui/primitives/textarea';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { Link } from '@/i18n/navigation';
import { getPageHref } from '@/lib/routes';
import {
  validateContactPayload,
  validateAttachment,
  MAX_FILE_SIZE,
  MAX_ATTACHMENTS,
} from '@/lib/contact';
import { cn } from '@/lib/utils';

type Href = ComponentProps<typeof Link>['href'];

interface ContactFormProps {
  locale: string;
  className?: string;
}

const ACCEPT_ATTR = '.pdf,.png,.jpg,.jpeg,.gif,.webp,.txt';

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
    attachment: 'Załącznik (opcjonalnie)',
    attachmentHint: 'Maks. 3 MB. PDF, PNG, JPG, GIF, WEBP, TXT.',
    removeFile: 'Usuń plik',
    fileTooLarge: 'Plik jest za duży. Maksymalny rozmiar to 3 MB.',
    fileTypeNotAllowed: 'Nieobsługiwany typ pliku. Dozwolone: PDF, PNG, JPG, GIF, WEBP, TXT.',
    tooManyFiles: 'Możesz dodać maksymalnie 3 pliki.',
    fileError: 'Błąd pliku',
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
    attachment: 'Attachment (optional)',
    attachmentHint: 'Max 3 MB. PDF, PNG, JPG, GIF, WEBP, TXT.',
    removeFile: 'Remove file',
    fileTooLarge: 'File is too large. Maximum size is 3 MB.',
    fileTypeNotAllowed: 'Unsupported file type. Allowed: PDF, PNG, JPG, GIF, WEBP, TXT.',
    tooManyFiles: 'You can attach up to 3 files.',
    fileError: 'File error',
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ContactForm({ locale, className }: ContactFormProps) {
  const ui = UI[locale] ?? UI.pl;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const selected = Array.from(event.target.files ?? []);

    if (selected.length === 0) return;

    if (files.length + selected.length > MAX_ATTACHMENTS) {
      setFileError(ui.tooManyFiles);
      event.target.value = '';
      return;
    }

    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(ui.fileTooLarge);
        event.target.value = '';
        return;
      }

      const check = validateAttachment(
        { name: file.name, type: file.type, size: file.size },
        locale
      );

      if (!check.valid) {
        setFileError(check.error ?? ui.fileTypeNotAllowed);
        event.target.value = '';
        return;
      }
    }

    setFiles(prev => [...prev, ...selected]);
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFileError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitStatus('idle');
    setFileError('');

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
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', message);
      formData.append('locale', locale);
      for (const file of files) {
        formData.append('file', file);
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setFiles([]);
        setErrors({});
        setFileError('');
      } else {
        const data = await response.json().catch(() => null);

        // Server returned a file-specific error — show it on the file field
        if (data?.error && (data.filename || response.status === 413)) {
          setFileError(data.error);
        } else {
          setSubmitStatus('error');
        }
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

          <FadeIn delay={0.175}>
            <Field>
              <FieldLabel htmlFor="contact-file">{ui.attachment}</FieldLabel>
              <FieldContent>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="contact-file"
                    className="inline-flex h-7 w-fit cursor-pointer items-center gap-1.5 rounded-md border border-input bg-input/20 px-2 font-sans text-xs text-muted-foreground transition-colors hover:bg-input/40 hover:text-foreground"
                  >
                    <Paperclip className="size-3.5" />
                    {ui.attachment}
                  </label>
                  <input
                    ref={fileInputRef}
                    id="contact-file"
                    type="file"
                    accept={ACCEPT_ATTR}
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                    aria-invalid={!!fileError}
                  />
                  <p className="font-sans text-xs text-muted-foreground">{ui.attachmentHint}</p>

                  {files.length > 0 ? (
                    <ul className="flex flex-col gap-1.5">
                      {files.map((file, index) => (
                        <li
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-input/20 px-2 py-1"
                        >
                          <span className="truncate font-sans text-xs text-foreground">
                            {file.name}{' '}
                            <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="shrink-0 rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-destructive"
                            aria-label={ui.removeFile}
                          >
                            <X className="size-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {fileError ? <FieldError>{fileError}</FieldError> : null}
                </div>
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
                href={getPageHref('privacy') as Href}
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
