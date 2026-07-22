import client from '@tina/__generated__/client';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface HeroProps {
  locale: string;
}

export async function Hero({ locale }: HeroProps) {
  const { data } = await client.queries.page({
    relativePath: `home/${locale}.md`,
  });

  const page = data.page;
  const body = page?.body as Parameters<typeof TinaMarkdown>[0]['content'];

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="container relative mx-auto flex max-w-[1440px] flex-col items-center px-6 py-24 text-center">
        <h1 className="max-w-4xl font-heading text-5xl font-semibold leading-tight tracking-tight text-foreground md:text-7xl">
          {page?.title ?? 'Bitspire'}
        </h1>

        {page?.description && (
          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-muted-foreground md:text-xl">
            {page.description}
          </p>
        )}

        {body && (
          <div className="prose prose-invert mt-8 max-w-2xl font-sans text-muted-foreground">
            <TinaMarkdown content={body} />
          </div>
        )}
      </div>
    </section>
  );
}
