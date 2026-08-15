'use client';

import type { ComponentProps } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/primitives/button';
import { cn } from '@/lib/utils';

const GLOW_CLASSES =
  'w-full transition-all duration-300 ease-out hover:shadow-[0_0_24px_-8px_color-mix(in_oklch,var(--primary),transparent_70%)] hover:ring-2 hover:ring-primary/30';

export function GlowButton({ className, children, ...props }: ComponentProps<typeof Button>) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Button
      asChild
      className={cn(
        GLOW_CLASSES,
        'data-[state=open]:shadow-[0_0_24px_-8px_color-mix(in_oklch,var(--primary),transparent_70%)]',
        className
      )}
      {...props}
    >
      <motion.button
        type={props.type}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.02, y: -1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.button>
    </Button>
  );
}
