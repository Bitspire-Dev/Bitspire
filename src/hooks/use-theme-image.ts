'use client';

import { useTheme } from 'next-themes';
import { useMounted } from '@/lib/use-mounted';

const GRYF_PATTERN = /^(?:https:\/\/assets\.tina\.io\/[^/]+)?\/layout\/(gryf-[^/]+\.png)$/;
const MODE_PATTERN = /(?:https:\/\/assets\.tina\.io\/[^/]+)?\/layout\/(light|dark)-mode\/(.+)$/;

export function useThemeImage(src: string | null | undefined, fallback: string): string {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!src) {
    return fallback;
  }

  const isDark = mounted && resolvedTheme === 'dark';
  const mode = isDark ? 'dark-mode' : 'light-mode';

  const gryfMatch = src.match(GRYF_PATTERN);
  if (gryfMatch) {
    return `/layout/${mode}/${gryfMatch[1]}`;
  }

  const modeMatch = src.match(MODE_PATTERN);
  if (modeMatch) {
    return `/layout/${mode}/${modeMatch[2]}`;
  }

  return src;
}
