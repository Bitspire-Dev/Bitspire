/**
 * Helpers for TinaCMS client queries.
 *
 * In local dev the generated client / dev server can take a moment to become
 * ready. A tiny retry wrapper prevents the first ever page load from failing
 * just because the schema was still compiling.
 */

import { cache } from 'react';
import client from '@tina/__generated__/client';

export async function tinaQueryWithRetry<T>(
  query: () => Promise<T>,
  { retries = 2, delayMs = 300 } = {}
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await query();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

function isTinaNotFound(error: unknown): boolean {
  return error instanceof Error && /Unable to find record/i.test(error.message);
}

function withTinaNotFound<T>(
  query: () => Promise<T>,
  emptyData: Record<string, unknown>
): () => Promise<T> {
  return async () => {
    try {
      return await tinaQueryWithRetry(query);
    } catch (error) {
      if (isTinaNotFound(error)) {
        return { data: emptyData, query: '', variables: {} } as T;
      }
      throw error;
    }
  };
}

/**
 * Request-scoped memoized connection queries. React's `cache` dedupes these
 * across layout, page and generateMetadata within a single render pass, so the
 * content backend is hit at most once per request.
 */
export const getBlogConnection = cache(() =>
  tinaQueryWithRetry(() => client.queries.blogConnection())
);

export const getProjectConnection = cache(() =>
  tinaQueryWithRetry(() => client.queries.projectConnection())
);

export const getPage = cache((relativePath: string) =>
  withTinaNotFound(() => client.queries.page({ relativePath }), { page: null })()
);

export const getPageConnection = cache(() =>
  tinaQueryWithRetry(() => client.queries.pageConnection())
);

export const getBlogPost = cache((relativePath: string) =>
  withTinaNotFound(() => client.queries.blog({ relativePath }), { blog: null })()
);

export const getProject = cache((relativePath: string) =>
  withTinaNotFound(() => client.queries.project({ relativePath }), { project: null })()
);
