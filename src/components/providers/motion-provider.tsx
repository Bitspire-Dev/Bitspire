'use client';

import { LazyMotion } from 'motion/react';
import type { ReactNode } from 'react';

// Features are split into a separate chunk so the animation engine isn't
// evaluated on the critical path. `m` components render their initial
// state and wait for this before animating.
const loadFeatures = () => import('./motion-features').then(res => res.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}
