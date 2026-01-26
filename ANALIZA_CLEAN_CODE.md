# Audyt clean code (Bitspire)

Data: 2026-01-25

## Zakres
Przegląd obejmuje kod źródłowy w katalogu src, pliki konfiguracyjne oraz middleware. Pominąłem artefakty build (np. .next) jako generowane.

## Skala
1 = niski wpływ, 10 = krytyczny wpływ na stabilność/utrzymanie.

## Znalezione problemy i rekomendacje

| ID | Poważność | Problem | Dowód | Rekomendacja |
|---|---:|---|---|---|
| 1 | 6 | Rozproszone źródła prawdy dla locales i BASE_URL (wiele stałych i list w kilku plikach). To zwiększa ryzyko niespójności i błędów przy dodaniu nowego języka lub zmianie domeny. | [src/app/sitemap.ts](src/app/sitemap.ts#L5-L10), [src/lib/seo/metadata.ts](src/lib/seo/metadata.ts#L3-L13), [src/i18n/request.ts](src/i18n/request.ts#L3-L5), [src/i18n/routing.ts](src/i18n/routing.ts#L5-L9), [src/app/[locale]/blog/page.tsx](src/app/[locale]/blog/page.tsx#L12-L14), [src/app/[locale]/blog/[slug]/page.tsx](src/app/[locale]/blog/[slug]/page.tsx#L11-L14) | Wydziel pojedynczy moduł konfiguracji (np. src/lib/i18n/config.ts) z `BASE_URL`, `SUPPORTED_LOCALES`, `defaultLocale`. Importuj go we wszystkich miejscach zamiast definiować lokalnie. |
| 2 | 5 | Duplikacja mapowań stron legal i nazw plików MDX w kilku miejscach, co grozi rozjazdem nazw/slugów. | [src/i18n/routing.ts](src/i18n/routing.ts#L13-L49), [src/lib/routing/legal-pages/config.ts](src/lib/routing/legal-pages/config.ts#L1-L8), [src/app/sitemap.ts](src/app/sitemap.ts#L131-L144) | Zdefiniuj jedną strukturę (np. tablica obiektów z `slugPl`, `slugEn`, `mdxFile`) i generuj z niej: pathnames, listę legal pages i sitemapę. |
| 3 | 4 | Duplikacja definicji middleware: plik middleware.ts deleguje do src/proxy.ts, ale oba eksportują konfigurację `config`. To zwiększa ryzyko rozjazdu i myli w utrzymaniu. | [middleware.ts](middleware.ts#L1-L6), [src/proxy.ts](src/proxy.ts#L1-L47) | Zostaw jedną konfigurację. Najprościej: przenieś pełną logikę do middleware.ts i usuń `config` z proxy albo usuń proxy całkowicie. |
| 4 | 7 | Limitowanie zapytań do API oparte o Map w pamięci procesu: nietrwałe w środowisku serverless, brak czyszczenia wygasłych wpisów, łatwe do obejścia przy skalowaniu. | [src/app/api/contact/route.ts](src/app/api/contact/route.ts#L12-L36) | Zastąp in-memory store zewnętrznym magazynem (np. Upstash Redis) i ustaw TTL. Dodaj cleanup wygasłych wpisów lub zastosuj gotowy middleware rate-limit. |
| 5 | 5 | Duplikacja walidacji formularza kontaktowego: ręczna walidacja po stronie klienta i niezależna walidacja Zod po stronie API. To może prowadzić do rozjazdu reguł i komunikatów. | [src/hooks/useContactForm.ts](src/hooks/useContactForm.ts#L35-L52), [src/app/api/contact/route.ts](src/app/api/contact/route.ts#L4-L10) | Wydziel wspólny schemat Zod do modułu wspólnego (np. src/lib/validation/contact.ts) i używaj go w obu warstwach. Ujednolić komunikaty i przygotować wersje i18n. |
| 6 | 4 | Zduplikowana logika filtrowania postów bloga w serwerowym `filterPosts` i klienckim `useSearch`. Dwie implementacje tej samej reguły rosną ryzyko niespójności. | [src/app/[locale]/blog/page.tsx](src/app/[locale]/blog/page.tsx#L44-L66), [src/hooks/useSearch.ts](src/hooks/useSearch.ts#L82-L105) | Przenieś filtr do wspólnego helpera (np. src/lib/search/filterPosts.ts) i importuj w obu miejscach. |
| 7 | 5 | `buildAdminLink` posiada złożoną, rozgałęzioną logikę z twardo zakodowanymi locale i ścieżkami. Utrudnia to testowanie i rozszerzanie (np. nowy locale). | [src/lib/routing/adminLink.ts](src/lib/routing/adminLink.ts#L22-L74) | Rozbij na mniejsze funkcje (np. `normalizePath`, `buildPreviewPath`, `buildAdminPath`) i opieraj się o wspólny config locales oraz mapę tras. Dodaj testy jednostkowe. |
| 8 | 3 | Filtr w zapytaniu blogowym w sitemapie zawiera puste warunki `startsWith: ""`, które nic nie wnoszą i utrudniają czytelność. | [src/app/sitemap.ts](src/app/sitemap.ts#L35-L43) | Usuń nieużywany `filter` albo zastąp go realnymi warunkami biznesowymi. |

## Uwagi końcowe
Skupiłem się na logice wspólnej, konfiguracji i miejscach, gdzie potencjalne rozjazdy są najbardziej kosztowne. Jeśli chcesz, mogę przygotować konkretne refaktoryzacje i testy jednostkowe dla wskazanych punktów.
