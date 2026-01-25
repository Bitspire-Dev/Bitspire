'use client';

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from '@/hooks/useSearch';
import { Badge } from '@/components/ui/primitives/Badge';
import { Input } from '@/components/ui/primitives/Input';
import { cn } from '@/lib/ui/classNames';

type ContentType = 'blog' | 'portfolio';

export interface SearchTranslations {
  searchPlaceholder?: string;
  clearSearch?: string;
  filterByTech?: string;
  clearFilters?: string;
  showLess?: string;
  showMore?: string;
  activeFilters?: string;
  removeFilter?: string;
}

interface SearchBarProps {
  allTags: string[];
  onSearchChange: (query: string) => void;
  onTagsChange: (tags: string[]) => void;
  locale: string;
  type?: ContentType;
  initialQuery?: string;
  initialTags?: string[];
}

const defaultCopy: Record<'pl' | 'en', Record<ContentType, Required<SearchTranslations>>> = {
  pl: {
    blog: {
      searchPlaceholder: 'Szukaj artykułów…',
      clearSearch: 'Wyczyść wyszukiwanie',
      filterByTech: 'Filtruj po tagach',
      clearFilters: 'Wyczyść filtry',
      showLess: 'Pokaż mniej',
      showMore: 'więcej',
      activeFilters: 'Aktywne filtry:',
      removeFilter: 'Usuń filtr',
    },
    portfolio: {
      searchPlaceholder: 'Szukaj projektów…',
      clearSearch: 'Wyczyść wyszukiwanie',
      filterByTech: 'Filtruj po technologiach',
      clearFilters: 'Wyczyść filtry',
      showLess: 'Pokaż mniej',
      showMore: 'więcej',
      activeFilters: 'Aktywne filtry:',
      removeFilter: 'Usuń filtr',
    },
  },
  en: {
    blog: {
      searchPlaceholder: 'Search articles…',
      clearSearch: 'Clear search',
      filterByTech: 'Filter by tags',
      clearFilters: 'Clear filters',
      showLess: 'Show less',
      showMore: 'more',
      activeFilters: 'Active filters:',
      removeFilter: 'Remove filter',
    },
    portfolio: {
      searchPlaceholder: 'Search projects…',
      clearSearch: 'Clear search',
      filterByTech: 'Filter by technology',
      clearFilters: 'Clear filters',
      showLess: 'Show less',
      showMore: 'more',
      activeFilters: 'Active filters:',
      removeFilter: 'Remove filter',
    },
  },
};

export function SearchBar({
  allTags,
  onSearchChange,
  onTagsChange,
  locale,
  type = 'blog',
  initialQuery,
  initialTags,
}: SearchBarProps) {
  const {
    searchQuery,
    selectedTags,
    hasActiveFilters,
    handleSearchChange: internalHandleSearchChange,
    handleTagToggle,
    handleClearSearch,
    handleClearFilters,
    handleClearTag: _handleClearTag,
    getDisplayedTags,
    getRemainingTagsCount,
    shouldShowMoreButton,
    toggleShowAllTags,
    showAllTags,
  } = useSearch({
    maxVisibleTags: 8,
    initialQuery,
    initialTags,
  });

  const normalizedLocale = locale === 'pl' ? 'pl' : 'en';
  const t = defaultCopy[normalizedLocale][type];
  const displayedTags = getDisplayedTags(allTags);
  const remainingCount = getRemainingTagsCount(allTags);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    internalHandleSearchChange(value);
    onSearchChange(value);
  };

  const handleTagClick = (tag: string) => {
    handleTagToggle(tag);
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onTagsChange(newTags);
  };

  const handleClear = () => {
    handleClearSearch();
    onSearchChange('');
  };

  const handleClearAll = () => {
    handleClearFilters();
    onSearchChange('');
    onTagsChange([]);
  };

  return (
    <div className="mb-12 space-y-6">
      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <Input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder={t.searchPlaceholder}
            inputSize="lg"
            variant="search"
            className="pl-12 pr-12"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={t.clearSearch}
            >
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Tags Filter */}
      {allTags.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              {t.filterByTech}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {t.clearFilters}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {displayedTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const selectedClasses = isSelected
                ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800';

              return (
                <Badge
                  key={tag}
                  as="button"
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  shape="pill"
                  size="md"
                  variant="neutral"
                  className={cn('cursor-pointer text-xs font-medium transition-all', selectedClasses)}
                  aria-pressed={isSelected}
                >
                  {tag}
                </Badge>
              );
            })}

            {shouldShowMoreButton(allTags) && (
              <Badge
                as="button"
                type="button"
                onClick={toggleShowAllTags}
                shape="pill"
                size="md"
                variant="neutral"
                className="cursor-pointer text-xs font-medium bg-slate-700/50 text-slate-400 hover:text-slate-200 border border-slate-600/50 hover:border-slate-500 transition-all"
              >
                {showAllTags ? t.showLess : `+${remainingCount} ${t.showMore}`}
              </Badge>
            )}
          </div>

          {/* Selected tags summary */}
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-slate-400">{t.activeFilters}</span>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="blue"
                    size="sm"
                    shape="pill"
                    className="gap-1.5"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagClick(tag)}
                      className="hover:text-blue-100 transition-colors"
                      aria-label={`${t.removeFilter} ${tag}`}
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Export aliases for backward compatibility
export { SearchBar as BlogSearch };
export { SearchBar as PortfolioSearch };
