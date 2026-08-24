import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProject, getProjectConnection } from '@/lib/tina';
import { PortfolioProjectPage } from '@/components/pages/PortfolioProjectPage';
import {
  getCategoryBySlug,
  getCategoryUrlSlug,
  PORTFOLIO_CATEGORIES,
  type PortfolioCategoryId,
} from '@/lib/portfolio/categories';
import { localeAlternates } from '@/lib/site';

interface ProjectPageParams {
  locale: string;
  category: string;
  slug: string;
}

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
    const slug = filename.replace(/\.md$/, '');
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

  return {
    title: project.title,
    description: project.description,
    alternates: localeAlternates(
      locale,
      l => `/portfolio/${getCategoryUrlSlug(canonicalCategory, l)}/${slug}`
    ),
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.description ?? undefined,
      images: screenshot ? [{ url: screenshot, alt: project.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description ?? undefined,
      images: screenshot ? [screenshot] : undefined,
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

  return (
    <PortfolioProjectPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data}
      locale={locale}
      category={canonicalCategory}
    />
  );
}
