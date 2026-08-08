'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TocItem } from '@/lib/toc';
import { Button } from '@/components/ui/primitives/button';
import { Card } from '@/components/ui/primitives/card';
import { TocList } from '@/components/ui/composites/toc-list';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MobileTocBarProps {
  toc: TocItem[];
  title: string;
  className?: string;
}

export function MobileTocBar({ toc, title, className }: MobileTocBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (toc.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 lg:hidden',
        className
      )}
    >
      <div className="flex flex-col gap-2">
        {isOpen ? (
          <Card className="max-h-[50vh] overflow-y-auto p-4">
            <TocList
              toc={toc}
              onItemClick={() => setIsOpen(false)}
            />
          </Card>
        ) : null}
        <Button
          onClick={() => setIsOpen(prev => !prev)}
          size="lg"
          className="w-full justify-between"
        >
          <span className="font-sans text-sm font-medium">{title}</span>
          {isOpen ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
