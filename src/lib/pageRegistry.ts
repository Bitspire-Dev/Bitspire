// Legacy registry kept only for backward-compatibility during routing refactor.
// New routing should rely on explicit segments and LEGAL_PAGES_* from lib/routing/config.
export const slugs: string[] = [];

export function getPageComponent(_slug: string) {
    return undefined;
}

export function isValidSlug(_slug: string): boolean {
    return false;
}
