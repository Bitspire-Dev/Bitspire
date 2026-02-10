import { buildLocalePath, type SupportedLocale } from "@/lib/seo/metadata";
import { resolveLocalizedPathname } from "@/i18n/routing";

export type AdminLinkMode = "production" | "admin" | "preview";

export interface AdminLinkContext {
  locale: string;
  mode?: AdminLinkMode;
  pathname?: string | null;
  previewLocale?: string | null;
}

function detectModeFromPath(pathname?: string | null): AdminLinkMode | undefined {
  if (!pathname) return undefined;
  if (pathname.startsWith("/admin/preview")) return "preview";
  if (pathname.startsWith("/admin/")) return "admin";
  return undefined;
}

function normalizeHref(href: string): string {
  if (href.startsWith("/")) return href;
  return `/${href}`;
}

export function buildAdminLink(href: string, context: AdminLinkContext): string {
  if (href.startsWith("http")) return href;

  const mode = context.mode ?? detectModeFromPath(context.pathname) ?? "production";
  const locale = context.locale;

  if (mode === "preview") {
    const pathname = context.pathname ?? "";
    const localeMatch = pathname.match(/\/admin\/preview\/([^\/]+)/);
    const previewLocale = context.previewLocale ?? localeMatch?.[1] ?? locale;

    const cleanHref = resolveLocalizedPathname(
      href.replace(/^\/(pl|en)/, "").replace(/\/$/, "") || "/",
      previewLocale === "en" ? "en" : "pl"
    );

    let newPath = "home";
    if (href === "/" || href === `/${previewLocale}` || href === `/${previewLocale}/`) {
      newPath = "home";
    } else if (cleanHref === "/portfolio") {
      newPath = "portfolio";
    } else if (cleanHref.startsWith("/portfolio/")) {
      newPath = cleanHref.substring(1);
    } else if (cleanHref === "/blog") {
      newPath = "blog";
    } else if (cleanHref.startsWith("/blog/")) {
      newPath = cleanHref.substring(1);
    } else if (cleanHref) {
      newPath = cleanHref.substring(1) || "home";
    }

    return `/admin/index.html#/~/admin/${previewLocale}/${newPath}`;
  }

  if (mode === "admin") {
    const raw = href.startsWith("/") ? href.slice(1) : href;
    const withoutLocale = raw.replace(/^(pl|en)(\/|$)/, "");
    const cleanHref = resolveLocalizedPathname(
      withoutLocale ? `/${withoutLocale}` : "/",
      locale === "en" ? "en" : "pl"
    ).replace(/^\//, "");
    if (cleanHref === "" || cleanHref === "/") {
      return `/admin/${locale}`;
    }
    return `/admin/${locale}/${cleanHref}`;
  }

  const withSlash = normalizeHref(href);
  const normalized = withSlash.replace(/\/$/, "") || "/";
  const withoutLocale = normalized.replace(/^\/(pl|en)(?=\/|$)/, "") || "/";
  const supportedLocale = (locale === "en" ? "en" : "pl") as SupportedLocale;
  return buildLocalePath(supportedLocale, withoutLocale);
}

export function isAdminPath(pathname?: string | null): boolean {
  return Boolean(pathname?.startsWith("/admin/"));
}
