'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { canPrefetchInBackground, schedulePageIdleTask } from '@/lib/ui/prefetch';

interface NavigationPrefetchProps {
  primaryRoutes: string[];
}

function normalizeInternalHref(rawHref: string) {
  if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
    return null;
  }

  const url = new URL(rawHref, window.location.origin);
  if (url.origin !== window.location.origin) {
    return null;
  }

  const normalizedHref = `${url.pathname}${url.search}`;
  const currentHref = `${window.location.pathname}${window.location.search}`;

  if (normalizedHref === currentHref) {
    return null;
  }

  return normalizedHref;
}

export function NavigationPrefetch({ primaryRoutes }: NavigationPrefetchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const prefetchedRoutesRef = useRef(new Set<string>());
  const serializedPrimaryRoutes = useMemo(() => primaryRoutes.join('|'), [primaryRoutes]);

  useEffect(() => {
    if (!canPrefetchInBackground()) {
      return;
    }

    return schedulePageIdleTask(() => {
      primaryRoutes.forEach((route) => {
        if (!route || prefetchedRoutesRef.current.has(route)) {
          return;
        }

        prefetchedRoutesRef.current.add(route);
        router.prefetch(route);
      });
    }, { timeout: 5000, fallbackDelay: 900 });
  }, [primaryRoutes, router, serializedPrimaryRoutes]);

  useEffect(() => {
    if (!canPrefetchInBackground()) {
      return;
    }

    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) {
                return;
              }

              const anchor = entry.target as HTMLAnchorElement;
              const href = normalizeInternalHref(anchor.href);
              if (href && !prefetchedRoutesRef.current.has(href)) {
                prefetchedRoutesRef.current.add(href);
                router.prefetch(href);
              }

              observer?.unobserve(anchor);
            });
          },
          {
            rootMargin: '1200px 0px',
            threshold: 0.01,
          }
        );

    const observeLinks = () => {
      const anchors = document.querySelectorAll<HTMLAnchorElement>('a[href]');

      anchors.forEach((anchor) => {
        if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
          return;
        }

        const href = normalizeInternalHref(anchor.href);
        if (!href || prefetchedRoutesRef.current.has(href)) {
          return;
        }

        if (!observer) {
          prefetchedRoutesRef.current.add(href);
          router.prefetch(href);
          return;
        }

        observer.observe(anchor);
      });
    };

    const cleanup = schedulePageIdleTask(observeLinks, { timeout: 5000, fallbackDelay: 1100 });

    return () => {
      cleanup();
      observer?.disconnect();
    };
  }, [pathname, router]);

  return null;
}