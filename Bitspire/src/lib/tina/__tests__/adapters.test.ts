// @vitest-environment node

import { describe, it, expect, vi } from "vitest";

// Mock schemas validation to be a passthrough in tests (testing adapters, not validation)
vi.mock("@/lib/tina/schemas", () => ({
    validateCmsData: vi.fn((_schema: unknown, data: unknown) => data),
    cmsPageSchema: {},
    cmsBlogPostSchema: {},
    cmsPortfolioSchema: {},
}));

// Mock i18n routing used by mappers
vi.mock("next-intl/routing", () => ({
    defineRouting: vi.fn((c: unknown) => c),
}));
vi.mock("next-intl/navigation", () => ({
    createNavigation: vi.fn(() => ({ Link: vi.fn(), redirect: vi.fn(), usePathname: vi.fn(), useRouter: vi.fn() })),
}));

import {
    normalizeBody,
    mapPageWithBody,
    mapHomePageData,
    mapBlogListItem,
    mapBlogList,
    mapPortfolioProject,
    mapPortfolioProjects,
    mapPortfolioItemData,
} from "@/lib/tina/adapters";

describe("normalizeBody", () => {
    it("returns { body: undefined, _body: undefined } for null", () => {
        const result = normalizeBody(null);
        expect(result.body).toBeUndefined();
        expect(result._body).toBeUndefined();
    });

    it("extracts body object", () => {
        const body = { type: "root", children: [] };
        const result = normalizeBody({ body });
        expect(result.body).toBe(body);
    });

    it("extracts body array", () => {
        const body = [{ type: "p" }];
        const result = normalizeBody({ body });
        expect(result.body).toBe(body);
    });

    it("body and _body are set to same value", () => {
        const body = { type: "root" };
        const result = normalizeBody({ body });
        expect(result.body).toEqual(result._body);
    });
});

describe("mapPageWithBody", () => {
    it("merges raw with body fields", () => {
        const raw = { title: "Page", __typename: "Pages" };
        const result = mapPageWithBody(raw);
        expect(result.title).toBe("Page");
    });

    it("merges extra fields", () => {
        const raw = { title: "Page" };
        const result = mapPageWithBody(raw, { locale: "pl" });
        expect((result as { locale?: string }).locale).toBe("pl");
    });

    it("preserves _content_source from raw", () => {
        const raw = { title: "Page", _content_source: { id: "123" } };
        const result = mapPageWithBody(raw);
        expect((result as { _content_source?: unknown })._content_source).toEqual({ id: "123" });
    });
});

describe("mapHomePageData", () => {
    it("adds locale to the mapped page", () => {
        const raw = { title: "Home" };
        const result = mapHomePageData(raw, "en");
        expect((result as { locale?: string }).locale).toBe("en");
    });
});

const rawPost = {
    _sys: { filename: "my-post.mdx", relativePath: "pl/my-post.mdx" },
    title: "My Post",
    description: "A description",
    excerpt: "Short excerpt",
    date: "2024-01-15",
    author: "Author",
    category: "Tech",
    tags: ["React", "TypeScript"],
    image: "/img/post.jpg",
    imageAlt: "Image alt",
    readTime: 5,
};

describe("mapBlogListItem", () => {
    it("returns correct title", () => {
        const result = mapBlogListItem(rawPost, "pl");
        expect(result.title).toBe("My Post");
    });

    it("slug is generated from filename (without .mdx)", () => {
        const result = mapBlogListItem(rawPost, "pl");
        expect(result.slug).toBe("my-post");
    });

    it("normalizes image path starting with /blog/", () => {
        const post = { ...rawPost, image: "/blog/my-image.jpg" };
        const result = mapBlogListItem(post, "pl");
        expect(result.image).toBe("/blog/my-image.jpg");
    });

    it("normalizes Tina CDN image URL", () => {
        const post = {
            ...rawPost,
            image: "https://assets.tina.io/abc123/blog/image.jpg",
        };
        const result = mapBlogListItem(post, "pl");
        expect(result.image).toBe("/blog/image.jpg");
    });

    it("returns null image when image is absent", () => {
        const post = { ...rawPost, image: null };
        const result = mapBlogListItem(post, "pl");
        expect(result.image).toBeUndefined();
    });

    it("has correct _sys fields", () => {
        const result = mapBlogListItem(rawPost, "pl");
        expect(result._sys.filename).toBe("my-post.mdx");
        expect(result._sys.relativePath).toBe("pl/my-post.mdx");
    });
});

describe("mapBlogList", () => {
    it("maps array of posts", () => {
        const result = mapBlogList([rawPost, rawPost], "pl");
        expect(result).toHaveLength(2);
        result.forEach((item) => expect(item.title).toBe("My Post"));
    });

    it("returns empty array for empty input", () => {
        expect(mapBlogList([], "pl")).toEqual([]);
    });
});

const rawProject = {
    _sys: { filename: "my-project.mdx", relativePath: "pl/my-project.mdx" },
    title: "My Project",
    description: "A project",
    tags: ["React"],
    year: "2023",
    image: "/img/project.jpg",
    imageAlt: "Project image",
    link: "https://example.com",
};

describe("mapPortfolioProject", () => {
    it("generates slug from filename", () => {
        const result = mapPortfolioProject(rawProject, "pl");
        expect(result.slug).toBe("my-project");
    });

    it("includes locale", () => {
        const result = mapPortfolioProject(rawProject, "en");
        expect(result.locale).toBe("en");
    });
});

describe("mapPortfolioProjects", () => {
    it("maps array", () => {
        const result = mapPortfolioProjects([rawProject], "pl");
        expect(result).toHaveLength(1);
    });
});

describe("mapPortfolioItemData", () => {
    it("adds locale and body fields", () => {
        const raw = { ...rawProject, body: { type: "root" } };
        const result = mapPortfolioItemData(raw, "pl");
        expect(result.locale).toBe("pl");
        expect(result.body).toBeDefined();
    });
});
