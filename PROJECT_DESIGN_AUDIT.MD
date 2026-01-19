# Audyt wad projektowych (Bitspire)

## Zakres
- Struktura komponentów, spójność UI, UX, dostępność, skalowalność stylów.
- Przepływ danych z TinaCMS, inline editing i spójność renderowania.

## Najważniejsze wady projektowe + rekomendacje

### 1) Rozproszone źródła „prawdy” dla treści CMS
**Problem:** Treści z Tina są używane w wielu wariantach (blog, portfolio, legal, home), a logika edycji i metadanych jest rozrzucona po komponentach.
**Skutek:** Ryzyko niespójnych zachowań w preview i trudny maintenance.
**Rekomendacja:**
- Wydzielić wspólny adapter/mapper dla danych z Tina (np. `lib/tina/adapters.ts`) i używać go w [src/providers/AdminPreviewRenderer.tsx](src/providers/AdminPreviewRenderer.tsx) oraz warstwie query.
- Ujednolicić podpisy propsów i przekazywać `_content_source` bez nadpisywania.

### 2) Brak centralnego „design system” dla komponentów UI
**Problem:** Duża liczba klas Tailwind rozproszona po komponentach, bez wspólnego API wariantów.
**Skutek:** Trudna zmiana stylów globalnych, ryzyko rozjazdów wizualnych.
**Rekomendacja:**
- Wprowadzić komponenty bazowe z wariantami (np. `Button`, `Card`, `Badge`) i używać ich w miejscach takich jak [src/components/sections/blog/BlogCard.tsx](src/components/sections/blog/BlogCard.tsx) i [src/components/sections/portfolio/PortfolioCard.tsx](src/components/sections/portfolio/PortfolioCard.tsx).

### 3) Duplikacja logiki UI i brak wspólnych helperów
**Problem:** Powtarzające się wzorce (np. daty, linki, tagi, hover efekty).
**Skutek:** Więcej pracy przy zmianach i większe ryzyko regresji.
**Rekomendacja:**
- Wydzielić helpery (np. `formatDate`, `toSlug`, `safeLink`) i używać ich konsekwentnie w komponentach bloga/portfolio.
- Zredukować duplikację renderu nagłówków i sekcji.

### 4) Spójność rich-text vs UI
**Problem:** Rich text ma własne presety, ale inne sekcje mają ręcznie pisane style.
**Skutek:** Nierówny wygląd treści (nagłówki, listy, cytaty, codeblocks).
**Rekomendacja:**
- Wymusić użycie [tina/richTextPresets.tsx](tina/richTextPresets.tsx) wszędzie, gdzie pojawia się rich text.
- Wprowadzić standardowe klasy wrappera dla rich textu (np. `richtext-body`) i utrzymywać tylko w jednym miejscu.

### 5) Brak jawnych reguł dla responsywności i spacingu
**Problem:** Różne sekcje mają własne wartości paddingów/marginesów.
**Skutek:** Brak spójnego rytmu pionowego.
**Rekomendacja:**
- Zdefiniować wspólną siatkę spacingu (np. `section-padding`, `content-max-width`) i stosować globalnie.

### 6) Inline editing – zależność od kontekstu preview
**Problem:** Klikalność `data-tina-field` zależy od poprawnego podania metadanych i trybu edycji.
**Skutek:** „Podświetla się, ale nie klika”.
**Rekomendacja:**
- Utrzymać mapowanie danych w preview tak, aby nie gubić `_content_source`.
- Dodać prosty health check w preview (np. ostrzeżenie, gdy brak `data-tina-field` na stronie).

## Szybki plan naprawczy (priorytety)
1) Ujednolicić warstwę danych Tina i zachować `_content_source` w każdym widoku.
2) Wyprowadzić wspólne komponenty UI i warianty.
3) Ustalić standardy spacingu i wrapperów sekcji.
4) Ograniczyć niestandardowe style rich text do jednego miejsca.
5) Przegląd preview routing i spójne linkowanie.

## Lista obserwowanych miejsc wysokiego ryzyka
- [src/providers/AdminPreviewRenderer.tsx](src/providers/AdminPreviewRenderer.tsx)
- [src/components/ui/SearchBar.tsx](src/components/ui/SearchBar.tsx)
- [src/components/sections/blog/BlogCard.tsx](src/components/sections/blog/BlogCard.tsx)
- [src/components/sections/portfolio/PortfolioCard.tsx](src/components/sections/portfolio/PortfolioCard.tsx)
- [tina/richTextPresets.tsx](tina/richTextPresets.tsx)
