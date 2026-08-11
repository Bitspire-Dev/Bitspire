import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MetaBadge from "@/components/ui/composites/MetaBadge";

describe("MetaBadge", () => {
    it("renders the label", () => {
        render(<MetaBadge label="Published" />);
        expect(screen.getByText("Published")).toBeInTheDocument();
    });

    it("applies blue variant by default", () => {
        render(<MetaBadge label="Status" />);
        expect(screen.getByText("Status").className).toContain("text-blue-300");
    });

    it("applies specific variant", () => {
        render(<MetaBadge label="Status" variant="slate" />);
        expect(screen.getByText("Status").className).toContain("text-slate-400");
    });

    it("applies tinaField data attribute", () => {
        render(<MetaBadge label="Status" tinaField="my-field" />);
        expect(screen.getByText("Status")).toHaveAttribute("data-tina-field", "my-field");
    });

    it("always uses pill shape and sm size", () => {
        render(<MetaBadge label="Status" />);
        const el = screen.getByText("Status");
        expect(el.className).toContain("rounded-full");
        expect(el.className).toContain("text-xs");
    });
});
