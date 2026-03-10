// @vitest-environment node

import { describe, it, expect } from "vitest";
import { extractBody, hasBodyContent } from "@/lib/tina/body";

describe("extractBody", () => {
    it("returns null for null input", () => {
        expect(extractBody(null)).toBeNull();
    });

    it("returns null for undefined input", () => {
        expect(extractBody(undefined)).toBeNull();
    });

    it("returns null when body is a string (not an object)", () => {
        expect(extractBody({ body: "some string" })).toBeNull();
    });

    it("returns object body when body is an object", () => {
        const body = { type: "root", children: [] };
        expect(extractBody({ body })).toBe(body);
    });

    it("returns array body when body is an array", () => {
        const body = [{ type: "p" }];
        expect(extractBody({ body })).toBe(body);
    });

    it("falls back to _body when body is absent", () => {
        const _body = { type: "root", children: [] };
        expect(extractBody({ _body })).toBe(_body);
    });

    it("prefers body over _body", () => {
        const body = { type: "body" };
        const _body = { type: "_body" };
        expect(extractBody({ body, _body })).toBe(body);
    });

    it("returns null when body is a number", () => {
        expect(extractBody({ body: 42 })).toBeNull();
    });
});

describe("hasBodyContent", () => {
    it("returns false for null", () => {
        expect(hasBodyContent(null)).toBe(false);
    });

    it("returns false for empty array", () => {
        expect(hasBodyContent([])).toBe(false);
    });

    it("returns true for non-empty array", () => {
        expect(hasBodyContent([{ type: "p" }])).toBe(true);
    });

    it("returns true for object body", () => {
        expect(hasBodyContent({ type: "root" })).toBe(true);
    });
});
