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
