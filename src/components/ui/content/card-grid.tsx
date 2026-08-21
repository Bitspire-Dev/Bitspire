'use client';

import { ContentCard, type ContentCardItem } from './content-card';
import type { ReactNode } from 'react';
import { StaggerContainer, StaggerItem } from '@/components/animations/stagger';
import { FadeIn } from '@/components/animations/fade-in';

interface CardGridProps {
  items: ContentCardItem[];
  emptyMessage: string;
  imageRatio?: number;
  renderFooter?: (item: ContentCardItem) => ReactNode;
}

export function CardGrid({ items, emptyMessage, imageRatio = 4 / 3, renderFooter }: CardGridProps) {
  if (items.length === 0) {
    return (
      <FadeIn>
        <p className="font-sans text-sm text-muted-foreground">{emptyMessage}</p>
      </FadeIn>
    );
  }

  return (
    <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(item => (
        <StaggerItem key={item.id}>
          <ContentCard
            item={item}
            imageRatio={imageRatio}
            footer={renderFooter ? renderFooter(item) : undefined}
          />
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
