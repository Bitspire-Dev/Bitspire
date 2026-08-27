import { describe, it, expect } from 'vitest';
import {
  siteUrl,
  localePathname,
  getDefaultOgImages,
  sitemapAlternates,
  localeAlternates,
} from '../site';

describe('siteUrl', () => {
  it('exposes the normalized site URL from env', () => {
    expect(siteUrl).toBe('https://example.com');
  });
});

describe('localePathname', () => {
  it('builds a locale-prefixed URL', () => {
    expect(localePathname('pl', '/')).toBe('https://example.com/pl');
    expect(localePathname('en', '/blog')).toBe('https://example.com/en/blog');
    expect(localePathname('pl', '/')).toBe('https://example.com/pl');
  });
});

describe('getDefaultOgImages', () => {
  it('returns open graph and twitter image paths for the locale', () => {
    const images = getDefaultOgImages('en');
    expect(images.openGraph[0].url).toBe('/en/opengraph-image');
    expect(images.twitter[0].url).toBe('/en/twitter-image');
  });
});

describe('sitemapAlternates', () => {
  it('generates language alternates and x-default', () => {
    const alts = sitemapAlternates(locale => `/blog/${locale === 'pl' ? 'pl-slug' : 'en-slug'}`);
    expect(alts.languages.pl).toMatch(/\/pl\/blog\/pl-slug$/);
    expect(alts.languages.en).toMatch(/\/en\/blog\/en-slug$/);
    expect(alts.languages['x-default']).toBeDefined();
  });
});

describe('localeAlternates', () => {
  it('generates canonical and language alternates', () => {
    const alts = localeAlternates(
      'pl',
      locale => `/portfolio/${locale === 'pl' ? 'pl-slug' : 'en-slug'}`
    );
    expect(alts.canonical).toMatch(/\/pl\/portfolio\/pl-slug$/);
    expect(alts.languages?.pl).toMatch(/\/pl\/portfolio\/pl-slug$/);
    expect(alts.languages?.en).toMatch(/\/en\/portfolio\/en-slug$/);
    expect(alts.languages?.['x-default']).toBeDefined();
  });
});
