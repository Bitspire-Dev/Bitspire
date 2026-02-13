# Problemy architektoniczne wymagajace przemyslenia

## 1. Hardcoded locale strings ("pl" / "en") rozsiane po calym projekcie

**Problem:** Zamiast korzystac z jednego zrodla prawdy (`src/i18n/locales.ts`), stringi `"pl"` i `"en"` sa hardcoded w dziesieciach plikow: page componentach, metadata.ts, sitemap.ts, proxy.ts, CookieBanner, Contact, PortfolioHighlights itd. Kazda zmiana (np. dodanie nowego jezyka) wymaga manualnych zmian w ~30 plikach.

**Rozmiar problemu:** Dotyczy prawie kazdego pliku w projekcie. Wymaga systematycznej refaktoryzacji z wprowadzeniem centralnych stalych i typow.

**Propozycja:** Stworzyc centralne `LOCALES` config z mapowniami (locale -> label, locale -> date-format-locale, locale -> url-prefix) i importowac je wszedzie.

---

## 2. Dwa roznie dzialajace systemy `localePrefix` (URL vs. CMS path)

**Problem:** Istnieja dwie funkcje `localePrefix` o tej samej nazwie, ale roznej logice:
- `src/lib/tina/queries.ts:localePrefix("pl")` -> `"pl/"` (prefix do sciezek CMS)
- `src/lib/seo/metadata.ts:localePrefix("pl")` -> `"/pl"` (prefix do URL)

Te dwie funkcje maja ta sama nazwe, ale robia cos innego. To prowadzi do pomylek i bledow.

**Propozycja:** Przenazwac na `cmsPathPrefix` i `urlLocalePrefix` lub zunifikowac podejscie.

---

## 3. Contact form hardcoded po polsku w CookieBanner

**Problem:** `CookieBanner.tsx` (cookie consent dialog) jest calkowicie hardcoded po polsku - "Szanujemy Twoja prywatnosc", "Odrzuc", "Akceptuj wszystkie" itd. Na stronie angielskiej wyswietla sie polski tekst. To samo dotyczy `CookieSettingsModal`, "Zobacz projekt" w `PortfolioHighlights` (portfolio/), "Data ostatniej aktualizacji" w `LegalPage`.

**Rozmiar problemu:** Wymaga albo wyciagniecia tych stringow do CMS, albo stworzenia systemu tlumaczen (np. osobny slownik JSON per locale, albo integracja z `next-intl` messages).

---

## 4. PortfolioHighlights istnieje w dwoch calkiem roznych wersjach

**Problem:** Sa dwa niezalezne komponenty o tej samej nazwie:
- `src/components/sections/home-page/PortfolioHighlights.tsx` - server component z `PortfolioHighlightsProps`, uzywajacy `portfolio.PortfolioHighlights` z TinaCMS
- `src/components/sections/portfolio/PortfolioHighlights.tsx` - client component z karuzelowym UI, uzywajacy `home.PortfolioHighlights`

Mimo takiej samej nazwy, maja calkowicie rozne interfejsy, props, rendering i zrodla danych. To powoduje confusion.

**Propozycja:** Przenazwac jeden z nich (np. home-page version na `FeaturedProjectsGrid`, a portfolio version na `ProjectsCarousel`).

---

## 5. Admin page routes duplikuja logike fetch + render

**Problem:** Kazda admin page (`blog/page.tsx`, `blog/[slug]/page.tsx`, `portfolio/page.tsx`, `portfolio/[slug]/page.tsx`, `[locale]/page.tsx`) powtarza ten sam pattern:
```
const client = getTinaClient();
try {
  const result = await client.queries.XXX({...});
  return (
    <AdminMotionFinal>
      <AdminPreviewProvider query={result.query} variables={result.variables} data={result.data}>
        <AdminXXXPreview ... />
      </AdminPreviewProvider>
    </AdminMotionFinal>
  );
} catch { notFound(); }
```

To jest 5 plikow z niemal identycznym boilerplate. Roznica jest tylko w: ktorego `client.queries.XXX` uzyc i ktory Preview component wyrenderowac.

**Propozycja:** Stworzyc generyczny `createAdminPage(queryFn, PreviewComponent)` factory (podobny do tego co zrobione dla legal pages).

---

## 6. Brak walidacji danych z CMS na granicach systemu

**Problem:** Dane z TinaCMS sa rzutowane (`as`) bez walidacji w wielu miejscach. Jesli CMS zwroci niespodziewany format danych (np. brakujace pole, null zamiast obiektu), komponent moze sie wysypac na produkcji bez jasnego bledu.

Przyklady:
- `AdminPreviewRenderer.tsx`: `data.pages as Record<string, unknown>` bez sprawdzenia
- `PortfolioHighlights` (home-page): casting `project.title as unknown as { children?:... }`
- `adapters.ts`: mapowanie danych bez sprawdzenia czy pola istnieja

**Propozycja:** Wprowadzic validation layer (np. zod schemas) na granicy CMS -> components.

---

## 7. Mieszanie `_body` i `body` w danych stron prawnych

**Problem:** `LegalPage.tsx` musi obsluzyc dwa rozne formaty danych:
```ts
const bodyContent = data?._body ?? data?.body ?? null;
```

To sugeruje, ze TinaCMS generuje pole `_body` w jednym kontekscie, a `body` w innym. Brak pojedynczego, przewidywalnego formatu danych.

**Propozycja:** Zunifikowac w layer adapterow (`adapters.ts`) tak, aby `LegalPage` zawsze dostawal dane w jednym formacie.
