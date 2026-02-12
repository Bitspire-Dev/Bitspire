"use client";
import React from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { buildLocalePath } from "@/lib/seo/metadata";
import { Button } from '@/components/ui/primitives/Button';

export const CTAButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
}> = ({ children, className = "", onClick, href }) => {
  const locale = useLocale() as 'pl' | 'en';
  const content = (
    <>
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.4.6 7.1 6.1a1 1 0 0 0 1.3 0l7.1-6.1M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{children}</span>
    </>
  );

  const classNames = `
    btn-tech-primary
    px-8 py-4
    inline-flex items-center justify-center gap-3
    rounded-lg
    font-medium text-lg
    ${className}
  `;

  if (href) {
    const isExternal = /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
    const isHashOnly = href.startsWith('#');
    const stripLocalePrefix = (value: string) => value.replace(/^\/(pl|en)(?=\/|$)/, '');

    if (!isExternal) {
      const base = isHashOnly ? '/' : stripLocalePrefix(href);
      const [pathAndQuery, hash] = base.split('#');
      const [path, query] = pathAndQuery.split('?');
      const localizedPath = buildLocalePath(locale, path || '/');
      const withQuery = query ? `${localizedPath}?${query}` : localizedPath;
      const localizedHref = hash ? `${withQuery}#${hash}` : withQuery;

      return (
        <Button asChild variant="ghost" size="lg" className={classNames}>
          <Link href={localizedHref}>{content}</Link>
        </Button>
      );
    }

    return (
      <Button asChild variant="ghost" size="lg" className={classNames}>
        <a href={href}>{content}</a>
      </Button>
    );
  }

  return (
    <Button onClick={onClick} variant="ghost" size="lg" className={classNames}>
      {content}
    </Button>
  );
};
