import { slugify } from '@/lib/string';

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractTocFromMarkdown(content: string): TocItem[] {
  const parts = content.split(/^---$/m);
  const body = parts.length >= 3 ? parts.slice(2).join('---') : content;
  const headingRegex = /^(#{2})\s+(.+)$/gm;
  const items: TocItem[] = [];
  const seen = new Set<string>();

  let match;
  while ((match = headingRegex.exec(body)) !== null) {
    const level = match[1].length;
    const rawText = match[2].trim();
    const text = cleanHeadingText(rawText);
    const baseId = slugify(text);

    let id = baseId;
    let counter = 1;
    while (seen.has(id)) {
      id = `${baseId}-${counter++}`;
    }
    seen.add(id);

    items.push({ id, text, level });
  }

  return items;
}

function cleanHeadingText(text: string): string {
  return text
    .replace(/(\*\*|__|~~|`)/g, '')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .trim();
}
