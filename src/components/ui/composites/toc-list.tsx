'use client';

import { cn } from '@/lib/utils';
import type { TocItem } from '@/lib/toc';

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
