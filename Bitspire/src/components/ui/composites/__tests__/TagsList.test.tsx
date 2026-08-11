import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TagsList from "@/components/ui/composites/TagsList";

describe("TagsList", () => {
    it("renders all provided tags", () => {
        render(<TagsList tags={["React", "TypeScript", "Next.js"]} />);
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
        expect(screen.getByText("Next.js")).toBeInTheDocument();
    });

    it("filters out null tags", () => {
        render(<TagsList tags={[null, "React", null]} />);
        expect(screen.getByText("React")).toBeInTheDocument();
    });

    it("returns null when all tags are null", () => {
        const { container } = render(<TagsList tags={[null, null]} />);
        expect(container.firstChild).toBeNull();
    });

    it("returns null when tags array is empty", () => {
        const { container } = render(<TagsList tags={[]} />);
        expect(container.firstChild).toBeNull();
    });

    it("limits displayed tags to maxTags (default 3)", () => {
        render(<TagsList tags={["A", "B", "C", "D", "E"]} />);
        // Default maxTags=3, so only A, B, C should render
        expect(screen.queryByText("D")).not.toBeInTheDocument();
        expect(screen.queryByText("E")).not.toBeInTheDocument();
    });

    it("uses custom maxTags", () => {
        render(<TagsList tags={["A", "B", "C", "D"]} maxTags={4} />);
        expect(screen.getByText("D")).toBeInTheDocument();
    });

    it("applies blue variant", () => {
        render(<TagsList tags={["React"]} variant="blue" />);
        expect(screen.getByText("React").className).toContain("text-blue-300");
    });

    it("applies cyan variant", () => {
        render(<TagsList tags={["Design"]} variant="cyan" />);
        expect(screen.getByText("Design").className).toContain("text-cyan-300");
    });
});
