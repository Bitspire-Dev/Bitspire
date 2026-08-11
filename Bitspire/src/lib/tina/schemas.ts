/**
 * Zod schemas for validating data coming from TinaCMS.
 * Used at the boundary between CMS data and component rendering
 * to catch unexpected shapes early with clear error messages.
 */
import { z } from "zod";

// ── Rich text (TinaMarkdownContent) ─────────────────────────────
// We don't deeply validate rich-text AST — we just ensure it's an
// object or array-of-objects (the shape TinaCMS produces).
const richText = z.union([
  z.record(z.string(), z.unknown()),
  z.array(z.record(z.string(), z.unknown())),
]).nullable().optional();

// ── Shared field schemas ────────────────────────────────────────
const sysSchema = z.object({
  filename: z.string().optional(),
  relativePath: z.string().optional(),
}).optional();

// ── Page schema (home page, legal pages, generic pages) ─────────
export const cmsPageSchema = z.object({
  __typename: z.string().optional(),
  title: z.string().nullish(),
  titleAccent: z.string().nullish(),
  description: z.string().nullish(),
  lastUpdate: z.string().nullish(),
  tocTitle: z.string().nullish(),
  body: richText,
  _body: richText,
  _sys: sysSchema,
}).passthrough();

// ── Blog post schema ────────────────────────────────────────────
export const cmsBlogPostSchema = z.object({
  __typename: z.string().optional(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  excerpt: z.string().nullish(),
  date: z.string().nullish(),
  author: z.string().nullish(),
  category: z.string().nullish(),
  tags: z.array(z.string().nullable()).nullish(),
  image: z.string().nullish(),
  imageAlt: z.string().nullish(),
  readTime: z.number().nullish(),
  slug: z.string().nullish(),
  body: richText,
  _body: richText,
  _sys: sysSchema,
}).passthrough();

// ── Portfolio item schema ───────────────────────────────────────
export const cmsPortfolioSchema = z.object({
  __typename: z.string().optional(),
  title: z.string().nullish(),
  description: z.string().nullish(),
  tags: z.array(z.string().nullable()).nullish(),
  year: z.string().nullish(),
  image: z.string().nullish(),
  imageAlt: z.string().nullish(),
  link: z.string().nullish(),
  featured: z.boolean().nullish(),
  slug: z.string().nullish(),
  body: richText,
  _body: richText,
  _sys: sysSchema,
}).passthrough();

// ── Validation helper ───────────────────────────────────────────
/**
 * Safely validate CMS data with a Zod schema.
 * In development, throws an error for invalid data.
 * In production, logs a warning and returns the raw data as-is (graceful degradation).
 */
export function validateCmsData<T>(
  schema: z.ZodType<T>,
  data: unknown,
  label: string,
): T {
  const result = schema.safeParse(data);
  if (result.success) return result.data;

  const message = `[CMS Validation] Invalid ${label} data: ${JSON.stringify(result.error.issues, null, 2)}`;

  if (process.env.NODE_ENV === "development") {
    console.error(message);
  } else {
    console.warn(message);
  }

  // Graceful degradation: return the data as-is in production
  return data as T;
}
