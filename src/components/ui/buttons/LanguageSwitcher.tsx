'use client';

import NextImage from 'next/image';
import { useLocale } from 'next-intl';
import { useMemo, useEffect, useCallback, useTransition, useRef } from 'react';
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
  const [isPending, startTransition] = useTransition();
  const hasPrefetchedRef = useRef(false);

  const stripLocalePrefix = useCallback((path: string) => {
    if (path.startsWith('/en')) return path.replace(/^\/en(\/|$)/, '/');
    if (path.startsWith('/pl')) return path.replace(/^\/pl(\/|$)/, '/');
    return path;
  }, []);

  const adminLocaleMatch = useMemo(() => {
    if (!pathname) return null;
    return pathname.match(/^\/admin\/(preview\/)?(pl|en)(?=\/|$)/);
  }, [pathname]);

  const isAdminPath = Boolean(adminLocaleMatch);

  const currentLocale = useMemo(() => {
    if (adminLocaleMatch?.[2] === 'en') return 'en';
    if (adminLocaleMatch?.[2] === 'pl') return 'pl';
    if (pathname?.startsWith('/en')) return 'en';
    if (pathname?.startsWith('/pl')) return 'pl';
    return intlLocale as 'pl' | 'en';
  }, [adminLocaleMatch, pathname, intlLocale]);

  const otherLocale = currentLocale === 'pl' ? 'en' : 'pl';

  const targetPath = useMemo(() => {
    const raw = pathname || '/';
    if (isAdminPath) {
      return raw.replace(
        /^\/admin\/(preview\/)?(pl|en)(?=\/|$)/,
        `/admin/$1${otherLocale}`
      );
    }
    const normalized = stripLocalePrefix(raw);
    return normalized === '' ? '/' : normalized;
  }, [pathname, stripLocalePrefix, isAdminPath, otherLocale]);

  const prefetchTarget = useCallback(() => {
    if (!targetPath || isAdminPath || hasPrefetchedRef.current) return;
    hasPrefetchedRef.current = true;
    if (typeof router.prefetch === 'function') {
      router.prefetch(targetPath, { locale: otherLocale });
    }
  }, [router, targetPath, isAdminPath, otherLocale]);

  useEffect(() => {
    if (isAdminPath) return;
    let idleId: number | null = null;
    let timeoutId: number | null = null;

    const schedulePrefetch = () => {
      if (typeof window === 'undefined') return;
      const ric = (window as Window & {
        requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number;
      }).requestIdleCallback;

      if (ric) {
        idleId = ric(() => prefetchTarget(), { timeout: 5000 });
      } else {
        timeoutId = window.setTimeout(() => prefetchTarget(), 1500);
      }
    };

    if (document.readyState === 'complete') {
      schedulePrefetch();
    } else {
      const onLoad = () => schedulePrefetch();
      window.addEventListener('load', onLoad, { once: true });
      return () => window.removeEventListener('load', onLoad);
    }

    return () => {
      if (idleId !== null && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [prefetchTarget, isAdminPath]);

  const handleSwitch = () => {
    if (!targetPath) return;
    if (isAdminPath) {
      window.location.assign(targetPath);
      return;
    }
    startTransition(() => {
      router.replace(targetPath, { locale: otherLocale, scroll: false });
    });
  };

  const ariaLabel = otherLocale === 'pl' 
    ? (labels?.switchToPolish || 'Switch to Polski')
    : (labels?.switchToEnglish || 'Switch to English');

  return (
    <button
      onClick={handleSwitch}
      onMouseEnter={prefetchTarget}
      onFocus={prefetchTarget}
      onPointerDown={prefetchTarget}
      className="group relative w-10 h-10 rounded-lg overflow-hidden border-2 border-slate-600/40 hover:border-blue-400/60 bg-slate-800/40 hover:bg-slate-700/60 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/20 hover:scale-110"
      aria-label={ariaLabel}
      aria-busy={isPending}
    >
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <NextImage
        src={flagMap[otherLocale as keyof typeof flagMap]}
        alt={otherLocale === 'pl' ? 'Polski' : 'English'}
        width={24}
        height={24}
        className="w-6 h-6 object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-300"
      />
    </button>
  );
}
