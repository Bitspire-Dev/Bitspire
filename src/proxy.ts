import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales } from './i18n/request';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'pl',
  localePrefix: 'always',
});

const getLocaleFromGeo = (country?: string | null) => {
  if (!country) return 'pl';
  return country.toUpperCase() === 'PL' ? 'pl' : 'en';
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const country = (request as unknown as { geo?: { country?: string } }).geo?.country;

  // If first segment is not a supported locale, normalize to default locale prefix
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment && !locales.includes(firstSegment as (typeof locales)[number])) {
    return NextResponse.redirect(new URL(`/pl${pathname}`, request.url));
  }

  // Geo-based redirect for root
  if (pathname === '/') {
    const locale = getLocaleFromGeo(country);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Admin entry normalization to Tina SPA hash
  if (pathname === '/admin' || pathname === '/admin/' || pathname === '/admin/index.html') {
    return NextResponse.redirect(new URL('/admin/index.html#/~/admin/pl', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Exclude static assets and Next internals; include admin and root
    '/((?!_next|_vercel|api|favicon.ico|.*\.[^/]+$).*)',
  ],
};
