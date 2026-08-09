import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import client from '@tina/__generated__/client';
import type { ProjectQuery } from '@tina/__generated__/types';
import { PortfolioProjectPage } from '@/components/pages/PortfolioProjectPage';

interface ProjectPageParams {
  locale: string;
  category: string;
  slug: string;
}

export async function generateStaticParams() {
  const tina = await client.queries.projectConnection();
  const edges = tina.data.projectConnection?.edges ?? [];
  const params: ProjectPageParams[] = [];

  for (const edge of edges) {
    const node = edge?.node;
    if (!node) continue;
    const relativePath = node._sys.relativePath;
    if (!relativePath.endsWith('.md')) continue;
    const [locale, category, filename] = relativePath.split('/');
    if (!locale || !category || !filename) continue;
    const slug = filename.replace(/\.md$/, '');
    params.push({ locale, category, slug });
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ProjectPageParams>;
}): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const tina = await client.queries.project({
    relativePath: `${locale}/${category}/${slug}.md`,
  });

  return {
    title: tina.data.project?.title,
    description: tina.data.project?.description,
  };
}

export default async function ProjectArticlePage({
  params,
}: {
  params: Promise<ProjectPageParams>;
}) {
  const { locale, category, slug } = await params;

  setRequestLocale(locale);

  const tina = await client.queries.project({
    relativePath: `${locale}/${category}/${slug}.md`,
  });

  if (!tina.data.project) {
    notFound();
  }

  return (
    <PortfolioProjectPage
      query={tina.query}
      variables={tina.variables}
      data={tina.data as ProjectQuery}
      locale={locale}
      category={category}
    />
  );
}
