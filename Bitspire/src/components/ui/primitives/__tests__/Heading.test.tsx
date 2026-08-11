import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Heading } from "@/components/ui/primitives/Heading";

describe("Heading", () => {
    it("renders children content", () => {
        render(<Heading>Hello</Heading>);
        expect(screen.getByText("Hello")).toBeInTheDocument();
    });

    it("renders as h2 by default", () => {
        render(<Heading>Default H2</Heading>);
        const el = screen.getByText("Default H2");
        expect(el.tagName).toBe("H2");
    });

    it("allows custom 'as' prop to override HTML tag", () => {
        render(<Heading as="h1">Custom H1</Heading>);
        expect(screen.getByText("Custom H1").tagName).toBe("H1");
    });

    it("applies preset sizes", () => {
        render(<Heading size="sm">Size SM</Heading>);
        expect(screen.getByText("Size SM").className).toContain("text-lg");

        render(<Heading size="2xl">Size 2XL</Heading>);
        expect(screen.getByText("Size 2XL").className).toContain("text-4xl");
    });

    it("applies default lg size if not specified", () => {
        render(<Heading>Default Size</Heading>);
        expect(screen.getByText("Default Size").className).toContain("text-2xl");
    });
});
