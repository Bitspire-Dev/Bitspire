'use client';

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

interface LocaleSwitcherProps {
  locale: string;
  blogMap: BlogArticleMap;
}

export function LocaleSwitcher({ locale, blogMap }: LocaleSwitcherProps) {
  const switchLocale = useLocaleSwitcher({ locale, blogMap });

  return (
    <Select value={locale} onValueChange={switchLocale}>
      <SelectTrigger aria-label="Change language" className="w-20 font-sans uppercase">
        <SelectValue placeholder={locale.toUpperCase()} />
      </SelectTrigger>
      <SelectContent align="end">
        {routing.locales.map(loc => (
          <SelectItem key={loc} value={loc} className="font-sans">
            {loc.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
