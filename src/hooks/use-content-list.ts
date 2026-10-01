import { useMemo } from 'react';
import type { ContentCardItem } from '@/components/ui/composites/content-card';

interface NodeLike {
  _sys?: { relativePath?: string | null };
}

interface ConnectionLike<TNode extends NodeLike> {
  edges?: Array<{ node?: TNode | null } | null> | null;
}

export function useContentList<TNode extends NodeLike>(
  connection: ConnectionLike<TNode> | null | undefined,
  locale: string,
  search: string,
  pathPrefix: string,
  matches: (node: TNode, term: string) => boolean,
  map: (node: TNode) => ContentCardItem
): ContentCardItem[] {
  return useMemo<ContentCardItem[]>(() => {
    const edges = connection?.edges ?? [];
    const term = search.toLowerCase().trim();

    return edges
      .filter((edge): edge is { node: TNode } & NonNullable<typeof edge> => !!edge && !!edge.node)
      .filter(edge => edge.node._sys?.relativePath?.startsWith(`${locale}/${pathPrefix}`))
      .filter(edge => !term || matches(edge.node, term))
      .map(edge => map(edge.node));
  }, [connection, locale, search, pathPrefix, matches, map]);
}

export function joinSearchTerms(values: (string | null | undefined)[]): string {
  return values.filter(Boolean).join(' ').toLowerCase();
}
