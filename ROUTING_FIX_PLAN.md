# Plan naprawy routingu (domyślny PL bez prefiksu)

## Cel
- Brak prefiksu dla `pl` (localePrefix = `as-needed`).
- `/portfolio`, `/blog`, `/polityka-*`, `/regulamin`, `/portfolio/[slug]`, `/blog/[slug]` mają działać jako wersje PL.
- Prefiks `/en` pozostaje dla EN.

## Diagnoza (na podstawie plików z listy)
1) Middleware i18n nie jest aktywny — logika jest w [src/proxy.ts](src/proxy.ts), ale nie ma pliku middleware w wymaganej lokalizacji, więc `/portfolio` nie mapuje się na `/pl/portfolio` (stąd 404).
2) Domyślny routing opiera się o segment [locale] w App Router, np. [src/app/[locale]/portfolio/page.tsx](src/app/[locale]/portfolio/page.tsx). Bez middleware brak dopasowania dla ścieżek bez locale.
3) Część linków w treści dla PL ma twardo wpisane `/pl` (np. [content/global/pl/header.mdx](content/global/pl/header.mdx)), co łamie zasadę „as-needed”.

## Plan działania

### 1) Aktywuj middleware i18n
- Utwórz plik middleware w wymaganej lokalizacji, np. [middleware.ts](middleware.ts), który eksportuje funkcję `proxy` i `config` z [src/proxy.ts](src/proxy.ts).
- Przykład intencji (bez implementacji w tym planie):
  - `export { config } from './src/proxy';`
  - `export { proxy as default } from './src/proxy';`
- Weryfikacja:
  - `/portfolio` powinno renderować stronę z [src/app/[locale]/portfolio/page.tsx](src/app/[locale]/portfolio/page.tsx) jako PL.
  - `/blog` powinno renderować stronę z [src/app/[locale]/blog/page.tsx](src/app/[locale]/blog/page.tsx) jako PL.
  - `/portfolio/[slug]` i `/blog/[slug]` bez locale działają jak PL.

### 2) Utrzymaj konfigurację `as-needed`
- Potwierdź, że `localePrefix: 'as-needed'` pozostaje w [src/i18n/routing.ts](src/i18n/routing.ts) (już jest).
- Nie dodawaj żadnych dodatkowych redirectów wymuszających `/pl`.

### 3) Oczyść twardo wpisane `/pl` w treści
- Zmień twarde linki w treściach PL, aby używały wersji bez prefiksu:
  - [content/global/pl/header.mdx](content/global/pl/header.mdx): `ctaButton.href` z `/pl#contact` → `/#contact`.
- Przeskanuj treści i komponenty pod kątem innych twardych ścieżek z `/pl` i zamień na wersje bez prefiksu (dla PL).
  - Przykładowe miejsca do kontroli:
    - [content/pages/pl/home.mdx](content/pages/pl/home.mdx)
    - [content/pages/pl/blog.mdx](content/pages/pl/blog.mdx)
    - [content/pages/pl/portfolio.mdx](content/pages/pl/portfolio.mdx)
    - [content/pages/pl/polityka-*.mdx](content/pages/pl/polityka-prywatnosci.mdx)
    - [content/pages/pl/regulamin.mdx](content/pages/pl/regulamin.mdx)

### 4) Weryfikacja linkowania i SEO
- Potwierdź, że `buildLocalePath()` generuje bez-prefiksowe URL dla PL (już tak działa w [src/lib/seo/metadata.ts](src/lib/seo/metadata.ts)).
- Zweryfikuj, że sitemap generuje poprawne URL bez `/pl` dla PL (już tak jest w [src/app/sitemap.ts](src/app/sitemap.ts)).

### 5) Testy funkcjonalne
- Wejścia PL bez prefiksu:
  - `/` (home)
  - `/portfolio`
  - `/portfolio/{slug}`
  - `/blog`
  - `/blog/{slug}`
  - `/polityka-prywatnosci`
  - `/polityka-cookies`
  - `/regulamin`
- Wejścia EN z prefiksem:
  - `/en`, `/en/portfolio`, `/en/portfolio/{slug}`, `/en/blog`, `/en/blog/{slug}`, `/en/privacy-policy`, `/en/cookies-policy`, `/en/terms`
- Admin:
  - `/admin` → przekierowanie do `/admin/index.html#/~/admin/pl`

## Kryteria akceptacji
- `/portfolio` nie zwraca 404 i renderuje PL.
- Każdy route z listy działa w wersji bez-prefiksowej dla PL.
- Wersja EN nadal wymaga `/en`.
- Linki w treści PL nie zawierają `/pl` (poza wyjątkami świadomie wymaganymi).
