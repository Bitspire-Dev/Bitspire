import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn', () => {
  it('merges tailwind classes and removes duplicates', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles conditional class values', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('text-red-500', isActive && 'font-bold', isDisabled && 'underline')).toBe(
      'text-red-500 font-bold'
    );
  });

  it('ignores null and undefined values', () => {
    expect(cn('text-red-500', null, undefined, false, '')).toBe('text-red-500');
  });

  it('returns an empty string when given no arguments', () => {
    expect(cn()).toBe('');
  });
});
