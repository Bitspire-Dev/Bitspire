import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/lib/routing/adminLink", () => ({
    buildAdminLink: vi.fn((href, ctx) => `/mocked${href}?l=${ctx.locale}&m=${ctx.mode}`),
}));

import BackLink from "@/components/layout/BackLink";

describe("BackLink", () => {
    it("renders null if no label is provided", () => {
        const { container } = render(<BackLink href="/foo" />);
        expect(container.firstChild).toBeNull();
    });

    it("renders link with label when provided", () => {
        render(<BackLink href="/foo" label="Go Back" />);
        const link = screen.getByRole("link", { name: /Go Back/ });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute("href", "/mocked/foo?l=pl&m=production"); // default props
    });

    it("passes locale and mode to buildAdminLink", () => {
        render(<BackLink href="/bar" label="Back" locale="en" linkMode="admin" />);
        const link = screen.getByRole("link", { name: /Back/ });
        expect(link).toHaveAttribute("href", "/mocked/bar?l=en&m=admin");
    });

    it("applies tinaField data attribute", () => {
        render(<BackLink href="/foo" label="Back" tinaField="my-field" />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("data-tina-field", "my-field");
    });
});
