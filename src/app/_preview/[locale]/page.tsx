import client from '@tina/__generated__/client';
import { HomePage } from '@/components/pages/HomePage';

export default async function PreviewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const tina = await client.queries.page({
    relativePath: `${locale}/home.md`,
  });

  return <HomePage query={tina.query} variables={tina.variables} data={tina.data} />;
}
