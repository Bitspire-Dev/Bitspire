'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

interface PulseDotProps {
  className?: string;
}

export function PulseDot({ className }: PulseDotProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <span
      className={cn('relative inline-flex size-2.5 items-center justify-center', className)}
      aria-hidden="true"
    >
      <span className="absolute inline-flex size-full rounded-full bg-green-500 opacity-75" />
      {!shouldReduceMotion ? (
        <motion.span
          className="absolute inline-flex size-full rounded-full bg-green-500"
          animate={{ scale: [1, 1.6, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : (
        <span className="absolute inline-flex size-full rounded-full bg-green-500" />
      )}
    </span>
  );
}
