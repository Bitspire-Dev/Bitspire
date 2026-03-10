// @vitest-environment node

import { describe, it, expect } from "vitest";
import { formatDate, toSlug, safeLink, safeImageSrc, extractTags, filterByQueryAndTags } from "@/lib/ui/helpers";

describe("formatDate", () => {
    it("returns undefined for null", () => {
        expect(formatDate(null)).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
        expect(formatDate(undefined)).toBeUndefined();
    });

    it("formats date in Polish (pl)", () => {
        const result = formatDate("2024-01-15", "pl");
        expect(result).toContain("2024");
        expect(result).toMatch(/stycz/i); // "stycznia" in Polish
    });

    it("formats date in English (en)", () => {
        const result = formatDate("2024-01-15", "en");
        expect(result).toContain("2024");
        expect(result).toMatch(/january/i);
    });

    it("falls back to pl-PL when no locale provided", () => {
        const result = formatDate("2024-01-15");
        expect(result).toBeDefined();
        expect(result).toContain("2024");
    });

    it("returns the original string for an invalid date", () => {
        const result = formatDate("not-a-date");
        expect(typeof result).toBe("string");
    });
});

describe("toSlug", () => {
    it("converts basic string to slug", () => {
        expect(toSlug("Hello World")).toBe("hello-world");
    });

    it("normalizes Polish characters (ą, ę, ó, etc.)", () => {
        expect(toSlug("Cześć Świat")).toBe("czesc-swiat");
    });

    it("strips special characters", () => {
        expect(toSlug("hello! @world#")).toBe("hello-world");
    });

    it("removes leading and trailing hyphens", () => {
        expect(toSlug("  -hello- ")).toBe("hello");
    });

    it("converts multiple spaces to single hyphen", () => {
        expect(toSlug("foo   bar")).toBe("foo-bar");
    });

    it("handles empty string", () => {
        expect(toSlug("")).toBe("");
    });

    it("lowercases result", () => {
        expect(toSlug("FOO BAR")).toBe("foo-bar");
    });
});

describe("safeLink", () => {
    it("returns undefined for null", () => {
        expect(safeLink(null)).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
        expect(safeLink(undefined)).toBeUndefined();
    });

    it("returns undefined for empty/whitespace string", () => {
        expect(safeLink("  ")).toBeUndefined();
    });

    it("passes through absolute path", () => {
        expect(safeLink("/about")).toBe("/about");
    });

    it("passes through hash link", () => {
        expect(safeLink("#section")).toBe("#section");
    });

    it("passes through full URL", () => {
        expect(safeLink("https://example.com")).toBe("https://example.com");
    });

    it("passes through http URL", () => {
        expect(safeLink("http://example.com")).toBe("http://example.com");
    });

    it("adds https:// to bare domain", () => {
        expect(safeLink("google.com")).toBe("https://google.com");
    });

    it("returns undefined for unrecognized pattern", () => {
        expect(safeLink("just-some-text")).toBeUndefined();
    });
});

describe("safeImageSrc", () => {
    it("returns undefined for null", () => {
        expect(safeImageSrc(null)).toBeUndefined();
    });

    it("returns undefined for undefined", () => {
        expect(safeImageSrc(undefined)).toBeUndefined();
    });

    it("returns undefined for empty/whitespace", () => {
        expect(safeImageSrc("  ")).toBeUndefined();
    });

    it("passes through https URL", () => {
        expect(safeImageSrc("https://cdn.example.com/img.jpg")).toBe("https://cdn.example.com/img.jpg");
    });

    it("passes through absolute path", () => {
        expect(safeImageSrc("/images/photo.jpg")).toBe("/images/photo.jpg");
    });

    it("passes through data URI", () => {
        expect(safeImageSrc("data:image/png;base64,abc")).toBe("data:image/png;base64,abc");
    });

    it("prepends / to relative path", () => {
        expect(safeImageSrc("images/photo.jpg")).toBe("/images/photo.jpg");
    });
});

describe("extractTags", () => {
    it("returns empty array for empty items list", () => {
        expect(extractTags([])).toEqual([]);
    });

    it("returns empty array when items have no tags", () => {
        expect(extractTags([{ tags: null }, { tags: undefined }])).toEqual([]);
    });

    it("filters out null tags", () => {
        expect(extractTags([{ tags: [null, "React", null] }])).toEqual(["React"]);
    });

    it("deduplicates tags across items", () => {
        const items = [
            { tags: ["React", "TypeScript"] },
            { tags: ["React", "Next.js"] },
        ];
        const result = extractTags(items);
        expect(result).toHaveLength(3);
        expect(result.filter((t) => t === "React")).toHaveLength(1);
    });

    it("returns tags sorted alphabetically", () => {
        const items = [{ tags: ["Zod", "React", "Next.js"] }];
        const result = extractTags(items);
        expect(result).toEqual(["Next.js", "React", "Zod"]);
    });
});

describe("filterByQueryAndTags", () => {
    const items = [
        { title: "React Guide", description: "Learn React basics", excerpt: null, tags: ["React", "Frontend"] },
        { title: "TypeScript Tips", description: "Advanced TS patterns", excerpt: "Quick tips", tags: ["TypeScript"] },
        { title: "Next.js Blog", description: "Build blogs with Next.js", excerpt: null, tags: ["React", "Next.js"] },
    ];

    it("returns all items when no filters applied", () => {
        expect(filterByQueryAndTags(items, "", [])).toHaveLength(3);
    });

    it("filters by title query (case-insensitive)", () => {
        const result = filterByQueryAndTags(items, "react", []);
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("React Guide");
    });

    it("filters by description query", () => {
        const result = filterByQueryAndTags(items, "advanced", []);
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("TypeScript Tips");
    });

    it("filters by excerpt text", () => {
        const result = filterByQueryAndTags(items, "quick", []);
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("TypeScript Tips");
    });

    it("filters by tags", () => {
        const result = filterByQueryAndTags(items, "", ["React"]);
        expect(result).toHaveLength(2);
    });

    it("combines query and tags (AND logic)", () => {
        const result = filterByQueryAndTags(items, "blog", ["React"]);
        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("Next.js Blog");
    });

    it("filters are case-insensitive for tags", () => {
        const result = filterByQueryAndTags(items, "", ["react"]);
        expect(result).toHaveLength(2);
    });

    it("returns empty when nothing matches", () => {
        expect(filterByQueryAndTags(items, "python", [])).toHaveLength(0);
    });
});
