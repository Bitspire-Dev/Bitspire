// @vitest-environment node

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    cmsPageSchema,
    cmsBlogPostSchema,
    cmsPortfolioSchema,
    validateCmsData,
} from "@/lib/tina/schemas";

describe("cmsPageSchema", () => {
    it("accepts a valid page object", () => {
        const result = cmsPageSchema.safeParse({ title: "Test Page", description: "Desc" });
        expect(result.success).toBe(true);
    });

    it("accepts object with no fields (all optional)", () => {
        const result = cmsPageSchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it("accepts object with extra fields (passthrough)", () => {
        const result = cmsPageSchema.safeParse({ extra: "field", title: "Hi" });
        expect(result.success).toBe(true);
    });

    it("accepts null fields (nullish)", () => {
        const result = cmsPageSchema.safeParse({ title: null, description: null });
        expect(result.success).toBe(true);
    });
});

describe("cmsBlogPostSchema", () => {
    it("accepts a valid blog post", () => {
        const result = cmsBlogPostSchema.safeParse({
            title: "Post",
            date: "2024-01-01",
            author: "Author",
            tags: ["React", null],
            readTime: 5,
        });
        expect(result.success).toBe(true);
    });

    it("accepts minimal data (all nullable fields)", () => {
        expect(cmsBlogPostSchema.safeParse({}).success).toBe(true);
    });

    it("rejects invalid readTime type (string instead of number)", () => {
        const result = cmsBlogPostSchema.safeParse({ readTime: "five" });
        expect(result.success).toBe(false);
    });
});

describe("cmsPortfolioSchema", () => {
    it("accepts valid portfolio item", () => {
        const result = cmsPortfolioSchema.safeParse({
            title: "Project",
            year: "2023",
            tags: ["React"],
            featured: true,
        });
        expect(result.success).toBe(true);
    });

    it("accepts minimal data", () => {
        expect(cmsPortfolioSchema.safeParse({}).success).toBe(true);
    });

    it("rejects invalid featured (string instead of boolean)", () => {
        const result = cmsPortfolioSchema.safeParse({ featured: "yes" });
        expect(result.success).toBe(false);
    });
});

describe("validateCmsData", () => {
    beforeEach(() => {
        vi.spyOn(console, "error").mockImplementation(() => { });
        vi.spyOn(console, "warn").mockImplementation(() => { });
    });

    it("returns parsed data when valid", () => {
        const result = validateCmsData(cmsPageSchema, { title: "Hello" }, "page");
        expect(result.title).toBe("Hello");
    });

    it("returns raw data as-is when invalid (graceful degradation)", () => {
        const invalidData = { readTime: "not-a-number" };
        const result = validateCmsData(cmsBlogPostSchema, invalidData, "blog");
        expect(result).toBe(invalidData);
    });

    it("logs error in development mode for invalid data", () => {
        vi.stubEnv("NODE_ENV", "development");

        validateCmsData(cmsBlogPostSchema, { readTime: "bad" }, "blog");
        expect(console.error).toHaveBeenCalled();

        vi.unstubAllEnvs();
    });
});
