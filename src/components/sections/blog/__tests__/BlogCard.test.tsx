import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock helpers and i18n
vi.mock("@/lib/ui/helpers", () => ({
    formatDate: vi.fn((date) => `formatted:${date}`),
    toSlug: vi.fn((t) => t.toLowerCase().replace(/\s+/g, "-")),
    safeLink: vi.fn((href) => href),
    safeImageSrc: vi.fn((src) => src),
}));

vi.mock("@/lib/ui/blogCopy", () => ({
    getBlogUiCopy: vi.fn(() => ({
        readTime: "{minutes} min read",
        readMore: "Read More",
    })),
}));

import BlogCard from "@/components/sections/blog/BlogCard";

describe("BlogCard", () => {
    const defaultProps = {
        title: "Awesome React Post",
        slug: "awesome-react-post",
        excerpt: "Learn everything about React.",
        date: "2024-01-01",
        readTime: 5,
        tags: ["React", "Frontend"],
        locale: "en",
        getLink: (p: string) => p,
    };

    it("renders the title", () => {
        render(<BlogCard {...defaultProps} />);
        expect(screen.getByRole("heading", { name: "Awesome React Post" })).toBeInTheDocument();
    });

    it("renders the excerpt if provided", () => {
        render(<BlogCard {...defaultProps} />);
        expect(screen.getByText("Learn everything about React.")).toBeInTheDocument();
    });

    it("renders the description if excerpt is not provided", () => {
        render(<BlogCard {...defaultProps} excerpt={null} description="Fallback description." />);
        expect(screen.getByText("Fallback description.")).toBeInTheDocument();
    });

    it("renders the formatted date", () => {
        render(<BlogCard {...defaultProps} />);
        expect(screen.getByText("formatted:2024-01-01")).toBeInTheDocument();
    });

    it("renders the formatted readTime", () => {
        render(<BlogCard {...defaultProps} />);
        expect(screen.getByText("5 min read")).toBeInTheDocument();
    });

    it("renders tags using TagsList component", () => {
        render(<BlogCard {...defaultProps} />);
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("Frontend")).toBeInTheDocument();
    });

    it("renders image if provided", () => {
        render(<BlogCard {...defaultProps} image="/cool-img.jpg" imageAlt="Cool Pic" />);
        // Testing specific alt text set for the Image component proxy
        const img = screen.getByAltText("Cool Pic");
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute("src", "/cool-img.jpg");
    });

    it("renders title as image alt if imageAlt not provided", () => {
        render(<BlogCard {...defaultProps} image="/cool-img.jpg" imageAlt={null} />);
        expect(screen.getByAltText("Awesome React Post")).toBeInTheDocument();
    });

    it("does not render image section if no image provided", () => {
        render(<BlogCard {...defaultProps} image={null} />);
        // Image element uses the alt tag
        expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });

    it("renders 'Read More' link text", () => {
        render(<BlogCard {...defaultProps} />);
        expect(screen.getByText("Read More")).toBeInTheDocument();
    });

    it("renders absolute link overlay when isAdmin is false", () => {
        render(<BlogCard {...defaultProps} isAdmin={false} />);
        const overlay = screen.getByRole("link", { name: "Awesome React Post" });
        expect(overlay).toBeInTheDocument();
        expect(overlay).toHaveAttribute("href", "/blog/awesome-react-post");
    });

    it("does not render overlay and renders normal button link when isAdmin is true", () => {
        render(<BlogCard {...defaultProps} isAdmin={true} />);
        expect(screen.queryByRole("link", { name: "Awesome React Post" })).not.toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Read More/ })).toBeInTheDocument();
    });
});
