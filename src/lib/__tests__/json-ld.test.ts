import { describe, it, expect } from 'vitest';
import {
  organizationJsonLd,
  websiteJsonLd,
  webPageJsonLd,
  blogPostingJsonLd,
  articleJsonLd,
  breadcrumbListJsonLd,
  combineJsonLd,
} from '../json-ld';

describe('organizationJsonLd', () => {
  it('returns a schema.org Organization graph', () => {
    const ld = organizationJsonLd();
    expect(ld['@type']).toBe('Organization');
    expect(ld['@id']).toBe('https://example.com/#organization');
    expect(ld.name).toBe('Bitspire');
    expect(ld.url).toBe('https://example.com');
    expect(ld.email).toBe('kontakt@bitspire.pl');
    expect(ld.telephone).toBe('+48780926993');
    expect(ld.sameAs).toContain('https://www.linkedin.com/company/bitspire-one');
    expect(ld.address['@type']).toBe('PostalAddress');
  });
});

describe('websiteJsonLd', () => {
  it('returns a schema.org WebSite graph', () => {
    const ld = websiteJsonLd();
    expect(ld['@type']).toBe('WebSite');
    expect(ld['@id']).toBe('https://example.com/#website');
    expect(ld.name).toBe('Bitspire');
    expect(ld.url).toBe('https://example.com');
    expect(ld.inLanguage).toEqual(['pl', 'en']);
    expect(ld.publisher).toEqual({ '@id': 'https://example.com/#organization' });
  });
});

describe('webPageJsonLd', () => {
  it('returns a schema.org WebPage graph with optional fields', () => {
    const ld = webPageJsonLd({
      name: 'Home',
      description: 'Home page description',
      url: 'https://example.com/pl',
      image: '/hero.webp',
    });
    expect(ld['@type']).toBe('WebPage');
    expect(ld['@id']).toBe('https://example.com/pl#webpage');
    expect(ld.name).toBe('Home');
    expect(ld.description).toBe('Home page description');
    expect(ld.image).toBe('/hero.webp');
    expect(ld.isPartOf).toEqual({ '@id': 'https://example.com/#website' });
    expect(ld.about).toEqual({ '@id': 'https://example.com/#organization' });
  });

  it('omits null optional fields', () => {
    const ld = webPageJsonLd({ name: 'Home', url: 'https://example.com/pl' });
    expect(ld.description).toBeUndefined();
    expect(ld.image).toBeUndefined();
  });
});

describe('blogPostingJsonLd', () => {
  it('returns a schema.org BlogPosting graph', () => {
    const ld = blogPostingJsonLd({
      title: 'Post title',
      description: 'Post description',
      url: 'https://example.com/pl/blog/post-title',
      image: '/cover.webp',
      datePublished: '2026-08-24',
      dateModified: '2026-08-25',
      author: { name: 'John Doe' },
    });
    expect(ld['@type']).toBe('BlogPosting');
    expect(ld.headline).toBe('Post title');
    expect(ld.datePublished).toBe('2026-08-24');
    expect(ld.dateModified).toBe('2026-08-25');
    expect(ld.author).toEqual({ '@type': 'Person', name: 'John Doe' });
    expect(ld.publisher).toEqual({ '@id': 'https://example.com/#organization' });
  });

  it('converts dotted Polish dates to ISO', () => {
    const ld = blogPostingJsonLd({
      title: 'Post',
      url: 'https://example.com/pl/blog/post',
      datePublished: '24.08.2026',
    });
    expect(ld.datePublished).toBe('2026-08-24');
  });

  it('falls back dateModified to datePublished', () => {
    const ld = blogPostingJsonLd({
      title: 'Post',
      url: 'https://example.com/pl/blog/post',
      datePublished: '2026-08-24',
    });
    expect(ld.dateModified).toBe('2026-08-24');
  });

  it('uses organization as author when no author name is provided', () => {
    const ld = blogPostingJsonLd({
      title: 'Post',
      url: 'https://example.com/pl/blog/post',
    });
    expect(ld.author).toEqual({ '@id': 'https://example.com/#organization' });
  });
});

describe('articleJsonLd', () => {
  it('returns a schema.org Article graph', () => {
    const ld = articleJsonLd({
      title: 'Article',
      url: 'https://example.com/pl/portfolio/project',
      datePublished: '2026-08-24',
      dateModified: '26.08.2026',
    });
    expect(ld['@type']).toBe('Article');
    expect(ld.datePublished).toBe('2026-08-24');
    expect(ld.dateModified).toBe('2026-08-26');
  });
});

describe('breadcrumbListJsonLd', () => {
  it('returns a schema.org BreadcrumbList graph', () => {
    const ld = breadcrumbListJsonLd([
      { name: 'Home', item: 'https://example.com/pl' },
      { name: 'Blog', item: 'https://example.com/pl/blog' },
    ]);
    expect(ld['@type']).toBe('BreadcrumbList');
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0]).toEqual({
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://example.com/pl',
    });
  });
});

describe('combineJsonLd', () => {
  it('combines multiple schema.org graphs', () => {
    const ld = combineJsonLd(organizationJsonLd(), websiteJsonLd());
    expect(ld['@context']).toBe('https://schema.org');
    expect(ld['@graph']).toHaveLength(2);
  });
});
