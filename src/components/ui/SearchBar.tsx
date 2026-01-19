'use client';

import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from '@/hooks/useSearch';

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
  translations?: SearchTranslations;
  tinaFields?: {
    searchPlaceholder?: string;
    clearSearch?: string;
    filterByTech?: string;
    clearFilters?: string;
    showLess?: string;
    showMore?: string;
    activeFilters?: string;
    removeFilter?: string;
  };
}

export function SearchBar({ allTags, onSearchChange, onTagsChange, locale: _locale, type: _type = 'blog', translations, tinaFields }: SearchBarProps) {
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
  } = useSearch({ maxVisibleTags: 8 });

  const t = translations || {};
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
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            placeholder={t.searchPlaceholder}
            className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            data-tina-field={tinaFields?.searchPlaceholder}
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={t.clearSearch}
              data-tina-field={tinaFields?.clearSearch}
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
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider" data-tina-field={tinaFields?.filterByTech}>
              {t.filterByTech}
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearAll}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                data-tina-field={tinaFields?.clearFilters}
              >
                {t.clearFilters}
              </button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {displayedTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const baseClasses = "px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer";
              const selectedClasses = isSelected
                ? "bg-blue-600 text-white border-2 border-blue-400 shadow-lg shadow-blue-600/30"
                : "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800";
              
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`${baseClasses} ${selectedClasses}`}
                  aria-pressed={isSelected}
                >
                  {tag}
                </button>
              );
            })}
            
            {shouldShowMoreButton(allTags) && (
              <button
                onClick={toggleShowAllTags}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-700/50 text-slate-400 hover:text-slate-200 border border-slate-600/50 hover:border-slate-500 transition-all"
                data-tina-field={showAllTags ? tinaFields?.showLess : tinaFields?.showMore}
              >
                {showAllTags ? t.showLess : `+${remainingCount} ${t.showMore}`}
              </button>
            )}
          </div>

          {/* Selected tags summary */}
          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-slate-400" data-tina-field={tinaFields?.activeFilters}>{t.activeFilters}</span>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-full text-xs"
                  >
                    {tag}
                    <button
                      onClick={() => handleTagClick(tag)}
                      className="hover:text-blue-100 transition-colors"
                      aria-label={`${t.removeFilter} ${tag}`}
                      data-tina-field={tinaFields?.removeFilter}
                    >
                      <FaTimes className="text-[10px]" />
                    </button>
                  </span>
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
