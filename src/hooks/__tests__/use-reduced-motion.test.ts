import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';

function createMockMediaQueryList(matches: boolean): MediaQueryList {
  return {
    matches,
    media: '(prefers-reduced-motion: reduce)',
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  } as MediaQueryList;
}

describe('useReducedMotion', () => {
  let matchMediaValue = false;

  beforeEach(() => {
    matchMediaValue = false;
    vi.resetModules();
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => createMockMediaQueryList(matchMediaValue)),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false when reduced motion is not preferred', async () => {
    const { useReducedMotion } = await import('../use-reduced-motion');
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when reduced motion is preferred', async () => {
    matchMediaValue = true;
    const { useReducedMotion } = await import('../use-reduced-motion');
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
