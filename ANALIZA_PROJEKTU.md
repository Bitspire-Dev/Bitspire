# Analiza projektu Bitspire – obszary do poprawy

Data: 2026-01-25

Poniżej zebrane są nieoptymalne/słabe rozwiązania wraz z propozycjami ulepszeń. Skupiłem się na wydajności, bezpieczeństwie i utrzymaniu projektu.

---

## 1) Ignorowanie błędów TypeScript przy buildzie
**Plik:** [next.config.ts](next.config.ts)
- **Problem:** `typescript.ignoreBuildErrors = true` ukrywa błędy typów w produkcji.
- **Skutek:** Możliwe regresje i błędy runtime trafiają do produkcji.
- **Propozycja:** Ustawić `ignoreBuildErrors: false` i doprowadzić typy do zielonego stanu (CI powinno blokować build z błędami).

## 3) `dangerouslyAllowSVG` w optymalizacji obrazów
**Plik:** [next.config.ts](next.config.ts)
- **Problem:** `images.dangerouslyAllowSVG = true` otwiera wektor XSS, jeśli SVG nie są w pełni zaufane.
- **Skutek:** Ryzyko bezpieczeństwa przy zewnętrznych lub edytowalnych SVG.
- **Propozycja:** Wyłączyć tę opcję i obsługiwać SVG przez zwykłe `<img>`/inline (lub whitelistować tylko bezpieczne źródła po stronie serwera).

## 4) `contentDispositionType: 'attachment'` dla obrazów
**Plik:** [next.config.ts](next.config.ts)
- **Problem:** Wymuszenie `attachment` może powodować niepożądane zachowanie pobierania plików oraz gorsze cache’owanie w przeglądarce.
- **Skutek:** Pogorszenie UX i potencjalnie gorsze Core Web Vitals.
- **Propozycja:** Przywrócić domyślne `inline`, o ile nie ma mocnego uzasadnienia biznesowego.

## 5) Zbyt agresywne cache’owanie obrazów z public
**Plik:** [next.config.ts](next.config.ts)
- **Problem:** `Cache-Control: immutable` na `/public/*` wymusza roczny cache bez możliwości odświeżenia.
- **Skutek:** Zmiany w obrazach o stałej nazwie mogą być niewidoczne przez długi czas.
- **Propozycja:** Stosować `immutable` tylko do assetów z hashem w nazwie lub skrócić TTL dla treści edytowalnych.

## 6) `useScrollAnimation` – niestabilne zależności i częste re-subskrypcje
**Plik:** [src/hooks/useScrollAnimation.ts](src/hooks/useScrollAnimation.ts)
- **Problem:** `options` to obiekt tworzony przy każdym renderze (także domyślny), więc efekt może się niepotrzebnie uruchamiać ponownie.
- **Skutek:** Nadmiarowe tworzenie `IntersectionObserver`, gorsza wydajność przy większej liczbie elementów.
- **Propozycja:** Memoizować `options` po stronie wywołującego lub wewnątrz hooka (np. `useMemo`) i używać stabilnego klucza w deps.

## 7) Brak debouncingu w filtrach (dużo `router.replace`)
**Plik:** [src/components/ui/composites/SearchBarRouter.tsx](src/components/ui/composites/SearchBarRouter.tsx)
- **Problem:** Aktualizacja URL odbywa się przy każdej zmianie inputu i tagu.
- **Skutek:** Nadmiarowe nawigacje i renderowanie strony, spadek responsywności.
- **Propozycja:** Dodać debounce (np. 250–400 ms) albo aktualizować URL dopiero po `Enter`/`blur`.

## 8) Pobieranie całych kolekcji bez paginacji
**Pliki:** [src/lib/tina/queries.ts](src/lib/tina/queries.ts), [src/lib/tina/params.ts](src/lib/tina/params.ts)
- **Problem:** `blogConnection()` i `portfolioConnection()` są wywoływane bez limitów/paginacji, a filtrowanie robi się lokalnie.
- **Skutek:** Niezbędna ilość danych rośnie wraz z liczbą wpisów, spowalniając build i requesty.
- **Propozycja:** Użyć paginacji lub filtrów po `relativePath`/`locale` na poziomie zapytania, ewentualnie cache’ować wynik (`revalidate`, `unstable_cache`).

## 9) Sitemap może pomijać wpisy przy większej liczbie treści
**Plik:** [src/app/sitemap.ts](src/app/sitemap.ts)
- **Problem:** `blogConnection()` i `portfolioConnection()` bez paginacji mogą zwrócić tylko część rekordów.
- **Skutek:** Niepełny sitemap i gorsze SEO.
- **Propozycja:** Dodać pętlę paginacyjną i zebrać wszystkie strony.

## 10) Niepotrzebny klientowy kontekst kursora (martwy kod)
**Plik:** [src/components/features/Cursor-Light.tsx](src/components/features/Cursor-Light.tsx)
- **Problem:** Provider i komponent nie są używane w aplikacji.
- **Skutek:** Niepotrzebny kod w repo i potencjalny narzut na bundle, jeśli zostanie użyty globalnie.
- **Propozycja:** Usunąć nieużywany moduł lub świadomie podłączyć w miejscu, gdzie jest potrzebny.

## 11) `FeaturedImage` wyłącza optymalizację dla lokalnych AVIF
**Plik:** [src/components/ui/media/FeaturedImage.tsx](src/components/ui/media/FeaturedImage.tsx)
- **Problem:** `unoptimized={isLocalAvif}` wyłącza pipeline optymalizacji Next.js.
- **Skutek:** Większe transfery i brak automatycznego dopasowania rozmiaru.
- **Propozycja:** Pozostawić optymalizację włączoną i polegać na `next/image` (zwłaszcza dla dużych obrazów). Jeśli jest powód, ograniczyć to do wyjątków.

## 12) Zbyt szerokie komponenty klienckie w layout
**Pliki:** [src/components/layout/Header.tsx](src/components/layout/Header.tsx), [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)
- **Problem:** Cały header i footer są `use client`, mimo że tylko część logiki wymaga JS.
- **Skutek:** Większy bundle na każdej stronie.
- **Propozycja:** Rozbić na server component z małymi client islands (np. menu mobilne, przycisk cookies).

## 13) Formularz kontaktowy bez osobnej ścieżki API i ochrony
**Plik:** [src/hooks/useContactForm.ts](src/hooks/useContactForm.ts)
- **Problem:** Wysyłka `POST` na `/` bez walidacji backendowej, rate‑limitów i anty‑spam.
- **Skutek:** Ryzyko spamu oraz brak kontroli błędów po stronie serwera.
- **Propozycja:** Dodać API route z walidacją (np. Zod), honeypot/recaptcha i limitowanie żądań.

---

Jeśli chcesz, mogę od razu wprowadzić poprawki w kodzie lub przygotować plan wdrożenia zmian krok po kroku.
