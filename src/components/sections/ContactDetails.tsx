'use client';

import { Building, Clock, Hash, Mail, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/primitives/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/primitives/card';
import { Separator } from '@/components/ui/primitives/separator';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { PulseDot } from '@/components/animations/pulse-dot';
import { SocialIcon } from '@/components/ui/composites/social-icon';
import { cn } from '@/lib/utils';
import type { PageQuery } from '@tina/__generated__/types';

type Contact = NonNullable<NonNullable<PageQuery['page']>['contact']>;
type ContactSocial = {
  __typename?: string;
  platform?: string | null;
  url?: string | null;
};

const DEFAULT_EMAIL = 'kontakt@bitspire.pl';

interface ContactDetailsProps {
  contact: Contact | null | undefined;
  locale: string;
  className?: string;
}

// NOTE: Replace placeholder NIP/KRS with real company data.
const DEFAULTS: Record<
  'pl' | 'en',
  {
    salesPhone: string;
    address: string;
    hours: string;
    taxId: string;
    krs: string;
    socials: ContactSocial[];
  }
> = {
  pl: {
    salesPhone: '+48 123 456 789',
    address: 'ul. Przykładowa 1, 00-000 Warszawa',
    hours: 'pn–pt: 9:00–17:00',
    taxId: '000-00-00-000',
    krs: '0000000000',
    socials: [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/bitspire' },
      { platform: 'GitHub', url: 'https://github.com/bitspire' },
      { platform: 'Instagram', url: 'https://www.instagram.com/bitspire' },
      { platform: 'Twitter', url: 'https://x.com/bitspire' },
    ],
  },
  en: {
    salesPhone: '+48 123 456 789',
    address: 'ul. Przykładowa 1, 00-000 Warsaw',
    hours: 'Mon–Fri: 9:00–17:00',
    taxId: '000-00-00-000',
    krs: '0000000000',
    socials: [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/bitspire' },
      { platform: 'GitHub', url: 'https://github.com/bitspire' },
      { platform: 'Instagram', url: 'https://www.instagram.com/bitspire' },
      { platform: 'Twitter', url: 'https://x.com/bitspire' },
    ],
  },
};

const UI: Record<string, Record<string, string>> = {
  pl: {
    title: 'Dane kontaktowe',
    status: 'Odpowiadamy zazwyczaj w 2 godziny',
    email: 'Email',
    salesPhone: 'Telefon do zespołu sales',
    address: 'Adres',
    hours: 'Godziny pracy',
    company: 'Dane firmy',
    taxId: 'NIP',
    krs: 'KRS',
    socials: 'Social media',
  },
  en: {
    title: 'Contact details',
    status: 'We usually reply within 2 hours',
    email: 'Email',
    salesPhone: 'Sales team phone',
    address: 'Address',
    hours: 'Working hours',
    company: 'Company details',
    taxId: 'Tax ID',
    krs: 'Company ID',
    socials: 'Social media',
  },
};

export function ContactDetails({ contact, locale, className }: ContactDetailsProps) {
  const ui = UI[locale] ?? UI.pl;
  const defaults = DEFAULTS[(locale === 'pl' ? 'pl' : 'en') as 'pl' | 'en'];
  const email = contact?.email || DEFAULT_EMAIL;
  const phone = contact?.phone || defaults.salesPhone;
  const address = contact?.address || defaults.address;
  const hours = contact?.hours || defaults.hours;
  const taxId = defaults.taxId;
  const krs = defaults.krs;

  const cmsSocials = (contact?.socials?.filter(s => Boolean(s?.url)) ?? []).map(
    s => s as ContactSocial
  );
  const socials = cmsSocials.length > 0 ? cmsSocials : defaults.socials;

  const contactItems = [
    { key: 'email', label: ui.email, value: email, href: `mailto:${email}`, icon: Mail },
    {
      key: 'phone',
      label: ui.salesPhone,
      value: phone,
      href: `tel:${phone.replace(/\s/g, '')}`,
      icon: Phone,
    },
    { key: 'address', label: ui.address, value: address, icon: MapPin },
    { key: 'hours', label: ui.hours, value: hours, icon: Clock },
  ];

  const hasCompanyDetails = Boolean(taxId) || Boolean(krs);

  return (
    <FadeIn>
      <Card className={cn('h-full', className)}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="font-heading text-xl md:text-2xl">{ui.title}</CardTitle>
              <CardDescription className="mt-1 font-sans text-xs text-muted-foreground">
                {locale === 'pl' ? 'Jesteśmy do Twojej dyspozycji.' : 'We are at your disposal.'}
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="shrink-0 gap-1.5 rounded-full border border-border/60 bg-card px-2.5 py-1 text-xs font-medium text-foreground"
            >
              <PulseDot className="size-2" />
              {ui.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <ul className="flex flex-col gap-4">
            {contactItems.map((item, index) => (
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

          {hasCompanyDetails ? (
            <>
              <Separator className="bg-border/60" />
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <Building className="size-4 text-muted-foreground" />
                  <h3 className="font-heading text-xs font-medium text-foreground">{ui.company}</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {taxId ? (
                    <FadeIn delay={0.2} className="flex items-start gap-3">
                      <Hash className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-sans text-xs text-muted-foreground">{ui.taxId}</p>
                        <p className="font-sans text-sm text-foreground">{taxId}</p>
                      </div>
                    </FadeIn>
                  ) : null}
                  {krs ? (
                    <FadeIn delay={0.25} className="flex items-start gap-3">
                      <Hash className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <div>
                        <p className="font-sans text-xs text-muted-foreground">{ui.krs}</p>
                        <p className="font-sans text-sm text-foreground">{krs}</p>
                      </div>
                    </FadeIn>
                  ) : null}
                </ul>
              </div>
            </>
          ) : null}

          {socials.length > 0 ? (
            <>
              <Separator className="bg-border/60" />
              <div>
                <p className="font-sans text-xs text-muted-foreground">{ui.socials}</p>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {socials.map((social, index) =>
                    social?.url ? (
                      <li key={index}>
                        <FadeIn delay={0.05 + index * 0.05}>
                          <a
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 font-sans text-xs text-foreground transition-colors hover:bg-muted hover:text-primary"
                            aria-label={social.platform || 'Link'}
                          >
                            <SocialIcon platform={social.platform || 'Link'} className="size-3.5" />
                            {social.platform || 'Link'}
                          </a>
                        </FadeIn>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            </>
          ) : null}
        </CardContent>
      </Card>
    </FadeIn>
  );
}
