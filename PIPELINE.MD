# PIPELINE — Bitspire (od A do Z)

Ten dokument opisuje **pełny pipeline projektu**: od tworzenia treści (MDX + TinaCMS), przez development i build, po deploy oraz runtime (obsługa requestów, i18n, SEO, preview admin).

## 0) TL;DR (jeden ekran)

- **Źródło prawdy dla treści:** `content/**` (MDX + frontmatter).
- **CMS/Preview:** TinaCMS; panel jest budowany do `public/admin` i działa jako SPA (`/admin/index.html#/...`).
- **Frontend:** Next.js App Router (`src/app/**`).
- **i18n:** `next-intl` + middleware (wymuszony prefix `/pl` i `/en`).
- **Dane:** warstwa zapytań Tina → adaptery/normalizacja → wrappery stron → sekcje UI.
- **Deploy:** Vercel (default: `npm install` → `npm run build`).

---

## 1) Elementy pipeline’u (co z czym się łączy)

### 1.1. Treść (MDX)

- Pliki treści: [content/](content/) (np. blog, portfolio, pages w PL/EN).
- Format: YAML frontmatter (metadane/pola) + body (rich-text/MDX).

### 1.2. TinaCMS (schema → generated client → preview)

- Konfiguracja Tina: [tina/config.ts](tina/config.ts).
- Schematy kolekcji: [tina/schemas/](tina/schemas/).
  - Pages: [tina/schemas/pages.ts](tina/schemas/pages.ts)
  - Blog: [tina/schemas/blog.ts](tina/schemas/blog.ts)
  - Portfolio: [tina/schemas/portfolio.ts](tina/schemas/portfolio.ts)
- Generated klient/typy: [tina/__generated__/](tina/__generated__/)
- Ustalanie URL preview z poziomu CMS (router per dokument): patrz `ui.router` w schematach.

### 1.3. Next.js (routing + render)

- App Router: [src/app/](src/app/)
- Konfiguracja Next: [next.config.ts](next.config.ts)
- Starter produkcyjny (Node HTTP server): [app.js](app.js)

### 1.4. i18n (next-intl)

- Konfiguracja requestów: [src/i18n/request.ts](src/i18n/request.ts)
- Nawigacja + mapowania: [src/i18n/routing.ts](src/i18n/routing.ts)
- Middleware (realnie wykonywany): [src/proxy.ts](src/proxy.ts)
- Entry middleware: [middleware.ts](middleware.ts)

### 1.5. SEO (metadata + sitemap)

- Helpery metadata: [src/lib/seo/metadata.ts](src/lib/seo/metadata.ts)
- Sitemap (dynamiczny): [src/app/sitemap.ts](src/app/sitemap.ts)
- Robots: [public/robots.txt](public/robots.txt)

---

## 2) Pipeline: authoring treści → Git → Tina → UI

### 2.1. Krok 1 — autor tworzy/edytuje treść

1) Autor edytuje pliki MDX w [content/](content/) **albo** przez TinaCMS (panel admin).
2) Wymóg spójności: pliki istnieją w obu językach (PL/EN).

W praktyce strukturę i checklistę spójności opisuje [DATAFLOW.MD](DATAFLOW.MD).

### 2.2. Krok 2 — Tina mapuje treść do schematu

- Tina czyta MDX z `content/**` i waliduje/udostępnia pola wg schematów w [tina/schemas/](tina/schemas/).
- `format: "mdx"` w kolekcjach mówi Tinie, że pliki mają body + frontmatter.

### 2.3. Krok 3 — UI pobiera dane i renderuje

Warstwa danych:
- Zapytania: [src/lib/tina/queries.ts](src/lib/tina/queries.ts)
- Static params / slugi: [src/lib/tina/params.ts](src/lib/tina/params.ts)
- Mapowanie i normalizacja + zachowanie `_content_source` (ważne dla preview): [src/lib/tina/adapters.ts](src/lib/tina/adapters.ts)

Render:
- Strony App Router (Server Components) pobierają dane i podają je do wrapperów stron.
- Wrappery stron renderują sekcje i rich-text.

Rich-text / code blocks:
- Presety rich-text (w tym podświetlanie kodu) są w [tina/richTextPresets.tsx](tina/richTextPresets.tsx).

---

## 3) Pipeline DEV (lokalnie)

### 3.1. `npm run dev`

Skrypt: `tinacms dev -c "next dev"` w [package.json](package.json).

Co się dzieje:
1) Tina uruchamia tryb dev (panel/GraphQL do preview i edycji).
2) Równolegle uruchamia Next dev server.
3) Middleware (i18n) wymusza prefix języka.
4) Panel admin jest dostępny pod `/admin` (z redirectem do SPA).

Najważniejsze wejścia:
- Strona: `http://localhost:3000/pl` / `http://localhost:3000/en`
- Admin: `http://localhost:3000/admin` (middleware przekieruje na `/admin/index.html#/~/admin/pl`)

### 3.2. Lint

- `npm run lint` uruchamia ESLint (patrz [package.json](package.json)).

---

## 4) Pipeline BUILD (artefakty)

### 4.1. `npm run build`

Skrypt: `tinacms build && next build` w [package.json](package.json).

Etapy:
1) `tinacms build`
   - Buduje/aktualizuje panel admin i jego assety do `public/admin` (ustawione w [tina/config.ts](tina/config.ts)).
   - Generuje/odświeża pliki w [tina/__generated__/](tina/__generated__/), jeśli schema się zmieniła.
2) `next build`
   - Buduje aplikację Next (`.next/`).
   - Pre-renderuje strony korzystające z `generateStaticParams`.
   - Kompiluje middleware i konfigurację.

### 4.2. `npm run build:skip-cloud-checks`

Skrypt: `tinacms build --skip-cloud-checks && next build` w [package.json](package.json).

Użycie: gdy build ma działać bez walidacji/zależności od usług chmurowych Tina.

### 4.3. Artefakty builda

- Next build: `.next/` (runtime dla `next start` / custom server).
- Tina admin build: `public/admin/**`.

---

## 5) Pipeline START/PROD (runtime serwera)

### 5.1. `npm run start`

Skrypt: `tinacms build && node app.js` w [package.json](package.json).

Sens:
- Najpierw upewnia się, że panel Tina w `public/admin` jest aktualny.
- Potem uruchamia własny minimalny server HTTP, który deleguje wszystko do Next.

Implementacja servera: [app.js](app.js).

### 5.2. `npm run prod`

Skrypt: `cross-env NODE_ENV=production npm run start` w [package.json](package.json).

Użycie: uruchomienie w trybie production (wpływa m.in. na optymalizacje Next i usuwanie `console` wg [next.config.ts](next.config.ts)).

### 5.3. Zmienne środowiskowe (runtime)

- `NEXT_PUBLIC_TINA_CLIENT_ID` — Tina client id (wymagane przez [tina/config.ts](tina/config.ts)).
- `TINA_TOKEN` — token Tina (wymagane przez [tina/config.ts](tina/config.ts)).
- `PORT` — port serwera (obsługiwane w [app.js](app.js)).
- `HOSTNAME` — hostname (obsługiwane w [app.js](app.js)).
- `NODE_ENV` — `production`/`development`.

---

## 6) Pipeline DEPLOY (Vercel)

Konfiguracja: [vercel.json](vercel.json).

Vercel wykona:
1) `npm install`
2) `npm run build`
3) Uruchomi framework `nextjs` (serverless/edge zgodnie z potrzebą).

Uwaga praktyczna:
- W Vercel najczęściej nie używa się [app.js](app.js), bo Vercel odpala Next w swoim środowisku.
- [app.js](app.js) jest przydatny dla hostingów typu VPS/panel, gdzie potrzebujesz jednego entrypointu Node.

---

## 7) Pipeline REQUEST (runtime) — co się dzieje, gdy user wchodzi na stronę

### 7.1. Diagram wysokopoziomowy

```
Client → (HTTP) → Next middleware → App Router route → Tina queries → adapters → wrappers/sections → HTML/JS → Client hydrate
```

### 7.2. Middleware i18n + redirecty

Wejście: [middleware.ts](middleware.ts) eksportuje middleware z [src/proxy.ts](src/proxy.ts).

Reguły (skrót):
- Jeśli URL nie ma prefiksu językowego (`/pl` lub `/en`) → redirect na `/pl{pathname}`.
- Jeśli user wejdzie na `/` → geo redirect (`PL` → `/pl`, reszta → `/en`).
- Jeśli user wejdzie na `/admin` → redirect do SPA hash: `/admin/index.html#/~/admin/pl`.
- Na końcu odpalany jest `next-intl` middleware.

### 7.3. Routing stron i dane

- Strony publiczne są w [src/app/[locale]/](src/app/[locale]/).
- Dla kolekcji (blog/portfolio) slugi są generowane z Tina connection: [src/lib/tina/params.ts](src/lib/tina/params.ts).
- Pobieranie treści następuje przez [src/lib/tina/queries.ts](src/lib/tina/queries.ts).

### 7.4. Preview admin (force-dynamic)

- Route’y admin są w [src/app/admin/](src/app/admin/).
- Admin strony ustawiają:
  - `export const dynamic = "force-dynamic"`
  - `export const revalidate = 0`
  - `export const fetchCache = "force-no-store"`

To wymusza świeże dane (live editing) i eliminuje cache w preview.

Mechanizm:
- Route admin robi query `client.queries.*` i podaje `query + variables + data` do [src/providers/AdminPreviewProvider.tsx](src/providers/AdminPreviewProvider.tsx).
- `useTina(...)` dostarcza live data do rendererów w [src/providers/AdminPreviewRenderer.tsx](src/providers/AdminPreviewRenderer.tsx).

---

## 8) Pipeline SEO

### 8.1. Metadata per-route

Strony mają `generateMetadata()` i budują alternatywy językowe przez helpery w [src/lib/seo/metadata.ts](src/lib/seo/metadata.ts).

Efekt:
- Canonical + `hreflang` (alternates languages).
- Open Graph / Twitter cards.
- Dla blog/portfolio dodatkowo JSON-LD w route (Article/CreativeWork).

### 8.2. Sitemap

- Generator sitemap: [src/app/sitemap.ts](src/app/sitemap.ts)
- Dane do sitemap są pobierane z Tina (`blogConnection`, `portfolioConnection`) + statyczne strony + legal pages.

---

## 9) Pipeline statycznych assetów i cache

- Public assets: [public/](public/)
- Długie cache headers:
  - dla obrazów i `_next/static` ustawiane w [next.config.ts](next.config.ts).
- Obrazy z Tina (remote): dozwolone przez `images.remotePatterns` w [next.config.ts](next.config.ts).

---

## 10) Checklisty (operacyjne)

### 10.1. Dodajesz nową stronę/sekcję/collection item

- Sprawdź checklistę w [DATAFLOW.MD](DATAFLOW.MD).
- Upewnij się, że:
  - istnieją pliki PL i EN w [content/](content/)
  - schema w [tina/schemas/](tina/schemas/) ma pola
  - zapytania są w [src/lib/tina/queries.ts](src/lib/tina/queries.ts)
  - slugi/statyczne paramy w [src/lib/tina/params.ts](src/lib/tina/params.ts)
  - render rich-text używa presetów w [tina/richTextPresets.tsx](tina/richTextPresets.tsx)
  - routing i18n (jeśli potrzebny mapping) w [src/i18n/routing.ts](src/i18n/routing.ts)
  - sitemap uwzględnia stronę, jeśli powinna być indeksowana: [src/app/sitemap.ts](src/app/sitemap.ts)

### 10.2. Deploy się wywala

- Najpierw: `npm run lint`.
- Potem lokalnie: `npm run build`.
- Jeśli problem dotyczy Tina cloud checks: `npm run build:skip-cloud-checks`.

---

## 11) Gdzie szukać “prawdy” o przepływie danych

- Architektura treści i spójność: [DATAFLOW.MD](DATAFLOW.MD)
- Wydajność i rekomendacje: [OPTIMIZATION.MD](OPTIMIZATION.MD)
- Ryzyka UI/preview: [PROJECT_DESIGN_AUDIT.MD](PROJECT_DESIGN_AUDIT.MD)
