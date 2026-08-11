import type { TinaMarkdownContent } from "tinacms/dist/rich-text";

export type BodyContent = TinaMarkdownContent | TinaMarkdownContent[] | null;

export function extractBody(data?: { body?: unknown; _body?: unknown } | null): BodyContent {
  if (!data) return null;
  const raw = (data as { body?: unknown }).body ?? (data as { _body?: unknown })._body;

  if (Array.isArray(raw)) return raw as TinaMarkdownContent[];
  if (raw && typeof raw === "object") return raw as TinaMarkdownContent;
  return null;
}

export function hasBodyContent(body: BodyContent): boolean {
  if (!body) return false;
  return Array.isArray(body) ? body.length > 0 : true;
}
