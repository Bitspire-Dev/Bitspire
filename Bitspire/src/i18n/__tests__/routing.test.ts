// @vitest-environment node

import { describe, it, expect, vi } from "vitest";

// Mock next-intl routing/navigation modules before importing routing.ts
vi.mock("next-intl/routing", () => ({
    defineRouting: vi.fn((config) => config),
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
    normalizePathname,
    resolveLocalizedPathname,
    resolvePathnameKey,
    getMdxFileName,
} from "@/i18n/routing";

describe("normalizePathname", () => {
    it("returns '/' for empty string", () => {
        expect(normalizePathname("")).toBe("/");
    });

    it("prepends '/' to path without it", () => {
        expect(normalizePathname("foo")).toBe("/foo");
    });

    it("strips trailing slash (non-root)", () => {
        expect(normalizePathname("/foo/")).toBe("/foo");
    });

    it("returns '/' for root path", () => {
        expect(normalizePathname("/")).toBe("/");
    });

    it("handles path already with leading slash", () => {
        expect(normalizePathname("/portfolio")).toBe("/portfolio");
    });

    it("does not strip trailing slash from root '/'", () => {
        expect(normalizePathname("/")).toBe("/");
    });
});

describe("resolveLocalizedPathname", () => {
    it("resolves PL-specific path to EN when locale is en", () => {
        const result = resolveLocalizedPathname("/polityka-prywatnosci", "en");
        expect(result).toBe("/privacy-policy");
    });

    it("resolves EN-specific path to PL when locale is pl", () => {
        const result = resolveLocalizedPathname("/privacy-policy", "pl");
        expect(result).toBe("/polityka-prywatnosci");
    });

    it("returns same path for /portfolio in PL", () => {
        expect(resolveLocalizedPathname("/portfolio", "pl")).toBe("/portfolio");
    });

    it("returns same path for /portfolio in EN", () => {
        expect(resolveLocalizedPathname("/portfolio", "en")).toBe("/portfolio");
    });

    it("resolves /polityka-cookies to /cookies-policy for EN", () => {
        expect(resolveLocalizedPathname("/polityka-cookies", "en")).toBe("/cookies-policy");
    });

    it("resolves /regulamin to /terms for EN", () => {
        expect(resolveLocalizedPathname("/regulamin", "en")).toBe("/terms");
    });

    it("resolves /terms back to /regulamin for PL", () => {
        expect(resolveLocalizedPathname("/terms", "pl")).toBe("/regulamin");
    });

    it("passes through unknown paths as-is", () => {
        expect(resolveLocalizedPathname("/unknown-page", "pl")).toBe("/unknown-page");
    });
});

describe("resolvePathnameKey", () => {
    it("returns the key for a known PL pathname", () => {
        const key = resolvePathnameKey("/polityka-prywatnosci", "pl");
        expect(key).toBe("/polityka-prywatnosci");
    });

    it("returns the key when matching the EN variant", () => {
        const key = resolvePathnameKey("/terms", "en");
        expect(key).toBe("/regulamin");
    });

    it("returns the key for /portfolio", () => {
        expect(resolvePathnameKey("/portfolio", "pl")).toBe("/portfolio");
    });

    it("returns null for unknown path", () => {
        expect(resolvePathnameKey("/totally-unknown", "pl")).toBeNull();
    });
});

describe("getMdxFileName", () => {
    it("returns PL filename for privacy + pl", () => {
        expect(getMdxFileName("privacy", "pl")).toBe("polityka-prywatnosci.mdx");
    });

    it("returns EN filename for privacy + en", () => {
        expect(getMdxFileName("privacy", "en")).toBe("privacy-policy.mdx");
    });

    it("returns PL filename for cookies + pl", () => {
        expect(getMdxFileName("cookies", "pl")).toBe("polityka-cookies.mdx");
    });

    it("returns EN filename for cookies + en", () => {
        expect(getMdxFileName("cookies", "en")).toBe("cookies-policy.mdx");
    });

    it("returns PL filename for terms + pl", () => {
        expect(getMdxFileName("terms", "pl")).toBe("regulamin.mdx");
    });

    it("returns EN filename for terms + en", () => {
        expect(getMdxFileName("terms", "en")).toBe("terms.mdx");
    });
});
