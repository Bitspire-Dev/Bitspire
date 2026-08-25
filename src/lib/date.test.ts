import { describe, it, expect } from 'vitest';
import { formatLongDate } from './date';

describe('formatLongDate', () => {
  it('formats a valid date in Polish', () => {
    const result = formatLongDate('2026-08-24', 'pl');
    expect(result).toContain('2026');
    expect(result).toContain('sierpnia');
  });

  it('formats a valid date in English', () => {
    const result = formatLongDate('2026-08-24', 'en');
    expect(result).toContain('August');
    expect(result).toContain('2026');
  });

  it('returns null for empty input', () => {
    expect(formatLongDate('', 'pl')).toBeNull();
  });

  it('returns the original value for invalid dates', () => {
    const invalid = 'not-a-date';
    expect(formatLongDate(invalid, 'pl')).toBe(invalid);
  });
});
