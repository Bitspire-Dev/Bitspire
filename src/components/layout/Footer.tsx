import { memo } from 'react';
import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Separator } from '@/components/ui/primitives/separator';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { Button } from '@/components/ui/primitives/button';
import { SocialIcon } from '@/components/ui/composites/social-icon';
import { COMPANY } from '@/lib/company';
import { MAIN_NAV_LINKS, type NavLink } from '@/lib/navigation';

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
  legal: { label: string; href: Href }[];
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
    legal: [{ label: 'Polityka prywatności', href: '/privacy' }],
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
    legal: [{ label: 'Privacy Policy', href: '/privacy' }],
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
  const company = COMPANY;

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
                {company.socials.map(social => (
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
                      <SocialIcon platform={social.platform} className="size-4" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <FooterColumn title={content.headings.navigation}>
              <nav className="flex flex-col gap-2">
                {(MAIN_NAV_LINKS[locale as 'pl' | 'en'] ?? MAIN_NAV_LINKS.pl).map(
                  (link: NavLink) => (
                    <Link
                      key={link.href}
                      href={link.href as Href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </nav>
            </FooterColumn>

            {/* Contact */}
            <FooterColumn title={content.headings.contact}>
              <div className="flex flex-col gap-3">
                <ContactItem icon={Mail}>
                  <a
                    href={`mailto:${company.email}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {company.email}
                  </a>
                </ContactItem>
                <ContactItem icon={Phone}>
                  <a
                    href={`tel:${company.phoneRaw}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {company.phone}
                  </a>
                </ContactItem>
                <ContactItem icon={MapPin}>
                  <span>{company.address[locale as 'pl' | 'en'] ?? company.address.pl}</span>
                </ContactItem>
                <ContactItem icon={Clock}>
                  <span>{company.hours[locale as 'pl' | 'en'] ?? company.hours.pl}</span>
                </ContactItem>
              </div>
            </FooterColumn>

            {/* Legal */}
            <FooterColumn title={content.headings.legal}>
              <nav className="flex flex-col gap-2">
                {content.legal.map(link => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
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
