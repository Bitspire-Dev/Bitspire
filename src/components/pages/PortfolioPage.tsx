'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import type { PageQuery } from '@tina/__generated__/types';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/primitives/card';
import { Button } from '@/components/ui/primitives/button';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { Separator } from '@/components/ui/primitives/separator';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/primitives/stagger';
import { PORTFOLIO_CATEGORIES, getCategoryHref } from '@/lib/portfolio/categories';
import { Breadcrumb, type BreadcrumbItem } from '@/components/ui/navigation/breadcrumb';

interface PortfolioPageProps {
  query: string;
  variables: { relativePath: string };
  data: PageQuery;
  locale: string;
  jsonLd?: Record<string, unknown>;
  breadcrumbs?: BreadcrumbItem[];
}

const UI: Record<string, Record<string, string>> = {
  pl: { browse: 'Przeglądaj' },
  en: { browse: 'Browse' },
};

export function PortfolioPage({
  query,
  variables,
  data,
  locale,
  jsonLd,
  breadcrumbs,
}: PortfolioPageProps) {
  const { data: tinaData } = useTina({ query, variables, data });
  const page = tinaData?.page;
  const ui = UI[locale] ?? UI.pl;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      {breadcrumbs ? (
        <Breadcrumb
          items={breadcrumbs}
          className="container mx-auto max-w-360 px-4 pt-6 md:px-6 md:pt-8"
        />
      ) : null}
      <section className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
        {page?.title ? (
          <div className="mb-8 max-w-2xl">
            <FadeIn>
              <h1
                data-tina-field={tinaField(page, 'title')}
                className="font-heading text-3xl font-bold text-foreground md:text-5xl"
              >
                {page.title}
              </h1>
            </FadeIn>
            {page.description ? (
              <FadeIn delay={0.05}>
                <p
                  data-tina-field={tinaField(page, 'description')}
                  className="mt-4 font-sans text-base text-muted-foreground"
                >
                  {page.description}
                </p>
              </FadeIn>
            ) : null}
          </div>
        ) : null}

        <Separator className="mb-12" />

        <StaggerContainer className="grid gap-6 md:grid-cols-2">
          {PORTFOLIO_CATEGORIES.map(category => (
            <StaggerItem key={category.id}>
              <Card className="group/card overflow-hidden">
                <AspectRatio ratio={4 / 3} className="bg-muted">
                  <Image
                    src={category.image}
                    alt={category.label[locale] ?? category.label.en}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain p-8 opacity-50 grayscale transition-all duration-300 group-hover/card:scale-105 group-hover/card:opacity-100 group-hover/card:grayscale-0"
                  />
                </AspectRatio>
                <CardHeader className="items-start gap-2">
                  <CardTitle as="h2" className="font-heading text-lg md:text-xl">
                    {category.label[locale] ?? category.label.en}
                  </CardTitle>
                  <CardDescription className="font-sans text-sm text-muted-foreground">
                    {category.description[locale] ?? category.description.en}
                  </CardDescription>
                </CardHeader>
                <div className="px-(--card-spacing) pb-(--card-spacing)">
                  <Button asChild>
                    <Link href={getCategoryHref(locale, category.id)}>{ui.browse}</Link>
                  </Button>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </>
  );
}
