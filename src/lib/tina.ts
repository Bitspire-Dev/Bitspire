/**
 * Helpers for TinaCMS client queries.
 *
 * In local dev the generated client / dev server can take a moment to become
 * ready. A tiny retry wrapper prevents the first ever page load from failing
 * just because the schema was still compiling.
 */

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
