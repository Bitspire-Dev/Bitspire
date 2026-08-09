export interface PortfolioCategory {
  id: 'websites' | 'software';
  slug: Record<string, string>;
  label: Record<string, string>;
  description: Record<string, string>;
  image: string;
}

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  {
    id: 'websites',
    slug: { pl: 'strony-internetowe', en: 'websites' },
    label: { pl: 'Strony internetowe', en: 'Websites' },
    description: {
      pl: 'Nowoczesne strony internetowe i aplikacje webowe',
      en: 'Modern websites and web applications',
    },
    image: '/logo-carousel/nextjs.svg',
  },
  {
    id: 'software',
    slug: { pl: 'oprogramowanie', en: 'software' },
    label: { pl: 'Oprogramowanie', en: 'Software' },
    description: {
      pl: 'Dedykowane oprogramowanie i aplikacje desktopowe',
      en: 'Custom software and desktop applications',
    },
    image: '/logo-carousel/react.svg',
  },
];

export type PortfolioCategoryId = (typeof PORTFOLIO_CATEGORIES)[number]['id'];

export function isPortfolioCategoryId(id: string): id is PortfolioCategoryId {
  return PORTFOLIO_CATEGORIES.some(category => category.id === id);
}

export function getCategoryById(id: string): PortfolioCategory | undefined {
  return PORTFOLIO_CATEGORIES.find(category => category.id === id);
}

export function getCategoryBySlug(slug: string, locale: string): PortfolioCategory | undefined {
  return PORTFOLIO_CATEGORIES.find(category => category.slug[locale] === slug);
}

export function getCategoryUrlSlug(id: PortfolioCategoryId, locale: string): string {
  return getCategoryById(id)?.slug[locale] ?? id;
}

export function getCategoryHref(locale: string, categoryId: PortfolioCategoryId) {
  const category = getCategoryUrlSlug(categoryId, locale);
  return {
    pathname: '/portfolio/[category]' as const,
    params: { category },
  };
}

export function getProjectHref(
  locale: string,
  categoryId: PortfolioCategoryId,
  projectSlug: string
) {
  const category = getCategoryUrlSlug(categoryId, locale);
  return {
    pathname: '/portfolio/[category]/[slug]' as const,
    params: { category, slug: projectSlug },
  };
}
