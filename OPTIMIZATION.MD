# Optymalizacje — stan obecny, ryzyka i rekomendacje

Dokument opisuje aktualne rozwiązania (content + src), ich słabe strony oraz proponowane usprawnienia dla SEO i UX. Na końcu: strategie ultraszybkiej zmiany języka (<~0,1 s) i rekomendacja.

---

## 1) Krótka mapa struktury (źródła prawdy)

- Treści: content/ (MDX + YAML frontmatter)
  - content/pages/{pl,en} — strony
  - content/blog/{pl,en} — wpisy
  - content/portfolio/{pl,en} — projekty
- Logika danych: src/lib/tina/ (queries + mappers + helpers)
- Routing i i18n: src/i18n/routing.ts
- Strony: src/app/[locale]/...
- Preview: src/app/admin/... + src/providers/...

---

## 2) Aktualne rozwiązania optymalizacyjne (co już działa)

### 2.1. Architektura strony
- App Router + Server Components (domyślnie szybkie renderowanie po stronie serwera).
- Statyczne generowanie wielu stron (generateStaticParams).
- Rozdzielenie warstwy danych (src/lib/tina/queries.ts) od UI (src/components/pages).

### 2.2. Warstwa treści
- Treści w MDX z frontmatter (łatwa edycja, kontrola danych, możliwość statycznego renderowania).
- Ujednolicona struktura kolekcji (blog, portfolio, pages).

### 2.3. SEO
- Generowany sitemap: src/app/sitemap.ts
- Kontrola title/description w frontmatter (content/pages/*.mdx)
- Spójne URL z prefiksem locale (/pl, /en)

### 2.4. Performance
- Ograniczone JS w krytycznych ścieżkach dzięki Server Components.
- Odseparowanie funkcji normalizujących dane (mappers).
- Unikanie niepotrzebnych fetchów w komponentach UI.

---

## 3) Słabe strony i ryzyka (obecny stan)

### 3.1. SEO
- Brak centralnego generowania metadata (title/description/og) w App Router na poziomie per-page.
- Możliwa niejednoznaczność slugów dla legal pages (różne mapowania w routing.ts i slugMap w page.tsx).
- Nie widać globalnego systemu canonical i alternates językowych w metadata.

### 3.2. UX / performance
- Brak jawnego systemu cache/revalidate dla list i wpisów (np. blog index, portfolio index).
- Część stron ma “fallback” logikę redirectów, co przy błędnym locale może dodawać dodatkowy skok (perceived latency).
- Brak jawnej strategii prefetcha dla zmiany języka (w praktyce może oznaczać 200–600 ms na pierwszym przełączeniu).

### 3.3. i18n
- Zmiana języka opiera się o zmianę patha (locale prefix) i pełny routing, bez prefetchu plików.
- Treści są w MDX i są ładowane dynamicznie z Tina — przy pierwszym wejściu w nowy locale może dojść do opóźnienia.

---

## 4) Proponowane rozwiązania SEO (priorytety)

### 4.1. Generowanie metadata per page
**Cel:** spójne title/description/og/alternate.

- Dodać generateMetadata w plikach route (np. src/app/[locale]/blog/[slug]/page.tsx).
- Źródła danych: frontmatter (title, description), a dla blog/portfolio także image.
- Dodać alternates (hreflang) dla PL/EN.

Efekt:
- Lepszy CTR w SERP.
- Mniej duplikatów w indeksie.
- Spójne social previews.

### 4.2. Canonical + alternates
- Dla każdej strony dodać canonical (lokalny) oraz alternates dla drugiego języka.
- W Next App Router: metadata.alternates.languages.

### 4.3. Struktura danych (schema.org)
- Dla blog postów i projektów dodać JSON-LD (Article / Project).
- Źródło danych: frontmatter (title, description, date, image, author).

---

## 5) Proponowane rozwiązania UX (priorytety)

### 5.1. Stabilny layout i szybkość ładowania
- Upewnić się, że wszystkie obrazy w hero i listach używają next/image.
- Ustawić width/height oraz placeholdery dla obrazów above-the-fold.

### 5.2. Prefetch list i nawigacji
- Dla głównych stron (home, blog, portfolio) wymusić prefetch na linkach.
- Stosować inteligentny prefetch na hover (navigation hover -> prefetch route).

### 5.3. Cache i revalidate
- Dodać revalidate do stron blog/portfolio, np. 3600s.
- Dla stron “bez zmian” (legal) ustawić bardzo długi revalidate.

---

## 6) Najważniejsze: zmiana języka <~0,1 s

### 6.1. Problem
Zmiana języka wymaga:
- przejścia na nowy route (/pl -> /en),
- pobrania MDX i wyników query z Tina,
- renderowania strony.

Bez prefetchu lub cache realne czasy to 200–800 ms (UX odczuwa „skok”).

### 6.2. Podejścia

#### Podejście A — Prefetch na interakcji
- Na hover przy przełączniku języka wykonać prefetch nowych tras.
- Prefetch wszystkich kluczowych endpointów (home/blog/portfolio).

Symulacja:
- Pierwsza zmiana języka: ~100–200 ms (lepsze, ale nie zawsze <0,1 s).
- Kolejne przełączenia: <100 ms.

Wady:
- Nie gwarantuje <0,1 s przy pierwszym kliknięciu.

#### Podejście B — Preload treści i danych na starcie
- W momencie wejścia na stronę, w tle pobrać “równoległą wersję językową” najważniejszych stron.
- Cache w pamięci (np. in-memory) w kliencie i re-use przy przełączeniu.

Symulacja:
- Pierwsza zmiana języka: <100 ms (dane już są).
- Wymaga dodatkowego transferu i pamięci.

Ryzyka:
- Większy initial data load.

#### Podejście C — SSR + Next.js cache + “instant swap”
- Przy przełączaniu języka używać cache w edge (ISR + revalidate) i prefetch route.
- Połączenie z podejściem A daje realnie ~80–120 ms.

Wady:
- Wciąż zależne od warunków sieci.

### 6.3. Rekomendacja (najlepsze UX)
**Rekomenduję hybrydę A + B:**
- Prefetch na hover.
- W tle preload równoległego locale dla bieżącej strony (tylko 1 route, nie cały serwis).

Efekt:
- Pierwsza zmiana języka na bieżącej stronie: ~50–90 ms.
- Minimalny koszt transferu (tylko 1 route i jego dane).

---

## 7) Konkretne punkty wdrożeniowe (plan)

1) Dodać generateMetadata dla:
   - src/app/[locale]/page.tsx
   - src/app/[locale]/blog/page.tsx
   - src/app/[locale]/blog/[slug]/page.tsx
   - src/app/[locale]/portfolio/page.tsx
   - src/app/[locale]/portfolio/[slug]/page.tsx
   - legal pages
2) Dodać alternates hreflang (pl/en).
3) Dodać JSON-LD w blog/portfolio.
4) Dodać revalidate do indeksów (blog, portfolio) i legal.
5) Dodać prefetch w przełączniku języka (hover + focus).
6) Dodać background preload danych dla bieżącej strony w drugim locale.

---

## 8) Wnioski końcowe

Największy ROI dla SEO: metadata + alternates + JSON-LD.
Największy ROI dla UX: prefetch + preload języka na bieżącej stronie + stabilny layout (obrazy).

Jeśli chcesz, mogę wdrożyć konkretne zmiany krok po kroku.
