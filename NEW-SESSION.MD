# Bitspire — Mapa Systemów i Komponentów

Kompleksowa dokumentacja wszystkich systemów, bibliotek, helperów, komponentów i konwencji dostępnych w projekcie. Używaj tego pliku jako punkt odniesienia przy tworzeniu nowych komponentów.

---

## Spis treści

1. [Stack technologiczny](#stack-technologiczny)
2. [src/lib — helpery, utils, dane](#srclib--helpery-utils-dane)
3. [src/i18n — routing i nawigacja i18n](#srci18n--routing-i-nawigacja-i18n)
4. [src/hooks — hooki React](#srchooks--hooki-react)
5. [src/components/providers — providery React](#srccomponentsproviders--providery-react)
6. [src/components/ui/primitives — prymitywy UI](#srccomponentsuiprimitives--prymitywy-ui)
7. [src/components/ui/composites — komponenty złożone](#srccomponentsuicomposites--komponenty-złożone)
8. [src/components/ui/navigation — nawigacja](#srccomponentsuinavigation--nawigacja)
9. [src/components/animations — animacje WebGL i Framer Motion](#srccomponentsanimations--animacje-webgl-i-framer-motion)
10. [src/components/sections — sekcje stron](#srccomponentssections--sekcje-stron)
11. [src/components/layout — Header i Footer](#srccomponentslayout--header-i-footer)
12. [src/components/pages — komponenty stron](#srccomponentspages--komponenty-stron)
13. [TinaCMS — content, schema, zapytania](#tinacms--content-schema-zapytania)
14. [Image optimization](#image-optimization)
15. [SEO — metadata, JSON-LD, sitemap, robots](#seo--metadata-json-ld-sitemap-robots)
16. [Next.js config](#nextjs-config)
17. [Konwencje i wzorce](#konwencje-i-wzorce)

---

## Stack technologiczny

| Warstwa         | Technologia                                             |
| --------------- | ------------------------------------------------------- |
| Framework       | Next.js 15.5 (App Router, SSG)                          |
| Język           | TypeScript 5.x                                          |
| CMS             | TinaCMS (local mode, GraphQL)                           |
| i18n            | next-intl (pl, en)                                      |
| Styling         | Tailwind CSS v4 (PostCSS)                               |
| UI primitives   | Radix UI + CVA (class-variance-authority)               |
| Animacje        | Framer Motion (motion/react), PixiJS 8 (WebGL)          |
| Fonts           | next/font/local (Inter, Nippo, IBM Plex Mono)           |
| Markdown        | TinaCMS rich-text + react-markdown                      |
| SEO             | next-metadata, JSON-LD, sitemap.ts, robots.ts           |
| Package manager | pnpm                                                    |
| Build           | `pnpm build:local` (tinacms build --local + next build) |

---

## src/lib — helpery, utils, dane

Wszystkie pliki server-only chyba że oznaczone.

### `utils.ts`

- **`cn(...inputs)`** — łączy klasy CSS (clsx + tailwind-merge). Używaj wszędzie zamiast string concatenation.

### `use-mounted.ts` _(use client)_

- **`useMounted()`** — zwraca `boolean`, true po hydratacji. Używaj gdy komponent musi wykonać pracę tylko na kliencie.

### `fonts.ts`

- **`inter`** — font sans (body text)
- **`nippo`** — font heading (nagłówki)
- **`ibmPlexMono`** — font mono (code, techniczne)

### `color.ts`

- **`hexToRgb(hex)`** — konwertuje HEX na `RgbTuple` [r,g,b] w zakresie 0-1
- **`getCssColor(varName)`** — pobiera wartość zmiennej CSS z `document` (client) lub fallback. Używane przez shadery PixiJS do synchronizacji kolorów z motywem.

### `company.ts`

- **`COMPANY`** — obiekt z danymi firmy: nazwa, email, telefon, adres (pl/en), godziny (pl/en), social media (LinkedIn, GitHub, Instagram, Facebook), taxId, KRS
- **`DEFAULT_EMAIL`** — domyślny email kontaktowy
- **`CompanyData`**, **`CompanySocial`** — typy

### `site.ts`

- **`siteName`** — nazwa strony (z COMPANY)
- **`siteUrl`** — kanoniczny URL (z `NEXT_PUBLIC_SITE_URL`, normalizowany — usuwa www., trailing slash)
- **`siteMetadata`** — pełna konfiguracja `Metadata` Next.js (OG, Twitter, icons, robots, metadataBase)
- **`localePathname(locale, pathname?)`** — buduje pełny URL z locale
- **`localeAlternates(pathname)`** — generuje alternatywy językowe (hreflang) dla metadata
- **`sitemapAlternates(pathname)`** — alternatywy dla sitemap.xml
- **`getDefaultOgImages(locale)`** — domyślne obrazy OG

### `navigation.ts`

- **`MAIN_NAV_LINKS`** — definicje linków nawigacji głównej (pl/en)
- **`NavLink`** — typ

### `image.ts`

- **`isUnoptimizedImage(src)`** — zwraca true dla SVG i GIF (nie optymalizuj przez Next/Image)

### `string.ts`

- **`extractContentSlug(filename)`** — ekstrahuje slug z nazwy pliku TinaCMS (np. `pl/home.md` → `home`)
- **`slugify(text)`** — konwertuje tekst na URL-friendly slug

### `date.ts`

- **`formatLongDate(dateString, locale)`** — formatuje datę długą (np. "15 stycznia 2024")
- **`dottedDateToIso(dotted)`** — konwertuje "DD.MM.YYYY" na ISO

### `blog.ts`

- **`getBlogArticleHref(slug, locale)`** — generuje href dla artykułu bloga
- **`extractBlogSlug(relativePath)`** — ekstrahuje slug z relativePath TinaCMS
- **`buildBlogArticleMap(connection)`** — buduje mapę slugów dla LocaleSwitcher (klucz: canonical, wartość: {pl, en})
- **`toRelatedItems(currentArticle, allArticles, locale, limit)`** — znajduje powiązane artykuły po tagach
- **`BlogArticleMap`** — typ

### `toc.ts`

- **`extractTocFromMarkdown(markdown)`** — ekstrahuje nagłówki H2 z Markdown do `TocItem[]`
- **`TocItem`** — typ `{ id, text }`

### `content-list.ts`

- **`useContentList(items, options)`** — hook do filtrowania listy treści po wyszukiwaniu. Opcje: `searchValue`, `searchKeys` (np. `['title', 'description', 'tags']`)
- **`joinSearchTerms(item, keys)`** — łączy pola w jeden string do wyszukiwania

### `ui.ts`

- **`Locale`** = `'pl' | 'en'`
- **`getUi(locale)`** — zwraca zlokalizowane teksty UI
- **`getPageFallbackTitle(pathname, locale)`** — fallback tytułu strony
- **`getErrorUi(locale)`** — teksty błędów
- **`getAuthorCardUi(locale)`** — teksty karty autora
- **`getTechnologyCarouselUi(locale)`** — teksty karuzeli technologii
- **`getServicesUi(locale)`** — teksty sekcji usług
- **`getPrivacyUi(locale)`** — teksty strony prywatności
- **`getWhyBitspireUi(locale)`** — teksty sekcji WhyBitspire
- Stałe: `PAGE_FALLBACK_TITLES`, `ERROR_UI`, `AUTHOR_CARD_UI`, `TECHNOLOGY_CAROUSEL_UI`, `SERVICES_UI`, `PRIVACY_UI`, `WHY_BITSPIRE_UI`

### `json-ld.ts`

- **`organizationJsonLd()`** — schema Organization
- **`websiteJsonLd()`** — schema WebSite
- **`webPageJsonLd(options)`** — schema WebPage
- **`blogPostingJsonLd(options)`** — schema BlogPosting
- **`articleJsonLd(options)`** — schema Article
- **`breadcrumbListJsonLd(items)`** — schema BreadcrumbList
- **`combineJsonLd(...things)`** — łączy wiele schematów w `@graph`
- Typy: `JsonLdThing`, `BreadcrumbItem`, `WebPageJsonLdOptions`, `BlogPostingJsonLdOptions`, `ArticleJsonLdOptions`

### `og-image.tsx`

- **`renderOgImage(options)`** — generuje obraz OG przez Next.js ImageResponse (używa `fs/promises`)
- **`OgImageOptions`** — typ

### `tina.ts`

- **`tinaQueryWithRetry(query, { retries, delayMs })`** — wrapper z retry dla zapytań TinaCMS
- **`getPage(relativePath)`** — pobiera pojedynczą stronę (cache'd)
- **`getPageConnection()`** — pobiera wszystkie strony (cache'd)
- **`getBlogConnection()`** — pobiera wszystkie artykuły bloga (cache'd)
- **`getBlogPost(relativePath)`** — pobiera artykuł (cache'd, 404 → null)
- **`getProjectConnection()`** — pobiera wszystkie projekty (cache'd)
- **`getProject(relativePath)`** — pobiera projekt (cache'd, 404 → null)

### `portfolio/categories.ts`

- **`PORTFOLIO_CATEGORIES`** — lista kategorii: `websites`, `software` (z slug/label/description/image dla pl/en)
- **`PortfolioCategory`**, **`PortfolioCategoryId`** — typy
- **`isPortfolioCategoryId(id)`** — type guard
- **`getCategoryById(id)`** — pobiera kategorię po ID
- **`getCategoryBySlug(slug, locale)`** — pobiera kategorię po slug dla locale
- **`getCategoryUrlSlug(categoryId, locale)`** — zwraca URL slug dla kategorii
- **`getCategoryHref(categoryId, locale)`** — zwraca href dla kategorii (pathname + params)
- **`getProjectHref(categoryId, slug, locale)`** — zwraca href dla projektu

---

## src/i18n — routing i nawigacja i18n

### `routing.ts`

- **`routing`** — konfiguracja `defineRouting` z next-intl:
  - `locales`: `['pl', 'en']`
  - `defaultLocale`: `'pl'`
  - `localePrefix`: `always`
  - `pathnames`: mapowanie ścieżek URL dla PL/EN (np. `/portfolio` ↔ `/portfolio`)

### `navigation.ts`

- **`Link`** — komponent Link świadomy locale (z `createNavigation(routing)`)
- **`redirect`** — funkcja redirect świadoma locale
- **`usePathname`** — hook zwracający pathname bez prefixu locale
- **`useRouter`** — hook routera świadomy locale
- **`getPathname`** — funkcja budująca pathname dla locale

### `request.ts`

- Default export `getRequestConfig` — waliduje locale z requestu, zwraca messages (obecnie puste — teksty UI są w `src/lib/ui.ts`)

---

## src/hooks — hooki React

Wszystkie hooki są `'use client'`.

### `use-locale-switcher.ts`

- **`useLocaleSwitcher(locale, blogMap)`** — zwraca funkcję `(targetLocale) => void` do zmiany języka. Obsługuje translację slugów artykułów blogowych i kategorii portfolio.

### `use-reduced-motion.ts`

- **`useReducedMotion()`** — zwraca `boolean`. Nasłuchuje `prefers-reduced-motion: reduce` przez `useSyncExternalStore`. Singleton z subskrybentami.

### `use-theme-image.ts`

- **`useThemeImage(src, fallback)`** — zwraca `string` (ścieżkę obrazu dla aktualnego motywu). Obsługuje:
  - Wzorce `GRYF_PATTERN` (obrazy gryfa light/dark)
  - Wzorce `MODE_PATTERN` (foldery `light-mode/` / `dark-mode/`)
  - URL-e `assets.tina.io` (TinaCMS)

---

## src/components/providers — providery React

Wszystkie providery są `'use client'`. Montowane w `src/app/[locale]/layout.tsx`.

### `theme-provider.tsx`

- **`ThemeProvider`** — wrapper dla next-themes (dark/light/system). Props: `children`.

### `motion-provider.tsx`

- **`MotionProvider`** — wrapper dla Framer Motion z `LazyMotion` + `domAnimation` (lazy loading funkcji animacji). Props: `children`.

### `error-boundary.tsx`

- **`ErrorBoundary`** — klasyczny React Error Boundary. Props: `children`, `fallback?`, `onError?`.

---

## src/components/ui/primitives — prymitywy UI

Komponenty oparte na Radix UI + CVA. Wszystkie używają `cn()` z `src/lib/utils.ts`.

### Layout / kontenery

| Komponent                                                                               | 'use client' | Opis                                                            | Kluczowe propsy                |
| --------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------- | ------------------------------ |
| `Card`                                                                                  | nie          | Karta z wariantami `default`/`glass`, rozmiarami `default`/`sm` | `variant`, `size`, `className` |
| `CardHeader`, `CardFooter`, `CardTitle`, `CardDescription`, `CardContent`, `CardAction` | nie          | Sub-komponenty karty                                            | `className`, `as` (CardTitle)  |
| `AspectRatio`                                                                           | tak          | Stałe proporcje (Radix)                                         | `ratio` (np. `16/9`)           |
| `Separator`                                                                             | tak          | Linia pozioma/pionowa (Radix)                                   | `orientation`, `decorative`    |
| `Skeleton`                                                                              | nie          | Placeholder z animacją pulsowania                               | `className`                    |

### Formularze

| Komponent                                                                                                                               | 'use client' | Opis                      | Kluczowe propsy                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                                                                                                | nie          | Przycisk z CVA wariantami | `variant` (default/outline/secondary/ghost/destructive/link), `size` (default/xs/sm/lg/icon/icon-xs/icon-sm/icon-lg), `asChild` |
| `Input`                                                                                                                                 | nie          | Pole input                | `type`, `className` + standardowe input props                                                                                   |
| `Textarea`                                                                                                                              | nie          | Pole textarea             | `className` + standardowe textarea props                                                                                        |
| `Label`                                                                                                                                 | tak          | Etykieta (Radix)          | `htmlFor`, `className`                                                                                                          |
| `Field`                                                                                                                                 | tak          | Grupa pól z orientacją    | `orientation` (vertical/horizontal/responsive)                                                                                  |
| `FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldLegend`, `FieldSeparator`, `FieldSet`, `FieldContent`, `FieldTitle` | tak          | Sub-komponenty formularzy | `className`, `errors` (FieldError)                                                                                              |
| `Select` + sub-komponenty                                                                                                               | tak          | Dropdown select (Radix)   | `size`, `position`, `align`                                                                                                     |

### Wyświetlanie

| Komponent                                                                                   | 'use client' | Opis                                | Kluczowe propsy                                                         |
| ------------------------------------------------------------------------------------------- | ------------ | ----------------------------------- | ----------------------------------------------------------------------- |
| `Badge`                                                                                     | nie          | Etykieta/status z CVA wariantami    | `variant` (default/secondary/destructive/outline/ghost/link), `asChild` |
| `Avatar`, `AvatarImage`, `AvatarFallback`, `AvatarGroup`, `AvatarGroupCount`, `AvatarBadge` | tak          | Awatary (Radix) z rozmiarami        | `size` (default/sm/lg), `src`, `alt`                                    |
| `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`                        | tak          | Akordeon (Radix)                    | `type`, `value`, `disabled`                                             |
| `NavigationMenu` + sub-komponenty                                                           | nie          | Menu nawigacyjne z dropdown (Radix) | `viewport`, `className`                                                 |

**Eksportowane warianty CVA:** `buttonVariants`, `badgeVariants`, `fieldVariants`, `navigationMenuTriggerStyle`

---

## src/components/ui/composites — komponenty złożone

Wszystkie `'use client'` chyba że oznaczone.

### `ArticleHeader.tsx`

- Nagłówek artykułu z okładką 16:9, tytułem, opisem, linkiem powrotnym.
- Props: `cover`, `coverAlt`, `tinaFieldCover`, `backHref`, `backLabel`, `locale`, `title`, `tinaFieldTitle`, `description`, `tinaFieldDescription`, `children`

### `AuthorCard.tsx`

- Karta autora z avatarem, nazwą, rolą, biografią, linkiem. Automatycznie generuje inicjały.
- Props: `author` (Author), `tinaField`, `className`, `locale`

### `ContactCta.tsx`

- Sekcja CTA zachęcająca do kontaktu (lokalizowany tytuł + opis + przycisk).
- Props: `locale`, `className`

### `MarkdownBody.tsx`

- Renderuje treść Markdown z TinaCMS (rich-text). Obsługuje obrazy, linki, nagłówki. Przesunięcie poziomów nagłówków.
- Props: `content`, `tinaField`, `components?`, `className`, `shiftHeadings?`

### `ShareCard.tsx`

- Karta udostępniania (X, LinkedIn, Facebook, kopiowanie linku). Automatycznie pobiera URL.
- Props: `title`, `locale`, `className`

### `article-meta.tsx`

- Metadane artykułu: data + tagi jako badge'y. Formatuje datę zgodnie z locale.
- Props: `date`, `tags`, `locale`, `tinaFieldDate?`, `tinaFieldTags?`

### `card-grid.tsx`

- Siatka kart (1/2/3 kolumny responsywnie) z animacją stagger.
- Props: `items` (ContentCardItem[]), `emptyMessage`, `imageRatio?`, `renderFooter?`, `titleAs?`

### `content-card.tsx`

- Pojedyncza karta z obrazem, tytułem, opisem, tagami, opcjonalnym CTA. Skeleton dla brakującego obrazu.
- Props: `item` (ContentCardItem), `imageRatio?`, `unoptimized?`, `footer?`, `titleAs?`
- Typy: `ContentCardItem`, `ContentCardMeta`

### `content-search.tsx`

- Pole wyszukiwania (kontrolowane).
- Props: `value`, `onChange`, `placeholder`

### `social-icon.tsx` _(server)_

- Ikona social media (GitHub, LinkedIn, X, Twitter, Instagram, Facebook, YouTube). Globe dla nieznanych.
- Props: `platform`, `className`

### `table-of-contents.tsx`

- Kompleksowy system TOC z IntersectionObserver do śledzenia aktywnego nagłówka.
- Eksporty: `TableOfContents` (desktop sticky), `MobileTocBar` (mobile rozwijane), `TocList`, `TocProvider`, `TocHeading`, `Heading2`, `Heading3`, `Heading`, `useTocId`, `useActiveHeading`
- Props TableOfContents: `toc` (TocItem[]), `title`, `className`
- Props MobileTocBar: `toc`, `title`, `className`

---

## src/components/ui/navigation — nawigacja

### `back-link.tsx` _(use client)_

- Link powrotny z ikoną strzałki w lewo.
- Props: `href` (Href), `label`, `locale`, `className`

### `breadcrumb.tsx` _(server)_

- Nawigacja breadcrumb z ChevronRight. Ostatni element nieaktywny.
- Props: `items` (BreadcrumbItem[]), `className`
- Typy: `BreadcrumbItem`, `BreadcrumbHref`

### `locale-switcher.tsx` _(use client)_

- Przełącznik języka z flagami (PL/EN). Używa Select. Obsługuje mapowanie slugów bloga.
- Props: `locale`, `blogMap` (BlogArticleMap)

### `theme-switcher.tsx` _(use client)_

- Przełącznik motywu (dark/light) z animacją Sun/Moon. View Transitions API.
- Props: `className`

---

## src/components/animations — animacje WebGL i Framer Motion

### `primitives/` — animacje Framer Motion

#### `fade-in.tsx` _(use client)_

- **`FadeIn`** — animacja fade-in z ruchem Y. Respektuje `prefers-reduced-motion`.
- Props: `children`, `delay?` (0), `duration?` (0.6), `y?` (24), `className?`

#### `stagger.tsx` _(use client)_

- **`StaggerContainer`** — kontener staggered animations. Props: `children`, `className?`, `stagger?` (0.05), `delay?` (0.1)
- **`StaggerItem`** — element stagger. Props: `children`, `className?`, `style?`, `x?`, `y?` (16), `duration?` (0.5)

### `atmosphere/` — scena WebGL (Hero)

System animowanego tła z chmurami i gwiazdami. 8 plików:

| Plik              | Typ                  | Eksport                                    | Opis                                                                                                                                                             |
| ----------------- | -------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scene.tsx`       | React _(use client)_ | `PixiScene`                                | Komponent React. Props: `theme?`, `onReady?`, `onError?`, `className?`, `style?` + HTMLAttributes. Zawiera IntersectionObserver pauzujący ticker.                |
| `engine.ts`       | Klasa TS             | `PixiSceneEngine`, `SceneTheme`            | Orchestrator: Application lifecycle, ticker, resize, mouse parallax, visibility, theme cross-fade, IntersectionObserver pause. Konstruktor: `(container, theme)` |
| `mesh.ts`         | Klasa TS             | `AtmosphereMesh`, `AtmosphereMeshOptions`  | Fullscreen quad z shaderem. Opcje: `width`, `height`, `intensity`, `colorCloud`, `starColor`, `cloudStrength`, `particleMode` (0=stars, 1=fireflies)             |
| `mouse.ts`        | Klasa TS             | `MouseController`                          | Smoothed mouse tracker z parallax. Metody: `attach()`, `detach()`, `update(dt, smoothing)`                                                                       |
| `quality.ts`      | Moduł                | `getQualityConfig()`, `QualityConfig`      | Stała konfiguracja jakości: resolution 1, shaderIntensity 0.7, maxFps 30                                                                                         |
| `glsl/noise.ts`   | Moduł                | `NOISE_GLSL`                               | GLSL noise helpers (hash + FBM)                                                                                                                                  |
| `glsl/shaders.ts` | Moduł                | `ATMOSPHERE_VERTEX`, `ATMOSPHERE_FRAGMENT` | Vertex + fragment shadery                                                                                                                                        |
| `index.ts`        | Re-export            | `PixiScene`, `SceneTheme`                  | Barrel export                                                                                                                                                    |

### `plasma/` — tło plasma (Contact)

System diagonalnego plasma beam. 6 plików:

| Plik              | Typ                  | Eksport                               | Opis                                                                      |
| ----------------- | -------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| `background.tsx`  | React _(use client)_ | `PlasmaBackground`                    | Komponent React. Props: `className?`                                      |
| `mesh.ts`         | Klasa TS             | `PlasmaMesh`, `PlasmaMeshOptions`     | Fullscreen quad z plasma shaderem. Opcje: `brandColor`, `width`, `height` |
| `quality.ts`      | Moduł                | `getPlasmaQuality()`, `PlasmaQuality` | Caps resolution i FPS dla mobile                                          |
| `glsl/noise.ts`   | Moduł                | `NOISE_GLSL`                          | 2D Simplex noise + FBM + ridged FBM                                       |
| `glsl/shaders.ts` | Moduł                | `PLASMA_VERTEX`, `PLASMA_FRAGMENT`    | Vertex + fragment shadery plasma                                          |
| `index.ts`        | Re-export            | `PlasmaBackground`                    | Barrel export                                                             |

---

## src/components/sections — sekcje stron

Wszystkie `'use client'`. Większość przyjmuje `page: PagePartsFragment` (dane z TinaCMS).

### Sekcje strony głównej

| Komponent                      | Props     | Opis                                                                                                                                         | Używa                                                                                                                    |
| ------------------------------ | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `Hero` _(memo)_                | `page`    | Sekcja hero z WebGL tłem, tytułem, CTA. PixiScene renderuje się tylko na desktop (nie touch, nie mobile, nie reduced motion, nie save-data). | `PixiScene` (dynamic), `useReducedMotion`, `useMounted`, `useScroll`, `tinaField`, `FadeIn`, `ErrorBoundary`, `Suspense` |
| `TechnologyCarousel` _(memo)_  | `locale?` | Marquee z logo technologii (2 wiersze). Pauza gdy poza viewport.                                                                             | IntersectionObserver, CSS animation                                                                                      |
| `Services` _(memo)_            | `page`    | Sekcja usług z accordion i obrazem gryfa.                                                                                                    | `Accordion`, `useThemeImage`, `tinaField`, `StaggerContainer`                                                            |
| `WhyBitspire`                  | `page`    | Sekcja "Dlaczego Bitspire" — bento grid z obrazami.                                                                                          | `Card`, `useThemeImage`, `tinaField`, `StaggerContainer`. Normalizacja URL obrazów TinaCMS.                              |
| `PortfolioHighlights` _(memo)_ | `page`    | Karuzela 3D z projektami (desktop/mobile).                                                                                                   | `Card`, `Badge`, `AspectRatio`, `tinaField`                                                                              |
| `CallToAction` _(memo)_        | `page`    | Sekcja CTA z przyciskami i obrazem gryfa.                                                                                                    | `useThemeImage`, `tinaField`, `StaggerContainer`                                                                         |

### Sekcje bloga

| Komponent            | Props                                        | Opis                                             |
| -------------------- | -------------------------------------------- | ------------------------------------------------ |
| `BlogArticleHeader`  | `blog`, `locale`, `backLabel`                | Nagłówek artykułu z okładką, tytułem, metadanymi |
| `BlogArticleBody`    | `body`, `tinaFieldBody`, `toc`, `className?` | Treść artykułu Markdown z TOC                    |
| `BlogArticleRelated` | `items`, `title`, `emptyMessage`             | Sekcja powiązanych artykułów                     |

### Sekcje portfolio

| Komponent                | Props                                                      | Opis                                                |
| ------------------------ | ---------------------------------------------------------- | --------------------------------------------------- |
| `PortfolioProjectHeader` | `project`, `backLabel`, `backHref`, `visitLabel`, `locale` | Nagłówek projektu z okładką, technologiami, linkiem |
| `PortfolioProjectBody`   | `body`, `tinaFieldBody`, `className?`                      | Treść projektu Markdown                             |

### Sekcje kontaktu

| Komponent        | Props                             | Opis                                                                 |
| ---------------- | --------------------------------- | -------------------------------------------------------------------- |
| `ContactHero`    | `page`                            | Nagłówek strony kontaktowej                                          |
| `ContactDetails` | `contact`, `locale`, `className?` | Karta z danymi kontaktowymi (email, telefon, adres, godziny, social) |
| `ContactForm`    | `contact`, `locale`, `className?` | Formularz kontaktowy (mailto:)                                       |

### Sekcje uniwersalne

| Komponent         | Props                                                                                                                                              | Opis                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `ContentListView` | `title`, `description?`, `searchValue`, `onSearchChange`, `searchPlaceholder`, `emptyMessage`, `items`, `imageRatio?`, `renderFooter?`, `titleAs?` | Uniwersalny widok listy z wyszukiwaniem i siatką kart |

---

## src/components/layout — Header i Footer

### `Header.tsx` _(use client)_

- **`Header`** — nagłówek z logo, nawigacją desktop/mobile, przełącznikiem języka i motywu.
- Props: `locale`, `blogMap`
- Podkomponenty: `DesktopNav`, `PortfolioMenuItem`, `MobileMenu`
- Używa: `useTheme`, `Link`, `LocaleSwitcher`, `ThemeSwitcher`, `useMounted`, `NavigationMenu`, `MAIN_NAV_LINKS`, `getCategoryHref`

### `Footer.tsx` _(server, memo)_

- **`Footer`** — stopka z nawigacją, danymi kontaktowymi, linkami prawnymi.
- Props: `locale`
- Używa: `Link`, `Separator`, `FadeIn`, `Button`, `SocialIcon`, `COMPANY`, `MAIN_NAV_LINKS`

---

## src/components/pages — komponenty stron

Wszystkie `'use client'`. Wszystkie używają `useTina` do integracji z TinaCMS.

| Komponent               | Props (poza query/variables/data)                     | Opis                                                        |
| ----------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| `HomePage` _(memo)_     | —                                                     | Strona główna. Renderuje wszystkie sekcje statycznie.       |
| `BlogPage`              | `locale`, `jsonLd?`, `breadcrumbs?`                   | Lista artykułów bloga z wyszukiwaniem                       |
| `BlogArticlePage`       | `related`, `locale`, `toc`, `jsonLd?`, `breadcrumbs?` | Pojedynczy artykuł bloga z TOC, autorem, share, powiązanymi |
| `PortfolioPage`         | `locale`, `jsonLd?`, `breadcrumbs?`                   | Główna strona portfolio z kartami kategorii                 |
| `PortfolioCategoryPage` | `category`, `locale`, `jsonLd?`, `breadcrumbs?`       | Lista projektów w kategorii z wyszukiwaniem                 |
| `PortfolioProjectPage`  | `locale`, `category`, `jsonLd?`, `breadcrumbs?`       | Pojedynczy projekt z nagłówkiem, treścią, CTA               |
| `ContactPage`           | `locale`, `jsonLd?`, `breadcrumbs?`                   | Strona kontaktowa z formularzem, danymi, tłem plasma        |
| `PrivacyPage`           | `locale`, `jsonLd?`, `breadcrumbs?`                   | Strona polityki prywatności z Markdown                      |

**Wspólny wzorzec props:**

```typescript
{
  query: string;        // zapytanie GraphQL TinaCMS
  variables: { relativePath: string };
  data: PageQuery | BlogQuery | ProjectQuery;
  locale: string;
  jsonLd?: object;      // structured data
  breadcrumbs?: BreadcrumbItem[];
}
```

---

## TinaCMS — content, schema, zapytania

### Konfiguracja (`tina/config.ts`)

- **Branch:** `main` (lub z env)
- **Media:** `mediaRoot: '/'`, `publicFolder: 'public'`
- **Build output:** `admin/` folder (dostępny pod `/admin`)

### Kolekcje (3)

#### `page` — strony

- **Path:** `content/pages/{locale}/`
- **Router:** `/{locale}/{slug}` (home → `/{locale}`)
- **Pola:**
  - `title` (required, isTitle)
  - `description?`
  - `lastUpdated?` (data dla stron prawnych)
  - `body?` (rich-text, isBody)
  - `services?` → `{ title?, items[]: { title, tagline, description } }`
  - `whyBitspire?` → `{ title?, description?, items[]: { title, subHeadline?, body?, fullText?, image?, imageAlt?, size? } }`
  - `portfolioHighlights?` → `{ title?, description?, items[]: { project: reference } }` (max 3)
  - `callToAction?` → `{ title?, description?, primaryLabel?, primaryHref?, secondaryLabel?, secondaryHref?, showImage? }`
  - `contact?` → `{ email?, phone?, address?, hours?, socials[]: { platform, url } }`

#### `blog` — artykuły

- **Path:** `content/blog/{locale}/`
- **Format:** `.md`
- **Router:** `/{locale}/blog/{slug}`
- **Pola:**
  - `title` (required, isTitle)
  - `canonical?` (unikalny ID dla wersji językowych)
  - `description?`, `cover?` (image), `tags?` (string[]), `date?`
  - `author?` → `{ name, role?, avatar?, bio?, link? }`
  - `body?` (rich-text, isBody)

#### `project` — projekty portfolio

- **Path:** `content/portfolio/{locale}/{category}/`
- **Format:** `.md`
- **Router:** `/{locale}/portfolio/{category}/{slug}`
- **Pola:**
  - `title` (required, isTitle)
  - `tagline?`, `description?`, `technologies?` (string[]), `websiteUrl?`, `screenshot?` (image)
  - `body?` (rich-text, isBody)

### Struktura contentu

```
content/
├── pages/{en,pl}/     — home, blog, portfolio, contact, privacy
├── blog/{en,pl}/      — artykuły (5 per locale)
└── portfolio/{en,pl}/ — websites/, software/
```

### Typy TypeScript (`tina/__generated__/types.ts`)

- **`Page`** — pełny typ strony z polami: title, description, lastUpdated, body, services, whyBitspire, portfolioHighlights, callToAction, contact
- **`Blog`** — typ artykułu: title, canonical, description, cover, tags, date, author, body
- **`Project`** — typ projektu: title, tagline, description, technologies, websiteUrl, screenshot, body
- **`PagePartsFragment`** — fragment GraphQL dla wszystkich pól strony (używany w sekcjach)
- **`BlogPartsFragment`** — fragment dla artykułu
- **`ProjectPartsFragment`** — fragment dla projektu
- Connection types: `PageConnection`, `BlogConnection`, `ProjectConnection`
- Filter types: `PageFilter`, `BlogFilter`, `ProjectFilter`

### Helpery zapytań (`src/lib/tina.ts`)

- `getPage(relativePath)` — pojedyncza strona (cache'd)
- `getPageConnection()` — wszystkie strony
- `getBlogConnection()` — wszystkie artykuły
- `getBlogPost(relativePath)` — pojedynczy artykuł (404 → null)
- `getProjectConnection()` — wszystkie projekty
- `getProject(relativePath)` — pojedynczy projekt (404 → null)
- `tinaQueryWithRetry(query, { retries, delayMs })` — wrapper z retry

### Integracja z komponentami

- **`useTina({ query, variables, data })`** — hook łączący komponent z TinaCMS (live editing)
- **`tinaField(page, fieldName)`** — generuje atrybut `data-tina-field` dla edycji inline
- Import: `import { useTina } from 'tinacms/dist/react'` i `import { tinaField } from 'tinacms/dist/react'`

---

## Image optimization

### `next.config.ts` — konfiguracja

- **Formaty:** AVIF, WebP
- **deviceSizes:** `[640, 750, 828, 1080, 1200, 1920, 2048, 3840]`
- **imageSizes:** `[16, 32, 48, 64, 96, 128, 256, 384]`
- **remotePatterns:** `assets.tina.io` (TinaCMS media)

### `src/lib/image.ts`

- **`isUnoptimizedImage(src)`** — zwraca true dla SVG i GIF. Używaj z `<Image unoptimized={isUnoptimizedImage(src)}>`.

### `src/hooks/use-theme-image.ts`

- **`useThemeImage(src, fallback)`** — przełącza ścieżki obrazów zależnie od motywu (light/dark).

### Wzorce

- Używaj `next/image` `<Image>` dla wszystkich obrazów rastrowych
- Używaj `<img>` tylko dla małych SVG (np. logo w TechnologyCarousel)
- Zawsze sprawdzaj `isUnoptimizedImage(src)` dla SVG/GIF
- Dla obrazów TinaCMS używaj `normalizeImageSrc()` w WhyBitspire (poprawia malformed URL)

---

## SEO — metadata, JSON-LD, sitemap, robots

### Metadata (`src/lib/site.ts`)

- **`siteMetadata`** — pełna konfiguracja `Metadata` Next.js (OG, Twitter, icons, robots, metadataBase)
- **`localeAlternates(pathname)`** — generuje hreflang alternatywy dla metadata
- Każda strona w `src/app/[locale]/` ma `generateMetadata` z alternatami

### JSON-LD (`src/lib/json-ld.ts`)

- `organizationJsonLd()` — Organization schema (w layout)
- `websiteJsonLd()` — WebSite schema (w layout)
- `webPageJsonLd(options)` — WebPage schema (na każdej stronie)
- `blogPostingJsonLd(options)` — BlogPosting schema (artykuły)
- `articleJsonLd(options)` — Article schema (projekty)
- `breadcrumbListJsonLd(items)` — BreadcrumbList schema
- `combineJsonLd(...things)` — łączy w `@graph`

### Sitemap (`src/app/sitemap.ts`)

- Dynamiczna sitemap.xml ze wszystkimi stronami, kategoriami, artykułami, projektami
- Alternatywy językowe dla każdej strony
- `lastModified` z daty aktualizacji contentu

### Robots (`src/app/robots.ts`)

- Blokuje `/admin` i `/api`
- Wskazuje na sitemap

### OG images

- `src/app/[locale]/opengraph-image.tsx` — dynamiczny OG image (1200x630 PNG)
- `src/app/[locale]/twitter-image.tsx` — dynamiczny Twitter image (1200x630 PNG)
- `src/lib/og-image.tsx` — `renderOgImage(options)` helper

---

## Next.js config

### `next.config.ts`

- **Plugin:** `withNextIntl(nextConfig)` z `createNextIntlPlugin('./src/i18n/request.ts')`
- **Images:** AVIF/WebP, deviceSizes, imageSizes, remotePatterns dla `assets.tina.io`
- **Headers:** cache dla fonts (1 rok), logo-carousel, flags, favicon
- **Rewrites:** `/admin` → `/admin/index.html`
- **Compiler:** usuwa `console.log` w production (z wyjątkiem error/warn)
- **Experimental:** `optimizePackageImports` dla `lucide-react`, `motion`, `radix-ui`, `next-themes`
- **productionBrowserSourceMaps:** `true`

### Build commands

- `pnpm build:local` — `tinacms build --local --skip-cloud-checks -c "next build"`
- `pnpm lint` — `eslint`
- `pnpm dev` — development

### Environment variables

- `NEXT_PUBLIC_SITE_URL` — kanoniczny URL strony (np. `https://bitspire.pl`)
- `TINA_CLIENT_ID`, `TINA_TOKEN` — TinaCMS (opcjonalne dla local mode)

---

## Konwencje i wzorce

### Tworzenie nowego komponentu

1. **'use client'** — dodaj jeśli komponent używa hooków React (useState, useEffect, useTina, etc.) lub `motion/react`
2. **memo** — używaj `memo()` dla komponentów, które re-renderują się często z tymi samymi propsami (szczególnie sekcje)
3. **cn()** — zawsze używaj `cn()` z `src/lib/utils.ts` do łączenia klas CSS
4. **tinaField** — dodaj `data-tina-field={tinaField(page, 'fieldName')}` do edytowalnych elementów
5. **useTina** — używaj w komponentach stron: `const { data } = useTina({ query, variables, data })`
6. **FadeIn** — owijaj sekcje w `<FadeIn>` dla animacji wejścia
7. **StaggerContainer/StaggerItem** — używaj dla list elementów
8. **useReducedMotion** — sprawdzaj przed animacjami
9. **useThemeImage** — używaj dla obrazów, które zależą od motywu
10. **Lokalna detekcja WebGL w Hero** — nie używaj globalnego providera; sprawdzaj `hover: none`, user agent, `saveData`, `prefers-reduced-motion` lokalnie w komponencie

### Struktura nowej sekcji

```tsx
'use client';

import { memo } from 'react';
import { useLocale } from 'next-intl';
import { tinaField } from 'tinacms/dist/react';
import type { PagePartsFragment } from '@tina/__generated__/types';
import { FadeIn } from '@/components/animations/primitives/fade-in';
import { cn } from '@/lib/utils';

interface MySectionProps {
  page: PagePartsFragment;
}

function MySectionContent({ page }: MySectionProps) {
  const locale = useLocale();
  // ...
  return (
    <section className="...">
      <FadeIn>
        <h2 data-tina-field={tinaField(page, 'title')}>{page.title}</h2>
      </FadeIn>
    </section>
  );
}

export const MySection = memo(MySectionContent);
```

### Struktura nowej strony

```tsx
// src/app/[locale]/my-page/page.tsx (server component)
import { getPage } from '@/lib/tina';
import { MyPage } from '@/components/pages/MyPage';

export async function generateMetadata({ params }) {
  /* ... */
}
export default async function Page({ params }) {
  const data = await getPage(`${params.locale}/my-page.md`);
  return (
    <MyPage query={data.query} variables={data.variables} data={data} locale={params.locale} />
  );
}
```

```tsx
// src/components/pages/MyPage.tsx (client component)
'use client';
import { useTina } from 'tinacms/dist/react';
// ...
export function MyPage({ query, variables, data, locale }) {
  const { data: tinaData } = useTina({ query, variables, data });
  // ...
}
```

### Lazy loading

- Używaj `next/dynamic` tylko dla ciężkich komponentów, które wymagają `window`/`document` przy inicjalizacji (np. `PixiScene`, `PlasmaBackground`) i mają `ssr: false`.
- Sekcje stron głównych powinny być importowane statycznie, aby uniknąć waterfall loading i kaskadowych re-renderów.

### WebGL w Hero — wzorce

```tsx
const mounted = useMounted();
const isReducedMotion = useReducedMotion();
const [canUseWebgl, setCanUseWebgl] = useState(false);

useEffect(() => {
  if (isReducedMotion) return;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const isMobile = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(navigator.userAgent);
  const saveData = navigator.connection?.saveData ?? false;
  setCanUseWebgl(!isTouch && !isMobile && !saveData);
}, [isReducedMotion]);

if (!mounted || !canUseWebgl) {
  return <StaticFallback />;
}

return <PixiScene />;
```

Nie używaj globalnych providerów do detekcji urządzenia — powodują one re-render całej aplikacji po hydracji.

### Importowanie ikon

- `lucide-react` — używaj named imports (zoptymalizowane przez `optimizePackageImports`)
- `import { ChevronLeftIcon } from 'lucide-react'`

### Animacje

- **Framer Motion:** importuj z `motion/react` (nie `framer-motion`)
- **WebGL:** używaj istniejących systemów `atmosphere/` lub `plasma/`, nie twórz nowych od zera
- **CSS animations:** używaj `globals.css` z `@keyframes`, pauzuj przez `data-paused` atrybut + IntersectionObserver
