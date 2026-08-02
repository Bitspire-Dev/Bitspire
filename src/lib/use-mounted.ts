'use client';

import { useSyncExternalStore } from 'react';

let mounted = false;
const subscribers = new Set<() => void>();

function setMounted(value: boolean) {
  mounted = value;
  subscribers.forEach(callback => callback());
}

export function useMounted() {
  return useSyncExternalStore(
    callback => {
      subscribers.add(callback);

      if (!mounted) {
        const id = setTimeout(() => setMounted(true), 0);

        return () => {
          clearTimeout(id);
          subscribers.delete(callback);
        };
      }

      return () => subscribers.delete(callback);
    },
    () => mounted,
    () => false
  );
}
