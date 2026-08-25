import { describe, it, expect } from 'vitest';
import { joinSearchTerms } from './content-list';

describe('joinSearchTerms', () => {
  it('joins non-empty terms with spaces and lowercases them', () => {
    expect(joinSearchTerms(['Hello', null, 'World', undefined])).toBe('hello world');
  });

  it('returns an empty string when no terms are provided', () => {
    expect(joinSearchTerms([])).toBe('');
    expect(joinSearchTerms([null, undefined])).toBe('');
  });
});
