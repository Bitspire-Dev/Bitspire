export type Locale = 'pl' | 'en';

export function getUi<T>(locale: string, map: Record<Locale, T>): T {
  return (map as Record<string, T>)[locale] ?? map.pl;
}

export const PAGE_FALLBACK_TITLES: Record<Locale, Record<string, string>> = {
  pl: {
    blog: 'Blog',
    contact: 'Kontakt',
    portfolio: 'Portfolio',
    privacy: 'Polityka prywatności',
  },
  en: {
    blog: 'Blog',
    contact: 'Contact',
    portfolio: 'Portfolio',
    privacy: 'Privacy Policy',
  },
};

export function getPageFallbackTitle(locale: string, page: string): string {
  return getUi(locale, PAGE_FALLBACK_TITLES)[page] ?? page;
}

export const ERROR_UI: Record<Locale, { title: string; description: string; cta: string }> = {
  pl: {
    title: 'Coś poszło nie tak',
    description: 'Nie udało się załadować strony. Spróbuj ponownie.',
    cta: 'Spróbuj ponownie',
  },
  en: {
    title: 'Something went wrong',
    description: 'The page could not be loaded. Please try again.',
    cta: 'Try again',
  },
};

export function getErrorUi(locale: string) {
  return getUi(locale, ERROR_UI);
}

export const AUTHOR_CARD_UI: Record<Locale, { cta: string }> = {
  pl: { cta: 'Poznaj ofertę' },
  en: { cta: 'Explore our offer' },
};

export function getAuthorCardUi(locale: string) {
  return getUi(locale, AUTHOR_CARD_UI);
}

export const TECHNOLOGY_CAROUSEL_UI: Record<Locale, { ariaLabel: string }> = {
  pl: { ariaLabel: 'Karuzela technologii' },
  en: { ariaLabel: 'Technology carousel' },
};

export function getTechnologyCarouselUi(locale: string) {
  return getUi(locale, TECHNOLOGY_CAROUSEL_UI);
}

export const SERVICES_UI: Record<Locale, { titleFallback: string }> = {
  pl: { titleFallback: 'Usługi' },
  en: { titleFallback: 'Services' },
};

export function getServicesUi(locale: string) {
  return getUi(locale, SERVICES_UI);
}

export const PRIVACY_UI: Record<Locale, { lastUpdated: string }> = {
  pl: { lastUpdated: 'Ostatnia aktualizacja:' },
  en: { lastUpdated: 'Last updated:' },
};

export function getPrivacyUi(locale: string) {
  return getUi(locale, PRIVACY_UI);
}

export const WHY_BITSPIRE_UI: Record<Locale, { titleFallback: string }> = {
  pl: { titleFallback: 'Dlaczego Bitspire' },
  en: { titleFallback: 'Why Bitspire' },
};

export function getWhyBitspireUi(locale: string) {
  return getUi(locale, WHY_BITSPIRE_UI);
}

export interface CityUi {
  heroBadgeSuffix: string;
  quoteCta: string;
  callLabel: string;
  meetingCta: string;
  servicesTitle: string;
  processTitle: string;
  projectsTitle: string;
  projectsEmpty: string;
  readMore: string;
  visit: string;
  faqTitle: string;
  bodyTitle: string;
  nearbyTitle: string;
  contactTitle: string;
  contactDescription: string;
  subjectPrefix: string;
}

export const CITY_UI: Record<Locale, CityUi> = {
  pl: {
    heroBadgeSuffix: 'i okolice · odpowiadamy w 2 h',
    quoteCta: 'Bezpłatna wycena',
    callLabel: 'Zadzwoń',
    meetingCta: 'Umów 15-min rozmowę',
    servicesTitle: 'Usługi',
    processTitle: 'Jak wygląda współpraca',
    projectsTitle: 'Realizacje z regionu',
    projectsEmpty: 'Brak realizacji z tego regionu.',
    readMore: 'Zobacz realizację',
    visit: 'Odwiedź',
    faqTitle: 'Częste pytania',
    bodyTitle: 'Strony internetowe',
    nearbyTitle: 'Obsługujemy też',
    contactTitle: 'Porozmawiajmy o Twoim projekcie',
    contactDescription:
      'Opowiedz nam o swoim pomyśle — oddzwonimy lub odpiszemy z konkretną propozycją i wyceną.',
    subjectPrefix: 'Strona www',
  },
  en: {
    heroBadgeSuffix: 'and the area · we reply within 2 h',
    quoteCta: 'Free quote',
    callLabel: 'Call us',
    meetingCta: 'Book a 15-min call',
    servicesTitle: 'Services',
    processTitle: 'How we work',
    projectsTitle: 'Projects from the region',
    projectsEmpty: 'No projects from this region yet.',
    readMore: 'See the project',
    visit: 'Visit',
    faqTitle: 'Frequently asked questions',
    bodyTitle: 'Websites',
    nearbyTitle: 'We also serve',
    contactTitle: 'Let’s talk about your project',
    contactDescription:
      'Tell us about your idea — we will call back or reply with a concrete proposal and quote.',
    subjectPrefix: 'Website',
  },
};

export function getCityUi(locale: string) {
  return getUi(locale, CITY_UI);
}
