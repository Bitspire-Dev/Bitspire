import { describe, it, expect } from 'vitest';
import { extractTocFromMarkdown } from '../toc';

describe('extractTocFromMarkdown', () => {
  it('extracts level 2 headings', () => {
    const md = '# Title\n\n## First\n\nContent\n\n## Second';
    const items = extractTocFromMarkdown(md);
    expect(items).toEqual([
      { id: 'first', text: 'First', level: 2 },
      { id: 'second', text: 'Second', level: 2 },
    ]);
  });

  it('ignores frontmatter delimited by ---', () => {
    const md = '---\ntitle: Post\n---\n\n## Heading\n\nContent';
    const items = extractTocFromMarkdown(md);
    expect(items).toEqual([{ id: 'heading', text: 'Heading', level: 2 }]);
  });

  it('cleans markdown formatting from heading text', () => {
    const md = '## **Bold** and __italic__ and `code`\n\n## [Link](url)';
    const items = extractTocFromMarkdown(md);
    expect(items[0].text).toBe('Bold and italic and code');
    expect(items[1].text).toBe('Link');
  });

  it('deduplicates identical ids with a counter suffix', () => {
    const md = '## Same\n\n## Same\n\n## Same';
    const items = extractTocFromMarkdown(md);
    expect(items.map(i => i.id)).toEqual(['same', 'same-1', 'same-2']);
  });

  it('ignores headings other than h2', () => {
    const md = '# H1\n\n### H3\n\n## H2';
    const items = extractTocFromMarkdown(md);
    expect(items).toEqual([{ id: 'h2', text: 'H2', level: 2 }]);
  });
});
