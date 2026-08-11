# Plany naprawy bledow

---

## BUG 1: SearchBar - wpisany tekst znika po ulamku sekundy

### Diagnoza

Problem lezacy w cyklicznym nadpisywaniu stanu. Lancuch zdarzen:

1. Uzytkownik wpisuje litere -> `SearchBar.handleSearchInput` wywoluje `internalHandleSearchChange(value)` (ustawia `searchQuery` w `useSearch`) i `onSearchChange(value)` (ustawia `query` w `SearchBarRouter`).

2. `SearchBarRouter` ma debounce `useEffect` (linia 91-100) ktory po 300ms wywoluje `router.replace(nextUrl)` co zmienia URL.

3. **Kluczowy problem:** `SearchBarRouter` ma drugi `useEffect` (linia 48-65) ktory nasuchuje URL. Kiedy URL sie zmienia (z krok 2), ten effect uruchamia `setQuery(urlQuery)` - ale w tym samym renderze `urlQuery` moze byc jeszcze pusty (bo Next.js `searchParams` nie odswiezyl sie synchronicznie po `router.replace`). W efekcie `query` wraca do `""`.

4. Ale jest gorszy problem: `useSearch` hook (linia 21-27) ma `useEffect(() => setSearchQuery(initialQuery), [initialQuery])`. Za kazdym razem kiedy `SearchBarRouter` przekazuje nowy `query` jako `initialQuery` do `SearchBar`, a `SearchBar` przekazuje go dalej do `useSearch` jako `initialQuery`, hook reaguje na zmiane i nadpisuje wewnetrzny `searchQuery`. To tworzy petla: `query` zmienia sie -> `initialQuery` zmienia sie -> `useSearch` resetuje `searchQuery` -> re-render -> znowu URL sync -> itd.

5. Efekt koncowy: uzytkownik wpisuje "a", debounce ustawia URL na `?q=a`, URL sync w `SearchBarRouter` widzi zmiane `currentUrl`, ale racing condition miedzy URL update a state powoduje migniecie i utrate testu.

### Plan naprawy

**Pliki do zmiany:**
- `src/hooks/useSearch.ts`
- `src/components/ui/composites/SearchBarRouter.tsx`

**Krok 1: Usunac synchronizacje `initialQuery`/`initialTags` w `useSearch.ts`**

Problem: `useEffect(() => setSearchQuery(initialQuery), [initialQuery])` (linie 21-23) i analogiczny dla tags (linie 25-27) tworza niekontrolowane nadpisywanie stanu. Te effecty sa niepotrzebne - `useSearch` powinien byc "controlled" - tzn. `SearchBar` bezposrednio ustawia query przez `handleSearchChange`.

Rozwiazanie: Usunac oba `useEffect`y z `useSearch.ts`. Hook powinien uzywac `initialQuery` tylko jako wartosc startowa w `useState`, nie reagowac na jej zmiany.

```ts
// PRZED (bugged):
const [searchQuery, setSearchQuery] = useState(initialQuery);
useEffect(() => { setSearchQuery(initialQuery); }, [initialQuery]);

// PO (fix):
const [searchQuery, setSearchQuery] = useState(initialQuery);
// brak useEffect - stan zarzadzany wylacznie przez handleSearchChange
```

**Krok 2: Zmienic model synchronizacji w `SearchBarRouter.tsx`**

Problem: Dual-direction sync (state -> URL i URL -> state) tworzy race condition. Rozwiazanie: URL powinien byc "slave" stanu (state -> URL), a nie na odwrot.

Zmiany:
- Usunac `useEffect` synchronizujacy URL -> state (linie 48-65). URL powinien byc tylko odczytywany przy pierwszym renderze (SSR hydration).
- Zachowac `useEffect` debounce: state -> URL (linie 91-100). Ten effect jest OK - po 300ms aktualizuje URL.
- `initialQuery` i `initialTags` sa odczytywane z `searchParams` przy moncie i ustawiane jako poczatkowy state. Potem state jest "source of truth".

```tsx
// Uproszczona logika SearchBarRouter:
const urlQuery = searchParams?.get("q") ?? "";
const urlTags = useMemo(() => normalizeTags((searchParams?.get("tags") ?? "").split(",")), [searchParams]);

// State zainicjalizowana z URL - ale potem zarzadzana lokalnie
const [query, setQuery] = useState(initialQuery ?? urlQuery);
const [tags, setTags] = useState(initialTags ?? urlTags);

// Jedyny effect: debounce state -> URL
useEffect(() => {
  const handle = window.setTimeout(() => {
    updateParams(query, tags);
  }, 300);
  return () => window.clearTimeout(handle);
}, [query, tags, updateParams]);
```

**Krok 3: `SearchBar` nie powinien przyjmowac zmiennego `initialQuery`**

Zmienic `SearchBar` aby nie przekazywal `query` z `SearchBarRouter` jako `initialQuery`. Zamiast tego, `SearchBar` powinien uzywac `searchQuery` z `useSearch` jako jedyne zrodlo prawdy, a `onSearchChange` / `onTagsChange` callbacki do komunikacji z rodzicem.

Alternatywnie mozna przeniesc caly stan do `SearchBarRouter` i przekazywac do `SearchBar` jako controlled component (`value` + `onChange` zamiast `initialQuery`).

### Oddzialywanie
- **`src/hooks/useSearch.ts`** - usunac 2 useEffecty (linie 21-27)
- **`src/components/ui/composites/SearchBarRouter.tsx`** - usunac URL->state sync, uproscic do jednokierunkowego flow
- **`src/components/ui/composites/SearchBar.tsx`** - opcjonalnie przeksztalcic na fully-controlled (value+onChange)

---

## BUG 2: Odstepy miedzy sekcjami - chaos CSS

### Diagnoza

Obecny stan CSS spacing miedzy sekcjami home page:

| Sekcja | Klasa (spacing) | Problem |
|--------|-----------------|---------|
| Hero | `min-h-[90dvh] pt-28 pb-10 lg:pt-0` + content: `lg:-translate-y-36` | Gryf: `lg:translate-y-[30%]`. Na medium screens (`md:`) brak specjalnych regul -> tresc jest za wysoko i header ja zaslania bo `pt-28` to za malo dla headerow wyzszych niz ~112px |
| About | `py-section lg:pt-64` | `lg:pt-64` (256px!) to kompensacja za translate w hero. Nienaturalne. |
| Features | `-mt-2.5 py-16 md:py-20 lg:py-24` | Negatywny margin-top rowniez kompensujacy. |
| FeaturedProjectsCarousel | `-mt-12 py-16 md:py-20` | Kolejny negatywny margin. |
| Statistics | `-mt-5 py-16 md:py-24` | Kolejny. |
| Technology | `mt-2.5 py-section` | Maly pozytywny. |
| Contact | `py-section mb-8` | OK, ale `mb-8` to hack. |

**Problem glowny:** Sekcje uzywaja `translate-y` zeby "podciagac" tresc wizualnie w gore, a potem nastepne sekcje musza kompensowac `-mt-XX` aby zamknac puste miejsce. To jest kruche i psuje sie na roznych viewport'ach (szczegolnie medium screens ~768-1024px).

**Problem hero na medium screens:** Na `md:` (768px+) ale ponizej `lg:` (1024px):
- Header jest `fixed top-0` z `py-2 md:py-4` + wewn. `py-3`, wiec ma ~60-72px wysokosci
- Hero ma `pt-28` (112px) co na mobile jest OK, ale na md nie ma `lg:pt-0` ani `lg:justify-center` (te sa dopiero od `lg:`)
- Content container ma `lg:-translate-y-36` ktory dopiero od `lg:` przesuwa w gore
- Na `md:` content jest naturalnie flow'owany od `pt-28`, co moze byc za blisko headera jezeli tytul jest duzy

### Plan naprawy

**Zasada:** Przestan uzywac `translate-y` do pozycjonowania sekcji (OPROCZ gryfa z hero - ten ma zostac). Zamiast tego uzyj odpowiednich `padding-top` / `padding-bottom` / `margin` / `gap`.

**Pliki do zmiany:**
- `src/components/sections/home-page/Hero.tsx`
- `src/components/sections/home-page/About.tsx`
- `src/components/sections/home-page/Features.tsx`
- `src/components/sections/home-page/FeaturedProjectsCarousel.tsx` (nowy odpowiednik PortfolioHighlights)
- `src/components/sections/home-page/Statistics.tsx`
- `src/components/sections/home-page/Technology.tsx`
- `src/components/sections/home-page/Contact.tsx`

**Krok 1: Hero - naprawic medium screen overlap**

Hero content container ma `lg:-translate-y-36`. To przesuwa content do gory dopiero na lg+. Na md content jest za wysoko bo `pt-28` jest za male.

Fix:
- Dodac `md:pt-36` (144px) zeby na medium screens content byl nizej i nie zadzial z headerem
- Zachowac `lg:pt-0 lg:justify-center` (desktop centering)
- NIE RUSZAC gryfa (`lg:translate-y-[30%]`) - bo to jest specjalne przesuniecie ktore ma zostac

```tsx
// Hero section className:
className="relative min-h-[90dvh] w-full flex flex-col items-center text-white overflow-visible
  pt-28 md:pt-36 pb-10 justify-start
  lg:justify-center lg:pt-0 lg:pb-0"

// Hero content container - USUNAC translate-y, zastapic padding:
className="container mx-auto px-4 relative z-20 flex flex-col items-center
  justify-start lg:justify-center lg:grow"
// Zamiast lg:-translate-y-36 uzyc lg:pb-32 (lub dostosowac pb zeby content
// byl wizualnie w dobrym miejscu bez psucia layout flow)
```

UWAGA: Poniewaz pozycja miedzy hero a about "ma zostac taka sama", trzeba dopilnowac zeby po usunieciu translate-y z hero content, about nie musial juz miec `lg:pt-64` kompensacji.

**Krok 2: About - zamienic `lg:pt-64` na normalne py**

Teraz About ma `py-section lg:pt-64` (256px top na desktop). To dlatego ze hero content jest przesuniete -translate-y-36 w gore, wiec about musi miec wiekszy top.

Po naprawie hero (krok 1):
- Jesli hero nie uzywa translate-y, about moze miec normalny padding: `py-section` lub `py-16 md:py-20 lg:py-24`
- Ale pamietaj: gryf w hero wciaz uzywa `translate-y-[30%]` i "wchodzi" w przestrzen About. About potrzebuje wiekszego `pt` na desktopie zeby gryf nie zaslonial contentu about.
- Dlatego: `py-section lg:pt-48` (zamiast 64) - dostosowac tak, zeby wizualnie odstep hero<->about byl taki sam jak teraz

**Krok 3: Sekcje ponizej About - zamienic negatywne marginy na normalne paddingi**

Kazda sekcja powinna miec sprojne `py-16 md:py-20 lg:py-24` (lub wariant, ale bez negatywnych margin-top):

- **Features:** `-mt-2.5` -> usunac, uzyc `py-16 md:py-20 lg:py-24`
- **FeaturedProjectsCarousel:** `-mt-12` -> usunac, uzyc `py-16 md:py-20`
- **Statistics:** `-mt-5` -> usunac, uzyc `py-16 md:py-24`
- **Technology:** `mt-2.5` -> usunac, uzyc `py-16 md:py-20` (zamiast `py-section mt-2.5`)
- **Contact:** `py-section mb-8` -> `py-16 md:py-20 lg:py-24` (usunac mb-8)

**Krok 4: Testowac na 3 breakpoints**

Po zmianach przetestowac na:
- Mobile: 375px
- Tablet: 768px (tu byl problem z overlapping)
- Desktop: 1280px+

Sprawdzic ze:
- Hero content nie jest zaslaniany przez header na zadnym breakpoint
- Gryf jest w tym samym miejscu co przed zmianami (nie ruszamy `lg:translate-y-[30%]`)
- Odstep hero<->about jest taki sam jak przed zmianami
- Pozostale sekcje maja rowne, spojne odstepy

### Oddzialywanie
- ~7 plikow sekcji do edycji (same klasy CSS)
- Zero zmian w logice JS/TS

---

## BUG 3: Technology.tsx - karuzela nie kreci sie na niektorych urzadzeniach

### Diagnoza

Karuzela w `Technology.tsx` uzywa recznie pisanej petli `requestAnimationFrame` (linie 117-153) do przesuwania elementow. Potencjalne problemy:

1. **`prefersReducedMotion` blokuje animacje calkowicie** (linia 78, 118): Na urzadzeniach z wlaczonym "Reduce Motion" (domyslne np. na niektorych Androidach lub starszych iOS) caly `useEffect` z rAF jest pomijany. Elementy zostaja w pozycji `translate3d(2000px, -50%, 0)` (linia 213) - calkowicie poza ekranem. Uzytkownik widzi puste miejsce.

2. **IntersectionObserver + isActive gate** (linie 65-75): Animacja uruchamia sie dopiero gdy sekcja jest widoczna. Jesli observer nigdy nie odpali (np. z powodu race condition przy SSR hydration na niektorych urzadzeniach), `isActive` zostaje `false` i nic sie nie dzieje.

3. **`visualViewport` nie jest dostepny wszedzie**: `window.visualViewport` nie jest wspierany na starszych urzadzeniach. Kod ma fallback (`|| window.innerWidth`), ale `window.visualViewport?.addEventListener("resize", ...)` moze cicho failowac.

4. **Brak initial positioning**: Elementy zaczynaja z `transform: translate3d(2000px, -50%, 0)` (offscreen w prawo). Dopiero rAF je przesuwa. Jesli rAF nie odpali (pkt 1-2), elementy sa niewidoczne.

5. **Tab backgrounding**: Kiedy uzytkownik przelacza tab, `rAF` jest wstrzymywany. Po powrocie, `cancelAnimationFrame` z cleanup moze nie zalapac starego rAF, i nowy effect moze nie uruchomic nowego rAF. Edge case, ale mozliwy.

### Plan naprawy

**Pliki do zmiany:**
- `src/components/sections/home-page/Technology.tsx`

**Krok 1: Zamienic rAF na CSS animation**

Zamiast recznie pisac `requestAnimationFrame` loop, uzyc CSS `@keyframes` z `animation: scroll Xs linear infinite`. To rozwiazuje:
- Nie jest blokowane przez `prefersReducedMotion` w logice JS (CSS `prefers-reduced-motion` moze byc obsluzony jak `@media (prefers-reduced-motion: reduce) { animation: none; }`)
- Nie wymaga IntersectionObserver do uruchomienia
- Nie ma problemu z tab backgrounding
- Jest bardziej wydajne (animacja na GPU)

Podejscie:
```tsx
// Render 2 kopie elementow obok siebie w kontenerze
// Kontener ma animation: scroll Xs linear infinite
// @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

<div className="flex animate-scroll">
  {/* Set 1 */}
  {items.map(item => <LogoItem key={...} item={item} />)}
  {/* Set 2 (duplicate for seamless loop) */}
  {items.map(item => <LogoItem key={...} item={item} />)}
</div>
```

To standardowy pattern "infinite CSS scroll" uzywany powszechnie i dzialajacy na wszystkich urzadzeniach.

**Krok 2: Obsluzyc `prefers-reduced-motion` gracefully**

Zamiast ukrywac caly element (jak teraz - elementy sa offscreen), po prostu zatrzymac animacje:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-scroll {
    animation-play-state: paused;
  }
}
```

Elementy sa widoczne, po prostu sie nie ruszaja.

**Krok 3: Usunac caly kod rAF, IntersectionObserver, positionsRef, resizeTimeout**

Po przejsciu na CSS animation mozna usunac:
- `positionsRef`, `rafRef`, `itemsRef`, `lastWidthRef`, `resizeTimeoutRef`
- `isActive` state + IntersectionObserver useEffect
- `logoCount` + `computeCount` logike
- 3 `useEffect`y (linie 51-153)
- Image preloading (opcjonalnie zachowac dla performance, ale nie jest required)

Komponent skurczy sie z ~245 linii do ~80.

### Oddzialywanie
- Tylko `Technology.tsx`
- Duze uproszczenie kodu (usunac ~160 linii, dodac ~40)
- Dodac klase `animate-scroll` w `globals.css` lub tailwind plugin

---

## BUG 4: Features mobile carousel - ujednolicic z FeaturedProjectsCarousel

### Diagnoza

**Obecny stan:**
- `FeaturedProjectsCarousel.tsx` (karuzela portfolio na stronie glownej) - renderuje karty z obrazkiem, tytulem, opisem i linkiem. Karuzela wyswietla sie ZAWSZE (desktop i mobile).
- `Features.tsx` - na desktop renderuje grid 3-kolumnowy, na mobile renderuje karuzele (`md:hidden`). Karuzela ma inne parametry:
  - Inna zawartosc karty (FeatureCardContent z obrazkiem, tytulem i opisem - ale bez linka)
  - Ten sam layout carousel (3 cards, offset, scale parametry juz dopasowane po ostatniej refaktoryzacji)
  - Inne klasy CSS: karty features maja border+bg, karty portfolio maja inny bg

**Cel:** Features mobile carousel ma byc 1:1 kopia logiki carousel z FeaturedProjectsCarousel (te same animacje, parametry, uklad controlsow). Tresc kart oczywiscie bedzie inna (feature vs project), ale wrapper carousel powinien byc wspoldzielony.

### Plan naprawy

**Pliki do zmiany (lub utworzenia):**
- `src/components/ui/composites/Carousel3D.tsx` (NOWY - shared carousel shell)
- `src/components/sections/home-page/Features.tsx` (refactor mobile part)
- `src/components/sections/home-page/FeaturedProjectsCarousel.tsx` (refactor carousel part)

**Krok 1: Wydzielic wspolny `Carousel3D` component**

Stworzyc generyczny komponent karuzeli 3D ktory przyjmuje:
```tsx
interface Carousel3DProps {
  items: React.ReactNode[];         // Lista kart do wyswietlenia
  controlLabels: { prev: string; next: string };
  initialIndex?: number;            // Domyslnie 1
  className?: string;               // Klasy dla containera
  containerHeight?: string;         // np. "h-125"
}
```

Cala logika karuzeli (useState index, getIndex, handleNext/Prev, AnimatePresence, offsety, scale, rotateY, przycisk prev/next) jest identyczna miedzy Features i FeaturedProjectsCarousel. Wydzielic ja do `Carousel3D`.

**Krok 2: Uzyc `Carousel3D` w `FeaturedProjectsCarousel`**

```tsx
<Carousel3D
  items={projects.map(project => (
    <ProjectCard project={project} locale={locale} isCenter={???} />
  ))}
  controlLabels={controlLabels}
/>
```

UWAGA: Jeden problem - `isCenter` musi byc znany wewnatrz Carousel3D, nie na zewnatrz. Rozwiazanie: `Carousel3D` powinien przyjmowac `renderItem` zamiast gotowych `React.ReactNode`:

```tsx
interface Carousel3DProps<T> {
  items: T[];
  renderItem: (item: T, isCenter: boolean) => React.ReactNode;
  controlLabels: { prev: string; next: string };
  initialIndex?: number;
  className?: string;
}
```

**Krok 3: Uzyc `Carousel3D` w `Features` mobile view**

```tsx
{/* Mobile */}
<div className="md:hidden">
  <Carousel3D
    items={features}
    renderItem={(feature, isCenter) => (
      <div className={`p-6 rounded-2xl border ... ${isCenter ? 'border-blue-500/60 ...' : ''}`}>
        <FeatureCardContent feature={feature} />
      </div>
    )}
    controlLabels={controlLabels}
    initialIndex={0}
  />
</div>
```

**Krok 4: Usunac zduplikowana logika carousel z Features i FeaturedProjectsCarousel**

Po wydzieleniu `Carousel3D`, z obu komponentow mozna usunac:
- `useState(currentIndex)`, `getIndex`, `handleNext`, `handlePrev`
- `AnimatePresence` + `motion.div` wrapper z parametrami offset/scale/rotateY
- Przyciski prev/next

### Oddzialywanie
- 1 nowy plik: `Carousel3D.tsx` (~70 linii)
- 2 pliki zrefaktorowane: `Features.tsx`, `FeaturedProjectsCarousel.tsx` (kazdy traci ~40-50 linii)
- Gwarancja ze obie karuzele zachowuja sie identycznie (bo uzywaja tego samego kodu)
- Latwiejsze utrzymanie - zmiana w carousel w jednym miejscu propaguje sie do obu
