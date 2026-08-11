// @vitest-environment node

import { describe, it, expect, vi } from "vitest";

// Mock i18n routing internals
vi.mock("next-intl/routing", () => ({
    defineRouting: vi.fn((c: unknown) => c),
}));
vi.mock("next-intl/navigation", () => ({
    createNavigation: vi.fn(() => ({
        Link: vi.fn(), redirect: vi.fn(), usePathname: vi.fn(), useRouter: vi.fn(),
    })),
}));

import { isAdminPath, buildAdminLink } from "@/lib/routing/adminLink";

describe("isAdminPath", () => {
    it("returns true for path starting with /admin/", () => {
        expect(isAdminPath("/admin/pl/home")).toBe(true);
    });

    it("returns false for regular path", () => {
        expect(isAdminPath("/portfolio")).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isAdminPath(undefined)).toBe(false);
    });

    it("returns false for null", () => {
        expect(isAdminPath(null)).toBe(false);
    });

    it("returns false for exactly '/admin' (no trailing slash)", () => {
        expect(isAdminPath("/admin")).toBe(false);
    });
});

describe("buildAdminLink — external URL", () => {
    it("returns URL as-is when it starts with https://", () => {
        const result = buildAdminLink("https://example.com", { locale: "pl" });
        expect(result).toBe("https://example.com");
    });

    it("returns URL as-is when it starts with http://", () => {
        const result = buildAdminLink("http://example.com", { locale: "pl" });
        expect(result).toBe("http://example.com");
    });
});

describe("buildAdminLink — production mode", () => {
    it("builds production locale path for /portfolio", () => {
        const result = buildAdminLink("/portfolio", { locale: "pl", mode: "production" });
        expect(result).toContain("pl");
        expect(result).toContain("portfolio");
    });

    it("builds root path for /", () => {
        const result = buildAdminLink("/", { locale: "pl", mode: "production" });
        expect(result).toContain("pl");
    });

    it("strips existing locale prefix from href", () => {
        const result = buildAdminLink("/pl/portfolio", { locale: "pl", mode: "production" });
        expect(result).not.toMatch(/\/pl\/pl/);
    });
});

describe("buildAdminLink — admin mode", () => {
    it("builds admin path for /portfolio", () => {
        const result = buildAdminLink("/portfolio", {
            locale: "pl",
            mode: "admin",
        });
        expect(result).toBe("/admin/pl/portfolio");
    });

    it("builds admin root for /", () => {
        const result = buildAdminLink("/", {
            locale: "pl",
            mode: "admin",
        });
        expect(result).toBe("/admin/pl");
    });

    it("strips locale from href when building admin path", () => {
        const result = buildAdminLink("/pl/blog", {
            locale: "pl",
            mode: "admin",
        });
        expect(result).toBe("/admin/pl/blog");
    });

    it("works for EN locale", () => {
        const result = buildAdminLink("/portfolio", {
            locale: "en",
            mode: "admin",
        });
        expect(result).toBe("/admin/en/portfolio");
    });
});

describe("buildAdminLink — preview mode", () => {
    it("builds preview URL for home", () => {
        const result = buildAdminLink("/", {
            locale: "pl",
            mode: "preview",
            pathname: "/admin/preview/pl",
        });
        expect(result).toContain("/admin/index.html#/~/admin/pl/home");
    });

    it("builds preview URL for /portfolio", () => {
        const result = buildAdminLink("/portfolio", {
            locale: "pl",
            mode: "preview",
            pathname: "/admin/preview/pl",
        });
        expect(result).toContain("portfolio");
        expect(result).toContain("/admin/index.html#");
    });

    it("builds preview URL for /blog", () => {
        const result = buildAdminLink("/blog", {
            locale: "pl",
            mode: "preview",
            pathname: "/admin/preview/pl",
        });
        expect(result).toContain("blog");
    });
});

describe("buildAdminLink — auto-detect mode from pathname", () => {
    it("detects admin mode from pathname /admin/pl/...", () => {
        const result = buildAdminLink("/portfolio", {
            locale: "pl",
            pathname: "/admin/pl/home",
        });
        expect(result).toContain("/admin/pl/portfolio");
    });

    it("detects preview mode from pathname /admin/preview/...", () => {
        const result = buildAdminLink("/blog", {
            locale: "pl",
            pathname: "/admin/preview/pl/home",
        });
        expect(result).toContain("/admin/index.html#");
    });
});
