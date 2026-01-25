"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/ui/composites/SearchBar";

type ContentType = "blog" | "portfolio";

interface SearchBarRouterProps {
  allTags: string[];
  locale: string;
  type?: ContentType;
  initialQuery?: string;
  initialTags?: string[];
}

function normalizeTags(tags?: string[]): string[] {
  return (tags ?? []).map((tag) => tag.trim()).filter(Boolean);
}

export function SearchBarRouter({
  allTags,
  locale,
  type = "blog",
  initialQuery,
  initialTags,
}: SearchBarRouterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialQueryValue = initialQuery ?? "";
  const initialTagsValue = useMemo(() => normalizeTags(initialTags), [initialTags]);

  const [query, setQuery] = useState(initialQueryValue);
  const [tags, setTags] = useState(initialTagsValue);

  useEffect(() => {
    setQuery(initialQueryValue);
  }, [initialQueryValue]);

  useEffect(() => {
    setTags(initialTagsValue);
  }, [initialTagsValue]);

  const updateParams = useCallback((nextQuery: string, nextTags: string[]) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    } else {
      params.delete("q");
    }

    const normalizedTags = normalizeTags(nextTags);
    if (normalizedTags.length > 0) {
      params.set("tags", normalizedTags.join(","));
    } else {
      params.delete("tags");
    }

    const query = params.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      updateParams(query, tags);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [query, tags, updateParams]);

  return (
    <SearchBar
      allTags={allTags}
      locale={locale}
      type={type}
      initialQuery={query}
      initialTags={tags}
      onSearchChange={(nextQuery) => {
        setQuery(nextQuery);
      }}
      onTagsChange={(nextTags) => {
        setTags(nextTags);
      }}
    />
  );
}
