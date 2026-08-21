'use client';

import { Clock, Link2, Mail, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/primitives/card';
import { Separator } from '@/components/ui/primitives/separator';
import { FadeIn } from '@/components/animations/fade-in';
import { cn } from '@/lib/utils';
import type { PageQuery } from '@tina/__generated__/types';

type Contact = NonNullable<NonNullable<PageQuery['page']>['contact']>;

const DEFAULT_EMAIL = 'kontakt@bitspire.pl';

interface ContactDetailsProps {
  contact: Contact | null | undefined;
  locale: string;
  className?: string;
}

const UI: Record<string, Record<string, string>> = {
  pl: {
    title: 'Dane kontaktowe',
    email: 'Email',
    phone: 'Telefon',
    address: 'Adres',
    hours: 'Godziny pracy',
    socials: 'Social media',
  },
  en: {
    title: 'Contact details',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    hours: 'Working hours',
    socials: 'Social media',
  },
};

export function ContactDetails({ contact, locale, className }: ContactDetailsProps) {
  const ui = UI[locale] ?? UI.pl;
  const email = contact?.email || DEFAULT_EMAIL;

  const items = [
    { key: 'email', label: ui.email, value: email, href: `mailto:${email}`, icon: Mail },
    ...(contact?.phone
      ? [
          {
            key: 'phone',
            label: ui.phone,
            value: contact.phone,
            href: `tel:${contact.phone.replace(/\s/g, '')}`,
            icon: Phone,
          },
        ]
      : []),
    ...(contact?.address
      ? [{ key: 'address', label: ui.address, value: contact.address, icon: MapPin }]
      : []),
    ...(contact?.hours
      ? [{ key: 'hours', label: ui.hours, value: contact.hours, icon: Clock }]
      : []),
  ];

  const hasSocials = contact?.socials && contact.socials.length > 0;

  return (
    <FadeIn>
      <Card className={cn('h-full', className)}>
        <CardHeader>
          <CardTitle className="font-heading text-xl md:text-2xl">{ui.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-4">
            {items.map((item, index) => (
              <li key={item.key}>
                <FadeIn delay={0.05 + index * 0.05} className="flex items-start gap-3">
                  <item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="font-sans text-xs text-muted-foreground">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="font-sans text-sm text-foreground transition-colors hover:text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="font-sans text-sm text-foreground">{item.value}</p>
                    )}
                  </div>
                </FadeIn>
              </li>
            ))}
          </ul>

          {hasSocials ? (
            <>
              <Separator className="my-4" />
              <p className="font-sans text-xs text-muted-foreground">{ui.socials}</p>
              <ul className="mt-2 flex flex-wrap gap-3">
                {contact.socials?.map((social, index) =>
                  social?.url ? (
                    <li key={index}>
                      <FadeIn delay={0.05 + index * 0.05}>
                        <a
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-sans text-xs text-foreground transition-colors hover:bg-muted"
                        >
                          <Link2 className="size-3" />
                          {social.platform || 'Link'}
                        </a>
                      </FadeIn>
                    </li>
                  ) : null
                )}
              </ul>
            </>
          ) : null}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
