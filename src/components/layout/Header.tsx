'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '../ui/buttons/LanguageSwitcher';
import { buildLocalePath } from '@/lib/seo/metadata';
import { buildAdminLink, type AdminLinkMode } from '@/lib/routing/adminLink';
import Image from 'next/image';

const NAVIGATION = {
  pl: [
    { label: 'Portfolio', href: '/portfolio', description: 'Zobacz nasze realizacje' },
    { label: 'Blog', href: '/blog', description: 'Czytaj nasze artykuły' },
  ],
  en: [
    { label: 'Portfolio', href: '/portfolio', description: 'See our projects' },
    { label: 'Blog', href: '/blog', description: 'Read our articles' },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigation = NAVIGATION[locale];
  const ctaButton = CTA_BUTTON[locale];
  const logoAlt = 'Bitspire - strona główna';
  const getLink = (href: string) =>
    linkMode ? buildAdminLink(href, { locale, mode: linkMode }) : buildLocalePath(locale, href);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-2 md:py-4 px-4 sm:px-6 animate-slide-in-down">
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 text-white max-w-screen-2xl mx-auto rounded-xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* górny pasek */}
        <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          {/* left: logo + optional center nav */}
          <div className="flex items-center">
            <Link
              href={getLink('/')}
              className="flex items-center shrink-0 translate-y-0 motion-safe:transition-transform hover:scale-105"
              aria-label={logoAlt}
            >
               <Image
                 src="/logo/bitspire-logo-main.svg"
                 alt="Bitspire logo"
                 width={120}
                 height={34}
                 className="w-24 md:w-32 h-auto"
                 priority
               />
            </Link>

            <nav className="hidden md:flex ml-8 space-x-1" aria-label="Główna nawigacja">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={getLink(item.href)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* right: CTA + language switcher + mobile trigger */}
          <div className="flex items-center gap-3 md:gap-4">
            
            {/* Mobile Menu Trigger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                   {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </motion.div>
            </motion.button>

            <div className="flex items-center">
              <LanguageSwitcher />
            </div>

            <div className="hidden md:flex items-center">
              <Link
                href={getLink(ctaButton.href)}
                className="group relative inline-flex items-center justify-center px-6 py-2.5 overflow-hidden font-medium text-white transition-all duration-300 bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
                aria-label={ctaButton.text}
              >
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative flex items-center gap-2">
                  {ctaButton.text}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            </div>

          </div>
        </div>

        {/* mobilne menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-slate-700/50"
            >
              <div className="px-5 py-6 space-y-4">
                <div className="space-y-3">
                  {navigation.map((item, index) => (
                    <Link
                      key={index}
                      href={getLink(item.href)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block group"
                    >
                      <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:border-blue-500/30 transition-all duration-300"
                      >
                         <div className="shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                            {/* Proste ikony dla menu - można podmienić na konkretne svg */}
                            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                         </div>
                         <div className="flex-1">
                            <h3 className="text-base font-semibold text-white group-hover:text-blue-300 transition-colors">
                              {item.label}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-300">
                              {item.description}
                            </p>
                         </div>
                         <div className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                         </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="pt-2"
                >
                  <Link
                    href={getLink(ctaButton.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative flex items-center justify-center w-full p-4 overflow-hidden font-bold rounded-xl group bg-linear-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg shadow-blue-900/20"
                  >
                    <span className="absolute inset-0 w-full h-full -mt-10 -ml-10 transition-all duration-1000 ease-out transform translate-x-0 translate-y-0 bg-blue-400 opacity-0 group-hover:opacity-20 group-hover:translate-x-10 group-hover:translate-y-10 rounded-full"></span>
                    <span className="relative text-white flex items-center gap-2">
                      {ctaButton.text}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
