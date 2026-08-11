// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock queries (async CMS calls) and config
vi.mock("@/lib/tina/queries", () => ({
    fetchAllBlogNodes: vi.fn(),
    fetchAllPortfolioNodes: vi.fn(),
    cmsPathPrefix: vi.fn((locale: string) => `${locale}/`),
}));

vi.mock("@/lib/routing/legal-pages/config", () => ({
    LEGAL_PAGES_PL: ["polityka-prywatnosci", "polityka-cookies", "regulamin"],
    LEGAL_PAGES_EN: ["privacy-policy", "cookies-policy", "terms"],
}));

import { fetchAllBlogNodes, fetchAllPortfolioNodes } from "@/lib/tina/queries";
import { getLegalSlugs, getHomeParam, mapPathForPagesCollection, getAllBlogSlugs, getAllPortfolioSlugs } from "@/lib/tina/params";

describe("getLegalSlugs", () => {
    it("returns 3 PL slugs for 'pl' locale", () => {
        const result = getLegalSlugs("pl");
        expect(result).toHaveLength(3);
        result.forEach((item) => expect(item.locale).toBe("pl"));
    });

    it("returns PL slug names", () => {
        const result = getLegalSlugs("pl");
        const slugs = result.map((i) => i.slug);
        expect(slugs).toContain("polityka-prywatnosci");
        expect(slugs).toContain("polityka-cookies");
        expect(slugs).toContain("regulamin");
    });

    it("returns 3 EN slugs for 'en' locale", () => {
        const result = getLegalSlugs("en");
        expect(result).toHaveLength(3);
        result.forEach((item) => expect(item.locale).toBe("en"));
    });

    it("returns EN slug names", () => {
        const result = getLegalSlugs("en");
        const slugs = result.map((i) => i.slug);
        expect(slugs).toContain("privacy-policy");
        expect(slugs).toContain("cookies-policy");
        expect(slugs).toContain("terms");
    });
});

describe("getHomeParam", () => {
    it("returns { locale } object", () => {
        expect(getHomeParam("pl")).toEqual({ locale: "pl" });
        expect(getHomeParam("en")).toEqual({ locale: "en" });
    });
});

describe("mapPathForPagesCollection", () => {
    it("combines locale prefix and slug with .mdx extension", () => {
        expect(mapPathForPagesCollection("pl", "home")).toBe("pl/home.mdx");
        expect(mapPathForPagesCollection("en", "about")).toBe("en/about.mdx");
    });
});

describe("getAllBlogSlugs", () => {
    beforeEach(() => {
        vi.mocked(fetchAllBlogNodes).mockResolvedValue([
            { _sys: { filename: "my-post", relativePath: "pl/my-post.mdx" } },
            { _sys: { filename: "another-post", relativePath: "en/another-post.mdx" } },
        ] as never);
    });

    it("filters nodes by locale prefix", async () => {
        const result = await getAllBlogSlugs("pl");
        expect(result).toHaveLength(1);
        expect(result[0].slug).toBe("my-post");
        expect(result[0].locale).toBe("pl");
    });

    it("returns EN slugs for EN locale", async () => {
        const result = await getAllBlogSlugs("en");
        expect(result).toHaveLength(1);
        expect(result[0].slug).toBe("another-post");
    });
});

describe("getAllPortfolioSlugs", () => {
    beforeEach(() => {
        vi.mocked(fetchAllPortfolioNodes).mockResolvedValue([
            { _sys: { filename: "project-1", relativePath: "pl/project-1.mdx" } },
        ] as never);
    });

    it("filters and returns portfolio slugs by locale", async () => {
        const result = await getAllPortfolioSlugs("pl");
        expect(result).toHaveLength(1);
        expect(result[0].slug).toBe("project-1");
    });
});
