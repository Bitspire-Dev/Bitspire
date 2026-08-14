import { memo } from 'react';
import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Globe, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Separator } from '@/components/ui/primitives/separator';
import { FadeIn } from '@/components/ui/composites/fade-in';
import { Button } from '@/components/ui/primitives/button';

type Href = ComponentProps<typeof Link>['href'];

interface FooterProps {
  locale: string;
}

interface FooterContent {
  company: string;
  tagline: string;
  headings: {
    navigation: string;
    contact: string;
    legal: string;
  };
  navLinks: { label: string; href: Href }[];
  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  socials: { platform: string; url: string }[];
  legal: { label: string; href: Href | string; placeholder?: boolean }[];
  copyright: string;
}

const FOOTER_CONTENT: Record<'pl' | 'en', FooterContent> = {
  pl: {
    company: 'Bitspire',
    tagline: 'Nowoczesne strony internetowe i oprogramowanie na miarę Twojego biznesu.',
    headings: {
      navigation: 'Nawigacja',
      contact: 'Kontakt',
      legal: 'Prawne',
    },
    navLinks: [
      { label: 'Strona główna', href: '/' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'Kontakt', href: '/contact' },
    ],
    contact: {
      email: 'hello@bitspire.pl',
      phone: '+48 123 456 789',
      address: 'ul. Przykładowa 1, 00-000 Warszawa',
      hours: 'pn–pt: 9:00–17:00',
    },
    socials: [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/bitspire' },
      { platform: 'GitHub', url: 'https://github.com/bitspire' },
      { platform: 'Instagram', url: 'https://www.instagram.com/bitspire' },
      { platform: 'Twitter', url: 'https://x.com/bitspire' },
    ],
    legal: [
      { label: 'Polityka prywatności', href: '/privacy' },
      { label: 'Regulamin', href: '#', placeholder: true },
      { label: 'Polityka cookies', href: '#', placeholder: true },
    ],
    copyright: '© 2026 Bitspire. Wszelkie prawa zastrzeżone.',
  },
  en: {
    company: 'Bitspire',
    tagline: 'Modern websites and tailor-made software for your business.',
    headings: {
      navigation: 'Navigation',
      contact: 'Contact',
      legal: 'Legal',
    },
    navLinks: [
      { label: 'Home', href: '/' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    contact: {
      email: 'hello@bitspire.pl',
      phone: '+48 123 456 789',
      address: 'ul. Przykładowa 1, 00-000 Warsaw',
      hours: 'Mon–Fri: 9:00–17:00',
    },
    socials: [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/company/bitspire' },
      { platform: 'GitHub', url: 'https://github.com/bitspire' },
      { platform: 'Instagram', url: 'https://www.instagram.com/bitspire' },
      { platform: 'Twitter', url: 'https://x.com/bitspire' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '#', placeholder: true },
      { label: 'Cookie Policy', href: '#', placeholder: true },
    ],
    copyright: '© 2026 Bitspire. All rights reserved.',
  },
};

function ContactItem({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm text-muted-foreground">
      <Icon className="mt-0.5 size-4 shrink-0" />
      {children}
    </div>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function FooterContent({ locale }: FooterProps) {
  const content = FOOTER_CONTENT[(locale === 'pl' ? 'pl' : 'en') as 'pl' | 'en'];

  return (
    <footer className="w-full border-t border-border/60 bg-background">
      <FadeIn className="w-full">
        <div className="container mx-auto max-w-360 px-6 py-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <span className="font-heading text-lg font-bold tracking-[0.2em] text-foreground">
                {content.company}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">{content.tagline}</p>
              <div className="flex items-center gap-2">
                {content.socials.map(social => (
                  <Button
                    key={social.platform}
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                    >
                      <Globe className="size-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <FooterColumn title={content.headings.navigation}>
              <nav className="flex flex-col gap-2">
                {content.navLinks.map(link => (
                  <Link
                    key={link.label}
                    href={link.href as Href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </FooterColumn>

            {/* Contact */}
            <FooterColumn title={content.headings.contact}>
              <div className="flex flex-col gap-3">
                <ContactItem icon={Mail}>
                  <a
                    href={`mailto:${content.contact.email}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {content.contact.email}
                  </a>
                </ContactItem>
                <ContactItem icon={Phone}>
                  <a
                    href={`tel:${content.contact.phone.replace(/\s/g, '')}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {content.contact.phone}
                  </a>
                </ContactItem>
                <ContactItem icon={MapPin}>
                  <span>{content.contact.address}</span>
                </ContactItem>
                <ContactItem icon={Clock}>
                  <span>{content.contact.hours}</span>
                </ContactItem>
              </div>
            </FooterColumn>

            {/* Legal */}
            <FooterColumn title={content.headings.legal}>
              <nav className="flex flex-col gap-2">
                {content.legal.map(link =>
                  link.placeholder ? (
                    <a
                      key={link.label}
                      href={link.href as string}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      aria-disabled="true"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href as Href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            </FooterColumn>
          </div>

          <Separator className="mt-10 bg-border/60" />

          <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">{content.copyright}</p>
            <p className="text-xs text-muted-foreground">
              {locale === 'pl'
                ? 'Projekt i realizacja: Bitspire'
                : 'Designed and built by Bitspire'}
            </p>
          </div>
        </div>
      </FadeIn>
    </footer>
  );
}

export const Footer = memo(FooterContent);
