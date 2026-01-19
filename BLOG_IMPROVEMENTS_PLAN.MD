# Plan poprawy bloga — responsywność, funkcjonalność, design

## Zakres
Blog (index + post):
- [src/components/pages/BlogPageWrapper.tsx](src/components/pages/BlogPageWrapper.tsx)
- [src/components/pages/BlogPostWrapper.tsx](src/components/pages/BlogPostWrapper.tsx)
- [src/components/sections/blog/BlogPostHeader.tsx](src/components/sections/blog/BlogPostHeader.tsx)
- [src/components/sections/blog/BlogGrid.tsx](src/components/sections/blog/BlogGrid.tsx)
- [src/components/sections/blog/BlogCard.tsx](src/components/sections/blog/BlogCard.tsx)
- [src/components/sections/blog/RelatedArticles.tsx](src/components/sections/blog/RelatedArticles.tsx)
- [src/components/sections/blog/TableOfContents.tsx](src/components/sections/blog/TableOfContents.tsx)
- [src/components/sections/blog/ShareButtons.tsx](src/components/sections/blog/ShareButtons.tsx)
- [src/components/sections/blog/AuthorBox.tsx](src/components/sections/blog/AuthorBox.tsx)

## 1) Słabe strony i głupie rozwiązania (obecnie)

### A) Responsywność
1) Długi blok klas `prose-*` w [src/components/pages/BlogPostWrapper.tsx](src/components/pages/BlogPostWrapper.tsx) jest trudny do utrzymania i modyfikacji na breakpoints.
2) Sidebar na desktop ma stałą szerokość 260px, ale brak elastycznego zachowania dla średnich rozdzielczości (duże luki lub ściskanie contentu).
3) Brak kontrolowanych breakpointów dla listy kart na blog index (karty bywają zbyt gęste przy ~1024px).

### B) Funkcjonalność
1) Brak sticky TOC na mobile (TOC w mobile jest poniżej artykułu; użytkownik traci kontekst).
2) Brak kontroli „czytanie” w RelatedArticles (czytanie to string bez integracji z tłumaczeniem i bez spójności formatowania).
3) Brak prostego „copy link” potwierdzanego UI feedback (w ShareButtons brak komunikatu toast/tooltip).

### C) Design i spójność
1) Wiele sekcji bloga ma inne podejście do marginesów i typografii — widoczne skoki w rytmie pionowym.
2) Brak spójnych tokenów typografii dla bloga (nagłówki, akapity, listy) sterowanych centralnie w jednym komponencie lub helperze.
3) RelatedArticles ma wizualny styl inny od BlogCard (inne odstępy, inne proporcje fontów) — brak spójności kart.

### D) Optymalizacja wydajności
1) Obrazki w kartach nie mają wyraźnych priorytetów/placeholderów w index (możliwe CLS przy dużych listach).
2) Brak prefetch strategii dla linków do wpisów (w wielu miejscach jest domyślne prefetch, ale brak świadomej optymalizacji dla długiej listy).

---

## 2) Plan zmian — etapami

### Etap 1: Uporządkowanie typografii i layoutu (responsywność + utrzymanie)
**Cel:** Prostsza i spójna typografia, mniej magicznych klas.

1) Wyprowadzić zestaw klas typograficznych do jednego miejsca (np. `const proseClassName = ...`) i używać w BlogPostWrapper.
2) Wyrównać wartości `prose-*` między blogiem i innymi stronami (jeśli istnieją podobne style).
3) Dodać breakpointy dla `grid` w BlogPostWrapper (np. elastyczna szerokość sidebaru).

**Efekt:** Mniej rozjechań i łatwiejsze aktualizacje.

---

### Etap 2: Spójność komponentów kart (BlogCard vs RelatedArticles)
**Cel:** Jedna baza stylu kart.

1) Ujednolicić layout i typografię kart w RelatedArticles z BlogCard.
2) Wprowadzić wspólny komponent bazowy (np. `BlogCardBase`) albo ujednolicony zestaw klas.
3) Wyrównać marginesy, wielkości tytułów i spacing CTA.

**Efekt:** Spójny wygląd całego bloga.

---

### Etap 3: Mobile UX i nawigacja
**Cel:** Lepsze doświadczenie czytania na mobile.

1) TOC: rozważyć mini-TOC sticky lub wysuwany panel (np. przycisk „Spis treści”).
2) ShareButtons: dodać krótki feedback po kopiowaniu linku.
3) Dodać kontrolę długości tytułów/leadów w kartach (clamp na mobile).

**Efekt:** Czytelność i użyteczność na małych ekranach.

---

### Etap 4: Wydajność i stabilność layoutu
**Cel:** Mniej CLS i szybszy rendering.

1) Dodać `placeholder="blur"` dla obrazów w BlogCard i RelatedArticles (z precomputed blurDataURL lub fallbackiem).
2) Ograniczyć prefetch na masowej liście wpisów (np. `prefetch={false}` dla dużych gridów).
3) Wstępne ładowanie tylko top 1–3 obrazów (reszta lazy).

**Efekt:** Lepsze Web Vitals.

---

## 3) Priorytety (szybkie wygrane)
1) Ujednolicenie kart (Etap 2).
2) Mobile UX (Etap 3).
3) Wydajność obrazów (Etap 4).

---

## 4) Lista zmian technicznych (checklista)
- [ ] Skonsolidować `prose` w jednym helperze w [src/components/pages/BlogPostWrapper.tsx](src/components/pages/BlogPostWrapper.tsx).
- [ ] Zunifikować style kart w [src/components/sections/blog/BlogCard.tsx](src/components/sections/blog/BlogCard.tsx) i [src/components/sections/blog/RelatedArticles.tsx](src/components/sections/blog/RelatedArticles.tsx).
- [ ] Dodać mobile TOC UX w [src/components/sections/blog/TableOfContents.tsx](src/components/sections/blog/TableOfContents.tsx).
- [ ] Dodać feedback po kopiowaniu w [src/components/sections/blog/ShareButtons.tsx](src/components/sections/blog/ShareButtons.tsx).
- [ ] Optymalizować obrazki kart w [src/components/sections/blog/BlogCard.tsx](src/components/sections/blog/BlogCard.tsx).

---

## 5) Dodatkowe pomysły (opcjonalne)
- Globalne ustawienie max-width treści bloga w layout (zamiast rozbudowanych klas).
- Wprowadzić tagi jako filtry w sidebarze na desktop.
- Przycisk „kontynuuj czytanie” w mobile po pierwszych 2–3 akapitach.
