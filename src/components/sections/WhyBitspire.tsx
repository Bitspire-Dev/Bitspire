'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ImageIcon } from 'lucide-react';
import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';

import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/primitives/card';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/animations/primitives/stagger';

type WhyBitspireData = NonNullable<PagePartsFragment['whyBitspire']>;
type WhyBitspireItem = NonNullable<NonNullable<WhyBitspireData['items']>[number]>;

interface WhyBitspireProps {
  page: PagePartsFragment;
}

function normalizeImageSrc(src?: string | null): string | null {
  if (!src) return null;
  return src.startsWith('/') ? src : `/${src}`;
}

interface TextSegment {
  type: 'heading' | 'paragraph';
  text: string;
}

function parseBodyText(source: string): TextSegment[] {
  return source
    .split(/\r?\n\s*\r?\n/)
    .map(p => p.replace(/\r?\n/g, ' ').trim())
    .filter(Boolean)
    .map(text => {
      const match = text.match(/^(#{1,4})\s+(.+)$/);
      return match
        ? { type: 'heading' as const, text: match[2] }
        : { type: 'paragraph' as const, text };
    });
}

interface BentoCardProps {
  item: WhyBitspireItem;
  className?: string;
  imageMinHeight?: string;
  titleClassName?: string;
}

function BentoCard({
  item,
  className,
  imageMinHeight = 'min-h-48',
  titleClassName,
}: BentoCardProps) {
  const imageSrc = normalizeImageSrc(item.image);
  const bodySource = item.body || item.fullText || '';
  const segments = parseBodyText(bodySource);

  return (
    <StaggerItem y={24} duration={0.5} className={cn('flex', className)}>
      <Card
        data-tina-field={tinaField(item, 'title')}
        className="group/card flex size-full flex-col gap-0 overflow-hidden rounded-lg pt-0 transition-shadow duration-300 hover:shadow-lg"
      >
        {imageSrc ? (
          <div
            data-tina-field={tinaField(item, 'image')}
            className={cn('relative flex-1 overflow-hidden bg-muted', imageMinHeight)}
          >
            <Image
              src={imageSrc}
              alt={item.imageAlt ?? item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-4"
            />
          </div>
        ) : (
          <div className={cn('flex flex-1 items-center justify-center bg-muted', imageMinHeight)}>
            <ImageIcon className="size-8 opacity-30" />
          </div>
        )}

        <CardHeader className="gap-1.5 px-(--card-spacing) pt-(--card-spacing)">
          <CardTitle
            data-tina-field={tinaField(item, 'title')}
            className={cn('font-heading font-semibold text-foreground', titleClassName)}
          >
            {item.title}
          </CardTitle>

          {item.subHeadline ? (
            <CardDescription
              data-tina-field={tinaField(item, 'subHeadline')}
              className="font-sans text-sm text-muted-foreground"
            >
              {item.subHeadline}
            </CardDescription>
          ) : null}
        </CardHeader>

        {segments.length > 0 ? (
          <CardContent
            data-tina-field={tinaField(item, item.body ? 'body' : 'fullText')}
            className="px-(--card-spacing) pb-(--card-spacing)"
          >
            <div className="space-y-2">
              {segments.map((segment, pIndex) =>
                segment.type === 'heading' ? (
                  <h4
                    key={pIndex}
                    className="font-heading mt-2 text-sm font-semibold text-foreground"
                  >
                    {segment.text}
                  </h4>
                ) : (
                  <p key={pIndex} className="font-sans text-sm text-muted-foreground">
                    {segment.text}
                  </p>
                )
              )}
            </div>
          </CardContent>
        ) : null}
      </Card>
    </StaggerItem>
  );
}

export function WhyBitspire({ page }: WhyBitspireProps) {
  const locale = useLocale();
  const data = page.whyBitspire;

  if (!data?.items?.length) {
    return null;
  }

  const items = data.items.filter((item): item is WhyBitspireItem => !!item);
  const titleFallback = locale === 'pl' ? 'Dlaczego Bitspire' : 'Why Bitspire';

  // Asymmetric bento layout (desktop):
  //  ┌────────────────────────────────┬───────────────┐
  //  │  High-Performance (large)      │               │
  //  │  image + text                  │  Szybkość      │
  //  │                                │  (full height) │
  //  ├───────────────┬────────────────┤               │
  //  │ UX            │ Pancerne       │               │
  //  └───────────────┴────────────────┴───────────────┘
  //       left column ~64%              right ~36%
  const [highPerf, ux, speed, security] = items;

  return (
    <section className="relative w-full bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto max-w-360 px-6 py-24">
        <FadeIn className="mb-10 max-w-2xl">
          <h2
            data-tina-field={tinaField(data, 'title')}
            className="font-heading text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            {data.title ?? titleFallback}
          </h2>

          {data.description ? (
            <p
              data-tina-field={tinaField(data, 'description')}
              className="mt-4 font-sans text-lg text-muted-foreground"
            >
              {data.description}
            </p>
          ) : null}
        </FadeIn>

        <StaggerContainer
          stagger={0.08}
          delay={0.1}
          className="flex flex-col gap-4 md:gap-6 lg:flex-row lg:items-stretch"
        >
          {/* Left column: High-Performance (top) + UX & Pancerne (bottom row) */}
          <div className="flex flex-col gap-4 md:gap-6 lg:w-[64%]">
            <BentoCard
              item={highPerf}
              className="flex-1"
              imageMinHeight="min-h-64"
              titleClassName="text-2xl font-bold"
            />
            <div className="flex flex-col gap-4 md:gap-6 sm:flex-row">
              <BentoCard
                item={ux}
                className="flex-1"
                imageMinHeight="min-h-48"
                titleClassName="text-lg"
              />
              <BentoCard
                item={security}
                className="flex-1"
                imageMinHeight="min-h-48"
                titleClassName="text-lg"
              />
            </div>
          </div>

          {/* Right column: Szybkość (full height, tall) */}
          <BentoCard
            item={speed}
            className="lg:w-[36%]"
            imageMinHeight="min-h-64"
            titleClassName="text-xl"
          />
        </StaggerContainer>
      </div>
    </section>
  );
}
