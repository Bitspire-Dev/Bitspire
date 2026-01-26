import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LanguageSwitcher } from '../ui/buttons/LanguageSwitcher';
import { buildLocalePath } from '@/lib/seo/metadata';
import { buildAdminLink, type AdminLinkMode } from '@/lib/routing/adminLink';

const NAVIGATION = {
  pl: [
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
  ],
  en: [
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
  ]
};

const CTA_BUTTON = {
  pl: { text: 'Zapytaj o ofertę', href: '/' },
  en: { text: 'Get a Quote', href: '/' }
};

export const Header: React.FC<{ locale: 'pl' | 'en'; linkMode?: AdminLinkMode }> = ({
  locale,
  linkMode,
}) => {
  const navigation = NAVIGATION[locale];
  const ctaButton = CTA_BUTTON[locale];
  const logoAlt = 'Bitspire - strona główna';
  const getLink = (href: string) =>
    linkMode ? buildAdminLink(href, { locale, mode: linkMode }) : buildLocalePath(locale, href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-2 md:py-4 px-4 sm:px-6 animate-slide-in-down">
      <div className="bg-gray-900/70 border border-gray-700 text-white max-w-screen-2xl mx-auto rounded-xl shadow-xl overflow-hidden">
        {/* górny pasek */}
        <div className="px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* left: logo + optional center nav */}
          <div className="flex items-center">
            <Link
              href={getLink('/')}
              className="flex items-center shrink-0 translate-y-0 motion-safe:transition-transform"
              aria-label={logoAlt}
            >
               <Image
                 src="/logo/bitspire-logo-main.svg"
                 alt="Bitspire logo"
                 width={120}
                 height={34}
                 className="w-24 md:w-30 h-auto"
                 priority
               />
            </Link>

            <nav className="hidden md:flex ml-2 space-x-6" aria-label="Główna nawigacja">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={getLink(item.href)}
                  className={`${index === 0 ? 'ml-10' : ''} text-sm font-medium text-slate-300 hover:text-white hover:underline underline-offset-4 decoration-blue-400/60 transition`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* right: CTA + language switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <LanguageSwitcher />
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href={getLink(ctaButton.href)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition"
                aria-label={ctaButton.text}
              >
                {ctaButton.text}
              </Link>
            </div>

          </div>
        </div>

        {/* mobilne menu bez JS */}
        <details className="md:hidden px-6 pb-6 border-t border-slate-700/50">
          <summary className="list-none cursor-pointer py-4 flex items-center gap-3 text-slate-200">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/60">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </span>
            <span className="text-sm font-medium">Menu</span>
          </summary>
          <div className="flex flex-col gap-3 pt-2" aria-label="Menu mobilne linki">
            {navigation.map((item, index) => (
              <Link
                key={index}
                href={getLink(item.href)}
                className="group relative overflow-hidden rounded-xl bg-linear-to-r from-slate-800/60 to-slate-700/40 border border-slate-600/30 hover:border-blue-400/50 backdrop-blur-sm px-6 py-4 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {item.label}
                  </span>
                  <svg className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-blue-600/0 via-blue-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
            
            <div className="flex flex-col gap-3 pt-3">
              <Link
                href={getLink(ctaButton.href)}
                className="relative overflow-hidden flex justify-center items-center py-4 w-full rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-lg font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-[1.02] group"
                aria-label={ctaButton.text}
              >
                <span className="relative z-10">{ctaButton.text}</span>
                <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
};
