'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
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
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { FadeIn } from '@/components/ui/composites/fade-in';
import { StaggerContainer, StaggerItem } from '@/components/ui/composites/stagger';

type CardSize = 'large' | 'wide' | 'tall' | 'small' | 'empty';

type WhyBitspireData = NonNullable<PagePartsFragment['whyBitspire']>;
type WhyBitspireItem = NonNullable<NonNullable<WhyBitspireData['items']>[number]>;

interface WhyBitspireProps {
  page: PagePartsFragment;
}

const SIZE_CLASSES: Record<CardSize, string> = {
  large: 'col-span-2 row-span-2',
  wide: 'col-span-2 row-span-1',
  tall: 'col-span-1 row-span-2',
  small: 'col-span-1 row-span-1',
  empty: 'col-span-1 row-span-1',
};

const SIZE_CLASSES_LG: Record<CardSize, string> = {
  large: 'lg:col-span-2 lg:row-span-2',
  wide: 'lg:col-span-2 lg:row-span-1',
  tall: 'lg:col-span-1 lg:row-span-2',
  small: 'lg:col-span-1 lg:row-span-1',
  empty: 'lg:col-span-1 lg:row-span-1',
};

// Exact 5-card layout: content order is Arch | Scale | UX | Security | Empty.
// Desktop (4x2): [empty][arch arch][scale]
//                [ux ux ][security][scale]
// Mobile (2x4):  [scale][security]
//                [scale][empty]
//                [arch arch]
//                [ux ux]
const START_CLASSES = [
  // 0: Architecture (wide)
  'col-start-1 row-start-3 lg:col-start-2 lg:row-start-1',
  // 1: Scalability (tall)
  'col-start-1 row-start-1 lg:col-start-4 lg:row-start-1',
  // 2: UX (wide)
  'col-start-1 row-start-4 lg:col-start-1 lg:row-start-2',
  // 3: Security (small)
  'col-start-2 row-start-1 lg:col-start-3 lg:row-start-2',
  // 4: Empty (small)
  'col-start-2 row-start-2 lg:col-start-1 lg:row-start-1',
];

const ASPECT_RATIOS: Record<CardSize, number> = {
  large: 4 / 3,
  wide: 16 / 9,
  tall: 3 / 4,
  small: 1,
  empty: 1,
};

function normalizeImageSrc(src?: string | null): string | null {
  if (!src) return null;
  return src.startsWith('/') ? src : `/${src}`;
}

function parseSize(size?: string | null): CardSize {
  const valid: CardSize[] = ['large', 'wide', 'tall', 'small', 'empty'];
  return valid.includes(size as CardSize) ? (size as CardSize) : 'small';
}

function getCardClasses(size: CardSize, index: number, totalCount: number): string {
  if (totalCount === 5 && index < START_CLASSES.length) {
    return cn(START_CLASSES[index], SIZE_CLASSES[size], SIZE_CLASSES_LG[size]);
  }
  return cn(SIZE_CLASSES[size], SIZE_CLASSES_LG[size]);
}

function BentoCard({
  item,
  index,
  totalCount,
}: {
  item: WhyBitspireItem;
  index: number;
  totalCount: number;
}) {
  const size = parseSize(item.size);
  const isEmpty = size === 'empty';
  const imageSrc = normalizeImageSrc(item.image);

  const positionClass = getCardClasses(size, index, totalCount);

  if (isEmpty) {
    return (
      <StaggerItem y={20} duration={0.4} className={positionClass}>
        <Card
          aria-label="Puste pole"
          data-tina-field={tinaField(item, 'title')}
          className="size-full items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 ring-0"
        />
      </StaggerItem>
    );
  }

  return (
    <StaggerItem
      y={24}
      duration={0.5}
      className={positionClass}
    >
      <Card
        data-tina-field={tinaField(item, 'title')}
        className="group/card flex size-full flex-col gap-0 overflow-hidden rounded-lg pt-0 transition-shadow duration-300 hover:shadow-lg"
      >
        {imageSrc && (
          <div data-tina-field={tinaField(item, 'image')}>
            <AspectRatio
              ratio={ASPECT_RATIOS[size]}
              className="w-full bg-muted"
            >
              <Image
                src={imageSrc}
                alt={item.imageAlt ?? item.title}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-contain p-3"
              />
            </AspectRatio>
          </div>
        )}

        <CardHeader className="gap-1.5 px-(--card-spacing) pt-(--card-spacing)">
          <CardTitle
            data-tina-field={tinaField(item, 'title')}
            className={cn(
              'font-heading font-medium text-foreground',
              size === 'small' ? 'text-lg' : 'text-xl'
            )}
          >
            {item.title}
          </CardTitle>

          {item.subHeadline ? (
            <CardDescription
              data-tina-field={tinaField(item, 'subHeadline')}
              className={cn(
                'font-sans text-sm text-muted-foreground',
                size === 'small' ? 'line-clamp-1' : 'line-clamp-2'
              )}
            >
              {item.subHeadline}
            </CardDescription>
          ) : null}
        </CardHeader>

        {item.body ? (
          <CardContent
            data-tina-field={tinaField(item, 'body')}
            className={cn(
              'px-(--card-spacing) pb-(--card-spacing) font-sans text-sm text-muted-foreground',
              size === 'small' ? 'line-clamp-2' : 'line-clamp-3'
            )}
          >
            {item.body}
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

  const items = data.items.filter(
    (item): item is WhyBitspireItem => !!item
  );

  const titleFallback = locale === 'pl' ? 'Dlaczego Bitspire' : 'Why Bitspire';
  const isExactLayout = items.length === 5;

  return (
    <section className="relative w-full bg-background">
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
          className={cn(
            'grid gap-4 md:gap-6',
            isExactLayout
              ? 'grid-cols-2 lg:grid-cols-4 grid-rows-[repeat(4,minmax(180px,auto))] lg:grid-rows-[repeat(2,minmax(180px,auto))]'
              : 'grid-cols-2 lg:grid-cols-4 grid-flow-dense auto-rows-[minmax(180px,auto)]'
          )}
        >
          {items.map((item, index) => (
            <BentoCard key={index} item={item} index={index} totalCount={items.length} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
