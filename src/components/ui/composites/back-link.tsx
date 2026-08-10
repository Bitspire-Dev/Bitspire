'use client';

import type { ComponentProps } from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/primitives/button';
import { Link } from '@/i18n/navigation';

interface BackLinkProps {
  href: ComponentProps<typeof Link>['href'];
  label: string;
  locale: string;
  className?: string;
}

export function BackLink({ href, label, locale, className }: BackLinkProps) {
  return (
    <Button asChild variant="ghost" className={cn('h-auto p-0 font-sans', className)}>
      <Link href={href} locale={locale}>
        <ArrowLeft className="mr-2 size-4 transition-transform duration-150 group-hover/button:-translate-x-0.5" />
        {label}
      </Link>
    </Button>
  );
}
