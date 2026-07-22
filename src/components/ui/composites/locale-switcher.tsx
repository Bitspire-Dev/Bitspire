'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LocaleSwitcherProps {
  locale: string;
}

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Select
      value={locale}
      onValueChange={value => {
        router.replace(pathname, { locale: value });
      }}
    >
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
