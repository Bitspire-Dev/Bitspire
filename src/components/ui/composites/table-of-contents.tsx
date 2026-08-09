'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TocItem } from '@/lib/toc';
import { Button } from '@/components/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/primitives/card';

export type { TocItem };

/* ------------------------------------------------------------------
 * TocProvider / TocHeading
 * ------------------------------------------------------------------ */

interface TocContextValue {
  getNextId(level: number): string | null;
}

const TocContext = createContext<TocContextValue | null>(null);

export function TocProvider({ toc, children }: { toc: TocItem[]; children: React.ReactNode }) {
  const indicesRef = useRef<Record<number, number>>({});
  indicesRef.current = {};

  const getNextId = (level: number): string | null => {
    const idx = indicesRef.current[level] ?? 0;
    const items = toc.filter(item => item.level === level);
    const item = items[idx];
    if (!item) return null;
    indicesRef.current[level] = idx + 1;
    return item.id;
  };

  return <TocContext.Provider value={{ getNextId }}>{children}</TocContext.Provider>;
}

export function useTocId(level: number): string | null {
  const ctx = useContext(TocContext);
  if (!ctx) return null;
  return ctx.getNextId(level);
}

export function TocHeading({
  level,
  children,
  ...props
}: { level: number } & React.HTMLAttributes<HTMLHeadingElement>) {
  const id = useTocId(level);
  const safeLevel = Math.min(Math.max(level, 1), 6);
  const Tag = `h${safeLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return (
    <Tag id={id ?? undefined} {...props}>
      {children}
    </Tag>
  );
}

export function Heading2(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <TocHeading level={2} {...props} />;
}

export function Heading3(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <TocHeading level={3} {...props} />;
}

export function Heading({
  level = 2,
  ...props
}: { level?: number } & React.HTMLAttributes<HTMLHeadingElement>) {
  return <TocHeading level={level} {...props} />;
}

/* ------------------------------------------------------------------
 * useActiveHeading
 * ------------------------------------------------------------------ */

export function useActiveHeading(toc: TocItem[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (toc.length === 0 || typeof window === 'undefined') return;

    const getVisibleId = () => {
      const headerOffset = 120;
      for (let i = toc.length - 1; i >= 0; i--) {
        const el = document.getElementById(toc[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            return toc[i].id;
          }
        }
      }
      return toc[0]?.id ?? null;
    };

    const update = () => setActiveId(getVisibleId());
    update();

    const observer = new IntersectionObserver(
      entries => {
        const visible = new Set<string>();
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
        }
        const active = [...visible]
          .map(id => toc.findIndex(item => item.id === id))
          .filter(idx => idx !== -1)
          .sort((a, b) => a - b)
          .map(idx => toc[idx].id)[0];
        if (active) setActiveId(active);
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    );

    for (const item of toc) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    window.addEventListener('scroll', update, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', update);
    };
  }, [toc]);

  return activeId;
}

/* ------------------------------------------------------------------
 * TocList
 * ------------------------------------------------------------------ */

interface TocListProps {
  toc: TocItem[];
  activeId?: string | null;
  onItemClick?: () => void;
  className?: string;
}

export function TocList({ toc, activeId, onItemClick, className }: TocListProps) {
  const handleClick = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    onItemClick?.();
  };

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className={cn('w-full', className)}>
      <ul className="flex flex-col gap-1">
        {toc.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={handleClick(item.id)}
              data-active={item.id === activeId}
              className={cn(
                'block rounded-md px-2 py-1.5 font-sans text-sm transition-colors',
                'text-muted-foreground hover:bg-muted hover:text-foreground',
                item.level === 3 && 'pl-5',
                item.id === activeId && 'bg-muted font-medium text-foreground'
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------
 * TableOfContents (desktop) / MobileTocBar
 * ------------------------------------------------------------------ */

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
    <Card className={cn('sticky top-24 w-full self-start', className)}>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <TocList toc={toc} activeId={activeId} />
      </CardContent>
    </Card>
  );
}

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
    <div className={cn('fixed inset-x-0 bottom-0 z-50 px-4 pb-4 lg:hidden', className)}>
      <div className="flex flex-col gap-2">
        {isOpen ? (
          <Card className="max-h-[50vh] overflow-y-auto p-4">
            <TocList toc={toc} onItemClick={() => setIsOpen(false)} />
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
