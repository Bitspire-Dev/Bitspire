export interface NavLink {
  label: string;
  href: string;
}

export const MAIN_NAV_LINKS: Record<'pl' | 'en', NavLink[]> = {
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
