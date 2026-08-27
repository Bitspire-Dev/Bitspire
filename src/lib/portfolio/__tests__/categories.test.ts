import { describe, it, expect } from 'vitest';
import {
  isPortfolioCategoryId,
  getCategoryById,
  getCategoryBySlug,
  getCategoryUrlSlug,
  getCategoryHref,
  getProjectHref,
} from '../categories';

describe('isPortfolioCategoryId', () => {
  it('returns true for valid category ids', () => {
    expect(isPortfolioCategoryId('websites')).toBe(true);
    expect(isPortfolioCategoryId('software')).toBe(true);
  });

  it('returns false for invalid category ids', () => {
    expect(isPortfolioCategoryId('apps')).toBe(false);
    expect(isPortfolioCategoryId('')).toBe(false);
  });
});

describe('getCategoryById', () => {
  it('returns the matching category', () => {
    const category = getCategoryById('websites');
    expect(category?.id).toBe('websites');
  });

  it('returns undefined for unknown id', () => {
    expect(getCategoryById('unknown')).toBeUndefined();
  });
});

describe('getCategoryBySlug', () => {
  it('returns the matching category by slug and locale', () => {
    const category = getCategoryBySlug('strony-internetowe', 'pl');
    expect(category?.id).toBe('websites');
  });

  it('returns undefined when slug does not match', () => {
    expect(getCategoryBySlug('unknown', 'pl')).toBeUndefined();
  });
});

describe('getCategoryUrlSlug', () => {
  it('returns the slug for the requested locale', () => {
    expect(getCategoryUrlSlug('websites', 'pl')).toBe('strony-internetowe');
    expect(getCategoryUrlSlug('websites', 'en')).toBe('websites');
  });

  it('falls back to the id when category is not found', () => {
    // cast to satisfy the type; the function should still behave predictably
    expect(getCategoryUrlSlug('unknown' as 'websites', 'pl')).toBe('unknown');
  });
});

describe('getCategoryHref', () => {
  it('returns the href for the category page', () => {
    expect(getCategoryHref('pl', 'websites')).toEqual({
      pathname: '/portfolio/[category]',
      params: { category: 'strony-internetowe' },
    });
  });
});

describe('getProjectHref', () => {
  it('returns the href for the project page', () => {
    expect(getProjectHref('pl', 'websites', 'my-project')).toEqual({
      pathname: '/portfolio/[category]/[slug]',
      params: { category: 'strony-internetowe', slug: 'my-project' },
    });
  });
});
