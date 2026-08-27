'use client';

import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/i18n/navigation';
import { getCategoryBySlug, getCategoryUrlSlug } from '@/lib/portfolio/categories';
import { getBlogArticleHref, type BlogArticleMap } from '@/lib/blog';

interface UseLocaleSwitcherOptions {
  locale: string;
  blogMap: BlogArticleMap;
}

export function useLocaleSwitcher({ locale, blogMap }: UseLocaleSwitcherOptions) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const { slug, category } = params as { slug?: string; category?: string };

  return (targetLocale: string) => {
    if (
      pathname === '/' ||
      pathname === '/blog' ||
      pathname === '/portfolio' ||
      pathname === '/contact' ||
      pathname === '/privacy'
    ) {
      router.replace(pathname, { locale: targetLocale });
      return;
    }

    if (pathname === '/blog/[slug]') {
      const currentSlug = slug ?? '';
      const canonical = blogMap.bySlug[`${locale}|${currentSlug}`];
      const targetSlug = canonical
        ? (blogMap.byCanonical[canonical][targetLocale] ?? currentSlug)
        : currentSlug;
      router.replace(getBlogArticleHref(targetSlug), { locale: targetLocale });
      return;
    }

    if (pathname === '/portfolio/[category]') {
      const currentCategory = category ? getCategoryBySlug(category, locale) : undefined;
      const targetCategory = currentCategory
        ? getCategoryUrlSlug(currentCategory.id, targetLocale)
        : (category ?? '');
      router.replace(
        { pathname: '/portfolio/[category]', params: { category: targetCategory } } as Parameters<
          typeof router.replace
        >[0],
        { locale: targetLocale }
      );
      return;
    }

    if (pathname === '/portfolio/[category]/[slug]') {
      const currentCategory = category ? getCategoryBySlug(category, locale) : undefined;
      const targetCategory = currentCategory
        ? getCategoryUrlSlug(currentCategory.id, targetLocale)
        : (category ?? '');
      router.replace(
        {
          pathname: '/portfolio/[category]/[slug]',
          params: { category: targetCategory, slug: slug ?? '' },
        } as Parameters<typeof router.replace>[0],
        { locale: targetLocale }
      );
      return;
    }

    router.replace(pathname as Parameters<typeof router.replace>[0], { locale: targetLocale });
  };
}
