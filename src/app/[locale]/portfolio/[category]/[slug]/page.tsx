import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProject, getProjectConnection } from '@/lib/tina';
import { PortfolioProjectPage } from '@/components/pages/PortfolioProjectPage';
import {
  getCategoryBySlug,
  getCategoryById,
  getCategoryUrlSlug,
  PORTFOLIO_CATEGORIES,
  type PortfolioCategoryId,
} from '@/lib/portfolio/categories';
import { localeAlternates, localePathname, siteMetadata, getDefaultOgImages, siteUrl } from '@/lib/site';
import { getPageHref } from '@/lib/routes';
import { combineJsonLd, webPageJsonLd, articleJsonLd, breadcrumbListJsonLd } from '@/lib/json-ld';
import { extractContentSlug } from '@/lib/string';

interface ProjectPageParams {
  locale: string;
  category: string;
  slug: string;
}

export const dynamicParams = false;

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const tina = await getProjectConnection();
  const edges = tina.data.projectConnection?.edges ?? [];
  const routeParams: { category: string; slug: string }[] = [];

  for (const edge of edges) {
    const node = edge?.node;
    if (!node) continue;
    const relativePath = node._sys.relativePath;
    if (!relativePath.endsWith('.md')) continue;
    const [contentLocale, canonicalCategory, filename] = relativePath.split('/');
    if (!contentLocale || !canonicalCategory || !filename) continue;
    if (contentLocale !== locale) continue;
    const categoryData = PORTFOLIO_CATEGORIES.find(category => category.id === canonicalCategory);
    if (!categoryData) continue;
    const slug = extractContentSlug(filename);
    routeParams.push({
      category: categoryData.slug[locale] ?? categoryData.slug.pl,
      slug,
    });
  }

  return routeParams;
}

function getCanonicalCategory(
  locale: string,
  categorySlug: string
): PortfolioCategoryId | undefined {
  return getCategoryBySlug(categorySlug, locale)?.id;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProjectPageParams>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const canonicalCategory = getCanonicalCategory(locale, category);
  if (!canonicalCategory) {
    return {};
  }

  const tina = await getProject(`${locale}/${canonicalCategory}/${slug}.md`);

  const project = tina.data.project;
  if (!project) return {};

  const screenshot = project.screenshot ?? undefined;
  const defaultImages = getDefaultOgImages(locale);

  return {
    title: project.title,
    description: project.description,
    alternates: localeAlternates(locale, l => ({
      pathname: '/portfolio/[category]/[slug]',
      params: {
        category: getCategoryUrlSlug(canonicalCategory, l),
        slug,
      },
    })),
    openGraph: {
      ...siteMetadata.openGraph,
      type: 'article',
      title: project.title,
      description: project.description ?? undefined,
      images: screenshot ? [{ url: screenshot, alt: project.title }] : defaultImages.openGraph,
    },
    twitter: {
      ...siteMetadata.twitter,
      card: 'summary_large_image',
      title: project.title,
      description: project.description ?? undefined,
      images: screenshot ? [screenshot] : defaultImages.twitter,
    },
  };
}

export default async function ProjectArticlePage({
  params,
}: {
  params: Promise<ProjectPageParams>;
}) {
  const { locale, category, slug } = await params;

  setRequestLocale(locale);

  const canonicalCategory = getCanonicalCategory(locale, category);
  if (!canonicalCategory) {
    notFound();
  }

  const tina = await getProject(`${locale}/${canonicalCategory}/${slug}.md`);

  if (!tina.data.project) {
    notFound();
  }

  const project = tina.data.project;
  const categoryData = getCategoryById(canonicalCategory);
  const categoryUrlSlug = getCategoryUrlSlug(canonicalCategory, locale);
  const categoryLabel = categoryData?.label[locale] ?? categoryData?.label.pl ?? category;
  const projectUrl = localePathname(locale, {
    pathname: '/portfolio/[category]/[slug]',
    params: { category: categoryUrlSlug, slug },
  });
  const homeLabel = locale === 'pl' ? 'Strona główna' : 'Home';
  const portfolioLabel = 'Portfolio';
  const jsonLd = combineJsonLd(
    webPageJsonLd({
      name: project.title,
      description: project.description,
      url: projectUrl,
      image: project.screenshot,
    }),
    articleJsonLd({
      title: project.title,
      description: project.description,
      url: projectUrl,
      image: project.screenshot,
    }),
    breadcrumbListJsonLd([
      { name: homeLabel, item: localePathname(locale, getPageHref('home')) },
      { name: portfolioLabel, item: localePathname(locale, getPageHref('portfolio')) },
      {
        name: categoryLabel,
        item: localePathname(locale, {
          pathname: '/portfolio/[category]',
          params: { category: categoryUrlSlug },
        }),
      },
      { name: project.title, item: projectUrl },
    ])
  );

  return (
    <PortfolioProjectPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      locale={locale}
      category={canonicalCategory}
      jsonLd={jsonLd}
      breadcrumbs={[
        { label: homeLabel, href: getPageHref('home') },
        { label: portfolioLabel, href: getPageHref('portfolio') },
        {
          label: categoryLabel,
          href: { pathname: '/portfolio/[category]', params: { category: categoryUrlSlug } },
        },
        { label: project.title },
      ]}
    />
  );
}
