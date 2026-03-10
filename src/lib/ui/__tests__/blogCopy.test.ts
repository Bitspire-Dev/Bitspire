// @vitest-environment node

import { describe, it, expect } from "vitest";
import { getBlogUiCopy } from "@/lib/ui/blogCopy";

describe("getBlogUiCopy", () => {
    it("returns Polish copy for 'pl' locale", () => {
        const copy = getBlogUiCopy("pl");
        expect(copy.noArticles).toBe("Brak artykułów spełniających kryteria.");
        expect(copy.readMore).toBe("Czytaj więcej");
        expect(copy.backToBlog).toBe("Wróć do bloga");
    });

    it("returns English copy for 'en' locale", () => {
        const copy = getBlogUiCopy("en");
        expect(copy.noArticles).toBe("No articles match your criteria.");
        expect(copy.readMore).toBe("Read more");
        expect(copy.backToBlog).toBe("Back to blog");
    });

    it("falls back to Polish for unknown locale", () => {
        const copy = getBlogUiCopy("de");
        expect(copy.noArticles).toBe("Brak artykułów spełniających kryteria.");
    });

    it("falls back to Polish for empty locale", () => {
        const copy = getBlogUiCopy("");
        expect(copy.readMore).toBe("Czytaj więcej");
    });

    it("PL copy has correct readTime template with {minutes}", () => {
        const copy = getBlogUiCopy("pl");
        expect(copy.readTime).toContain("{minutes}");
    });

    it("EN copy has correct readTime template with {minutes}", () => {
        const copy = getBlogUiCopy("en");
        expect(copy.readTime).toContain("{minutes}");
    });

    it("copy has nested shareButtons structure", () => {
        const copy = getBlogUiCopy("pl");
        expect(copy.shareButtons).toBeDefined();
        expect(copy.shareButtons.twitter).toBeDefined();
        expect(copy.shareButtons.linkedin).toBeDefined();
        expect(copy.shareButtons.facebook).toBeDefined();
        expect(copy.shareButtons.copyLink).toBeDefined();
    });

    it("copy has nested authorBox structure", () => {
        const copy = getBlogUiCopy("en");
        expect(copy.authorBox).toBeDefined();
        expect(copy.authorBox.title).toBeDefined();
        expect(copy.authorBox.bio).toBeDefined();
        expect(copy.authorBox.contact).toBeDefined();
    });

    it("PL and EN copies have identical top-level keys", () => {
        const pl = getBlogUiCopy("pl");
        const en = getBlogUiCopy("en");
        expect(Object.keys(pl).sort()).toEqual(Object.keys(en).sort());
    });
});
