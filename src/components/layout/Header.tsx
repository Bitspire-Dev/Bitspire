'use client';

import { useState, type ComponentProps } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { Link } from '@/i18n/navigation';
import { ChevronDownIcon, Menu, X } from 'lucide-react';
import { LocaleSwitcher } from '@/components/ui/navigation/locale-switcher';
import { ThemeSwitcher } from '@/components/ui/navigation/theme-switcher';
import { useMounted } from '@/lib/use-mounted';
import { cn } from '@/lib/utils';
import { getPageHref } from '@/lib/routes';
import { Button } from '@/components/ui/primitives/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/primitives/navigation-menu';
import { getCategoryHref } from '@/lib/portfolio/categories';
import type { BlogArticleMap } from '@/lib/blog';
import { MAIN_NAV_LINKS, type NavLink } from '@/lib/navigation';

type Href = ComponentProps<typeof Link>['href'];

interface HeaderProps {
  locale: string;
  blogMap: BlogArticleMap;
}

export function Header({ locale, blogMap }: HeaderProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const navLinks = MAIN_NAV_LINKS[locale as 'pl' | 'en'] ?? MAIN_NAV_LINKS.pl;
  const isDark = mounted && resolvedTheme === 'dark';
  const logoSrc = isDark ? '/favicon-dark-mode.svg' : '/favicon-light-mode.svg';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background md:bg-background/95 md:backdrop-blur">
      <div className="container mx-auto flex h-14 max-w-360 items-center justify-between px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3 md:gap-4">
          <MobileMenu locale={locale} links={navLinks} blogMap={blogMap} />
          <ThemeSwitcher className="md:hidden" />

          <Link
            href={getPageHref('home') as Href}
            className="flex min-w-0 items-center gap-2"
            aria-label="Bitspire"
          >
            <Image
              src={logoSrc}
              alt="Bitspire"
              width={24}
              height={19}
              className="h-5 w-auto shrink-0"
              unoptimized
            />
            <span className="font-heading text-base font-bold tracking-widest text-brand sm:text-lg sm:tracking-[0.2em] md:text-xl">
              BITSPIRE
            </span>
          </Link>
        </div>

        <DesktopNav links={navLinks} locale={locale} />

        <div className="hidden items-center gap-2 md:flex">
          <ThemeSwitcher />
          <LocaleSwitcher locale={locale} blogMap={blogMap} />
        </div>
      </div>
    </header>
  );
}

function DesktopNav({ links, locale }: { links: NavLink[]; locale: string }) {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {links.map(link =>
          link.href === '/portfolio' ? (
            <PortfolioMenuItem key={link.label} label={link.label} locale={locale} />
          ) : (
            <NavigationMenuItem key={link.label}>
              <Button
                asChild
                variant="ghost"
                className="text-foreground/70 hover:bg-muted hover:text-foreground"
              >
                <Link href={link.href as Href}>{link.label}</Link>
              </Button>
            </NavigationMenuItem>
          )
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function PortfolioMenuItem({ label, locale }: { label: string; locale: string }) {
  const [open, setOpen] = useState(false);

  return (
    <NavigationMenuItem
      className="relative"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <Button
        variant="ghost"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="text-foreground/70 hover:bg-muted hover:text-foreground"
      >
        {label}
        <ChevronDownIcon
          className={cn(
            'relative top-px ml-1 size-3 transition duration-300',
            open && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </Button>
      {open ? (
        <div className="absolute top-full left-0 z-50 mt-1.5 w-auto rounded-xl bg-popover p-1.5 text-popover-foreground shadow-md ring-1 ring-foreground/10">
          <div className="flex flex-col gap-1">
            <Button asChild variant="ghost" className="justify-start">
              <Link href={getCategoryHref(locale, 'websites')} onClick={() => setOpen(false)}>
                {locale === 'pl' ? 'Strony internetowe' : 'Websites'}
              </Link>
            </Button>
            <Button asChild variant="ghost" className="justify-start">
              <Link href={getCategoryHref(locale, 'software')} onClick={() => setOpen(false)}>
                {locale === 'pl' ? 'Oprogramowanie' : 'Software'}
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
    </NavigationMenuItem>
  );
}

function MobileMenu({
  locale,
  links,
  blogMap,
}: {
  locale: string;
  links: NavLink[];
  blogMap: BlogArticleMap;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(s => !s)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="size-11 text-foreground/80"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      <div
        className={cn(
          'fixed inset-x-0 top-14 z-40 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-b border-border/40 bg-background px-4 py-6 transition-all duration-200 md:hidden',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        <nav className="w-full">
          <ul className="flex flex-col items-start gap-1">
            {links.map(link =>
              link.href === '/portfolio' ? (
                <li key={link.label} className="w-full">
                  <span className="block w-full rounded-lg py-3 font-sans text-base font-medium text-foreground/80">
                    {link.label}
                  </span>
                  <ul className="ml-4 flex flex-col gap-1 border-l border-border/40 pl-2">
                    <li className="w-full">
                      <Link
                        href={getCategoryHref(locale, 'websites')}
                        onClick={() => setOpen(false)}
                        className="block w-full rounded-lg py-3 font-sans text-sm text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {locale === 'pl' ? 'Strony internetowe' : 'Websites'}
                      </Link>
                    </li>
                    <li className="w-full">
                      <Link
                        href={getCategoryHref(locale, 'software')}
                        onClick={() => setOpen(false)}
                        className="block w-full rounded-lg py-3 font-sans text-sm text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                      >
                        {locale === 'pl' ? 'Oprogramowanie' : 'Software'}
                      </Link>
                    </li>
                  </ul>
                </li>
              ) : (
                <li key={link.label} className="w-full">
                  <Link
                    href={link.href as Href}
                    onClick={() => setOpen(false)}
                    className="block w-full rounded-lg py-3 font-sans text-base text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="mt-4 border-t border-border/40 pt-4">
          <LocaleSwitcher locale={locale} blogMap={blogMap} />
        </div>
      </div>
    </div>
  );
}
