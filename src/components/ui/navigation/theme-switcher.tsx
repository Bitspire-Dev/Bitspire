'use client';

import { useRef } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';

import { useMounted } from '@/lib/use-mounted';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/primitives/button';
import { Skeleton } from '@/components/ui/primitives/skeleton';

const ICON_ANIMATION_DURATION = 0.25;

interface ThemeSwitcherProps {
  className?: string;
}

function suppressTransitions(): HTMLStyleElement {
  const style = document.createElement('style');
  style.textContent = '*, *::before, *::after { transition: none !important; }';
  document.head.appendChild(style);
  return style;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const reducedMotion = useReducedMotion();
  const suppressStyleRef = useRef<HTMLStyleElement | null>(null);

  const clearSuppressStyle = () => {
    if (suppressStyleRef.current) {
      suppressStyleRef.current.remove();
      suppressStyleRef.current = null;
    }
  };

  const toggle = () => {
    if (!resolvedTheme) return;

    const next = resolvedTheme === 'dark' ? 'light' : 'dark';

    if (reducedMotion || typeof document === 'undefined' || !document.startViewTransition) {
      setTheme(next);
      return;
    }

    clearSuppressStyle();

    const root = document.documentElement;
    const transition = document.startViewTransition(() => {
      // Temporarily disable every CSS transition so the live DOM is already in
      // its final state when the snapshot for the cross-fade is taken. Without
      // this the new snapshot could capture a mid-transition colour.
      suppressStyleRef.current = suppressTransitions();

      if (next === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      root.style.colorScheme = next;

      flushSync(() => setTheme(next));
    });

    transition.finished.then(clearSuppressStyle).catch(clearSuppressStyle);
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
          <m.span
            key={isDark ? 'dark' : 'light'}
            initial={{ opacity: 0, rotate: -90, scale: 0 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0 }}
            transition={{ duration: ICON_ANIMATION_DURATION, ease: 'easeInOut' }}
            className="inline-flex size-5 items-center justify-center"
          >
            {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </m.span>
        </AnimatePresence>
      )}
    </Button>
  );
}
