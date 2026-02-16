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

  // Read URL params once at mount for initial state
  const urlQuery = searchParams?.get("q") ?? "";
  const urlTagsRaw = searchParams?.get("tags") ?? "";
  const mountUrlTags = useMemo(() => normalizeTags(urlTagsRaw.split(",")), [urlTagsRaw]);

  // Local state is the single source of truth.
  // Initialized from props (server) or URL params (client navigation).
  const [query, setQuery] = useState(initialQuery ?? urlQuery);
  const [tags, setTags] = useState<string[]>(() => {
    const fromProps = normalizeTags(initialTags);
    return fromProps.length > 0 ? fromProps : mountUrlTags;
  });

  // Build the URL that corresponds to current state
  const buildUrl = useCallback(
    (q: string, t: string[]) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      const normalized = normalizeTags(t);
      if (normalized.length > 0) params.set("tags", normalized.join(","));
      const qs = params.toString();
      return qs ? `${pathname}?${qs}` : pathname;
    },
    [pathname],
  );

  // Track the last URL we pushed so we don't re-push the same thing
  const lastPushedUrlRef = useRef<string>(
    buildUrl(initialQuery ?? urlQuery, normalizeTags(initialTags).length > 0 ? normalizeTags(initialTags) : mountUrlTags),
  );

  // Debounce: push state -> URL after 300ms of inactivity
  useEffect(() => {
    const nextUrl = buildUrl(query, tags);
    if (nextUrl === lastPushedUrlRef.current) return;

    const handle = window.setTimeout(() => {
      lastPushedUrlRef.current = nextUrl;
      router.replace(nextUrl, { scroll: false });
    }, 300);

    return () => window.clearTimeout(handle);
  }, [query, tags, buildUrl, router]);

  return (
    <SearchBar
      allTags={allTags}
      locale={locale}
      type={type}
      initialQuery={query}
      initialTags={tags}
      onSearchChange={setQuery}
      onTagsChange={setTags}
    />
  );
}
