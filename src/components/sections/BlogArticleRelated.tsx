'use client';

import type { ContentCardItem } from '@/components/ui/composites/content-card';
import { Separator } from '@/components/ui/primitives/separator';
import { CardGrid } from '@/components/ui/composites/card-grid';

interface BlogArticleRelatedProps {
  items: ContentCardItem[];
  title: string;
  emptyMessage: string;
}

export function BlogArticleRelated({ items, title, emptyMessage }: BlogArticleRelatedProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="w-full pt-0 pb-8 md:pb-12">
      <Separator className="my-12" />
      <h2 className="font-heading text-2xl font-bold text-foreground md:text-3xl">{title}</h2>
      <div className="mt-8">
        <CardGrid items={items} emptyMessage={emptyMessage} imageRatio={16 / 9} />
      </div>
    </section>
  );
}
