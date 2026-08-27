import { describe, it, expect } from 'vitest';
import type { BlogConnectionQuery } from '@tina/__generated__/types';
import { getBlogArticleHref, extractBlogSlug, buildBlogArticleMap, toRelatedItems } from '../blog';

function createBlogNode(overrides: {
  id?: string;
  title?: string;
  relativePath: string;
  canonical?: string;
  description?: string;
  cover?: string;
  tags?: string[];
  date?: string;
}): NonNullable<NonNullable<BlogConnectionQuery['blogConnection']>['edges']>[number] {
  return {
    cursor: 'cursor',
    node: {
      __typename: 'Blog',
      id: overrides.id ?? 'id',
      title: overrides.title ?? 'Title',
      canonical: overrides.canonical ?? null,
      description: overrides.description ?? null,
      cover: overrides.cover ?? null,
      tags: overrides.tags ?? null,
      date: overrides.date ?? null,
      body: null,
      _sys: {
        __typename: 'SystemInfo',
        filename: overrides.relativePath.split('/').pop() ?? '',
        basename: '',
        hasReferences: null,
        breadcrumbs: [],
        path: '',
        relativePath: overrides.relativePath,
        extension: 'md',
      },
      author: null,
    },
  };
}

describe('getBlogArticleHref', () => {
  it('returns the href object for a blog slug', () => {
    expect(getBlogArticleHref('my-post')).toEqual({
      pathname: '/blog/[slug]',
      params: { slug: 'my-post' },
    });
  });
});

describe('extractBlogSlug', () => {
  it('removes the .md extension and keeps the last path segment', () => {
    expect(extractBlogSlug('pl/my-post.md')).toBe('my-post');
    expect(extractBlogSlug('my-post.md')).toBe('my-post');
    expect(extractBlogSlug('my-post')).toBe('my-post');
  });
});

describe('buildBlogArticleMap', () => {
  it('builds a map by canonical and by slug', () => {
    const data: BlogConnectionQuery = {
      __typename: 'Query',
      blogConnection: {
        __typename: 'BlogConnection',
        totalCount: 2,
        pageInfo: {
          __typename: 'PageInfo',
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: '',
          endCursor: '',
        },
        edges: [
          createBlogNode({
            id: '1',
            title: 'Post 1',
            relativePath: 'pl/post-1.md',
            canonical: 'canonical-1',
          }),
          createBlogNode({
            id: '2',
            title: 'Post 2',
            relativePath: 'en/post-1-en.md',
            canonical: 'canonical-1',
          }),
        ],
      },
    };

    const map = buildBlogArticleMap(data);
    expect(map.bySlug).toEqual({
      'pl|post-1': 'canonical-1',
      'en|post-1-en': 'canonical-1',
    });
    expect(map.byCanonical['canonical-1']).toEqual({
      pl: 'post-1',
      en: 'post-1-en',
    });
  });

  it('uses the slug as canonical when canonical is missing', () => {
    const data: BlogConnectionQuery = {
      __typename: 'Query',
      blogConnection: {
        __typename: 'BlogConnection',
        totalCount: 1,
        pageInfo: {
          __typename: 'PageInfo',
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: '',
          endCursor: '',
        },
        edges: [createBlogNode({ id: '1', title: 'Post', relativePath: 'pl/post.md' })],
      },
    };

    const map = buildBlogArticleMap(data);
    expect(map.byCanonical['post']).toEqual({ pl: 'post' });
    expect(map.bySlug['pl|post']).toBe('post');
  });
});

describe('toRelatedItems', () => {
  it('returns up to three related articles sorted by shared tags', () => {
    const data: BlogConnectionQuery = {
      __typename: 'Query',
      blogConnection: {
        __typename: 'BlogConnection',
        totalCount: 4,
        pageInfo: {
          __typename: 'PageInfo',
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: '',
          endCursor: '',
        },
        edges: [
          createBlogNode({
            id: 'current',
            title: 'Current',
            relativePath: 'pl/current.md',
            tags: ['react', 'nextjs'],
          }),
          createBlogNode({
            id: 'related-1',
            title: 'Related 1',
            relativePath: 'pl/related-1.md',
            tags: ['react', 'nextjs', 'typescript'],
            cover: '/cover-1.webp',
          }),
          createBlogNode({
            id: 'related-2',
            title: 'Related 2',
            relativePath: 'pl/related-2.md',
            tags: ['react'],
          }),
          createBlogNode({
            id: 'unrelated',
            title: 'Unrelated',
            relativePath: 'pl/unrelated.md',
            tags: ['css'],
          }),
        ],
      },
    };

    const items = toRelatedItems('current', 'pl', data);
    expect(items).toHaveLength(3);
    expect(items[0].id).toBe('related-1');
    expect(items[0].image).toBe('/cover-1.webp');
    expect(items[1].id).toBe('related-2');
    expect(items[2].id).toBe('unrelated');
  });

  it('excludes the current article', () => {
    const data: BlogConnectionQuery = {
      __typename: 'Query',
      blogConnection: {
        __typename: 'BlogConnection',
        totalCount: 1,
        pageInfo: {
          __typename: 'PageInfo',
          hasPreviousPage: false,
          hasNextPage: false,
          startCursor: '',
          endCursor: '',
        },
        edges: [createBlogNode({ id: 'only', title: 'Only', relativePath: 'pl/only.md' })],
      },
    };

    const items = toRelatedItems('only', 'pl', data);
    expect(items).toHaveLength(0);
  });
});
