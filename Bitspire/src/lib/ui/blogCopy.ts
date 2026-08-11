export type BlogUiCopy = {
  noArticles: string;
  readMore: string;
  readTime: string; // use {minutes}
  by: string;
  backToBlog: string;
  publishedOn: string;
  shareTitle: string;
  shareButtons: {
    twitter: string;
    linkedin: string;
    facebook: string;
    copyLink: string;
  };
  tableOfContentsTitle: string;
  authorBox: {
    title: string;
    bio: string;
    contact: string;
  };
  relatedArticlesTitle: string;
};

const COPY: Record<string, BlogUiCopy> = {
  pl: {
    noArticles: 'Brak artykułów spełniających kryteria.',
    readMore: 'Czytaj więcej',
    readTime: '{minutes} min czytania',
    by: 'Autor:',
    backToBlog: 'Wróć do bloga',
    publishedOn: 'Opublikowano:',
    shareTitle: 'Udostępnij',
    shareButtons: {
      twitter: 'X (Twitter)',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      copyLink: 'Kopiuj link',
    },
    tableOfContentsTitle: 'Spis treści',
    authorBox: {
      title: 'Autor',
      bio: 'Artykuł przygotowany przez Bitspire. Tworzymy szybkie i nowoczesne strony oraz aplikacje webowe.',
      contact: 'Poznaj ofertę',
    },
    relatedArticlesTitle: 'Powiązane artykuły',
  },
  en: {
    noArticles: 'No articles match your criteria.',
    readMore: 'Read more',
    readTime: '{minutes} min read',
    by: 'By',
    backToBlog: 'Back to blog',
    publishedOn: 'Published on:',
    shareTitle: 'Share',
    shareButtons: {
      twitter: 'X (Twitter)',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
      copyLink: 'Copy link',
    },
    tableOfContentsTitle: 'Table of contents',
    authorBox: {
      title: 'Author',
      bio: 'Article by Bitspire. We build fast, modern websites and web applications.',
      contact: 'See our services',
    },
    relatedArticlesTitle: 'Related articles',
  },
};

export function getBlogUiCopy(locale: string): BlogUiCopy {
  return COPY[locale] ?? COPY.pl;
}
