'use client';

import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/primitives/select';
import { useLocaleSwitcher } from '@/hooks/use-locale-switcher';
import type { BlogArticleMap } from '@/lib/blog';
import { routing } from '@/i18n/routing';

const LOCALE_FLAG: Record<string, string> = {
  pl: '/flags/pl.svg',
  en: '/flags/gb.svg',
};

const LOCALE_LABEL: Record<string, string> = {
  pl: 'PL',
  en: 'EN',
};

interface LocaleSwitcherProps {
  locale: string;
  blogMap: BlogArticleMap;
}

export function LocaleSwitcher({ locale, blogMap }: LocaleSwitcherProps) {
  const switchLocale = useLocaleSwitcher({ locale, blogMap });

  return (
    <Select value={locale} onValueChange={switchLocale}>
      <SelectTrigger aria-label="Change language" className="w-22 font-sans">
        <SelectValue placeholder={locale.toUpperCase()} />
      </SelectTrigger>
      <SelectContent align="end">
        {routing.locales.map(loc => (
          <SelectItem key={loc} value={loc} className="font-sans">
            <span className="flex items-center gap-2">
              <Image
                src={LOCALE_FLAG[loc] ?? `/flags/${loc}.svg`}
                alt={LOCALE_LABEL[loc] ?? loc.toUpperCase()}
                width={16}
                height={12}
                className="size-4 shrink-0 rounded-xs object-cover"
                unoptimized
              />
              {LOCALE_LABEL[loc] ?? loc.toUpperCase()}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
