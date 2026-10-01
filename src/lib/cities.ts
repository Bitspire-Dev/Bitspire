/**
 * Registry of localized city landing pages (/[city] route).
 *
 * Content lives in `content/cities/{locale}/{slug}.md` — this registry is only
 * used for static labels (footer links, nearby-city chips) where we don't want
 * to query Tina just to render a city name.
 */
export interface CityInfo {
  slug: string;
  name: string;
}

export const CITIES: CityInfo[] = [
  { slug: 'slupsk', name: 'Słupsk' },
  { slug: 'ustka', name: 'Ustka' },
  { slug: 'lebork', name: 'Lębork' },
  { slug: 'bytow', name: 'Bytów' },
  { slug: 'kobylnica', name: 'Kobylnica' },
];

export function getCityHref(citySlug: string) {
  return { pathname: '/[city]' as const, params: { city: citySlug } };
}

export function getCityName(citySlug: string): string {
  return CITIES.find(c => c.slug === citySlug)?.name ?? citySlug;
}
