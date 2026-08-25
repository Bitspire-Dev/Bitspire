import { COMPANY } from '@/lib/company';
import { routing } from '@/i18n/routing';
import { siteUrl } from '@/lib/site';

const ORGANIZATION_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

export interface JsonLdThing {
  '@context': 'https://schema.org';
  '@type': string;
  '@id'?: string;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: COMPANY.name,
    url: siteUrl,
    logo: `${siteUrl}/favicon-light-mode.svg`,
    email: COMPANY.email,
    telephone: COMPANY.phoneRaw,
    address: {
      '@type': 'PostalAddress',
      addressCountry: COMPANY.address.pl,
    },
    sameAs: COMPANY.socials.map(social => social.url),
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: COMPANY.name,
    url: siteUrl,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: routing.locales,
  };
}

export interface WebPageJsonLdOptions {
  name: string;
  description?: string | null;
  url: string;
  image?: string | null;
}

export function webPageJsonLd({ name, description, url, image }: WebPageJsonLdOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    name,
    description: description ?? undefined,
    url,
    image: image ?? undefined,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORGANIZATION_ID },
  };
}

export interface BlogPostingJsonLdOptions {
  title: string;
  description?: string | null;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  author?: { name?: string | null } | null;
}

export function blogPostingJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
}: BlogPostingJsonLdOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: title,
    description: description ?? undefined,
    image: image ?? undefined,
    url,
    datePublished: datePublished ? toIsoDate(datePublished) : undefined,
    dateModified: dateModified
      ? toIsoDate(dateModified)
      : datePublished
        ? toIsoDate(datePublished)
        : undefined,
    author: author?.name
      ? {
          '@type': 'Person',
          name: author.name,
        }
      : { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
  };
}

export interface ArticleJsonLdOptions {
  title: string;
  description?: string | null;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
}

export function articleJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: ArticleJsonLdOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    description: description ?? undefined,
    image: image ?? undefined,
    url,
    datePublished: datePublished ? toIsoDate(datePublished) : undefined,
    dateModified: dateModified
      ? toIsoDate(dateModified)
      : datePublished
        ? toIsoDate(datePublished)
        : undefined,
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
  };
}

export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}

export function combineJsonLd(...graphs: Record<string, unknown>[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': graphs,
  };
}

function toIsoDate(date: string): string {
  // Accepts both "YYYY-MM-DD" and "DD.MM.YYYY" formats.
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }
  const parts = date.split('.');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  return date;
}
