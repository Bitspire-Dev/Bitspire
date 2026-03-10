import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/primitives/Badge";

describe("Badge", () => {
    it("renders the text content", () => {
        render(<Badge>React</Badge>);
        expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("renders as span by default", () => {
        render(<Badge>Tag</Badge>);
        expect(screen.getByText("Tag").tagName).toBe("SPAN");
    });

    it("renders as button when as='button'", () => {
        render(<Badge as="button">Click</Badge>);
        expect(screen.getByRole("button", { name: "Click" })).toBeInTheDocument();
    });

    it("applies blue variant classes", () => {
        render(<Badge variant="blue">Blue</Badge>);
        expect(screen.getByText("Blue").className).toContain("text-blue-300");
    });

    it("applies cyan variant classes", () => {
        render(<Badge variant="cyan">Cyan</Badge>);
        expect(screen.getByText("Cyan").className).toContain("text-cyan-300");
    });

    it("applies pill shape by default", () => {
        render(<Badge>Pill</Badge>);
        expect(screen.getByText("Pill").className).toContain("rounded-full");
    });

    it("applies md shape", () => {
        render(<Badge shape="md">Square</Badge>);
        expect(screen.getByText("Square").className).toContain("rounded-md");
    });

    it("applies custom className", () => {
        render(<Badge className="custom-badge">Label</Badge>);
        expect(screen.getByText("Label").className).toContain("custom-badge");
    });
});
