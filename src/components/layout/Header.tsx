'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { LocaleSwitcher } from '@/components/ui/composites/locale-switcher';
import { cn } from '@/lib/utils';

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  locale: string;
  links: NavLink[];
}

const DEFAULT_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
];

export function Header({ locale, links }: HeaderProps) {
  const navLinks = links.length > 0 ? links : DEFAULT_LINKS;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MobileMenu locale={locale} links={navLinks} />

          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="/layout/logo-bitspire.svg"
              alt="Bitspire"
              width={120}
              height={32}
              className="h-8 w-auto"
              unoptimized
            />
            <span className="font-heading text-lg font-bold tracking-[0.2em] text-[#0052FF] md:text-xl">
              BITSPIRE
            </span>
          </Link>
        </div>

        <DesktopNav locale={locale} links={navLinks} />

        <div className="hidden md:block">
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </header>
  );
}

function DesktopNav({ locale, links }: { locale: string; links: NavLink[] }) {
  return (
    <nav className="hidden md:block">
      <ul className="flex items-center gap-1">
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={`/${locale}${link.href === '/' ? '' : link.href}`}
              className="rounded-lg px-3 py-2 font-sans text-sm text-foreground/70 transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MobileMenu({ locale, links }: { locale: string; links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(s => !s)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        className={cn(
          'fixed inset-x-0 top-14 z-40 border-b border-border/40 bg-background/95 px-4 py-6 backdrop-blur transition-all duration-200 md:hidden',
          open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0 pointer-events-none'
        )}
      >
        <nav className="w-full">
          <ul className="flex flex-col items-start gap-1">
            {links.map(link => (
              <li key={link.href} className="w-full">
                <Link
                  href={`/${locale}${link.href === '/' ? '' : link.href}`}
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-lg py-2 font-sans text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 border-t border-border/40 pt-4">
          <LocaleSwitcher locale={locale} />
        </div>
      </div>
    </div>
  );
}
