import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSearch } from "@/hooks/useSearch";

describe("useSearch — default state", () => {
    it("has empty searchQuery by default", () => {
        const { result } = renderHook(() => useSearch());
        expect(result.current.searchQuery).toBe("");
    });

    it("has empty selectedTags by default", () => {
        const { result } = renderHook(() => useSearch());
        expect(result.current.selectedTags).toEqual([]);
    });

    it("has hasActiveFilters = false by default", () => {
        const { result } = renderHook(() => useSearch());
        expect(result.current.hasActiveFilters).toBe(false);
    });

    it("accepts initialQuery option", () => {
        const { result } = renderHook(() => useSearch({ initialQuery: "react" }));
        expect(result.current.searchQuery).toBe("react");
    });

    it("accepts initialTags option", () => {
        const { result } = renderHook(() => useSearch({ initialTags: ["React"] }));
        expect(result.current.selectedTags).toEqual(["React"]);
    });
});

describe("useSearch — handleSearchChange", () => {
    it("updates searchQuery", () => {
        const { result } = renderHook(() => useSearch());
        act(() => result.current.handleSearchChange("typescript"));
        expect(result.current.searchQuery).toBe("typescript");
    });

    it("sets hasActiveFilters to true", () => {
        const { result } = renderHook(() => useSearch());
        act(() => result.current.handleSearchChange("react"));
        expect(result.current.hasActiveFilters).toBe(true);
    });
});

describe("useSearch — handleTagToggle", () => {
    it("adds a tag", () => {
        const { result } = renderHook(() => useSearch());
        act(() => result.current.handleTagToggle("React"));
        expect(result.current.selectedTags).toContain("React");
    });

    it("removes an already-selected tag (toggle off)", () => {
        const { result } = renderHook(() => useSearch({ initialTags: ["React"] }));
        act(() => result.current.handleTagToggle("React"));
        expect(result.current.selectedTags).not.toContain("React");
    });
});

describe("useSearch — clear handlers", () => {
    it("handleClearSearch clears query", () => {
        const { result } = renderHook(() => useSearch({ initialQuery: "foo" }));
        act(() => result.current.handleClearSearch());
        expect(result.current.searchQuery).toBe("");
    });

    it("handleClearFilters clears both query and tags", () => {
        const { result } = renderHook(() => useSearch({ initialQuery: "foo", initialTags: ["React"] }));
        act(() => result.current.handleClearFilters());
        expect(result.current.searchQuery).toBe("");
        expect(result.current.selectedTags).toEqual([]);
    });

    it("handleClearTag removes specific tag", () => {
        const { result } = renderHook(() => useSearch({ initialTags: ["React", "TypeScript"] }));
        act(() => result.current.handleClearTag("React"));
        expect(result.current.selectedTags).not.toContain("React");
        expect(result.current.selectedTags).toContain("TypeScript");
    });
});

describe("useSearch — tag display", () => {
    it("toggleShowAllTags toggles showAllTags state", () => {
        const { result } = renderHook(() => useSearch());
        expect(result.current.showAllTags).toBe(false);
        act(() => result.current.toggleShowAllTags());
        expect(result.current.showAllTags).toBe(true);
    });

    it("getDisplayedTags limits to maxVisibleTags by default", () => {
        const { result } = renderHook(() => useSearch({ maxVisibleTags: 3 }));
        const allTags = ["A", "B", "C", "D", "E"];
        expect(result.current.getDisplayedTags(allTags)).toHaveLength(3);
    });

    it("getDisplayedTags shows all when showAllTags = true", () => {
        const { result } = renderHook(() => useSearch({ maxVisibleTags: 3 }));
        act(() => result.current.toggleShowAllTags());
        expect(result.current.getDisplayedTags(["A", "B", "C", "D", "E"])).toHaveLength(5);
    });

    it("getRemainingTagsCount returns correct count", () => {
        const { result } = renderHook(() => useSearch({ maxVisibleTags: 3 }));
        expect(result.current.getRemainingTagsCount(["A", "B", "C", "D", "E"])).toBe(2);
    });

    it("getRemainingTagsCount returns 0 when tags <= max", () => {
        const { result } = renderHook(() => useSearch({ maxVisibleTags: 8 }));
        expect(result.current.getRemainingTagsCount(["A", "B"])).toBe(0);
    });

    it("shouldShowMoreButton returns true when tags > max", () => {
        const { result } = renderHook(() => useSearch({ maxVisibleTags: 3 }));
        expect(result.current.shouldShowMoreButton(["A", "B", "C", "D"])).toBe(true);
    });

    it("shouldShowMoreButton returns false when tags <= max", () => {
        const { result } = renderHook(() => useSearch({ maxVisibleTags: 5 }));
        expect(result.current.shouldShowMoreButton(["A", "B"])).toBe(false);
    });
});

describe("useSearch — filterItems", () => {
    const items = [
        { title: "React Guide", tags: ["React", "Frontend"] },
        { title: "TypeScript Tips", tags: ["TypeScript"] },
        { title: "Next.js Blog", tags: ["React", "Next.js"] },
    ];

    it("returns all items when no filters active", () => {
        const { result } = renderHook(() => useSearch());
        expect(result.current.filterItems(items)).toHaveLength(3);
    });

    it("filters by title query (case-insensitive)", () => {
        const { result } = renderHook(() => useSearch({ initialQuery: "typescript" }));
        const filtered = result.current.filterItems(items);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].title).toBe("TypeScript Tips");
    });

    it("filters by selected tags", () => {
        const { result } = renderHook(() => useSearch({ initialTags: ["React"] }));
        expect(result.current.filterItems(items)).toHaveLength(2);
    });
});
