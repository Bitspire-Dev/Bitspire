'use client';

import Image from 'next/image';
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
import type { ReactNode } from 'react';

export interface ContentCardItem {
  id: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  tags?: (string | null)[] | null;
  meta?: Record<string, string | null | undefined>;
}

interface ContentCardProps {
  item: ContentCardItem;
  imageRatio?: number;
  unoptimized?: boolean;
  footer?: ReactNode;
}

export function ContentCard({ item, imageRatio = 4 / 3, unoptimized, footer }: ContentCardProps) {
  const image = item.image ?? null;
  const imageAlt = item.imageAlt ?? item.title ?? '';

  return (
    <Card className="flex flex-col overflow-hidden">
      <AspectRatio ratio={imageRatio} className="bg-muted">
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
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
        <CardTitle className="font-heading text-lg">{item.title}</CardTitle>
        <CardDescription className="font-sans text-sm text-muted-foreground">
          {item.description}
        </CardDescription>
      </CardHeader>
      {item.tags && item.tags.length > 0 ? (
        <CardContent className="flex-1">
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
    </Card>
  );
}
