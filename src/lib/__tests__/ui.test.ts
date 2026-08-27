import { describe, it, expect } from 'vitest';
import {
  getUi,
  getPageFallbackTitle,
  getErrorUi,
  getAuthorCardUi,
  getTechnologyCarouselUi,
  getServicesUi,
  getPrivacyUi,
  getWhyBitspireUi,
} from '../ui';

describe('getUi', () => {
  it('returns the value for the requested locale', () => {
    expect(getUi('en', { pl: 'Polski', en: 'English' })).toBe('English');
  });

  it('falls back to pl for unknown locales', () => {
    expect(getUi('de', { pl: 'Polski', en: 'English' })).toBe('Polski');
  });
});

describe('getPageFallbackTitle', () => {
  it('returns the translated title for known pages', () => {
    expect(getPageFallbackTitle('pl', 'contact')).toBe('Kontakt');
    expect(getPageFallbackTitle('en', 'contact')).toBe('Contact');
  });

  it('falls back to the page slug when no translation exists', () => {
    expect(getPageFallbackTitle('pl', 'unknown')).toBe('unknown');
  });
});

describe('getErrorUi', () => {
  it('returns Polish error messages', () => {
    const ui = getErrorUi('pl');
    expect(ui.title).toBe('Coś poszło nie tak');
    expect(ui.cta).toBe('Spróbuj ponownie');
  });

  it('returns English error messages', () => {
    const ui = getErrorUi('en');
    expect(ui.title).toBe('Something went wrong');
    expect(ui.cta).toBe('Try again');
  });
});

describe('getAuthorCardUi', () => {
  it('returns the cta text for the requested locale', () => {
    expect(getAuthorCardUi('pl').cta).toBe('Poznaj ofertę');
    expect(getAuthorCardUi('en').cta).toBe('Explore our offer');
  });
});

describe('getTechnologyCarouselUi', () => {
  it('returns the aria label for the requested locale', () => {
    expect(getTechnologyCarouselUi('pl').ariaLabel).toBe('Karuzela technologii');
    expect(getTechnologyCarouselUi('en').ariaLabel).toBe('Technology carousel');
  });
});

describe('getServicesUi', () => {
  it('returns the title fallback for the requested locale', () => {
    expect(getServicesUi('pl').titleFallback).toBe('Usługi');
    expect(getServicesUi('en').titleFallback).toBe('Services');
  });
});

describe('getPrivacyUi', () => {
  it('returns the last updated label for the requested locale', () => {
    expect(getPrivacyUi('pl').lastUpdated).toBe('Ostatnia aktualizacja:');
    expect(getPrivacyUi('en').lastUpdated).toBe('Last updated:');
  });
});

describe('getWhyBitspireUi', () => {
  it('returns the title fallback for the requested locale', () => {
    expect(getWhyBitspireUi('pl').titleFallback).toBe('Dlaczego Bitspire');
    expect(getWhyBitspireUi('en').titleFallback).toBe('Why Bitspire');
  });
});
