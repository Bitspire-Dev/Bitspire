import { describe, it, expect } from 'vitest';
import { formatLongDate, dottedDateToIso } from './date';

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

describe('dottedDateToIso', () => {
  it('converts DD.MM.YYYY to ISO', () => {
    expect(dottedDateToIso('24.08.2026')).toBe('2026-08-24');
    expect(dottedDateToIso('1.1.2020')).toBe('2020-01-01');
  });

  it('returns null for empty or invalid input', () => {
    expect(dottedDateToIso('')).toBeNull();
    expect(dottedDateToIso(undefined)).toBeNull();
    expect(dottedDateToIso(null)).toBeNull();
    expect(dottedDateToIso('2026-08-24')).toBeNull();
    expect(dottedDateToIso('32.13.2026')).toBeNull();
    expect(dottedDateToIso('foo')).toBeNull();
  });
});
