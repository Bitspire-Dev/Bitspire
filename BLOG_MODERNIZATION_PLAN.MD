# Plan modernizacji komponentów bloga (optymalizacja, dane, funkcje, mobile-first)

Poniżej pełny plan modernizacji komponentów bloga. Dokument skupia się na: wydajności, kompletności danych, poprawie funkcji oraz responsywności ze szczególnym naciskiem na telefony.

---

## 1) Zakres i inwentaryzacja komponentów

**Strony i wrappery**
- [src/components/pages/BlogPageWrapper.tsx](src/components/pages/BlogPageWrapper.tsx)
- [src/components/pages/BlogPostWrapper.tsx](src/components/pages/BlogPostWrapper.tsx)

**Sekcje bloga**
- [src/components/sections/blog/BlogHeader.tsx](src/components/sections/blog/BlogHeader.tsx)
- [src/components/sections/blog/BlogGrid.tsx](src/components/sections/blog/BlogGrid.tsx)
- [src/components/sections/blog/BlogCard.tsx](src/components/sections/blog/BlogCard.tsx)
- [src/components/sections/blog/BlogPostHeader.tsx](src/components/sections/blog/BlogPostHeader.tsx)
- [src/components/sections/blog/ReadingProgressBar.tsx](src/components/sections/blog/ReadingProgressBar.tsx)
- [src/components/sections/blog/TableOfContents.tsx](src/components/sections/blog/TableOfContents.tsx)
- [src/components/sections/blog/ShareButtons.tsx](src/components/sections/blog/ShareButtons.tsx)
- [src/components/sections/blog/AuthorBox.tsx](src/components/sections/blog/AuthorBox.tsx)
- [src/components/sections/blog/RelatedArticles.tsx](src/components/sections/blog/RelatedArticles.tsx)

---

## 2) Główne problemy do rozwiązania

### 2.1 Wydajność (mobile)
- ReadingProgressBar laguje na mobile (scroll handler + setState na każdym scrollu).
- BlogCard i RelatedArticles używają background-image w div zamiast optymalizacji obrazów.
- Brak podziału dużych obszarów UI pod mobile (zbyt duże fonty i paddingi).

### 2.2 Kompletność danych
- Brak spójnej obsługi: `imageAlt`, `author`, `readTime`, `category`, `excerpt` i `tags` jako wymagane w UI.
- Brak fallbacków tłumaczeń w blogu (np. `readMore`, `readTime`, `by`, `publishedOn`).
- Brak wyświetlenia części danych w niektórych miejscach (np. „author bio” vs brak autora).

### 2.3 Funkcjonalność
- TableOfContents nie „przykleja się” do przewijanego layoutu i nie podąża między kafelkami.
- Brak konsystentnego scroll containera dla TOC i share box.

### 2.4 Responsywność
- Zbyt agresywne rozmiary fontów i marginesów dla mobile.
- Sidebar na desktop jest OK, ale na mobile potrzebne lepsze stacking i ukrycia ciężkich sekcji.

---

## 3) Plan modernizacji – priorytety

### P1 — Krytyczne (mobile performance + UX)

1) **ReadingProgressBar**
   - Optymalizacja: throttle via requestAnimationFrame + passive scroll listener.
   - Zmniejszyć liczbę obliczeń i selektorów DOM (cache element).
   - Opcja: wyłączyć na mobile, jeśli nadal laguje.
   - Plik: [src/components/sections/blog/ReadingProgressBar.tsx](src/components/sections/blog/ReadingProgressBar.tsx)

2) **TableOfContents – sticky i scroll**
   - TOC ma się przewijać razem z artykułem między ShareButtons a końcem artykułu.
   - Rozwiązanie: wrapper sidebar z `position: sticky` + `top` + `max-height` i `overflow-y`.
   - Dodatkowo: obserwować nagłówki tylko w obrębie article content.
   - Plik: [src/components/sections/blog/TableOfContents.tsx](src/components/sections/blog/TableOfContents.tsx)
   - Layout: [src/components/pages/BlogPostWrapper.tsx](src/components/pages/BlogPostWrapper.tsx)

3) **Responsive layout dla blog postów**
   - Zmniejszyć fonty, marginesy i odstępy na mobile.
   - Na mobile przenieść TOC i ShareButtons na dół artykułu (stacked), ewentualnie accordion.
   - Plik: [src/components/pages/BlogPostWrapper.tsx](src/components/pages/BlogPostWrapper.tsx)

---

### P2 — Dane i spójność

1) **Dane blog postów: wymagania minimalne**
   - `title`, `description`, `date`, `author` → wymagane.
   - `imageAlt` → wymagane, jeśli jest `image`.
   - `readTime`, `category`, `tags`, `excerpt` → wymagane dla UX i filtrów.
   - Spójne fallbacki w UI, gdy brak.

2) **Wzorce wyświetlania danych**
   - BlogCard powinien zawsze pokazywać `imageAlt` i `excerpt` (lub fallback do description).
   - AuthorBox: brak `authorBox` → default fallback lub ukrycie bloku.
   - ShareButtons: brak `buttons` → fallback labels (EN/PL) lub ukrycie.

3) **Tłumaczenia**
   - Uzupełnić brakujące pola w content/pages/{pl,en}/blog.mdx.
   - Sprawdzić konsekwencję placeholderów `readTime` (`{minutes}`).

---

### P3 — UI / komponenty listy

1) **BlogGrid i BlogCard**
   - Zoptymalizować layout na mobile: jedna kolumna, mniejsze marginesy.
   - Obrazki w kartach: migracja do next/image dla lepszej wydajności.
   - Zmniejszyć efekty hover dla mobile (mniej kosztów).

2) **RelatedArticles**
   - Dla mobile wyświetlać 1–2 elementy lub slider.
   - Zastąpić background-image komponentem Image.

---

## 4) Szczegóły implementacyjne (propozycje)

### 4.1 ReadingProgressBar (wydajność)
- Użyj requestAnimationFrame, a nie setState na każdym scrollu.
- Cache elementu `article` po pierwszym znalezieniu.
- Dodaj `passive: true` dla scroll listenera.
- Jeśli nadal laguje → wyłącz bar dla `max-width: 768px`.

### 4.2 TOC: sticky pomiędzy ShareButtons i końcem artykułu
- W sidebar layout:
  - Owinąć TOC w kontener z `position: sticky` i `top: 120px`.
  - Ustawić `max-height: calc(100vh - 160px)` i `overflow-y: auto`.
- Na mobile:
  - TOC jako accordion pod artykułem.

### 4.3 BlogPostLayout (mobile)
- Zmniejszyć `prose` font-size i spacing na mobile.
- FeaturedImage: ograniczyć wysokość (np. 16:9 z mniejszym marginesem).
- Sidebar: na mobile renderować jako stacked section.

---

## 5) Definicja „done” (akceptacja)

- ReadingProgressBar nie laguje na mobile lub jest wyłączony dla mobile.
- TOC scrolluje się i pozostaje w obrębie viewportu między ShareButtons a końcem artykułu.
- BlogPost i BlogList poprawnie renderują się na szerokościach 320px–1920px.
- Wszystkie posty mają komplet danych (lub działają z fallbackami).
- Wydajność: brak zauważalnego jank na scroll.

---

## 6) Kolejność wdrożenia

1) ReadingProgressBar optymalizacja / fallback mobile.
2) TOC sticky + layout sidebar.
3) BlogPost mobile adjustments.
4) BlogCard/RelatedArticles image + responsive.
5) Dane i tłumaczenia.

---

Jeśli chcesz, wchodzę w realizację punktów P1 krok po kroku.
