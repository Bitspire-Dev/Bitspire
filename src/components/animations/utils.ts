export type RgbTuple = [number, number, number];

export function hexToRgb(hex: string, fallback: RgbTuple): RgbTuple {
  const clean = hex.replace('#', '').trim();
  if (clean.length !== 6) return [...fallback] as RgbTuple;

  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ] as RgbTuple;
}

export function getCssColor(name: string, fallback: RgbTuple | string): RgbTuple {
  if (typeof document === 'undefined') {
    return Array.isArray(fallback) ? ([...fallback] as RgbTuple) : hexToRgb(fallback, [0, 0, 0]);
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value ? hexToRgb(value, [0, 0, 0]) : hexToRgb(fallback as string, [0, 0, 0]);
}

// Schedules non-critical work for when the main thread is idle, keeping
// expensive initialization (WebGL context, shader compilation) off the
// critical render path so the browser can paint the LCP element first.
//
// Safari has no `requestIdleCallback`, so it falls back to a short timeout —
// the 100ms window still lets the browser paint before the task runs.
export function runWhenIdle(callback: () => void, timeout = 2000): () => void {
  if (typeof window === 'undefined') return () => {};

  // Re-typed as optional: lib.dom declares these as always present, but
  // Safari lacks them at runtime.
  const w = window as typeof window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };

  if (w.requestIdleCallback && w.cancelIdleCallback) {
    const id = w.requestIdleCallback(callback, { timeout });
    return () => w.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(callback, 100);
  return () => window.clearTimeout(id);
}
