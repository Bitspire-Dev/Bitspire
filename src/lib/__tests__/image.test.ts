import { describe, it, expect } from 'vitest';
import { isUnoptimizedImage } from '../image';

describe('isUnoptimizedImage', () => {
  it('returns true for SVG and GIF sources', () => {
    expect(isUnoptimizedImage('/logo.svg')).toBe(true);
    expect(isUnoptimizedImage('/hero.gif')).toBe(true);
  });

  it('returns false for other image formats', () => {
    expect(isUnoptimizedImage('/photo.png')).toBe(false);
    expect(isUnoptimizedImage('/photo.jpg')).toBe(false);
    expect(isUnoptimizedImage('/photo.webp')).toBe(false);
  });

  it('returns false for null or undefined', () => {
    expect(isUnoptimizedImage(null)).toBe(false);
    expect(isUnoptimizedImage(undefined)).toBe(false);
  });
});
