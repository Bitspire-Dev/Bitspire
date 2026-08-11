'use client';

import { useEffect, useState, type ComponentProps } from 'react';
import Image from 'next/image';
import { Link, usePathname } from '@/i18n/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { LocaleSwitcher } from '@/components/ui/composites/locale-switcher';
import { useTheme } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/primitives/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/primitives/navigation-menu';
import { getCategoryHref } from '@/lib/portfolio/categories';
import type { BlogArticleMap } from '@/lib/blog';

type Href = ComponentProps<typeof Link>['href'];

interface NavLink {
  label: string;
  href: string;
}

interface HeaderProps {
  locale: string;
  blogMap: BlogArticleMap;
}

const NAV_LINKS: Record<'pl' | 'en', NavLink[]> = {
  pl: [
    { label: 'Strona główna', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Kontakt', href: '/contact' },
  ],
  en: [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function Header({ locale, blogMap }: HeaderProps) {
  const navLinks = NAV_LINKS[locale as 'pl' | 'en'] ?? NAV_LINKS.pl;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[90rem] items-center px-4 md:px-6">
        <div className="flex flex-1 items-center gap-4">
          <MobileMenu locale={locale} links={navLinks} blogMap={blogMap} />

          <Link href="/" className="flex items-center gap-2">
            <ThemeLogo />
            <span className="font-heading text-lg font-bold tracking-[0.2em] text-brand md:text-xl">
              BITSPIRE
            </span>
          </Link>
        </div>

        <DesktopNav links={navLinks} locale={locale} />

        <div className="flex flex-1 items-center justify-end gap-2">
          <ThemeToggle />
          <div className="hidden md:flex">
            <LocaleSwitcher locale={locale} blogMap={blogMap} />
          </div>
        </div>
      </div>
    </header>
  );
}

function DesktopNav({ links, locale }: { links: NavLink[]; locale: string }) {
  const [value, setValue] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setValue('');
  }, [pathname]);

  return (
    <NavigationMenu className="hidden md:flex" value={value} onValueChange={setValue}>
      <NavigationMenuList>
        {links.map(link =>
          link.href === '/portfolio' ? (
            <PortfolioMenuItem
              key={link.href}
              label={link.label}
              locale={locale}
              onClose={() => setValue('')}
            />
          ) : (
            <NavigationMenuItem key={link.href}>
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

function PortfolioMenuItem({
  label,
  locale,
  onClose,
}: {
  label: string;
  locale: string;
  onClose: () => void;
}) {
  const preventHover = (event: React.PointerEvent) => event.preventDefault();

  return (
    <NavigationMenuItem value="portfolio">
      <NavigationMenuTrigger
        className="text-foreground/70 hover:bg-muted hover:text-foreground"
        onPointerEnter={preventHover}
        onPointerMove={preventHover}
        onPointerLeave={preventHover}
      >
        {label}
      </NavigationMenuTrigger>
      <NavigationMenuContent onPointerEnter={preventHover} onPointerLeave={preventHover}>
        <div className="flex flex-col gap-1 p-2">
          <Button asChild variant="ghost" className="justify-start" onClick={onClose}>
            <Link href={getCategoryHref(locale, 'websites')}>
              {locale === 'pl' ? 'Strony internetowe' : 'Websites'}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="justify-start" onClick={onClose}>
            <Link href={getCategoryHref(locale, 'software')}>
              {locale === 'pl' ? 'Oprogramowanie' : 'Software'}
            </Link>
          </Button>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function ThemeLogo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Image
      src={!mounted || theme === 'dark' ? '/favicon-dark-mode.svg' : '/favicon-light-mode.svg'}
      alt="Bitspire"
      width={24}
      height={19}
      priority
      className="h-5 w-auto"
      unoptimized
    />
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = !mounted || theme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="text-foreground/80"
    >
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
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
        className="text-foreground/80"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      <div
        className={cn(
          'fixed inset-x-0 top-14 z-40 border-b border-border/40 bg-background/95 px-4 py-6 backdrop-blur transition-all duration-200 md:hidden',
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        )}
      >
        <nav className="w-full">
          <ul className="flex flex-col items-start gap-1">
            {links.map(link => (
              <li key={link.href} className="w-full">
                <Link
                  href={link.href as Href}
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-lg py-2 font-sans text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-4">
          <ThemeToggle />
          <LocaleSwitcher locale={locale} blogMap={blogMap} />
        </div>
      </div>
    </div>
  );
}
