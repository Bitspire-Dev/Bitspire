'use client';

import { cn } from '@/lib/utils';
import type { TocItem } from '@/lib/toc';
import { useActiveHeading } from '@/lib/toc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/primitives/card';
import { TocList } from '@/components/ui/composites/toc-list';

interface TableOfContentsProps {
  toc: TocItem[];
  title: string;
  className?: string;
}

export function TableOfContents({ toc, title, className }: TableOfContentsProps) {
  const activeId = useActiveHeading(toc);

  if (toc.length === 0) {
    return null;
  }

  return (
    <Card
      className={cn(
        'sticky top-24 w-full self-start',
        className
      )}
    >
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <TocList toc={toc} activeId={activeId} />
      </CardContent>
    </Card>
  );
}
