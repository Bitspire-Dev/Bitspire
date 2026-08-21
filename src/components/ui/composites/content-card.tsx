'use client';

import Image from 'next/image';
import type { ComponentProps, ReactNode } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/primitives/card';
import { Badge } from '@/components/ui/primitives/badge';
import { AspectRatio } from '@/components/ui/primitives/aspect-ratio';
import { Skeleton } from '@/components/ui/primitives/skeleton';
import { Button } from '@/components/ui/primitives/button';

type Href = ComponentProps<typeof Link>['href'];

export interface ContentCardMeta {
  primaryHref?: Href;
  ctaLabel?: string;
  websiteUrl?: string | null;
  tinaField_title?: string | null;
  tinaField_description?: string | null;
  tinaField_image?: string | null;
  tinaField_tags?: string | null;
  tinaField_websiteUrl?: string | null;
}

export interface ContentCardItem {
  id: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  tags?: (string | null)[] | null;
  meta?: ContentCardMeta;
}

interface ContentCardProps {
  item: ContentCardItem;
  imageRatio?: number;
  unoptimized?: boolean;
  footer?: ReactNode;
}

export function ContentCard({ item, imageRatio = 4 / 3, unoptimized, footer }: ContentCardProps) {
  const locale = useLocale();
  const image = item.image ?? null;
  const imageAlt = item.imageAlt ?? item.title ?? '';
  const primaryHref = item.meta?.primaryHref as Href | undefined;
  const ctaLabel =
    (item.meta?.ctaLabel as string | undefined) ??
    (locale === 'pl' ? 'Czytaj więcej' : 'Read more');

  return (
    <Card className="flex flex-col overflow-hidden">
      <AspectRatio
        data-tina-field={item.meta?.tinaField_image as string | undefined}
        ratio={imageRatio}
        className="bg-muted"
      >
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover/card:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized={unoptimized ?? image.endsWith('.svg')}
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <Skeleton className="size-16 rounded-full" />
          </div>
        )}
      </AspectRatio>
      <CardHeader className="items-start gap-2">
        <CardTitle
          data-tina-field={item.meta?.tinaField_title as string | undefined}
          className="font-heading text-lg"
        >
          {item.title}
        </CardTitle>
        <CardDescription
          data-tina-field={item.meta?.tinaField_description as string | undefined}
          className="font-sans text-sm text-muted-foreground"
        >
          {item.description}
        </CardDescription>
      </CardHeader>
      {item.tags && item.tags.length > 0 ? (
        <CardContent
          data-tina-field={item.meta?.tinaField_tags as string | undefined}
          className="flex-1"
        >
          <div className="flex flex-wrap gap-2">
            {item.tags
              ?.filter((tag): tag is string => tag !== null)
              .map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
          </div>
        </CardContent>
      ) : null}
      {footer ? <CardFooter className="flex gap-2">{footer}</CardFooter> : null}
      {!footer && primaryHref ? (
        <CardFooter className="flex gap-2">
          <Button asChild variant="default">
            <Link href={primaryHref}>{ctaLabel}</Link>
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
