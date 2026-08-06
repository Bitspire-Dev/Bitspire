'use client';

import { useRef, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/primitives/button';
import { Skeleton } from '@/components/ui/primitives/skeleton';

const THEME_TRANSITION_DURATION = 350;
const ICON_ANIMATION_DURATION = 0.25;

interface ThemeSwitcherProps {
  className?: string;
}

let mounted = false;
const mountedSubscribers = new Set<() => void>();

function useMounted() {
  return useSyncExternalStore(
    callback => {
      mountedSubscribers.add(callback);

      if (!mounted) {
        const id = setTimeout(() => {
          mounted = true;
          mountedSubscribers.forEach(cb => cb());
        }, 0);

        return () => {
          clearTimeout(id);
          mountedSubscribers.delete(callback);
        };
      }

      return () => mountedSubscribers.delete(callback);
    },
    () => mounted,
    () => false
  );
}

let reducedMotion = false;
let reducedMotionMediaQuery: MediaQueryList | null = null;
const reducedSubscribers = new Set<() => void>();

function getReducedMotionMediaQuery() {
  if (typeof window === 'undefined') return null;
  if (!reducedMotionMediaQuery) {
    reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = reducedMotionMediaQuery.matches;
    reducedMotionMediaQuery.addEventListener('change', () => {
      reducedMotion = reducedMotionMediaQuery?.matches ?? false;
      reducedSubscribers.forEach(cb => cb());
    });
  }
  return reducedMotionMediaQuery;
}

function useReducedMotion() {
  return useSyncExternalStore(
    callback => {
      reducedSubscribers.add(callback);
      getReducedMotionMediaQuery();
      return () => reducedSubscribers.delete(callback);
    },
    () => {
      getReducedMotionMediaQuery();
      return reducedMotion;
    },
    () => false
  );
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const reducedMotion = useReducedMotion();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = () => {
    const root = document.documentElement;
    root.classList.add('theme-transition');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

    timeoutRef.current = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, THEME_TRANSITION_DURATION);
  };

  if (!mounted) {
    return <Skeleton className={cn('size-9 rounded-lg', className)} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={label}
      aria-pressed={isDark}
      className={cn('text-foreground/80', className)}
    >
      {reducedMotion ? (
        isDark ? (
          <Moon className="size-5" />
        ) : (
          <Sun className="size-5" />
        )
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'dark' : 'light'}
            initial={{ opacity: 0, rotate: -90, scale: 0 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0 }}
            transition={{ duration: ICON_ANIMATION_DURATION, ease: 'easeInOut' }}
            className="inline-flex size-5 items-center justify-center"
          >
            {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </motion.span>
        </AnimatePresence>
      )}
    </Button>
  );
}
