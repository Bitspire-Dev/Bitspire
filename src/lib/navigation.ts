import type { LocalizedHref } from '@/lib/routes';
import { getPageHref } from '@/lib/routes';

export interface NavLink {
  label: string;
  href: LocalizedHref;
}

export const MAIN_NAV_LINKS: Record<'pl' | 'en', NavLink[]> = {
  pl: [
    { label: 'Strona główna', href: getPageHref('home') },
    { label: 'Portfolio', href: getPageHref('portfolio') },
    { label: 'Blog', href: getPageHref('blog') },
    { label: 'Kontakt', href: getPageHref('contact') },
  ],
  en: [
    { label: 'Home', href: getPageHref('home') },
    { label: 'Portfolio', href: getPageHref('portfolio') },
    { label: 'Blog', href: getPageHref('blog') },
    { label: 'Contact', href: getPageHref('contact') },
  ],
};
