// @vitest-environment node

import { describe, it, expect } from "vitest";
import { cn } from "@/lib/ui/classNames";

describe("cn", () => {
    it("joins string arguments", () => {
        expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("returns empty string when called with no arguments", () => {
        expect(cn()).toBe("");
    });

    it("ignores false values", () => {
        expect(cn("foo", false, "bar")).toBe("foo bar");
    });

    it("ignores null values", () => {
        expect(cn("foo", null, "bar")).toBe("foo bar");
    });

    it("ignores undefined values", () => {
        expect(cn("foo", undefined, "bar")).toBe("foo bar");
    });

    it("converts numbers to string", () => {
        expect(cn("foo", 42)).toBe("foo 42");
    });

    it("includes keys from object where value is true", () => {
        expect(cn({ active: true, disabled: false })).toBe("active");
    });

    it("excludes keys from object where value is false", () => {
        expect(cn({ "class-a": true, "class-b": false })).toBe("class-a");
    });

    it("handles multiple object conditions", () => {
        const result = cn({ "text-red": true, "text-blue": false, "font-bold": true });
        expect(result).toContain("text-red");
        expect(result).toContain("font-bold");
        expect(result).not.toContain("text-blue");
    });

    it("handles nested arrays", () => {
        expect(cn(["foo", "bar"])).toBe("foo bar");
    });

    it("handles mixed types: string, object, array", () => {
        const result = cn("base", { active: true }, ["extra", "classes"]);
        expect(result).toContain("base");
        expect(result).toContain("active");
        expect(result).toContain("extra");
        expect(result).toContain("classes");
    });

    it("handles deeply nested arrays", () => {
        expect(cn([["foo", "bar"], "baz"])).toBe("foo bar baz");
    });

    it("returns 0 as class string", () => {
        expect(cn(0)).toBe("0");
    });
});
