'use client';

import type { ReactNode } from 'react';
import { FadeIn } from '@/components/ui/composites/fade-in';
import { ContentSearch } from '@/components/ui/composites/content-search';
import { CardGrid } from '@/components/ui/composites/card-grid';
import type { ContentCardItem } from '@/components/ui/composites/content-card';
import { Separator } from '@/components/ui/primitives/separator';

interface ContentListViewProps {
  title: string;
  description?: string | null;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  emptyMessage: string;
  items: ContentCardItem[];
  imageRatio?: number;
  renderFooter?: (item: ContentCardItem) => ReactNode;
}

export function ContentListView({
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  emptyMessage,
  items,
  imageRatio = 4 / 3,
  renderFooter,
}: ContentListViewProps) {
  return (
    <section className="container mx-auto max-w-360 px-4 py-16 md:px-6 md:py-24">
      <FadeIn>
        <h1 className="font-heading text-3xl font-bold text-foreground md:text-5xl">{title}</h1>
      </FadeIn>
      {description ? (
        <FadeIn delay={0.05}>
          <p className="mt-4 max-w-2xl font-sans text-base text-muted-foreground">{description}</p>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.1}>
        <ContentSearch
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </FadeIn>

      <Separator className="my-12" />

      <CardGrid
        items={items}
        emptyMessage={emptyMessage}
        imageRatio={imageRatio}
        renderFooter={renderFooter}
      />
    </section>
  );
}
