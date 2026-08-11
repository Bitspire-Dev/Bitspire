// @vitest-environment node

import { describe, it, expect, vi } from "vitest";
import { normalizePost, normalizeProject, getRelatedPosts } from "@/lib/tina/mappers";

// Mock dependencies
vi.mock("@/lib/ui/helpers", () => ({
    formatDate: vi.fn((date: string) => `formatted:${date}`),
}));
vi.mock("@/i18n/locales", () => ({
    DEFAULT_LOCALE: "pl",
}));

describe("normalizePost", () => {
    const raw = {
        _sys: { filename: "my-post.mdx" },
        title: "My Post",
        date: "2024-01-15",
        description: "A post",
        excerpt: null,
        readTime: 5,
        image: "/img.jpg",
        imageAlt: null,
        category: "Tech",
        tags: ["React"],
        author: "Author",
        body: null,
    };

    it("generates slug from _sys.filename, stripping .mdx", () => {
        const result = normalizePost(raw);
        expect(result.slug).toBe("my-post");
    });

    it("includes dateFormatted using formatDate", () => {
        const result = normalizePost(raw);
        expect(result.dateFormatted).toBe("formatted:2024-01-15");
    });

    it("relatedPosts defaults to empty array", () => {
        const result = normalizePost(raw);
        expect(result.relatedPosts).toEqual([]);
    });

    it("uses provided relatedPosts", () => {
        const related = [{ title: "Related Post" }];
        const result = normalizePost(raw, { relatedPosts: related });
        expect(result.relatedPosts).toBe(related);
    });

    it("passes through all original fields", () => {
        const result = normalizePost(raw);
        expect(result.title).toBe("My Post");
        expect(result.category).toBe("Tech");
    });

    it("uses default locale when none provided", () => {
        // Just verify it doesn't throw — locale used internally via formatDate
        expect(() => normalizePost(raw)).not.toThrow();
    });
});

describe("normalizeProject", () => {
    const raw = {
        _sys: { filename: "my-project.mdx" },
        title: "My Project",
        description: "A project",
        tags: ["React"],
        year: "2023",
        image: "/img.jpg",
        imageAlt: null,
        body: null,
    };

    it("generates slug from _sys.filename, stripping .mdx", () => {
        const result = normalizeProject(raw);
        expect(result.slug).toBe("my-project");
    });

    it("preserves year", () => {
        const result = normalizeProject(raw);
        expect(result.year).toBe("2023");
    });

    it("adds locale field (default pl)", () => {
        const result = normalizeProject(raw);
        expect(result.locale).toBe("pl");
    });

    it("uses provided locale", () => {
        const result = normalizeProject(raw, { locale: "en" });
        expect(result.locale).toBe("en");
    });
});

describe("getRelatedPosts", () => {
    const current = { _sys: { filename: "current.mdx" }, category: "Tech" };
    const post1 = { _sys: { filename: "post1.mdx" }, category: "Tech" };
    const post2 = { _sys: { filename: "post2.mdx" }, category: "Design" };
    const post3 = { _sys: { filename: "post3.mdx" }, category: "Tech" };
    const post4 = { _sys: { filename: "post4.mdx" }, category: "Design" };

    it("excludes the current post", () => {
        const result = getRelatedPosts(current, [current, post1]);
        expect(result.find((p) => p._sys?.filename === "current.mdx")).toBeUndefined();
    });

    it("returns posts from same category first", () => {
        const result = getRelatedPosts(current, [post2, post3, post1]);
        expect(result[0].category).toBe("Tech");
        expect(result[1].category).toBe("Tech");
    });

    it("limits to 3 by default", () => {
        const result = getRelatedPosts(current, [post1, post2, post3, post4]);
        expect(result.length).toBeLessThanOrEqual(3);
    });

    it("uses custom limit", () => {
        const result = getRelatedPosts(current, [post1, post2, post3, post4], 2);
        expect(result.length).toBeLessThanOrEqual(2);
    });

    it("returns general posts when no category match found", () => {
        const noCategoryPost = { _sys: { filename: "x.mdx" }, category: undefined };
        const result = getRelatedPosts(noCategoryPost, [post1, post2]);
        expect(result.length).toBeGreaterThan(0);
    });

    it("returns empty array when allPosts is empty", () => {
        const result = getRelatedPosts(current, []);
        expect(result).toEqual([]);
    });
});
