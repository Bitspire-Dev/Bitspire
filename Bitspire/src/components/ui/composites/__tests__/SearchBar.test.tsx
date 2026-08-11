import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockHooks = {
    searchQuery: "",
    selectedTags: [] as string[],
    hasActiveFilters: false,
    handleSearchChange: vi.fn(),
    handleTagToggle: vi.fn(),
    handleClearSearch: vi.fn(),
    handleClearFilters: vi.fn(),
    getDisplayedTags: vi.fn((tags) => tags),
    getRemainingTagsCount: vi.fn(() => 0),
    shouldShowMoreButton: vi.fn(() => false),
    toggleShowAllTags: vi.fn(),
    showAllTags: false,
};

vi.mock("@/hooks/useSearch", () => ({
    useSearch: vi.fn(() => mockHooks),
}));

import { SearchBar } from "@/components/ui/composites/SearchBar";

describe("SearchBar", () => {
    const defaultProps = {
        allTags: ["React", "TypeScript", "Next.js"],
        onSearchChange: vi.fn(),
        onTagsChange: vi.fn(),
        locale: "pl",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders search input with correct placeholder for blog PL", () => {
        render(<SearchBar {...defaultProps} type="blog" />);
        expect(screen.getByPlaceholderText("Szukaj artykułów…")).toBeInTheDocument();
    });

    it("renders tags as buttons", () => {
        render(<SearchBar {...defaultProps} />);
        expect(screen.getByText("React")).toBeInTheDocument();
        expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });

    it("calls onSearchChange when typing in input", async () => {
        render(<SearchBar {...defaultProps} />);
        const input = screen.getByPlaceholderText("Szukaj artykułów…");
        await userEvent.type(input, "a");

        expect(mockHooks.handleSearchChange).toHaveBeenCalled();
        expect(defaultProps.onSearchChange).toHaveBeenCalled();
    });

    it("calls onTagsChange when tag is clicked", async () => {
        render(<SearchBar {...defaultProps} />);
        const tagBtn = screen.getByText("React");
        await userEvent.click(tagBtn);

        expect(mockHooks.handleTagToggle).toHaveBeenCalledWith("React");
        expect(defaultProps.onTagsChange).toHaveBeenCalled();
    });

    it("shows clear search button only when query exists", () => {
        const { rerender } = render(<SearchBar {...defaultProps} />);
        expect(screen.queryByLabelText("Wyczyść wyszukiwanie")).not.toBeInTheDocument();

        mockHooks.searchQuery = "test";
        rerender(<SearchBar {...defaultProps} />);
        expect(screen.getByLabelText("Wyczyść wyszukiwanie")).toBeInTheDocument();
        mockHooks.searchQuery = ""; // restore
    });
});
