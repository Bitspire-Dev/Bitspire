import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Text } from "@/components/ui/primitives/Text";

describe("Text", () => {
    it("renders children text", () => {
        render(<Text>Paragraph content</Text>);
        expect(screen.getByText("Paragraph content")).toBeInTheDocument();
    });

    it("renders as <p> by default", () => {
        render(<Text>My text</Text>);
        expect(screen.getByText("My text").tagName).toBe("P");
    });

    it("allows rendering as different HTML tag using 'as' prop", () => {
        render(<Text as="span">Span text</Text>);
        expect(screen.getByText("Span text").tagName).toBe("SPAN");
    });

    it("applies default size (base)", () => {
        render(<Text>Base size</Text>);
        const el = screen.getByText("Base size");
        expect(el.className).toContain("text-base");
    });

    it("applies sm size variant", () => {
        render(<Text size="sm">Small text</Text>);
        expect(screen.getByText("Small text").className).toContain("text-sm");
    });

    it("applies lg size variant", () => {
        render(<Text size="lg">Large text</Text>);
        expect(screen.getByText("Large text").className).toContain("text-lg");
    });

    it("applies custom className properly merged", () => {
        render(<Text className="custom-italic">Merged text</Text>);
        const el = screen.getByText("Merged text");
        expect(el.className).toContain("text-base"); // Default size
        expect(el.className).toContain("custom-italic"); // Custom appended
    });
});
