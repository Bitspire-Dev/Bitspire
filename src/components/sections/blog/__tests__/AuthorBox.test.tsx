import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/hooks/useAdminLink", () => ({
    useAdminLink: vi.fn(() => ({
        getLink: vi.fn((path) => path),
    })),
}));

import AuthorBox from "@/components/sections/blog/AuthorBox";

describe("AuthorBox", () => {
    const validProps = {
        author: "Jan Kowalski",
        authorBox: {
            title: "Senior Developer",
            bio: "Writes a lot of code.",
            contact: "Get in touch",
        },
    };

    it("renders when all props are present", () => {
        render(<AuthorBox {...validProps} />);
        expect(screen.getByText("Jan Kowalski")).toBeInTheDocument();
        expect(screen.getByText("Senior Developer")).toBeInTheDocument();
        expect(screen.getByText("Writes a lot of code.")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Get in touch" })).toBeInTheDocument();
    });

    it("renders author's first initial in the avatar circle", () => {
        render(<AuthorBox {...validProps} />);
        expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("returns null if author is totally missing", () => {
        const { container } = render(<AuthorBox {...validProps} author={undefined} />);
        expect(container.firstChild).toBeNull();
    });

    it("returns null if authorBox is totally missing", () => {
        const { container } = render(<AuthorBox author="Jan Kowalski" authorBox={undefined} />);
        expect(container.firstChild).toBeNull();
    });
});
