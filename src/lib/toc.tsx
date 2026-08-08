'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractTocFromMarkdown(content: string): TocItem[] {
  const parts = content.split(/^---$/m);
  const body = parts.length >= 3 ? parts.slice(2).join('---') : content;
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = headingRegex.exec(body)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const text = cleanHeadingText(rawText);
    const baseId = slugify(text);

    let id = baseId;
    let counter = 1;
    while (seen.has(id)) {
      id = `${baseId}-${counter++}`;
    }
    seen.add(id);

    items.push({ id, text, level });
  }

  return items;
}

function cleanHeadingText(text: string): string {
  return text
    .replace(/(\*\*|__|~~|`)/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .trim();
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

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
  return <Tag id={id ?? undefined} {...props}>{children}</Tag>;
}

export function Heading2(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <TocHeading level={2} {...props} />;
}

export function Heading3(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <TocHeading level={3} {...props} />;
}

export function Heading({ level = 2, ...props }: { level?: number } & React.HTMLAttributes<HTMLHeadingElement>) {
  return <TocHeading level={level} {...props} />;
}


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
