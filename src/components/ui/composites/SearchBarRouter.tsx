"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const urlQuery = searchParams?.get("q") ?? "";
  const urlTagsRaw = searchParams?.get("tags") ?? "";
  const urlTags = useMemo(() => normalizeTags(urlTagsRaw.split(",")), [urlTagsRaw]);
  const urlTagsKey = useMemo(() => urlTags.join("|"), [urlTags]);
  const currentQueryString = searchParams?.toString() ?? "";
  const currentUrl = currentQueryString ? `${pathname}?${currentQueryString}` : pathname;

  const [query, setQuery] = useState(initialQueryValue);
  const [tags, setTags] = useState(initialTagsValue);
  const tagsKey = useMemo(() => normalizeTags(tags).join("|"), [tags]);
  const initializedRef = useRef(false);
  const lastUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!initializedRef.current) {
      setQuery(urlQuery);
      setTags(urlTags);
      initializedRef.current = true;
      return;
    }

    if (lastUrlRef.current === currentUrl) return;

    if (query !== urlQuery) {
      setQuery(urlQuery);
    }

    if (tagsKey !== urlTagsKey) {
      setTags(urlTags);
    }
  }, [currentUrl, query, urlQuery, tagsKey, urlTagsKey, urlTags]);

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
    if (nextUrl !== currentUrl) {
      lastUrlRef.current = nextUrl;
      router.replace(nextUrl, { scroll: false });
    }
  }, [currentUrl, pathname, router, searchParams]);

  useEffect(() => {
    if (!initializedRef.current) return;
    if (query === urlQuery && tagsKey === urlTagsKey) return;

    const handle = window.setTimeout(() => {
      updateParams(query, tags);
    }, 300);

    return () => window.clearTimeout(handle);
  }, [query, tags, tagsKey, urlQuery, urlTagsKey, updateParams]);

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
