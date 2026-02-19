# DATAFLOW — Bitspire (checklista projektowa komponentów)

Poniższy dokument to **wyczerpująca lista kontrolna** procesu tworzenia nowego komponentu/sekcji/strony tak, aby od razu był w 100% kompatybilny z istniejącą architekturą (Next.js App Router + TinaCMS + MDX + i18n). Traktuj go jako **jedno źródło prawdy** dla spójności rozwiązań i uniknięcia rozbieżności. Dokument ma pokrywać wszystkie niezbędne kroki – bez wyjątków.

---

## 0) Zasady nadrzędne (nie negocjujemy)

- **Każdy nowy element ma mieć wersję PL i EN.**
- **Źródłem treści jest folder content/** (MDX). Frontmatter w YAML, treść w MDX.
- **Każda treść musi mieć pola Tina** (TinaCMS schema + tinaField w UI).
- **Każda treść musi mieć zapytania w warstwie Tina** (generated client + queries).
- **Każda nowa sekcja/strona musi mieć spójny routing** (i18n + slug + admin preview).
- **Nie mieszamy wzorców.** Te same typy obiektów = te same rozwiązania (np. sekcje strony domowej zawsze w pages schema, nie w osobnych plikach MDX).
- **Podstawowe tokeny designu (kolory, spacing, container)** definiujemy i utrzymujemy w tailwind.config.js; w JSX/CSS używamy klas opartych o te tokeny.

---

## 1) Architektura danych (jak płynie content)

### 1.1. Skąd biorą się dane
1) **content/** — źródło prawdy (MDX z YAML frontmatter). Przykłady:
   - content/pages/pl/home.mdx
   - content/pages/en/home.mdx
   - content/blog/pl/*.mdx
   - content/portfolio/en/*.mdx
2) **TinaCMS schema** — definiuje pola do edycji:
   - tina/schemas/pages.ts
   - tina/schemas/blog.ts
   - tina/schemas/portfolio.ts
   - tina/schemas/sections.ts
3) **Generated client + types** — automatycznie generowane (tina/__generated__/client.ts, tina/__generated__/types.ts, tina/__generated__/schema.gql) i używane w queries.
4) **Data access layer** — src/lib/tina/queries.ts + adapters.ts + mappers.ts + body helpers.
5) **Wspólne typy danych** — src/lib/tina/types.ts (używane przez wrappery/komponenty).
6) **Strony Next.js** — src/app/[locale]/... pobierają dane i renderują wrappery.
7) **Wrappery stron** — src/components/pages/*Wrapper.tsx łączą dane + sekcje.
8) **Sekcje / UI** — src/components/sections/** + src/components/ui/**.
9) **Admin Preview** — src/app/admin/** + src/providers/** (live preview w Tina).

### 1.2. Jednolity format MDX
- **Frontmatter (YAML)** = metadane i pola strukturalne (np. title, description, hero, etc.).
- **Body (MDX)** = treść właściwa (np. artykuł, opis, dodatkowe akapity).
- Frontmatter jest mapowany do pól w TinaCMS.
- Body jest renderowane przez TinaMarkdown/RichText (zgodnie z presetami).

### 1.3. Jednolity i18n
- Obsługa locale: **pl + en**.
- Routing i mapowania: src/i18n/routing.ts.
- Legal pages mapowane: src/lib/routing/legal-pages/config.ts.
- Każda nowa treść musi mieć plik w obu językach i mieć spójny slug.

---

## 2) Typy komponentów i ich „ścieżka życia”

### 2.1. Strona (page)
Strony są renderowane w App Router i pobierają dane z Tina.

**Minimalna ścieżka:**
1) MDX w content/pages/{locale}/[slug].mdx
2) Tina schema w tina/schemas/pages.ts
3) Query w src/lib/tina/queries.ts (getPage/getHomePage/getLegalPage)
4) Route w src/app/[locale]/[slug]/page.tsx
5) Wrapper w src/components/pages/*Wrapper.tsx
6) Admin preview w src/app/admin/[locale]/[slug]/page.tsx
7) Renderer preview w src/providers/AdminPreviewRenderer.tsx
8) Aktualizacja sitemap w src/app/sitemap.ts (jeśli nowa strona statyczna)
9) Aktualizacja mapowań i18n w src/i18n/routing.ts (jeśli slugy różnią się per język)

### 2.2. Sekcja strony (section)
Sekcje strony domowej/portfolio/blog itp. są **polem obiektu** w pages schema.

**Minimalna ścieżka:**
1) Pola w tina/schemas/sections.ts
2) Pole sekcji dodane do pages schema (tina/schemas/pages.ts)
3) Dane w frontmatter content/pages/{locale}/home.mdx
4) Komponent w src/components/sections/**
5) Użycie w wrapperze strony (np. HomePageWrapper)
6) TinaField w UI dla każdego edytowalnego pola
7) Render body (jeśli potrzeba) przez TinaMarkdown

### 2.3. Wpis blogowy / portfolio (collection)
To osobne kolekcje z własnym MDX.

**Minimalna ścieżka:**
1) MDX w content/blog|portfolio/{locale}/[slug].mdx
2) Schema w tina/schemas/blog.ts lub tina/schemas/portfolio.ts
3) Query w src/lib/tina/queries.ts (getBlogPost/getPortfolioItem)
4) Route w src/app/[locale]/blog|portfolio/[slug]/page.tsx
5) Wrapper w src/components/pages/*Wrapper.tsx
6) Admin preview w src/app/admin/[locale]/blog|portfolio/[slug]/page.tsx
7) Renderer preview w src/providers/AdminPreviewRenderer.tsx
8) Update sitemap (dynamic pages)

---

## 3) Checklist — tworzenie nowego komponentu (pełny proces)

### 3.1. Analiza architektury przed zmianą
- [ ] Zidentyfikuj typ: page / section / collection-item.
- [ ] Określ, czy dane są statyczne czy z Tina.
- [ ] Określ, czy potrzebujesz MDX body.
- [ ] Zdecyduj, czy komponent jest tylko UI, czy też pobiera dane.

### 3.2. Definicja danych (content + schema)
- [ ] Dodaj **frontmatter** w MDX (YAML) z pełnym zestawem pól.
- [ ] Upewnij się, że istnieje PL i EN.
- [ ] Dodaj pole do schematu Tina:
  - [ ] pages schema (strony i sekcje)
  - [ ] blog schema (wpisy)
  - [ ] portfolio schema (projekty)
  - [ ] sections schema (sekcje strony domowej)
- [ ] Ustal poprawne typy Tina:
  - string, datetime, boolean, list, image, object.
- [ ] Dodaj opisy i labelki (UX w Tina).
- [ ] Zadbaj o zgodność typu w src/lib/tina/types.ts (jeśli typ jest współdzielony w UI).
- [ ] Po zmianie schema uruchom regenerację plików Tina (tina/__generated__).

### 3.3. Tworzenie treści (MDX)
- [ ] Nowy plik: content/[collection]/[locale]/[slug].mdx
- [ ] Frontmatter w YAML (metadane + pola).
- [ ] Body w MDX (content).
- [ ] Zgodność z istniejącymi wzorcami (format dat, slug, image path).

### 3.4. Wspólna normalizacja danych (mappers)
- [ ] Użyj normalizePost / normalizeProject (src/lib/tina/mappers.ts).
- [ ] Dodaj nowe mapowania, jeśli wprowadzasz nowe pola do list.
- [ ] Upewnij się, że slug jest spójny (_sys.filename).
- [ ] Mapowanie stron i sekcji realizuj przez adapters.ts (mapPageWithBody / mapHomePageData).

### 3.5. Query layer (Tina queries)
- [ ] Dodaj funkcję w src/lib/tina/queries.ts:
  - [ ] getX(locale, slug)
  - [ ] getXIndex(locale)
- [ ] Użyj `client.queries.<collection>`.
- [ ] Używaj prefix(locale) = "pl/" lub "en/".
- [ ] Sortowanie, filtrowanie, mapping wg wzorców.
- [ ] Zwracaj typy z src/lib/tina/types.ts, gdy są używane w UI/wrapperach.

### 3.6. Routing i i18n
- [ ] Dodaj route w src/app/[locale]/.../page.tsx.
- [ ] generateStaticParams dla obu locale.
- [ ] Obsłuż redirect jeśli locale niepoprawne.
- [ ] Update i18n mapowania w src/i18n/routing.ts, jeśli slugy różne.

### 3.7. Wrapper strony
- [ ] Utwórz/rozszerz wrapper w src/components/pages/**.
- [ ] Wstrzyknij dane z Tina.
- [ ] Renderuj sekcje i body.
- [ ] Dodaj TinaMarkdown/RichText (dla body).
- [ ] Dodaj tinaField dla edytowalnych pól.

### 3.8. Sekcje UI
- [ ] Utwórz komponent w src/components/sections/**.
- [ ] Utrzymaj spójny styl (Tailwind + istniejące layouty).
- [ ] Dla każdego pola z Tina dodaj data-tina-field.
- [ ] Używaj pomocników do body (extractBody, hasBodyContent).
- [ ] Nie zostawiaj martwych zależności po usuniętych sekcjach.

### 3.9. Admin Preview (Tina)
- [ ] Dodaj route w src/app/admin/[locale]/.../page.tsx.
- [ ] Podłącz AdminPreviewProvider.
- [ ] Dodaj renderer w AdminPreviewRenderer.tsx.
- [ ] Zapewnij normalizację danych pod preview.
- [ ] Dla kolekcji (blog/portfolio) uzupełnij listy i relacje.

### 3.10. Sitemap i SEO
- [ ] Zaktualizuj sitemap.ts dla nowych stron lub kolekcji.
- [ ] Upewnij się, że `title` i `description` istnieją w MDX.
- [ ] Dla obrazów dodaj `imageAlt`.
- [ ] Dla obrazów z lokalnych ścieżek używaj helperów bezpieczeństwa (np. safeImageSrc), jeśli są stosowane w UI.

### 3.11. Test spójności
- [ ] Czy pliki PL i EN są kompletne?
- [ ] Czy slugy są spójne i poprawnie mapowane?
- [ ] Czy Tina schema odpowiada frontmatter?
- [ ] Czy wszystkie pola mają tinaField w UI?
- [ ] Czy admin preview działa?
- [ ] Czy routing generuje stronę bez 404?
- [ ] Czy wygenerowane pliki Tina są aktualne (client/types/schema)?

---

## 4) Wzorce szczegółowe (do naśladowania)

### 4.1. Pages collection
- Pliki: content/pages/{locale}/home.mdx, blog.mdx, portfolio.mdx.
- Schemat: tina/schemas/pages.ts.
- Route: src/app/[locale]/page.tsx (home) + indywidualne podstrony.
- Wrapper: src/components/pages/HomePageWrapper.tsx, BlogPageWrapper.tsx, PortfolioPageWrapper.tsx.

### 4.2. Blog collection
- Pliki: content/blog/{locale}/[slug].mdx.
- Schemat: tina/schemas/blog.ts.
- Route: src/app/[locale]/blog/[slug]/page.tsx.
- Wrapper: src/components/pages/BlogPostWrapper.tsx.
- Index: src/app/[locale]/blog/page.tsx + BlogPageWrapper.

### 4.3. Portfolio collection
- Pliki: content/portfolio/{locale}/[slug].mdx.
- Schemat: tina/schemas/portfolio.ts.
- Route: src/app/[locale]/portfolio/[slug]/page.tsx.
- Wrapper: src/components/pages/PortfolioItemWrapper.tsx.
- Index: src/app/[locale]/portfolio/page.tsx + PortfolioPageWrapper.

### 4.4. Legal pages
- Slugi sterowane przez config: src/lib/routing/legal-pages/config.ts.
- Mapowanie plików w src/i18n/routing.ts.
- Strony: polityka-prywatnosci, polityka-cookies, regulamin oraz ich EN.

---

## 5) Minimalny zestaw plików do modyfikacji (w zależności od typu)

### Nowa sekcja na stronie głównej
- content/pages/pl/home.mdx
- content/pages/en/home.mdx
- tina/schemas/sections.ts
- tina/schemas/pages.ts
- src/components/sections/... (nowy komponent)
- src/components/pages/HomePageWrapper.tsx
- src/providers/AdminPreviewRenderer.tsx (jeśli preview wymaga specyficznego mapowania)

### Nowa strona statyczna (np. "about")
- content/pages/pl/about.mdx
- content/pages/en/about.mdx
- tina/schemas/pages.ts
- src/app/[locale]/about/page.tsx
- src/components/pages/AboutPageWrapper.tsx
- src/app/admin/[locale]/about/page.tsx
- src/providers/AdminPreviewRenderer.tsx
- src/i18n/routing.ts (slugy per locale)
- src/app/sitemap.ts

### Nowy typ kolekcji (np. case studies)
- content/case-studies/pl/*.mdx
- content/case-studies/en/*.mdx
- tina/schemas/case-studies.ts (nowa kolekcja)
- tina/config.ts (dodanie kolekcji)
- src/lib/tina/queries.ts (getCaseStudy, getCaseStudies)
- src/app/[locale]/case-studies/page.tsx
- src/app/[locale]/case-studies/[slug]/page.tsx
- src/components/pages/CaseStudyPageWrapper.tsx
- src/app/admin/[locale]/case-studies/... (preview)
- src/providers/AdminPreviewRenderer.tsx
- src/app/sitemap.ts

---

## 6) Spójność i „anty-rozjazdy”

- [ ] Nie twórz alternatywnych formatów danych.
- [ ] Nie omijaj TinaCMS — każde pole musi mieć schema + tinaField.
- [ ] Nie twórz treści bez wersji EN/PL.
- [ ] Nie twórz nowych routingów bez aktualizacji i18n + sitemap.
- [ ] Nie używaj nowych helperów, jeśli istnieją (extractBody, hasBodyContent, normalizePost).
- [ ] Po zmianie schema zawsze regeneruj tina/__generated__.

---

## 7) Gotowy „szkielet” procesu (krok po kroku)

1) **Zdefiniuj data model** (jakie pola? jaka struktura? lista? obiekt?)
2) **Dodaj do Tina schema** (fields + labels + ui config)
3) **Dodaj frontmatter do MDX** (PL + EN)
4) **Dodaj/zmodyfikuj query** (getX / getXIndex)
5) **Dodaj lub rozbuduj route** (App Router)
6) **Dodaj wrapper + sekcję** (UI)
7) **Dodaj tinaField** do wszystkich pól
8) **Podłącz Admin Preview**
9) **Zaktualizuj sitemap**
10) **Zweryfikuj i18n mapping**
11) **Sprawdź spójność stylów + layoutów**
12) **Zregeneruj pliki Tina** (tina/__generated__)

---

## 8) Weryfikacja końcowa (check before merge)

- [ ] Czy oba języki istnieją i są aktualne?
- [ ] Czy frontmatter = schema 1:1?
- [ ] Czy UI używa tinaField dla każdego pola?
- [ ] Czy routing ma poprawne locale prefix?
- [ ] Czy admin preview działa bez błędów?
- [ ] Czy nowy komponent nie wprowadza drugiego „standardu”?
- [ ] Czy Tina __generated__ jest aktualne?

---

## 9) Przypięte punkty krytyczne (nie pominąć)

- **content** to jedyny punkt prawdy.
- **Tina schema** musi odzwierciedlać każde pole frontmatter.
- **MDX body** renderujemy zawsze przez TinaMarkdown.
- **Locale** musi być częścią ścieżki i danych.
- **Admin Preview** musi działać dla każdego nowego typu treści.
- **Sitemap + SEO** aktualizowane dla nowych stron i kolekcji.
- **Generated Tina files** muszą być aktualne po każdej zmianie schema.

---

To jest checklista referencyjna. Przy każdym nowym komponencie przechodzimy przez cały proces i odhaczamy punkty — bez wyjątków.
