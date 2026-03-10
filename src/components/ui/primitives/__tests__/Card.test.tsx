import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card, CardContent, CardMedia, CardAccent } from "@/components/ui/primitives/Card";

describe("Card", () => {
    it("renders children content", () => {
        render(
            <Card>
                <p>Card content</p>
            </Card>
        );
        expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("renders as specific element when 'as' provided", () => {
        render(<Card as="article">Article block</Card>);
        expect(screen.getByText("Article block").tagName).toBe("ARTICLE");
    });

    it("applies blue variant correctly", () => {
        render(<Card variant="blue">Blue card</Card>);
        const card = screen.getByText("Blue card");
        expect(card.className).toContain("hover:border-blue-500/50");
    });
});



describe("CardContent", () => {
    it("applies correct padding", () => {
        render(<CardContent padding="md">Content inner</CardContent>);
        const el = screen.getByText("Content inner");
        expect(el.className).toContain("p-6");
    });
});


describe("CardMedia", () => {
    it("renders image wrapper", () => {
        render(
            <CardMedia>
                <img src="/test.jpg" alt="test" />
            </CardMedia>
        );
        const wrapper = screen.getByRole("img").parentElement;
        expect(wrapper?.className).toContain("aspect-video");
    });
});

describe("CardAccent", () => {
    it("renders accent line with variant color", () => {
        render(<CardAccent variant="slate" />);
        // Not testing much beyond rendering empty div without crashing because it's purely visual
        const { container } = render(<CardAccent variant="cyan" />);
        expect(container.firstChild).toHaveClass("from-cyan-500");
    });
});
