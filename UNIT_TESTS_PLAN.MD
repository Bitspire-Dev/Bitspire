# Plan Wdrożenia Testów Jednostkowych — Bitspire

> **Cel:** Osiągnięcie ≥ 90% pokrycia testami jednostkowymi.
> **Stack testowy:** Vitest 4 · @testing-library/react 16 · jsdom · vite-tsconfig-paths

### Wymagane paczki

```bash
npm install -D vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/dom \
  @testing-library/user-event \
  @testing-library/jest-dom \
  @vitest/coverage-v8 \
  vite-tsconfig-paths
```

> [!IMPORTANT]
> `@testing-library/jest-dom` — wymagany przez `setup.ts` (custom matchers jak `.toBeInTheDocument()`).
> `@testing-library/user-event` — wymagany przez testy komponentów (sekcja 5).
> `@vitest/coverage-v8` — wymagany przez `--coverage` (bez tego vitest nie zbierze pokrycia).

---

## 1. Konfiguracja Vitest

### [NEW] `vitest.config.ts`

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/__tests__/**",
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx",
        "src/app/**/loading.tsx",
        "src/app/**/not-found.tsx",
        "src/lib/tina/client.ts",
        "src/lib/tina/queries.ts",
        "src/providers/**",
        "src/components/admin/**",
        "src/proxy.ts",
        "tina/**",
      ],
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
    },
  },
});
```

### [NEW] `src/__tests__/setup.ts`

```ts
import "@testing-library/jest-dom/vitest";
import React from "react";

// ── Globalny cleanup między testami ──────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();
});

// ── Stuby dla API niedostępnych w jsdom ─────────────────────────
vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
  cb(0);
  return 0;
});
vi.stubGlobal("cancelAnimationFrame", vi.fn());

Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(""),
  },
  writable: true,
});

// ── Mock next/navigation ────────────────────────────────────────
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/"),
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  notFound: vi.fn(),
  redirect: vi.fn(),
}));

// ── Mock next-intl ──────────────────────────────────────────────
vi.mock("next-intl", () => ({
  useLocale: vi.fn(() => "pl"),
  useTranslations: vi.fn(() => (key: string) => key),
}));

// ── Mock next/image (React.createElement, nie DOM) ──────────────
vi.mock("next/image", () => ({
  default: ({ src, alt, width, height, ...rest }: Record<string, unknown>) =>
    React.createElement("img", { src, alt, width, height, ...rest }),
}));

// ── Mock next/link ──────────────────────────────────────────────
vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: Record<string, unknown>) =>
    React.createElement("a", { href, ...rest }, children as React.ReactNode),
}));

// ── Mock framer-motion (forwardRef, poprawne React elementy) ────
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  const tags = ["div", "span", "section", "ul", "li", "button", "a", "p",
    "h1", "h2", "h3", "h4", "nav", "footer", "header", "article", "aside",
    "main", "form", "img", "svg", "path"];
  const motion = Object.fromEntries(
    tags.map((tag) => [
      tag,
      React.forwardRef(
        ({ children, ...props }: Record<string, unknown>, ref: unknown) =>
          React.createElement(tag, { ...props, ref }, children as React.ReactNode)
      ),
    ])
  );
  return {
    ...actual,
    motion,
    AnimatePresence: ({ children }: { children: unknown }) => children,
  };
});
```

### [MODIFY] `package.json` — dodać skrypty

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

### [MODIFY] `tsconfig.json` — dodać typy

W sekcji `compilerOptions` dodaj:

```json
"types": ["vitest/globals", "@testing-library/jest-dom"]
```

To zapewni poprawne typy dla globalnych `describe`, `it`, `expect`, `vi` oraz matcherów `.toBeInTheDocument()` itp.

---

## 2. Co NIE jest testowane (wyłączenia)

| Plik / Katalog | Powód |
|---|---|
| `src/lib/tina/client.ts` | Inicjalizacja klienta CMS — zewnętrzna zależność |
| `src/lib/tina/queries.ts` | Operacje async na CMS API — testy integracyjne |
| `src/proxy.ts` | Middleware Next.js — wymaga infrastruktury request/response |
| `src/providers/**` | Thin wrappers nad TinaCMS provider — brak logiki |
| `src/components/admin/**` | Admin-only component — brak logiki |
| `src/app/**/page.tsx, layout.tsx` | Server Components / routing Next.js |
| `tina/**` | Konfiguracja CMS |

---

## 3. Plan Testów — pliki w kolejności priorytetowej

Konwencja: pliki testowe obok testowanych modułów, np.:
- `src/lib/ui/helpers.ts` → `src/lib/ui/__tests__/helpers.test.ts`
- `src/hooks/useSearch.ts` → `src/hooks/__tests__/useSearch.test.ts`
- `src/components/ui/primitives/Button.tsx` → `src/components/ui/primitives/__tests__/Button.test.tsx`

---

### PRIORYTET 1 — Funkcje czyste (najwyższy ROI)

#### 3.1 `src/lib/ui/__tests__/helpers.test.ts`

Testowany plik: [helpers.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/ui/helpers.ts)

| Funkcja | Test cases |
|---|---|
| `formatDate(date, locale)` | `null/undefined` → `undefined`; data PL (`"2024-01-15"`, `"pl"`) → `"15 stycznia 2024"`; data EN → `"January 15, 2024"`; nieprawidłowa data → zwraca input; brak locale → domyślny `pl-PL` |
| `toSlug(value)` | Polskie znaki (`"Cześć Świat"` → `"czesc-swiat"`); spacje i znaki specjalne; pusty string; wielkie litery; wiodące/końcowe myślniki |
| `safeLink(href)` | `null/undefined/"  "` → `undefined`; ścieżka bezwzględna (`"/foo"`) → pass-through; hash → pass-through; pełny URL → pass-through; domena bez protokołu (`"google.com"` → `"https://google.com"`); brak dopasowania → `undefined` |
| `safeImageSrc(src)` | `null/undefined` → `undefined`; URL → pass-through; `/path` → pass-through; `data:` → pass-through; relatywna ścieżka → dodaje `/` |
| `extractTags(items)` | Pusta tablica; items bez tagów; items z `null` tagami; deduplikacja i sortowanie |
| `filterByQueryAndTags(items, query, tags)` | Filtrowanie po tytule; filtrowanie po opisie/excerpt; filtrowanie po tagach; kombinacja query + tagi; case-insensitive; puste filtry → wszystkie items |

#### 3.2 `src/lib/ui/__tests__/classNames.test.ts`

Testowany plik: [classNames.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/ui/classNames.ts)

| Funkcja | Test cases |
|---|---|
| `cn(...values)` | Stringi: `cn("a", "b")` → `"a b"`; false/null/undefined → pominięte; number → string; obiekt warunkowy `{ active: true, disabled: false }` → `"active"`; zagnieżdżone tablice; mieszane typy; brak argumentów → `""` |

#### 3.3 `src/lib/ui/__tests__/blogCopy.test.ts`

Testowany plik: [blogCopy.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/ui/blogCopy.ts)

| Funkcja | Test cases |
|---|---|
| `getBlogUiCopy(locale)` | `"pl"` → zwraca polski obiekt z kluczami `noArticles, readMore, ...`; `"en"` → zwraca angielski; nieznany locale → fallback do `"pl"`; sprawdzenie struktury (nested `shareButtons`, `authorBox`) |

#### 3.4 `src/lib/__tests__/cookies.test.ts`

Testowany plik: [cookies.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/cookies.ts)

> **Wymaga:** mock `cookies-next` (`getCookie`, `setCookie`, `deleteCookie`)

| Funkcja | Test cases |
|---|---|
| `parseConsent(value)` | `null/undefined` → `null`; poprawny JSON (encodeURIComponent) → obiekt z defaults; nieprawidłowy JSON → `null`; partial JSON → merge z `defaultConsent` |
| `serializeConsent(state)` | Roundtrip: `parseConsent(serializeConsent(state))` === state; wynik jest URI-encoded |
| `defaultConsent` | `necessary: true`, reszta `false` |
| `setCookie(name, value, days)` | Wywołuje `setCNext` z odpowiednimi opcjami (path, maxAge, sameSite) |
| `getCookie(name)` | Zwraca string; `undefined` gdy brak |
| `removeCookie(name)` | Wywołuje `delCNext` |
| `loadConsent()` | Z ciasteczka; fallback do localStorage; `null` gdy brak |
| `saveConsent(state)` | Dodaje timestamp ISO; zapisuje do cookie + localStorage |
| `hasAnyConsent()` | `true` gdy jest consent, `false` gdy brak |
| `updateConsent(partial)` | Merge z istniejącym; tworzy nowy gdy brak istniejącego |

#### 3.5 `src/i18n/__tests__/locales.test.ts`

Testowany plik: [locales.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/i18n/locales.ts)

| Funkcja | Test cases |
|---|---|
| `isLocale(value)` | `"pl"` → `true`; `"en"` → `true`; `"de"` → `false`; `null` → `false`; `123` → `false` |
| `normalizeLocale(value)` | `"en"` → `"en"`; `undefined/null/"fr"` → `"pl"` (DEFAULT_LOCALE) |
| consts | `locales` zawiera `["pl","en"]`; `OG_LOCALES`, `LOCALE_LABELS`, `DATE_LOCALES` mają klucze obu locali |

#### 3.6 `src/i18n/__tests__/translations.test.ts`

Testowany plik: [translations.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/i18n/translations.ts)

| Funkcja | Test cases |
|---|---|
| `getTranslations(locale)` | `"pl"` → zawiera `cookieBanner.heading`; `"en"` → angielska wersja; nieznany → fallback do PL; sprawdź, że oba locale mają te same klucze (symmetria) |

#### 3.7 `src/i18n/__tests__/routing.test.ts`

Testowany plik: [routing.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/i18n/routing.ts)

> **Wymaga:** mock `next-intl/routing` i `next-intl/navigation`

| Funkcja | Test cases |
|---|---|
| `normalizePathname(pathname)` | `""` → `"/"`; `"foo"` → `"/foo"`; `"/foo/"` → `"/foo"`; `"/"` → `"/"` |
| `resolveLocalizedPathname(pathname, locale)` | `"/polityka-prywatnosci"` + `"en"` → `"/privacy-policy"`; `"/privacy-policy"` + `"pl"` → `"/polityka-prywatnosci"`; `/portfolio` → same for both; nieznana ścieżka → pass-through |
| `resolvePathnameKey(pathname, locale)` | Znalezienie klucza dla `/regulamin` → `"/regulamin"`; `/terms` + `"en"` → `"/regulamin"`; nieznana → `null` |
| `getMdxFileName(pageType, locale)` | `"privacy"` + `"pl"` → `"polityka-prywatnosci.mdx"`; `"privacy"` + `"en"` → `"privacy-policy.mdx"` |

---

### PRIORYTET 2 — Logika CMS (adapters, mappers, schemas)

#### 3.8 `src/lib/tina/__tests__/body.test.ts`

Testowany plik: [body.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/tina/body.ts)

| Funkcja | Test cases |
|---|---|
| `extractBody(data)` | `null/undefined` → `null`; `{ body: {...} }` → obiekt; `{ _body: [...] }` → tablica; `{ body: "string" }` → `null`; `{ body: [...], _body: {...} }` → priorytet `body` |
| `hasBodyContent(body)` | `null` → `false`; pusty array → `false`; obiekt → `true`; array z elementami → `true` |

#### 3.9 `src/lib/tina/__tests__/schemas.test.ts`

Testowany plik: [schemas.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/tina/schemas.ts)

| Element | Test cases |
|---|---|
| `cmsPageSchema` | Poprawne dane → success; brak pól → success (passthrough); dodatkowe pola → success (passthrough) |
| `cmsBlogPostSchema` | Poprawne dane z wszystkimi polami; minimalne dane; `null` pola |
| `cmsPortfolioSchema` | Poprawne dane; minimalne dane |
| `validateCmsData(schema, data, label)` | Poprawne dane → zwraca parsed; niepoprawne dane w dev → console.error + return raw; niepoprawne dane w prod → console.warn + return raw |

#### 3.10 `src/lib/tina/__tests__/mappers.test.ts`

Testowany plik: [mappers.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/tina/mappers.ts)

| Funkcja | Test cases |
|---|---|
| `normalizePost(raw, options)` | Wygenerowany `slug` z `_sys.filename`; usunięcie `.mdx`; sformatowana data; domyślne `relatedPosts = []`; domyślny locale |
| `normalizeProject(raw, options)` | Slug z filename; przekazanie `year`; locale |
| `getRelatedPosts(current, allPosts, limit)` | Posty z tej samej kategorii najpierw; wykluczenie bieżącego; limit domyślny 3; brak kategorii → z ogólnych; za mało w kategorii → dopełnienie innymi |

#### 3.11 `src/lib/tina/__tests__/params.test.ts`

Testowany plik: [params.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/tina/params.ts)

> **Wymaga:** mock `queries.ts` (`fetchAllBlogNodes`, `fetchAllPortfolioNodes`)

| Funkcja | Test cases |
|---|---|
| `getLegalSlugs("pl")` | Zwraca 3 elementy z `LEGAL_PAGES_PL` |
| `getLegalSlugs("en")` | Zwraca 3 elementy z `LEGAL_PAGES_EN` |
| `getHomeParam(locale)` | `{ locale }` |
| `mapPathForPagesCollection(locale, slug)` | `"pl"`, `"home"` → `"pl/home.mdx"` |
| `getAllBlogSlugs(locale)` | Z mockiem → filtruje po prefix locale |
| `getAllPortfolioSlugs(locale)` | Z mockiem → filtruje po prefix locale |

#### 3.12 `src/lib/tina/__tests__/adapters.test.ts`

Testowany plik: [adapters.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/tina/adapters.ts)

> **Wymaga:** mock `validateCmsData` (lub pozwolić na passthrough)

| Funkcja | Test cases |
|---|---|
| `normalizeBody(value)` | `null` → `{ body: undefined, _body: undefined }`; z body obiektem; z body tablicą |
| `mapPageWithBody(raw, extra)` | Dodaje body/_body do raw; merge z extra; zachowuje `_content_source` |
| `mapHomePageData(raw, locale)` | Dodaje locale |
| `mapBlogListItem(raw, locale)` | Poprawne pola output; normalizacja image (URL Tina); fallback slug z `_sys.filename` |
| `mapBlogList(items, locale)` | Mapuje array |
| `mapBlogPostData(raw, options)` | Z relatedPosts; body/\_body; wszystkie pola; slug |
| `mapPortfolioProject(raw, locale)` | Normalizacja projektu |
| `mapPortfolioProjects(projects, locale)` | Mapuje array |
| `mapPortfolioItemData(raw, locale)` | Body + locale |

---

### PRIORYTET 3 — Routing i SEO

#### 3.13 `src/lib/seo/__tests__/metadata.test.ts`

Testowany plik: [metadata.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/seo/metadata.ts)

> **Wymaga:** mock `resolveLocalizedPathname`

| Funkcja | Test cases |
|---|---|
| `normalizeLocale(locale)` | `"en"` → `"en"`; `undefined` → `"pl"` |
| `urlLocalePrefix(locale)` | `"pl"` → `"/pl"`; `"en"` → `"/en"` |
| `buildLocalePath(locale, path)` | Root path; non-root; z/bez wiodącego `/` |
| `absoluteUrl(path)` | Relatywna → z `BASE_URL`; absoluta → pass-through |
| `buildAlternates(locale, paths)` | Canonical URL; languages klucze `pl`, `en` |
| `buildMetadata({...})` | Pełne dane → poprawny obiekt Metadata; brak title → fallback `"Bitspire"`; z image → openGraph.images + twitter; bez image → brak images; ogType article |

#### 3.14 `src/lib/routing/__tests__/adminLink.test.ts`

Testowany plik: [adminLink.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/lib/routing/adminLink.ts)

> **Wymaga:** mock `resolveLocalizedPathname`, `buildLocalePath`

| Funkcja | Test cases |
|---|---|
| `isAdminPath(pathname)` | `"/admin/foo"` → `true`; `"/foo"` → `false`; `null/undefined` → `false` |
| `buildAdminLink(href, context)` mode: **production** | `/portfolio` → buduje locale path; `/` → root; z locale w href → stripuje |
| `buildAdminLink(href, context)` mode: **admin** | `/portfolio` → `/admin/{locale}/portfolio`; `/` → `/admin/{locale}` |
| `buildAdminLink(href, context)` mode: **preview** | Różne ścieżki → `/admin/index.html#/~/admin/{locale}/{path}`; home | portfolio | blog |
| `buildAdminLink(href, context)` — external URL | `"https://example.com"` → pass-through |

---

### PRIORYTET 4 — React Hooks (renderHook)

#### 3.15 `src/hooks/__tests__/useSearch.test.ts`

Testowany plik: [useSearch.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/hooks/useSearch.ts)

```ts
import { renderHook, act } from "@testing-library/react";
```

| Scenariusz | Test |
|---|---|
| Wartości domyślne | `searchQuery = ""`, `selectedTags = []`, `hasActiveFilters = false` |
| `handleSearchChange` | Ustawia query; `hasActiveFilters = true` |
| `handleTagToggle` | Dodaje tag; ponownie → usuwa tag (toggle) |
| `handleClearSearch` | Czyści query |
| `handleClearFilters` | Czyści query + tagi |
| `handleClearTag` | Usuwa konkretny tag |
| `toggleShowAllTags` | Toggle boolean |
| `getDisplayedTags` | Ogranicza do `maxVisibleTags`; `showAllTags = true` → wszystkie |
| `getRemainingTagsCount` | Oblicza poprawnie |
| `shouldShowMoreButton` | `true` gdy > max |
| `filterItems` | Filtruje po tytule, tagach; case-insensitive; puste filtry → all |
| Opcje inicjalne | `initialQuery`, `initialTags`, `maxVisibleTags` |

#### 3.16 `src/hooks/__tests__/useContactForm.test.ts`

Testowany plik: [useContactForm.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/hooks/useContactForm.ts)

> **Wymaga:** `global.fetch` mock

| Scenariusz | Test |
|---|---|
| Stan początkowy | Puste pola, `loading = false`, `success = false`, `error = ""` |
| `handleChange` | Aktualizuje odpowiednie pole formData |
| Walidacja — brak name | `error` ustawiony; form nie wysłany |
| Walidacja — brak email | `error` ustawiony |
| Walidacja — nieprawidłowy email | `error` ustawiony |
| Walidacja — brak message | `error` ustawiony |
| Sukces submit | `fetch` called; `success = true`; form zresetowany; `onSuccess` callback |
| Błąd serwera | `response.ok = false`; `error` ustawiony; `onError` callback |
| Wyjątek fetch | `error` z wiadomością wyjątku |
| `resetForm` | Czyści wszystko |

#### 3.17 `src/hooks/__tests__/useModal.test.ts`

Testowany plik: [useModal.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/hooks/useModal.ts)

| Scenariusz | Test |
|---|---|
| `isOpen = false` | `visible = false` |
| `isOpen = true` | `visible = true`, `entering` initially true → false (po rAF) |
| `isOpen` false → true → false | Animation states: `closing = true` → po 250ms `visible = false` |
| Escape key | Wywołuje `onClose` |
| Tab trap | Focus wraps z last → first i odwrotnie |
| `handleClose` | Ustawia `closing`, po 250ms wywołuje `onClose` |
| `overlayClass`, `contentClass` | Poprawne klasy CSS na podstawie `entering/closing` |

#### 3.18 `src/hooks/__tests__/useCookies.test.ts`

Testowany plik: [useCookies.tsx](file:///c:/Users/kubap/Desktop/Bitspire/src/hooks/useCookies.tsx)

> **Wymaga:** mock `@/lib/cookies`

| Scenariusz | Test |
|---|---|
| Inicjalizacja | `consent = null`, `ready = false` → po mount `ready = true` |
| `loadConsent` zwraca dane | `consent` ustawiony |
| `grantAll` | Wszystkie kategorie `true`; `saveConsent` called |
| `rejectAll` | Tylko `necessary: true` |
| `setCategories` | Ustawia wybrane; nie zmienia `necessary` |
| `hasConsent("necessary")` | Zawsze `true` |
| `hasConsent("analytics")` | Zależy od consent state |

#### 3.19 `src/hooks/__tests__/useAdminLink.test.ts`

Testowany plik: [useAdminLink.ts](file:///c:/Users/kubap/Desktop/Bitspire/src/hooks/useAdminLink.ts)

> **Wymaga:** mock `next/navigation`, `next-intl`, `@/lib/routing/adminLink`

| Scenariusz | Test |
|---|---|
| Tryb produkcyjny | `isAdmin = false`; `getLink("/portfolio")` → production path |
| Tryb admin | pathname `/admin/...` → `isAdmin = true`; `getLink` → admin path |

---

### PRIORYTET 5 — Komponenty UI (Testing Library)

> Mocki: `next/image`, `next/link`, `framer-motion`, `next-intl` (w setup.ts).
> Testujemy: renderowanie, props, interakcje user events, conditional rendering.

#### 3.20 `src/components/ui/primitives/__tests__/Button.test.tsx`

| Test | Opis |
|---|---|
| Renderuje z tekstem | `children` widoczny |
| Warianty | Klasa CSS zmienia się z `variant` prop |
| onClick | Handler wywoływany |
| disabled | Przycisk niedostępny |
| as link | Renderuje `<a>` gdy `href` |

#### 3.21 `src/components/ui/primitives/__tests__/Badge.test.tsx`

| Test | Opis |
|---|---|
| Renderuje tekst | Widoczny badge |
| Warianty | Styled accordingly |

#### 3.22 `src/components/ui/primitives/__tests__/Card.test.tsx`

| Test | Opis |
|---|---|
| Renderuje children | Content visible |
| Props | className, onClick |

#### 3.23 `src/components/ui/primitives/__tests__/Input.test.tsx`

| Test | Opis |
|---|---|
| Renderuje | Input widoczny |
| onChange | Wywołuje handler |
| placeholder | Wyświetla |
| type | Ustawia typ |

#### 3.24 `src/components/ui/primitives/__tests__/Heading.test.tsx`, `Text.test.tsx`

| Test | Opis |
|---|---|
| Poprawny tag HTML | h1-h6 na podstawie `level` |
| Renderuje tekst | children |

#### 3.25 `src/components/ui/composites/__tests__/TagsList.test.tsx`

| Test | Opis |
|---|---|
| Renderuje tagi | Lista tagów widoczna |
| Klik na tag | Wywołuje callback |
| Aktywny tag | Oznaczenie CSS |

#### 3.26 `src/components/ui/composites/__tests__/MetaBadge.test.tsx`

| Test | Opis |
|---|---|
| Renderuje | Treść widoczna |

#### 3.27 `src/components/ui/composites/__tests__/SearchBar.test.tsx`

| Test | Opis |
|---|---|
| Renderuje input | Pole wyszukiwania |
| Wpisywanie tekstu | onChange called |
| Przycisk wyczyść | Widoczny po wpisaniu tekstu |

#### 3.28 `src/components/ui/cookie-consent/__tests__/CookieBanner.test.tsx`

> **Wymaga:** mock `useCookieConsent`

| Test | Opis |
|---|---|
| Renderuje banner | Gdy brak consent |
| "Akceptuj wszystkie" | Wywołuje `grantAll` |
| "Odrzuć" | Wywołuje `rejectAll` |
| Ukrywa banner | Gdy consent istnieje |

#### 3.29 `src/components/ui/cookie-consent/__tests__/CookieSettingsModal.test.tsx`

| Test | Opis |
|---|---|
| Renderuje modal | Gdy otwarty |
| Toggle kategorii | Checkbox analytics |
| "Akceptuj wszystkie" / "Odrzuć wszystkie" | Wywołują odpowiednie handlery |

#### 3.30 `src/components/sections/blog/__tests__/BlogCard.test.tsx`

| Test | Opis |
|---|---|
| Renderuje tytuł, date | Z danych |
| Image | Gdy podany |
| Brak image | Bez image |
| Link | Do wpisu |

#### 3.31 `src/components/sections/blog/__tests__/AuthorBox.test.tsx`

| Test | Opis |
|---|---|
| Renderuje autora | Tekst widoczny |

#### 3.32 `src/components/sections/blog/__tests__/ShareButtons.test.tsx`

| Test | Opis |
|---|---|
| Renderuje przyciski | Twitter, LinkedIn, Facebook, Copy |
| Klik kopiuj link | Wywołuje clipboard API |

#### 3.33 `src/components/layout/__tests__/BackLink.test.tsx`

| Test | Opis |
|---|---|
| Renderuje link | Z tekstem i href |

#### 3.34 `src/components/ui/buttons/__tests__/LanguageSwitcher.test.tsx`

| Test | Opis |
|---|---|
| Renderuje | Przycisk widoczny |
| Klik | Przełącza locale |

---

## 4. Strategia Mockowania

| Zależność | Sposób mockowania |
|---|---|
| `next/navigation` | `vi.mock` w `setup.ts` — `usePathname`, `useRouter`, `notFound`, `redirect` |
| `next-intl` | `vi.mock` — `useLocale`, `useTranslations` |
| `next/image` | `vi.mock` → prosty `<img>` |
| `next/link` | `vi.mock` → prosty `<a>` |
| `framer-motion` | `vi.mock` → passthrough HTML elements |
| `cookies-next` | `vi.mock` per-test w plikach cookies |
| `@/lib/tina/client` | `vi.mock` → pusty klient |
| `@/lib/tina/queries` | `vi.mock` per-test |
| `global.fetch` | `vi.fn()` w testach `useContactForm` |
| `window.localStorage` | Dostępny w jsdom; `vi.spyOn` jeśli potrzebne |
| `navigator.clipboard` | Globalny stub w `setup.ts` — jsdom nie ma Clipboard API |
| `requestAnimationFrame` | Globalny stub w `setup.ts` — synchroniczny callback (useModal) |
| `vi.clearAllMocks()` | Globalnie w `beforeEach` w `setup.ts` — zapobiega wyciekowi stanu |

---

## 5. Wskazówki Implementacyjne

1. **Każdy plik testowy** ma strukturę:
   ```ts
   import { describe, it, expect, vi, beforeEach } from "vitest";
   // imports...

   describe("nazwaModułu", () => {
     describe("nazwaFunkcji", () => {
       it("powinien ...", () => { ... });
     });
   });
   ```

2. **Hook tests** używają `renderHook` z `@testing-library/react`:
   ```ts
   const { result } = renderHook(() => useSearch());
   act(() => { result.current.handleSearchChange("query"); });
   expect(result.current.searchQuery).toBe("query");
   ```

3. **Component tests** używają `render` + `screen` + `userEvent`:
   ```ts
   import { render, screen } from "@testing-library/react";
   import userEvent from "@testing-library/user-event";
   ```

4. **Nie testuj** implementacji (np. ile razy `useState` jest wywołany), testuj **zachowanie** (output dla danego input).

5. **`vi.useFakeTimers()`** dla testów `useModal` (setTimeout 250ms). `requestAnimationFrame` jest już stubowany synchronicznie w `setup.ts`.

6. **Snapshot testy** NIE są zalecane — zbyt kruche. Testuj specifyczne elementy DOM.

7. **`beforeEach(() => vi.clearAllMocks())`** jest ustawiony globalnie w `setup.ts` — nie trzeba go powtarzać w plikach testowych.

---

## 6. Kolejność Wdrażania

```
Faza 1: Konfiguracja (vitest.config.ts, setup.ts, package.json)
Faza 2: Testy lib/ui (helpers, classNames, blogCopy)               ← ~60 test cases
Faza 3: Testy lib/cookies                                           ← ~25 test cases
Faza 4: Testy i18n (locales, translations, routing)                  ← ~35 test cases
Faza 5: Testy lib/tina (body, schemas, mappers, params, adapters)    ← ~50 test cases
Faza 6: Testy lib/seo + lib/routing (metadata, adminLink)           ← ~30 test cases
Faza 7: Testy hooks (useSearch, useContactForm, useModal, useCookies, useAdminLink) ← ~45 test cases
Faza 8: Testy komponentów UI (primitives, composites, cookie-consent) ← ~30 test cases
Faza 9: Testy komponentów sekcji (blog, layout)                      ← ~20 test cases

RAZEM: ~295 test cases
```

---

## 7. Weryfikacja Pokrycia

```bash
npx vitest run --coverage
```

Raport HTML w `./coverage/index.html`. Cel: **≥ 90% lines/functions/statements, ≥ 85% branches**.

Pliki wyłączone z pokrycia (sekcja `exclude` w `vitest.config.ts`) nie wpływają na metrykę.
