import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import client from '@tina/__generated__/client';
import { tinaQueryWithRetry } from '@/lib/tina';
import { buildMetadata } from '@/lib/metadata';
import { PortfolioProjectPage } from '@/components/pages/PortfolioProjectPage';
import { getCategoryBySlug, PORTFOLIO_CATEGORIES } from '@/lib/portfolio/categories';

interface ProjectPageParams {
  locale: string;
  category: string;
  slug: string;
}

export async function generateStaticParams({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const tina = await tinaQueryWithRetry(() => client.queries.projectConnection());
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

function getCanonicalCategory(locale: string, categorySlug: string): string | undefined {
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

  const tina = await tinaQueryWithRetry(() =>
    client.queries.project({
      relativePath: `${locale}/${canonicalCategory}/${slug}.md`,
    })
  );

  const project = tina.data.project;
  if (!project) {
    return {};
  }

  return buildMetadata({
    title: project.title ?? slug,
    description: project.description ?? '',
    locale,
    pathname: `/portfolio/${category}/${slug}`,
    image: project.screenshot ?? undefined,
  });
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

  const tina = await tinaQueryWithRetry(() =>
    client.queries.project({
      relativePath: `${locale}/${canonicalCategory}/${slug}.md`,
    })
  );

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
