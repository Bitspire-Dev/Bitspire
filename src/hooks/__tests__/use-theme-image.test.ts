import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useThemeImage } from '../use-theme-image';

const mockUseTheme = vi.fn(() => ({ resolvedTheme: 'light' }));

vi.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('useThemeImage', () => {
  it('returns the fallback for null or undefined', () => {
    const { result } = renderHook(({ src, fallback }) => useThemeImage(src, fallback), {
      initialProps: { src: null as string | null, fallback: '/fallback.webp' },
    });
    expect(result.current).toBe('/fallback.webp');
  });

  it('returns the original src when it does not match patterns', () => {
    const { result } = renderHook(() => useThemeImage('/images/photo.png', '/fallback.webp'));
    expect(result.current).toBe('/images/photo.png');
  });

  it('rewrites gryf assets to the active theme directory', () => {
    const { result } = renderHook(() => useThemeImage('/layout/gryf-hero.png', '/fallback.webp'));
    expect(result.current).toBe('/layout/light-mode/gryf-hero.png');
  });

  it('rewrites light-mode assets to dark-mode when theme is dark', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' });
    const { result } = renderHook(() =>
      useThemeImage('/layout/light-mode/hero.png', '/fallback.webp')
    );
    expect(result.current).toBe('/layout/dark-mode/hero.png');
  });

  it('keeps dark-mode assets in dark-mode when theme is dark', () => {
    mockUseTheme.mockReturnValue({ resolvedTheme: 'dark' });
    const { result } = renderHook(() =>
      useThemeImage('/layout/dark-mode/hero.png', '/fallback.webp')
    );
    expect(result.current).toBe('/layout/dark-mode/hero.png');
  });
});
