'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { useMemo, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';

const flagMap = {
  pl: '/flags/pl.svg',
  en: '/flags/gb.svg',
};

interface LanguageSwitcherProps {
  labels?: {
    switchToPolish?: string;
    switchToEnglish?: string;
  };
}

export function LanguageSwitcher({ labels }: LanguageSwitcherProps = {}) {
  const intlLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const stripLocalePrefix = useCallback((path: string) => {
    if (path.startsWith('/en')) return path.replace(/^\/en(\/|$)/, '/');
    if (path.startsWith('/pl')) return path.replace(/^\/pl(\/|$)/, '/');
    return path;
  }, []);

  const currentLocale = useMemo(() => {
    if (pathname?.startsWith('/en')) return 'en';
    if (pathname?.startsWith('/pl')) return 'pl';
    return intlLocale as 'pl' | 'en';
  }, [pathname, intlLocale]);

  const otherLocale = currentLocale === 'pl' ? 'en' : 'pl';

  const targetPath = useMemo(() => {
    const raw = pathname || '/';
    const normalized = stripLocalePrefix(raw);
    return normalized === '' ? '/' : normalized;
  }, [pathname, stripLocalePrefix]);

  const prefetchTarget = useCallback(() => {
    if (!targetPath) return;
    if (typeof router.prefetch === 'function') {
      router.prefetch(targetPath, { locale: otherLocale });
    }
  }, [router, targetPath]);

  useEffect(() => {
    prefetchTarget();
  }, [prefetchTarget]);

  const handleSwitch = () => {
    if (!targetPath) return;
    router.replace(targetPath, { locale: otherLocale });
  };

  const ariaLabel = otherLocale === 'pl' 
    ? (labels?.switchToPolish || 'Switch to Polski')
    : (labels?.switchToEnglish || 'Switch to English');

  return (
    <button
      onClick={handleSwitch}
      onMouseEnter={prefetchTarget}
      onFocus={prefetchTarget}
      className="group relative w-10 h-10 rounded-lg overflow-hidden border-2 border-slate-600/40 hover:border-blue-400/60 bg-slate-800/40 hover:bg-slate-700/60 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/20 hover:scale-110"
      aria-label={ariaLabel}
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <Image
        src={flagMap[otherLocale as keyof typeof flagMap]}
        alt={otherLocale === 'pl' ? 'Polski' : 'English'}
        width={24}
        height={24}
        className="w-6 h-6 object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-300"
      />
    </button>
  );
}
