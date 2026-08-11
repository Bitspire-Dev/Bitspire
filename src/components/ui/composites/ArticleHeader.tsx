'use client';

import type { ReactNode, ComponentProps } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { Separator } from '@/components/ui/primitives/separator';
import { BackLink } from '@/components/ui/composites/back-link';
import { FadeIn } from '@/components/ui/composites/fade-in';

type Href = ComponentProps<typeof Link>['href'];

interface ArticleHeaderProps {
  cover?: string | null;
  coverAlt?: string;
  tinaFieldCover?: string;
  backHref: Href;
  backLabel: string;
  locale: string;
  title: string;
  tinaFieldTitle: string;
  description?: string | null;
  tinaFieldDescription?: string;
  children?: ReactNode;
}

export function ArticleHeader({
  cover,
  coverAlt,
  tinaFieldCover,
  backHref,
  backLabel,
  locale,
  title,
  tinaFieldTitle,
  description,
  tinaFieldDescription,
  children,
}: ArticleHeaderProps) {
  return (
    <div className="mt-4 w-full">
      {cover ? (
        <FadeIn>
          <AspectRatio data-tina-field={tinaFieldCover} ratio={16 / 9} className="w-full bg-muted">
            <Image
              src={cover}
              alt={coverAlt ?? title}
              fill
              priority
              unoptimized={cover?.endsWith('.svg') ?? false}
              className="object-cover"
              sizes="100vw"
            />
          </AspectRatio>
        </FadeIn>
      ) : null}

      <div className="w-full pt-8 md:pt-12">
        <FadeIn delay={0.05}>
          <BackLink href={backHref} label={backLabel} locale={locale} className="mb-6" />
        </FadeIn>

        <header>
          <FadeIn delay={0.1}>
            <h1
              data-tina-field={tinaFieldTitle}
              className="font-heading text-3xl font-bold text-foreground md:text-5xl"
            >
              {title}
            </h1>
          </FadeIn>

          {description ? (
            <FadeIn delay={0.15}>
              <p
                data-tina-field={tinaFieldDescription}
                className="mt-4 max-w-2xl font-sans text-lg text-muted-foreground"
              >
                {description}
              </p>
            </FadeIn>
          ) : null}

          {children}
        </header>

        <Separator className="my-12" />
      </div>
    </div>
  );
}
