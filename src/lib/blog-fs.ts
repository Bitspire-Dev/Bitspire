import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { extractBlogSlug, getBlogArticleHref, type BlogArticleMap } from '@/lib/blog';
import type { ContentCardItem } from '@/components/ui/composites/content-card';

interface BlogFrontmatter {
  title: string;
  description: string;
  cover: string;
  canonical: string;
  tags: string[];
  relativePath: string;
  locale: string;
  slug: string;
}

function parseFrontmatter(content: string): Record<string, string | string[]> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result: Record<string, string | string[]> = {};
  let currentListKey: string | null = null;

  for (const line of yaml.split(/\r?\n/)) {
    if (currentListKey && /^\s+-\s+/.test(line)) {
      const value = line.replace(/^\s+-\s+/, '').replace(/^['"]|['"]$/g, '');
      const existing = result[currentListKey];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        result[currentListKey] = [value];
      }
      continue;
    }

    currentListKey = null;
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);
    if (kvMatch) {
      const [, key, value] = kvMatch;
      if (value === '') {
        currentListKey = key;
        result[key] = [];
      } else {
        result[key] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  return result;
}

async function readBlogFile(
  locale: string,
  filename: string
): Promise<BlogFrontmatter | null> {
  const fullPath = path.join(process.cwd(), 'content', 'blog', locale, filename);
  const content = await readFile(fullPath, 'utf-8').catch(() => '');
  if (!content) return null;

  const fm = parseFrontmatter(content);
  const slug = extractBlogSlug(filename);

  return {
    title: (fm.title as string) ?? '',
    description: (fm.description as string) ?? '',
    cover: (fm.cover as string) ?? '',
    canonical: ((fm.canonical as string) ?? '').trim() || slug,
    tags: (fm.tags as string[]) ?? [],
    relativePath: `${locale}/${filename}`,
    locale,
    slug,
  };
}

async function readAllBlogFrontmatter(): Promise<BlogFrontmatter[]> {
  const blogDir = path.join(process.cwd(), 'content', 'blog');
  const locales = await readdir(blogDir, { withFileTypes: true })
    .then(entries => entries.filter(e => e.isDirectory()).map(e => e.name))
    .catch(() => []);

  const results: BlogFrontmatter[] = [];

  for (const locale of locales) {
    const files = await readdir(path.join(blogDir, locale)).catch(() => []);
    for (const file of files.filter(f => f.endsWith('.md'))) {
      const fm = await readBlogFile(locale, file);
      if (fm) results.push(fm);
    }
  }

  return results;
}

export async function buildBlogArticleMapFromFs(): Promise<BlogArticleMap> {
  const posts = await readAllBlogFrontmatter();

  const byCanonical: Record<string, Record<string, string>> = {};
  const bySlug: Record<string, string> = {};

  for (const post of posts) {
    if (!byCanonical[post.canonical]) {
      byCanonical[post.canonical] = {};
    }
    byCanonical[post.canonical][post.locale] = post.slug;
    bySlug[`${post.locale}|${post.slug}`] = post.canonical;
  }

  return { byCanonical, bySlug };
}

export async function getBlogSlugsForLocale(locale: string): Promise<string[]> {
  const posts = await readAllBlogFrontmatter();
  return posts.filter(p => p.locale === locale).map(p => p.slug);
}

export async function toRelatedItemsFromFs(
  currentSlug: string,
  locale: string
): Promise<ContentCardItem[]> {
  const posts = await readAllBlogFrontmatter();
  const current = posts.find(p => p.locale === locale && p.slug === currentSlug);
  const currentTags = new Set(current?.tags ?? []);

  const scored = posts
    .filter(p => p.locale === locale && p.slug !== currentSlug)
    .map(p => ({
      ...p,
      shared: p.tags.filter(tag => currentTags.has(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, 3);

  return scored.map(p => ({
    id: p.relativePath,
    title: p.title,
    description: p.description,
    image: p.cover,
    imageAlt: p.title,
    tags: p.tags,
    meta: {
      primaryHref: getBlogArticleHref(p.slug),
    },
  }));
}
