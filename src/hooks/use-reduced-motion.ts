'use client';

import { useSyncExternalStore } from 'react';

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

export function useReducedMotion(): boolean {
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
