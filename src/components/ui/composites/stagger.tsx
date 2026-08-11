'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

const containerVariants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delay,
    },
  }),
};

export function StaggerContainer({
  children,
  className,
  stagger = 0.05,
  delay = 0.1,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!isInView) {
      const timer = setTimeout(() => setFallback(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  if (shouldReduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const shouldAnimate = isInView || fallback;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? 'visible' : undefined}
      custom={{ stagger, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  x?: number | string;
  y?: number | string;
  duration?: number;
}

const itemVariants = {
  hidden: (custom: { x: number | string; y: number | string }) => ({
    opacity: 0,
    x: custom.x,
    y: custom.y,
  }),
  visible: (custom: { duration: number }) => ({
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: custom.duration, ease: EASE_OUT_EXPO },
  }),
};

export function StaggerItem({
  children,
  className,
  x = 0,
  y = 16,
  duration = 0.5,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={itemVariants} custom={{ x, y, duration }}>
      {children}
    </motion.div>
  );
}
