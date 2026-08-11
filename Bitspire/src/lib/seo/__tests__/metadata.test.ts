// @vitest-environment node

import { describe, it, expect, vi } from "vitest";

// Mock both next-intl internals used by routing.ts
vi.mock("next-intl/routing", () => ({
    defineRouting: vi.fn((c: unknown) => c),
}));
vi.mock("next-intl/navigation", () => ({
    createNavigation: vi.fn(() => ({
        Link: vi.fn(),
        redirect: vi.fn(),
        usePathname: vi.fn(),
        useRouter: vi.fn(),
    })),
}));

import {
    normalizeLocale,
    urlLocalePrefix,
    buildLocalePath,
    absoluteUrl,
    buildAlternates,
    buildMetadata,
    BASE_URL,
} from "@/lib/seo/metadata";

describe("normalizeLocale", () => {
    it("returns 'en' for 'en'", () => {
        expect(normalizeLocale("en")).toBe("en");
    });

    it("returns 'pl' for 'pl'", () => {
        expect(normalizeLocale("pl")).toBe("pl");
    });

    it("falls back to 'pl' for unknown locale", () => {
        expect(normalizeLocale("fr")).toBe("pl");
    });

    it("falls back to 'pl' for undefined", () => {
        expect(normalizeLocale(undefined)).toBe("pl");
    });
});

describe("urlLocalePrefix", () => {
    it("returns /pl for pl", () => {
        expect(urlLocalePrefix("pl")).toBe("/pl");
    });

    it("returns /en for en", () => {
        expect(urlLocalePrefix("en")).toBe("/en");
    });
});

describe("absoluteUrl", () => {
    it("prepends BASE_URL to relative path", () => {
        expect(absoluteUrl("/blog")).toBe(`${BASE_URL}/blog`);
    });

    it("prepends BASE_URL to path without leading slash", () => {
        expect(absoluteUrl("about")).toBe(`${BASE_URL}/about`);
    });

    it("passes through https URL unchanged", () => {
        expect(absoluteUrl("https://example.com")).toBe("https://example.com");
    });

    it("passes through http URL unchanged", () => {
        expect(absoluteUrl("http://example.com")).toBe("http://example.com");
    });
});

describe("buildLocalePath", () => {
    it("creates path with locale prefix for non-root", () => {
        const result = buildLocalePath("pl", "/portfolio");
        expect(result).toContain("pl");
        expect(result).toContain("portfolio");
    });

    it("creates root path for '/'", () => {
        const result = buildLocalePath("pl", "/");
        expect(result).toBe("/pl");
    });

    it("handles path without leading slash", () => {
        const result = buildLocalePath("en", "blog");
        expect(result).toContain("en");
        expect(result).toContain("blog");
    });
});

describe("buildAlternates", () => {
    const paths = { pl: "/pl/portfolio", en: "/en/portfolio" };

    it("creates canonical URL using provided locale path", () => {
        const result = buildAlternates("pl", paths);
        expect(result.canonical).toBe(`${BASE_URL}/pl/portfolio`);
    });

    it("includes both pl and en in languages", () => {
        const result = buildAlternates("pl", paths);
        expect(result.languages.pl).toBe(`${BASE_URL}/pl/portfolio`);
        expect(result.languages.en).toBe(`${BASE_URL}/en/portfolio`);
    });
});

describe("buildMetadata", () => {
    const baseArgs = {
        title: "My Page",
        description: "A description",
        locale: "pl" as const,
        paths: { pl: "/pl", en: "/en" },
    };

    it("returns correct title", () => {
        const result = buildMetadata(baseArgs);
        expect(result.title).toBe("My Page");
    });

    it("falls back to Bitspire when no title", () => {
        const result = buildMetadata({ ...baseArgs, title: null });
        expect(result.title).toBe("Bitspire");
    });

    it("includes openGraph with correct type (default website)", () => {
        const result = buildMetadata(baseArgs);
        expect(result.openGraph?.type).toBe("website");
    });

    it("supports ogType article", () => {
        const result = buildMetadata({ ...baseArgs, ogType: "article" });
        expect(result.openGraph?.type).toBe("article");
    });

    it("includes images in openGraph when image provided", () => {
        const result = buildMetadata({ ...baseArgs, image: "/og.jpg" });
        expect(result.openGraph?.images).toBeDefined();
    });

    it("omits images when no image provided", () => {
        const result = buildMetadata(baseArgs);
        expect(result.openGraph?.images).toBeUndefined();
    });

    it("sets twitter card to summary_large_image when image provided", () => {
        const result = buildMetadata({ ...baseArgs, image: "/og.jpg" });
        expect(result.twitter?.card).toBe("summary_large_image");
    });

    it("sets twitter card to summary when no image", () => {
        const result = buildMetadata(baseArgs);
        expect(result.twitter?.card).toBe("summary");
    });

    it("includes alternates", () => {
        const result = buildMetadata(baseArgs);
        expect(result.alternates).toBeDefined();
        expect(result.alternates?.canonical).toBeDefined();
    });
});
