/**
 * Factory for creating admin preview pages.
 * Eliminates duplicated boilerplate across blog, portfolio, and home admin pages.
 */
import { notFound, redirect } from "next/navigation";
import { AdminPreviewProvider } from "@/providers/AdminPreviewProvider";
import { getTinaClient } from "@/lib/tina/client";
import { AdminMotionFinal } from "@/components/admin/AdminMotionFinal";
import { isLocale, DEFAULT_LOCALE } from "@/i18n/locales";
import type { ReactNode } from "react";

const client = getTinaClient();

interface AdminPageResult {
  query: string;
  variables: Record<string, unknown>;
  data: Record<string, unknown>;
}

interface AdminPageParams {
  locale: string;
  slug?: string;
}

/**
 * Options for creating an admin page.
 */
interface CreateAdminPageOptions<TExtra = void> {
  /**
   * Async function that fetches data from TinaCMS.
   * Receives the tina client, locale, and optional slug.
   * Must return { result, extra? } where result has query/variables/data.
   */
  fetchData: (params: {
    client: typeof client;
    locale: string;
    slug?: string;
  }) => Promise<{ result: AdminPageResult; extra?: TExtra }>;

  /**
   * Render function that creates the preview component.
   * Receives locale, slug, and the extra data from fetchData.
   */
  renderPreview: (params: {
    locale: string;
    slug?: string;
    extra?: TExtra;
  }) => ReactNode;

  /**
   * Whether to validate locale and redirect to default locale if invalid.
   * Defaults to true.
   */
  validateLocale?: boolean;

  /**
   * Custom redirect path when locale is invalid.
   * Defaults to `/admin/${DEFAULT_LOCALE}`.
   */
  invalidLocaleRedirect?: string;
}

/**
 * Creates an admin page component with standardized boilerplate:
 * - Locale validation (optional)
 * - Data fetching from TinaCMS via provided query function
 * - AdminMotionFinal + AdminPreviewProvider wrapper
 * - Error handling with notFound()
 */
export function createAdminPage<TExtra = void>(
  options: CreateAdminPageOptions<TExtra>
) {
  const { fetchData, renderPreview, validateLocale = false, invalidLocaleRedirect } = options;

  return async function AdminPageRoute({
    params,
  }: {
    params: Promise<AdminPageParams>;
  }) {
    const { locale, slug } = await params;

    if (validateLocale && !isLocale(locale)) {
      redirect(invalidLocaleRedirect ?? `/admin/${DEFAULT_LOCALE}`);
    }

    try {
      const { result, extra } = await fetchData({ client, locale, slug });

      return (
        <AdminMotionFinal>
          <AdminPreviewProvider
            query={result.query}
            variables={result.variables}
            data={result.data}
          >
            {renderPreview({ locale, slug, extra })}
          </AdminPreviewProvider>
        </AdminMotionFinal>
      );
    } catch (error) {
      console.error(`Admin page not found (locale=${locale}, slug=${slug}):`, error);
      notFound();
    }
  };
}
