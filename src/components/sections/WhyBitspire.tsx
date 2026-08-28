'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { ImageIcon } from 'lucide-react';
import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { getWhyBitspireUi } from '@/lib/ui';

import { cn } from '@/lib/utils';
import { useThemeImage } from '@/hooks/use-theme-image';
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

const ASSETS_TINA_IO = 'https://assets.tina.io/';
const TINA_ASSETS_PATTERN =
  /^https:\/\/assets\.tina\.io\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})([^/].*)/;

function normalizeImageSrc(src?: string | null): string | null {
  if (!src) return null;

  // TinaCMS can emit assets.tina.io URLs without a slash between the clientId
  // and the file path (e.g. ...e309layout/ekran-vs-code.png). Repair that.
  const tinaMatch = src.match(TINA_ASSETS_PATTERN);
  if (tinaMatch) {
    return `${ASSETS_TINA_IO}${tinaMatch[1]}/${tinaMatch[2]}`;
  }

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
  imageMinHeight = 'min-h-40 sm:min-h-48',
  titleClassName,
}: BentoCardProps) {
  const rawSrc = normalizeImageSrc(item.image);
  const imageSrc = useThemeImage(rawSrc, '');
  const bodySource = item.body || item.fullText || '';
  const segments = parseBodyText(bodySource);

  return (
    <StaggerItem y={24} duration={0.5} className={cn('flex', className)}>
      <Card
        variant="glass"
        data-tina-field={tinaField(item, 'title')}
        className="group/card flex size-full flex-col gap-0 overflow-hidden rounded-2xl pt-0"
      >
        {imageSrc ? (
          <div
            data-tina-field={tinaField(item, 'image')}
            className={cn('relative flex-1 overflow-hidden bg-muted/50', imageMinHeight)}
          >
            <Image
              src={imageSrc}
              alt={item.imageAlt ?? item.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-2 sm:p-4"
            />
          </div>
        ) : (
          <div
            className={cn('flex flex-1 items-center justify-center bg-muted/50', imageMinHeight)}
          >
            <ImageIcon className="size-8 opacity-30" />
          </div>
        )}

        <CardHeader className="gap-1.5 px-(--card-spacing) pt-(--card-spacing)">
          <CardTitle
            as="h3"
            data-tina-field={tinaField(item, 'title')}
            className={cn('font-heading font-semibold text-foreground', titleClassName)}
          >
            {item.title}
          </CardTitle>

          {item.subHeadline ? (
            <CardDescription
              data-tina-field={tinaField(item, 'subHeadline')}
              className="font-sans text-sm text-foreground/70"
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
            <div className="space-y-2.5">
              {segments.map((segment, pIndex) =>
                segment.type === 'heading' ? (
                  <h4
                    key={pIndex}
                    className="mt-2 font-heading text-sm font-semibold text-foreground"
                  >
                    {segment.text}
                  </h4>
                ) : (
                  <p
                    key={pIndex}
                    className="font-sans text-sm leading-7 text-foreground/75 md:text-base"
                  >
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

type BentoSize = 'large' | 'wide' | 'tall' | 'small' | 'empty';

function resolveBentoSize(item: WhyBitspireItem, index: number): BentoSize {
  if (item.size) return item.size as BentoSize;
  // Legacy fallback: first four items follow the original hard-coded layout.
  if (index === 0) return 'tall';
  if (index === 1) return 'large';
  return 'small';
}

function assignBentoSlots(items: WhyBitspireItem[]): {
  tall?: WhyBitspireItem;
  large?: WhyBitspireItem;
  small: WhyBitspireItem[];
  rest: WhyBitspireItem[];
} {
  const small: WhyBitspireItem[] = [];
  const rest: WhyBitspireItem[] = [];
  let tall: WhyBitspireItem | undefined;
  let large: WhyBitspireItem | undefined;

  for (const [index, item] of items.entries()) {
    const size = resolveBentoSize(item, index);
    if (size === 'tall' && !tall) {
      tall = item;
    } else if (size === 'large' && !large) {
      large = item;
    } else if (size === 'small' && small.length < 2) {
      small.push(item);
    } else {
      rest.push(item);
    }
  }

  return { tall, large, small, rest };
}

export function WhyBitspire({ page }: WhyBitspireProps) {
  const locale = useLocale();
  const data = page.whyBitspire;
  const ui = getWhyBitspireUi(locale);

  if (!data?.items?.length) {
    return null;
  }

  const items = data.items.filter((item): item is WhyBitspireItem => !!item);
  const { tall, large, small, rest } = assignBentoSlots(items);

  return (
    <section className="relative w-full scroll-mt-20 bg-background">
      <div className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
        <FadeIn className="mb-10 max-w-2xl">
          <h2
            data-tina-field={tinaField(data, 'title')}
            className="font-heading text-2xl font-semibold tracking-tight text-balance text-foreground sm:text-3xl md:text-4xl"
          >
            {data.title ?? ui.titleFallback}
          </h2>

          {data.description ? (
            <p
              data-tina-field={tinaField(data, 'description')}
              className="mt-4 font-sans text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg"
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
          <div className="flex flex-col gap-4 md:gap-6 lg:w-[64%]">
            {large ? (
              <BentoCard
                item={large}
                className="flex-1"
                imageMinHeight="min-h-48 sm:min-h-64"
                titleClassName="text-xl font-bold sm:text-2xl"
              />
            ) : null}

            {small.length > 0 ? (
              <div className="flex flex-col gap-4 sm:flex-row md:gap-6">
                {small.map(item => (
                  <BentoCard
                    key={item.title}
                    item={item}
                    className="flex-1"
                    imageMinHeight="min-h-40 sm:min-h-48"
                    titleClassName="text-base sm:text-lg"
                  />
                ))}
              </div>
            ) : null}

            {rest.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                {rest.map(item => (
                  <BentoCard
                    key={item.title}
                    item={item}
                    className="flex-1"
                    imageMinHeight="min-h-40 sm:min-h-48"
                    titleClassName="text-base sm:text-lg"
                  />
                ))}
              </div>
            ) : null}
          </div>

          {tall ? (
            <BentoCard
              item={tall}
              className="lg:w-[36%]"
              imageMinHeight="min-h-48 sm:min-h-64"
              titleClassName="text-lg sm:text-xl"
            />
          ) : null}
        </StaggerContainer>
      </div>
    </section>
  );
}
