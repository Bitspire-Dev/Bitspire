// @vitest-environment node

import { describe, it, expect } from "vitest";
import { getTranslations } from "@/i18n/translations";

describe("getTranslations", () => {
    it("returns Polish translations for 'pl'", () => {
        const t = getTranslations("pl");
        expect(t.cookieBanner.heading).toBe("Szanujemy Twoją prywatność");
    });

    it("returns English translations for 'en'", () => {
        const t = getTranslations("en");
        expect(t.cookieBanner.heading).toBe("We respect your privacy");
    });

    it("falls back to Polish for unknown locale", () => {
        const t = getTranslations("de");
        expect(t.cookieBanner.heading).toBe("Szanujemy Twoją prywatność");
    });

    it("falls back to Polish for empty string locale", () => {
        const t = getTranslations("");
        expect(t.cookieBanner.heading).toBe("Szanujemy Twoją prywatność");
    });

    it("PL translation has all expected cookieBanner keys", () => {
        const t = getTranslations("pl");
        expect(t.cookieBanner.ariaLabel).toBeDefined();
        expect(t.cookieBanner.description).toBeDefined();
        expect(t.cookieBanner.privacyPolicy).toBeDefined();
        expect(t.cookieBanner.cookiePolicy).toBeDefined();
        expect(t.cookieBanner.reject).toBeDefined();
        expect(t.cookieBanner.settings).toBeDefined();
        expect(t.cookieBanner.acceptAll).toBeDefined();
    });

    it("EN translation has all expected cookieSettings keys", () => {
        const t = getTranslations("en");
        expect(t.cookieSettings.heading).toBe("Cookie settings");
        expect(t.cookieSettings.rejectAll).toBeDefined();
        expect(t.cookieSettings.acceptAll).toBeDefined();
        expect(t.cookieSettings.close).toBeDefined();
    });

    it("both locales have the same top-level keys", () => {
        const pl = getTranslations("pl");
        const en = getTranslations("en");
        expect(Object.keys(pl).sort()).toEqual(Object.keys(en).sort());
    });

    it("both locales have the same cookieBanner keys", () => {
        const pl = getTranslations("pl");
        const en = getTranslations("en");
        expect(Object.keys(pl.cookieBanner).sort()).toEqual(Object.keys(en.cookieBanner).sort());
    });

    it("PL has portfolio translations", () => {
        const t = getTranslations("pl");
        expect(t.portfolio.viewProject).toBe("Zobacz projekt");
        expect(t.portfolio.noProjects).toBe("Brak projektów.");
    });

    it("PL has legal translations", () => {
        const t = getTranslations("pl");
        expect(t.legal.lastUpdate).toBeDefined();
    });

    it("PL has carousel translations", () => {
        const t = getTranslations("pl");
        expect(t.carousel.prev).toBeDefined();
        expect(t.carousel.next).toBeDefined();
    });
});
