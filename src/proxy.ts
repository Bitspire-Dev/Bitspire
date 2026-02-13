import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function getCountry(request: NextRequest): string | undefined {
	return (
		request.headers.get('x-vercel-ip-country') ??
		request.headers.get('x-geo-country') ??
		request.headers.get('x-country') ??
		request.headers.get('cf-ipcountry') ??
		undefined
	);
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname === '/admin' || pathname === '/admin/') {
		const url = request.nextUrl.clone();
		const locale = request.nextUrl.locale === 'en' ? 'en' : 'pl';
		url.pathname = '/admin/index.html';
		url.hash = `#/~/admin/${locale}`;
		return NextResponse.redirect(url);
	}

	// Admin routes should bypass locale normalization
	if (pathname.startsWith('/admin')) {
		return NextResponse.next();
	}

	// Geo-redirect only for the root path
	if (pathname === '/') {
		const country = getCountry(request);
		if (country && country.toUpperCase() !== 'PL') {
			const url = request.nextUrl.clone();
			url.pathname = '/en';
			return NextResponse.redirect(url);
		}
	}

	return intlMiddleware(request);
}

export default function middleware(request: NextRequest) {
	return proxy(request);
}

export const config = {
	matcher: [
		// Exclude static assets and Next internals; include admin and root
		'/((?!_next|_vercel|api|favicon.ico|.*\.[^/]+$).*)',
	],
};
