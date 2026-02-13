/**
 * Centralized UI translations for strings that are NOT managed by the CMS.
 * Components can import `getTranslations(locale)` to get the right strings.
 */
import type { Locale } from './locales';
import { DEFAULT_LOCALE } from './locales';

const translations = {
  pl: {
    // Cookie banner
    cookieBanner: {
      ariaLabel: 'Komunikat o cookies',
      heading: 'Szanujemy Twoją prywatność',
      description:
        'Używamy plików cookies niezbędnych oraz – po wyrażeniu zgody – analitycznych, personalizacyjnych i marketingowych aby ulepszać działanie serwisu. Szczegóły znajdziesz w',
      privacyPolicy: 'polityce prywatności',
      cookiePolicy: 'polityce cookies',
      reject: 'Odrzuć',
      settings: 'Ustawienia',
      acceptAll: 'Akceptuj wszystkie',
    },
    // Cookie settings modal
    cookieSettings: {
      heading: 'Ustawienia cookies',
      description: 'Dostosuj zgody dla poszczególnych kategorii. Zmiany zapisują się natychmiast.',
      necessary: 'Niezbędne',
      analytics: 'Analityczne',
      personalization: 'Personalizacyjne',
      marketing: 'Marketing / Reklamowe',
      necessaryDesc: 'Podstawowe cookies wymagane do działania serwisu (nie można wyłączyć).',
      analyticsDesc: 'Pomagają analizować ruch i ulepszać serwis (anonimowe statystyki).',
      personalizationDesc: 'Zapamiętywanie preferencji i dostosowanie interfejsu.',
      marketingDesc: 'Pomiar skuteczności kampanii i dopasowanie treści reklamowych.',
      toggleCategory: 'Przełącz kategorię',
      rejectAll: 'Odrzuć wszystkie',
      acceptAll: 'Akceptuj wszystkie',
      close: 'Zamknij',
    },
    // Portfolio
    portfolio: {
      viewProject: 'Zobacz projekt',
      viewAllProjects: 'Zobacz wszystkie projekty',
      featured: 'Wyróżnione',
      viewDetails: 'Zobacz szczegóły projektu...',
      noProjects: 'Brak projektów.',
      year: 'Rok',
      backToPortfolio: 'Powrót do portfolio',
      ctaQuestion: 'Chcesz zobaczyć coś konkretnego?',
      ctaContact: 'Napisz do nas',
      ctaNote: 'Przygotujemy spersonalizowane case study',
    },
    // Legal
    legal: {
      lastUpdate: 'Data ostatniej aktualizacji',
      noSections: 'Brak sekcji do wyświetlenia.',
      disclaimer: 'Dokument informacyjny – nie stanowi porady prawnej.',
      directLink: 'Bezpośredni link',
    },
    // Navigation carousel
    carousel: {
      prev: 'Poprzedni projekt',
      next: 'Następny projekt',
    },
  },
  en: {
    // Cookie banner
    cookieBanner: {
      ariaLabel: 'Cookie consent notice',
      heading: 'We respect your privacy',
      description:
        'We use essential cookies and – with your consent – analytics, personalization, and marketing cookies to improve our website. Details can be found in our',
      privacyPolicy: 'privacy policy',
      cookiePolicy: 'cookie policy',
      reject: 'Reject',
      settings: 'Settings',
      acceptAll: 'Accept all',
    },
    // Cookie settings modal
    cookieSettings: {
      heading: 'Cookie settings',
      description: 'Customize consent for each category. Changes are saved immediately.',
      necessary: 'Essential',
      analytics: 'Analytics',
      personalization: 'Personalization',
      marketing: 'Marketing / Advertising',
      necessaryDesc: 'Basic cookies required for the website to function (cannot be disabled).',
      analyticsDesc: 'Help analyze traffic and improve the website (anonymous statistics).',
      personalizationDesc: 'Remember preferences and customize the interface.',
      marketingDesc: 'Measure campaign effectiveness and personalize advertising content.',
      toggleCategory: 'Toggle category',
      rejectAll: 'Reject all',
      acceptAll: 'Accept all',
      close: 'Close',
    },
    // Portfolio
    portfolio: {
      viewProject: 'View project',
      viewAllProjects: 'View all projects',
      featured: 'Featured',
      viewDetails: 'View project details...',
      noProjects: 'No projects found.',
      year: 'Year',
      backToPortfolio: 'Back to portfolio',
      ctaQuestion: 'Looking for something specific?',
      ctaContact: 'Contact us',
      ctaNote: 'We\'ll prepare a personalized case study',
    },
    // Legal
    legal: {
      lastUpdate: 'Last updated',
      noSections: 'No sections to display.',
      disclaimer: 'Informational document – does not constitute legal advice.',
      directLink: 'Direct link',
    },
    // Navigation carousel
    carousel: {
      prev: 'Previous project',
      next: 'Next project',
    },
  },
} as const;

export type Translations = typeof translations[Locale];

/**
 * Get the UI translations for a given locale.
 * Falls back to DEFAULT_LOCALE if the locale is not found.
 */
export function getTranslations(locale: string): Translations {
  if (locale in translations) return translations[locale as Locale];
  return translations[DEFAULT_LOCALE];
}
