import { setRequestLocale } from 'next-intl/server';
import client from '@tina/__generated__/client';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { notFound } from 'next/navigation';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { data } = await client.queries.page({
    relativePath: `home/${locale}.md`,
  });

  if (!data?.page) {
    notFound();
  }

  const { title, description, body } = data.page as {
    title: string;
    description: string;
    body: Parameters<typeof TinaMarkdown>[0]['content'];
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {title}
          </h1>
          {description && (
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          )}
          {body && (
            <div className="prose dark:prose-invert max-w-md">
              <TinaMarkdown content={body} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
