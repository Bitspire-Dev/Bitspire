"use client";
import { useState, useCallback, useMemo, useEffect } from "react";

interface UseSearchOptions {
  initialQuery?: string;
  initialTags?: string[];
  maxVisibleTags?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    initialQuery = "",
    initialTags = [],
    maxVisibleTags = 8,
  } = options;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);
  const [showAllTags, setShowAllTags] = useState(false);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSelectedTags(initialTags);
  }, [initialTags]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedTags([]);
    setSearchQuery("");
  }, []);

  const handleClearTag = useCallback((tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const toggleShowAllTags = useCallback(() => {
    setShowAllTags((prev) => !prev);
  }, []);

  const hasActiveFilters = useMemo(
    () => searchQuery.length > 0 || selectedTags.length > 0,
    [searchQuery, selectedTags]
  );

  const getDisplayedTags = useCallback(
    (allTags: string[]) => {
      return showAllTags ? allTags : allTags.slice(0, maxVisibleTags);
    },
    [showAllTags, maxVisibleTags]
  );

  const getRemainingTagsCount = useCallback(
    (allTags: string[]) => {
      return Math.max(0, allTags.length - maxVisibleTags);
    },
    [maxVisibleTags]
  );

  const shouldShowMoreButton = useCallback(
    (allTags: string[]) => {
      return allTags.length > maxVisibleTags;
    },
    [maxVisibleTags]
  );

  const filterItems = useCallback(
    <T extends { title?: string; tags?: (string | null)[] | null }>(
      items: T[]
    ): T[] => {
      return items.filter((item) => {
        // Search query filter
        const matchesQuery =
          !searchQuery ||
          item.title?.toLowerCase().includes(searchQuery.toLowerCase());

        // Tags filter
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.some((tag) =>
            item.tags?.some(
              (itemTag) =>
                itemTag?.toLowerCase() === tag.toLowerCase()
            )
          );

        return matchesQuery && matchesTags;
      });
    },
    [searchQuery, selectedTags]
  );

  return {
    searchQuery,
    selectedTags,
    showAllTags,
    hasActiveFilters,
    handleSearchChange,
    handleTagToggle,
    handleClearSearch,
    handleClearFilters,
    handleClearTag,
    toggleShowAllTags,
    getDisplayedTags,
    getRemainingTagsCount,
    shouldShowMoreButton,
    filterItems,
  };
}
