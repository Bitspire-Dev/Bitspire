// @vitest-environment node

import { describe, it, expect } from "vitest";
import {
    locales,
    DEFAULT_LOCALE,
    isLocale,
    normalizeLocale,
    OG_LOCALES,
    LOCALE_LABELS,
    DATE_LOCALES,
} from "@/i18n/locales";

describe("locales constants", () => {
    it("contains 'pl' and 'en'", () => {
        expect(locales).toContain("pl");
        expect(locales).toContain("en");
    });

    it("has DEFAULT_LOCALE as 'pl'", () => {
        expect(DEFAULT_LOCALE).toBe("pl");
    });

    it("OG_LOCALES has entries for all locales", () => {
        for (const locale of locales) {
            expect(OG_LOCALES[locale]).toBeDefined();
        }
    });

    it("LOCALE_LABELS has entries for all locales", () => {
        for (const locale of locales) {
            expect(LOCALE_LABELS[locale]).toBeDefined();
        }
    });

    it("DATE_LOCALES has entries for all locales", () => {
        for (const locale of locales) {
            expect(DATE_LOCALES[locale]).toBeDefined();
        }
    });

    it("OG_LOCALES pl is 'pl_PL'", () => {
        expect(OG_LOCALES.pl).toBe("pl_PL");
    });

    it("OG_LOCALES en is 'en_US'", () => {
        expect(OG_LOCALES.en).toBe("en_US");
    });
});

describe("isLocale", () => {
    it("returns true for 'pl'", () => {
        expect(isLocale("pl")).toBe(true);
    });

    it("returns true for 'en'", () => {
        expect(isLocale("en")).toBe(true);
    });

    it("returns false for unsupported locale like 'de'", () => {
        expect(isLocale("de")).toBe(false);
    });

    it("returns false for null", () => {
        expect(isLocale(null)).toBe(false);
    });

    it("returns false for number", () => {
        expect(isLocale(123)).toBe(false);
    });

    it("returns false for empty string", () => {
        expect(isLocale("")).toBe(false);
    });
});

describe("normalizeLocale", () => {
    it("returns 'en' for 'en' input", () => {
        expect(normalizeLocale("en")).toBe("en");
    });

    it("returns 'pl' for 'pl' input", () => {
        expect(normalizeLocale("pl")).toBe("pl");
    });

    it("falls back to DEFAULT_LOCALE for unsupported locale", () => {
        expect(normalizeLocale("fr")).toBe(DEFAULT_LOCALE);
    });

    it("falls back to DEFAULT_LOCALE for undefined", () => {
        expect(normalizeLocale(undefined)).toBe(DEFAULT_LOCALE);
    });

    it("falls back to DEFAULT_LOCALE for null", () => {
        expect(normalizeLocale(null)).toBe(DEFAULT_LOCALE);
    });
});
