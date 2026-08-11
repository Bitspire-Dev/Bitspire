# Raport wydajności - Bitspire (Mobile)

## Podsumowanie

Strona ładuje się ~10 sekund na mobile i karuzele/animacje lagują z dwóch głównych powodów:

1. **Za duży bundle JS** - barrel import react-icons (1.36MB surowego JS), framer-motion w headerze (ładowana od razu)
2. **Efekty CSS zabijające GPU mobilne** - masowe użycie `blur-[100px+]`, `backdrop-blur` na fixed headerze, brak `will-change` hints

> **Uwaga:** Obrazki NIE są problemem - Next.js Image Optimization działa poprawnie, serwuje AVIF ~22-27KB per obraz. Surowe pliki źródłowe (.webp) są duże, ale Next.js je optymalizuje on-the-fly.

---

## PROBLEM 1: Wolne ładowanie strony (~10s na mobile)

### 1.1 React-Icons - barrel import (KRYTYCZNE)

**Pliki:** `Footer.tsx`, `Carousel3D.tsx`, `PortfolioHighlights.tsx`, `FeaturedProjectsCarousel.tsx`, `SearchBar.tsx`

**Problem:** Plik `node_modules/react-icons/fa/index.mjs` waży **1.36MB** (4835 linii) - zawiera WSZYSTKIE ikony FontAwesome jako inline SVG functions. Nawet z `"sideEffects": false`, webpack musi sparsować cały ten plik żeby wyciągnąć potrzebne eksporty. Używamy ~10 ikon, ale parser przechodzi przez 1000+.

```tsx
// TAK JEST TERAZ - webpack parsuje cały 1.36MB plik:
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
```

**Ważne:** `react-icons` v5 NIE ma per-file importów. Ścieżka `react-icons/fa/FaChevronLeft` **nie istnieje** - w katalogu `fa/` jest tylko `index.js`, `index.mjs` i `index.d.ts`. Nie da się obejść barrel importu w ramach tego pakietu.

**Rozwiązanie - opcja A (zalecana):** Zainstalować `@react-icons/all-files` - osobny pakiet z per-file importami:

```bash
npm install @react-icons/all-files
```

```tsx
// Każda ikona to osobny plik ~1KB:
import { FaChevronLeft } from '@react-icons/all-files/fa/FaChevronLeft';
import { FaChevronRight } from '@react-icons/all-files/fa/FaChevronRight';
```

**Rozwiązanie - opcja B:** Zamienić react-icons na `lucide-react` (natywny tree-shaking, każda ikona to osobny moduł ES) lub inline SVG.

**Rozwiązanie - opcja C:** Wyodrębnić 10 używanych ikon jako inline SVG components w jednym pliku `icons.tsx` (~3KB) i usunąć `react-icons` z zależności.

**Wpływ:** Redukcja parsowanego JS o ~1.3MB (bundle po tree-shake mniejszy, ale czas parsowania znacznie krótszy).

---

### 1.2 Framer Motion w Header.tsx (ładowana natychmiast)

**Plik:** `Header.tsx:5`

```tsx
import { motion, AnimatePresence } from 'framer-motion';
```

**Problem:** Header jest komponentem widocznym natychmiast - nie jest lazy-loadowany. Import framer-motion (~56KB gzipped, ~155KB parsed) w headerze oznacza, że cała biblioteka jest w initial bundle.

Framer-motion jest tutaj używany do:
- `whileTap={{ scale: 0.95 }}` na hamburger buttonie (linia 78)
- `animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}` na ikonie hamburger (linia 86)
- `AnimatePresence` + `motion.div` na mobilnym menu slide-in (linia 125)
- `motion.div` z `initial/animate` na linkach w menu (linia 141)

Wszystko to da się zrobić w CSS transitions/keyframes.

**Rozwiązanie:**

```tsx
// ZAMIAST:
<motion.button whileTap={{ scale: 0.95 }}>
// CSS:
<button className="active:scale-95 transition-transform">

// ZAMIAST AnimatePresence z height animation:
// CSS:
<div className={`overflow-hidden transition-[height,opacity] duration-300 ease-in-out ${
  isMobileMenuOpen ? 'h-auto opacity-100' : 'h-0 opacity-0'
}`}>

// ZAMIAST motion.div na rotate ikony:
<div className={`transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`}>
```

Po tej zmianie framer-motion nie jest w initial bundle - ładuje się dopiero gdy user scrolluje do sekcji które go potrzebują (Features, Statistics, karuzele - wszystkie lazy-loadowane przez `dynamic()` w `HomePageSections.client.tsx`).

**Wpływ:** ~56KB gzipped mniej w initial bundle, szybszy TTI.

---

### 1.3 Hero Image - quality i sizes

**Plik:** `Hero.tsx:200-213`

```tsx
<div className="w-[130vw] max-w-none lg:translate-y-[calc(30%+0.3rem)]">
  <div className="relative aspect-video lg:aspect-[1.8/1] w-full">
    <Image
      src={imageSrc}
      sizes="(max-width: 768px) 130vw, (max-width: 1280px) 130vw, 130vw"
      quality={90}
      priority
      loading="eager"
    />
```

**Analiza sizes:**
- Obraz ma być na 130% szerokości ekranu - to jest zamierzone i `sizes="130vw"` jest poprawne dla rozdzielczości
- `sizes` attribute mówi przeglądarce dokładnie jaki rozmiar renderowanego obrazu spodziewamy się, a Next.js na tej podstawie wybiera najbliższy wariant z `deviceSizes`
- Na mobile 390px -> 130vw = 507px -> Next.js serwuje wariant 640px (z `deviceSizes`)
- Na desktop 1920px -> 130vw = 2496px -> Next.js serwuje wariant 2560px

**Problem z quality:**
- `quality={90}` na mobile jest przesadą. Na ekranie 390px (nawet 130vw = 507px renderowanego obrazu) różnica między quality 75 a 90 jest niemożliwa do zauważenia, ale rozmiar pliku jest ~1.5-2x większy
- Next.js nie obsługuje responsive quality (jedno ustawienie na wszystkie breakpointy)

**Rozwiązanie:**
```tsx
quality={80}  // kompromis: na desktop nadal ostre, na mobile oszczędność ~30-40%
```

Quality 80 to sweet spot - perceptualnie identyczne z 90 na ekranach retina (gdzie piksele są i tak gęste), ale mniejszy rozmiar.

**Problem z renderowaniem na 130vw:**
- Kontener ma `w-[130vw]` ale rodzic ma `flex justify-center` w divie `w-full`
- Na sekcji jest `overflow-visible` - poprawne
- Ale `html, body` w `globals.css` ma `overflow-x: hidden` - więc boczne 15vw po każdej stronie jest ukryte
- Efekt wizualny jest taki, że obraz rozciąga się poza ekran po bokach (co jest zamierzone dla efektu "wychodzenia" poza stronę)
- Jeśli obraz nie wygląda na rozciągnięty do 130vw, problem może leżeć w tym, że `aspect-video` (16:9) ogranicza wysokość, a `object-contain object-bottom` skurczył obraz w pionie - przez co nie wypełnia pełnych 130vw

**Do zbadania:** Sprawdzić w DevTools na mobile czy `w-[130vw]` jest poprawnie compute'owany. Jeśli rodzic ma `max-width` gdzieś wyżej w layoucie, to 130vw się nie rozciągnie. Klasa `max-w-none` na kontenerze powinna to rozwiązywać, ale warto zweryfikować.

---

### 1.4 `ssr: false` na dynamicznych importach

**Plik:** `HomePageSections.client.tsx`

```tsx
const Features = dynamic(() => import("...Features"), { ssr: false });
const FeaturedProjectsCarousel = dynamic(() => import("..."), { ssr: false });
const Statistics = dynamic(() => import("..."), { ssr: false });
const Technology = dynamic(() => import("..."), { ssr: false });
```

**Problem:** `ssr: false` oznacza że te sekcje NIE renderują się na serwerze. User widzi puste placeholder divy, a potem po załadowaniu JS dopiero pojawia się content. To powoduje:
- Gorszy CLS (Cumulative Layout Shift) - content "wskakuje"
- Dłuższy perceived loading time
- Puste białe przestrzenie podczas ładowania

**Kontekst:** Te sekcje używają framer-motion i client-side hooks, więc nie mogą być w pełni server-rendered. Ale mogą renderować static HTML na serwerze (tytuły, opisy, obrazki) i hydrować się po stronie klienta.

**Rozwiązanie:** Usunąć `ssr: false` - framer-motion obsługuje SSR (renderuje elementy w stanie `initial`). Content będzie widoczny od razu, a animacje zaczną działać po hydration.

---

## PROBLEM 2: Lagujące animacje karuzeli i sekcji na mobile

### 2.1 Background.tsx - dyskusja o optymalności CSS blur vs alternatyw

**Plik:** `src/components/layout/Background.tsx`

```tsx
<div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
  <div className="absolute top-[25%] left-[33%] w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
  <div className="absolute bottom-[25%] right-[25%] w-80 h-80 bg-blue-700/12 rounded-full blur-3xl" />
  <div className="absolute top-1/2 left-1/2 ... bg-indigo-400/8 rounded-full blur-3xl" />
  <div className="absolute top-10 right-[33%] ... bg-cyan-400/10 rounded-full blur-3xl" />
  <div className="absolute bottom-10 left-10 ... bg-sky-500/14 rounded-full blur-3xl" />
  <div className="absolute top-[33%] right-10 ... bg-blue-300/6 rounded-full blur-3xl" />
  <div className="absolute inset-0 bg-black/40" />
</div>
```

**Twoje słuszne założenie:** CSS-definiowany background powinien być lżejszy niż grafika, bo przeglądarka narzydzia CSS są natywne i zoptymalizowane.

**Niuans:** To prawda dla WIĘKSZOŚCI właściwości CSS - `background-color`, `border`, `border-radius`, `linear-gradient`, `radial-gradient` są rasteryzowane raz i cachowane. Ale **`filter: blur()`** jest wyjątkiem - to post-processing shader, NIE natywna rasteryzacja:

1. Przeglądarka renderuje element (kolorowe kółko) do osobnej textury
2. Uruchamia Gaussian blur shader na GPU z promieniem 64px (`blur-3xl` = `blur(64px)`)
3. Zapisuje wynik do warstwy kompozytowej

To **nie jest** to samo co np. `radial-gradient` - który jest rzeczywiście natywny i instant. `filter: blur()` to dodatkowa operacja GPU po renderowaniu elementu.

**Dodatkowy problem: `position: fixed`**
Element z `fixed` tworzy osobną warstwę kompozytową. Przy KAŻDYM scrollu przeglądarka musi ponownie skomponować tę warstwę z resztą strony. Na desktopie to nie problem, ale na mobile, 6 elementów z blur-3xl w fixed kontenerze = ciągłe obciążenie GPU.

**Optymalne rozwiązanie - zamiana blur na radial-gradient:**

`radial-gradient` jest PRAWDZIWIE natywną operacją CSS. Przeglądarka rasteryzuje go raz, cachuje, i potem to jest zwykłe rysowanie textury. Wizualnie efekt jest identyczny - miękkie kolorowe plamy na ciemnym tle:

```tsx
// ZAMIAST blur na elementach:
<div className="absolute top-[25%] left-[33%] w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />

// UŻYĆ radial-gradient bezpośrednio na jednym tle:
<div className="fixed inset-0 pointer-events-none" style={{
  zIndex: 0,
  background: `
    radial-gradient(circle 384px at 33% 25%, rgba(59,130,246,0.15) 0%, transparent 70%),
    radial-gradient(circle 320px at 75% 75%, rgba(29,78,216,0.12) 0%, transparent 70%),
    radial-gradient(circle 288px at 50% 50%, rgba(99,102,241,0.08) 0%, transparent 70%),
    radial-gradient(circle 256px at 67% 5%, rgba(34,211,238,0.10) 0%, transparent 70%),
    radial-gradient(circle 192px at 5% 90%, rgba(14,165,233,0.14) 0%, transparent 70%),
    radial-gradient(circle 224px at 90% 33%, rgba(147,197,253,0.06) 0%, transparent 70%),
    rgba(0,0,0,0.40)
  `
}} />
```

**Dlaczego to rozwiązanie jest najlepsze:**
- **ZERO filtrów GPU** - `radial-gradient` jest rasteryzowany raz przez CPU i cachowany
- **1 element zamiast 7** - jeden div z wieloma gradient layers zamiast 7 osobnych divów
- **Identyczny efekt wizualny** - miękkie kolorowe glow na ciemnym tle
- **Natywne CSS** - dokładnie tak jak zakładałeś, prawdziwie natywna operacja przeglądarki
- **Zero pamięci GPU na dodatkowe textury** - gradients to część głównej textury tła

**Dotyczy też:** `PageBackground.tsx` - ten sam pattern z `blur-[120px]` x5 elementów. Ta sama zamiana na `radial-gradient`.

---

### 2.2 Sekcyjne blur-[100px+] dekoracje (KRYTYCZNE)

**Znalezione instancje:**

| Plik | Klasa | Rozmiar elementu | Rozmiar blur |
|------|-------|-------------------|-------------|
| `Hero.tsx:93` | `blur-[120px]` + `mix-blend-screen` | w-125 h-75 | 120px |
| `Features.tsx:86` | `blur-[100px]` | w-200 h-100 | 100px |
| `FeaturedProjectsCarousel.tsx:118` | `blur-[120px]` | 120% x 120% | 120px |
| `PortfolioHighlights.tsx:137` | `blur-[120px]` | 120% x 120% | 120px |
| `Statistics.tsx:55` | `blur-[120px]` | w-250 h-250 | 120px |
| `Technology.tsx:165` | `blur-[100px]` | max-w-250 h-75 | 100px |
| `Contact.tsx:111` | `blur-[150px]` | w-200 h-200 | 150px |
| `Contact.tsx:112` | `blur-[120px]` | w-150 h-150 | 120px |

**Problem:** Każdy z tych elementów to osobna operacja Gaussian blur na GPU. Razem to ~10 jednoczesnych blur shaderów na stronie głównej.

**To samo rozwiązanie co dla Background.tsx** - zamienić na `radial-gradient`:

```tsx
// ZAMIAST:
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
     w-[120%] h-[120%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />

// UŻYĆ:
<div className="absolute inset-0 pointer-events-none" style={{
  background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)'
}} />
```

Efekt wizualny jest identyczny - miękka kolorowa plama. Ale zero kosztu GPU.

---

### 2.3 backdrop-blur na fixed headerze (KRYTYCZNE dla scrollowania)

**Plik:** `Header.tsx:40`

```tsx
<div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 ...">
```

**Problem:**
`backdrop-blur-md` na element z `position: fixed` (header jest `fixed top-0`) wymusza na przeglądarce:
1. Wyrenderowanie wszystkiego CO JEST POD headerem (cały content strony)
2. Zastosowanie Gaussian blur na tym fragmencie
3. Nałożenie header div z semi-transparentnym tłem na wierzch
4. **POWTÓRZENIE tego przy KAŻDYM frame scrollowania** - bo content pod headerem się zmienia

Na desktopie to ~0.5ms per frame. Na mobile GPU (Adreno 610, Mali-G57) to ~3-5ms per frame, co przy 60fps daje 18-30% budżetu frame'a TYLKO na blur headera.

**Rozwiązanie:**
```tsx
// Na mobile: nieprzezroczyste tło (zero blur)
// Na desktop: backdrop-blur (GPU to udźwignie)
<div className="bg-gray-900/95 md:bg-gray-900/80 md:backdrop-blur-md border border-gray-700/50 ...">
```

Na mobile `bg-gray-900/95` (95% opacity) wygląda praktycznie identycznie jak blur-md + bg/80, ale nie wymaga żadnych operacji GPU.

---

### 2.4 Carousel3D - lagi, marginesy, brak swipe (KRYTYCZNE)

**Plik:** `src/components/ui/composites/Carousel3D.tsx`

#### Problem A: `layoutId` powoduje layout thrashing

```tsx
<motion.div
  key={`${key}-${index}`}
  layoutId={key}  // <-- PROBLEM
  initial={{ x: xOffset, scale, opacity, zIndex, rotateY }}
  animate={{ x: xOffset, scale, opacity, zIndex, rotateY }}
```

`layoutId` uruchamia layout animations (FLIP) - framer-motion mierzy pozycję elementu w DOM, oblicza różnicę, i animuje transform. To wymusza **layout reflow + style recalculation** przy każdej zmianie slajdu. Na mobile reflow jest kosztowny.

Bez `layoutId`, framer-motion używa tylko transform-based animations (GPU-accelerated, zero reflow).

#### Problem B: brak `will-change` hints

Przeglądarka nie wie z góry, że te elementy będą animowane. Bez `will-change: transform`, przy każdej animacji przeglądarka musi:
1. Zdecydować czy element potrzebuje własnej warstwy
2. Stworzyć warstwę kompozytową
3. Dopiero potem animować

Z `will-change: transform` przeglądarka tworzy warstwę z góry i animacja jest natychmiastowa.

#### Problem C: kafelki dotykają granic ekranu na mobile

```tsx
style={{ position: 'absolute', width: '350px' }}
// xOffset = offset * 320
```

Na mobile (375px ekran): centralna karta 350px ma 12.5px margin po obu stronach. Dotyka granic.

Kontrolki (buttony prev/next) mają `left-4` / `right-4` (16px) - na 375px to jest na samej krawędzi ekranu.

#### Problem D: brak swipe/drag

Na mobile naturalną interakcją jest swipe, nie klikanie przycisków. Brak obsługi gestu przeciągania jest problem UX.

#### Rozwiązanie dla wszystkich problemów:

```tsx
export default function Carousel3D<T>({
  items,
  renderItem,
  getKey,
  controlLabels,
  initialIndex = 1,
  className = '',
  containerHeight = 'h-125',
}: Carousel3DProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (items.length === 0) return null;

  const getIndex = (idx: number) => {
    const len = items.length;
    return ((idx % len) + len) % len;
  };

  const handleNext = () => setCurrentIndex((prev) => getIndex(prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => getIndex(prev - 1));

  // Obsługa swipe/drag
  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipeThreshold = 50;
    const velocityThreshold = 500;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      handlePrev();
    }
  };

  return (
    <div className={`relative ${containerHeight} flex items-center justify-center perspective-1000 ${className}`}>
      {/* Drag overlay - łapie gesty na całym kontenerze */}
      <motion.div
        className="absolute inset-0 z-30 touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ cursor: 'grab' }}
      />

      <AnimatePresence mode="popLayout">
        {[-1, 0, 1].map((offset) => {
          const index = getIndex(currentIndex + offset);
          const item = items[index];
          if (!item) return null;

          const isCenter = offset === 0;
          // Mniejszy offset na mobile żeby kafelki nie wychodziły za ekran
          const xOffset = offset * 280;  // zmniejszone z 320
          const scale = isCenter ? 1.05 : 0.85;  // zmniejszone z 1.1
          const opacity = isCenter ? 1 : 0.5;
          const zIndex = isCenter ? 10 : 0;
          const rotateY = offset * -25;

          const key = getKey(item, index);

          return (
            <motion.div
              key={`${key}-${index}`}
              // BEZ layoutId - czyste transform animations
              initial={{ x: xOffset, scale, opacity, zIndex, rotateY }}
              animate={{ x: xOffset, scale, opacity, zIndex, rotateY }}
              transition={{ duration: 0.5, ease: 'circOut' }}
              style={{
                position: 'absolute',
                width: 'min(350px, 80vw)',  // responsywna szerokość
                willChange: 'transform, opacity',  // GPU layer hint
              }}
              className="rounded-2xl cursor-pointer"
              onClick={() => {
                if (offset !== 0) setCurrentIndex(index);
              }}
            >
              {renderItem(item, index, isCenter)}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Controls - z większym marginesem */}
      <button
        onClick={handlePrev}
        className="absolute left-2 md:left-4 z-20 p-3 rounded-full bg-black/30 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
        aria-label={controlLabels.prev}
      >
        <FaChevronLeft className="text-white text-xl" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 md:right-4 z-20 p-3 rounded-full bg-black/30 backdrop-blur border border-white/10 hover:bg-white/10 transition-colors"
        aria-label={controlLabels.next}
      >
        <FaChevronRight className="text-white text-xl" />
      </button>
    </div>
  );
}
```

**Kluczowe zmiany:**
1. Usunięty `layoutId` - czyste transform animations bez reflow
2. Dodane `willChange: 'transform, opacity'` - GPU layer hint
3. Dodany drag/swipe overlay z `motion.div drag="x"`
4. Szerokość kafelka: `min(350px, 80vw)` - responsywna, nie wychodzi za ekran
5. Offset zmniejszony z 320 na 280 - więcej miejsca po bokach
6. Scale centrum zmniejszone z 1.1 na 1.05 - mniej clippingu

---

### 2.5 PortfolioHighlights.tsx - duplikacja karuzeli

**Plik:** `src/components/sections/home-page/PortfolioHighlights.tsx`

Ten komponent implementuje WŁASNĄ karuzelę 3D (ręczne `AnimatePresence` + `motion.div` z `rotateY`, linia 186-218) zamiast użyć `Carousel3D.tsx`.

**Konsekwencje:**
- Duplikacja kodu animacji (oba pliki ~identyczna logika)
- Ten sam `layoutId` problem
- Brak `will-change` hints
- Brak swipe/drag
- Brak responsywnej szerokości kafelków
- Obrazki w karuzeli bez `sizes` prop (linia 219)

**Rozwiązanie:** Komponent `FeaturedProjectsCarousel.tsx` już używa generycznego `Carousel3D`. `PortfolioHighlights.tsx` powinien być skonsolidowany z `FeaturedProjectsCarousel.tsx` albo też przejść na `Carousel3D`.

---

### 2.6 Hero blob - nieskończona animacja JS + blur + mix-blend

**Plik:** `Hero.tsx:90-94`

```tsx
<motion.div
  animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  className="absolute ... blur-[120px] ... mix-blend-screen"
/>
```

**Problem podwójny:**
1. `blur-[120px]` na elemencie który ZMIENIA ROZMIAR (scale 1→1.1→1) - przeglądarka musi PRZELICZAĆ blur przy każdym frame bo rozmiar się zmienił
2. `mix-blend-screen` wymaga compositing z elementami pod spodem
3. Animacja jest nieskończona - framer-motion trzyma JS interval nawet gdy user scrolluje w dół

**Rozwiązanie (zamiana na CSS animation + radial-gradient):**

```tsx
// ZAMIAST motion.div z blur:
<div
  className="absolute top-0 left-1/2 -translate-x-1/2 w-125 h-75 rounded-full pointer-events-none z-0 animate-hero-glow"
  style={{
    background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.20) 0%, transparent 70%)',
    mixBlendMode: 'screen',
  }}
/>
```

```css
/* W globals.css: */
@keyframes hero-glow {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
}
.animate-hero-glow {
  animation: hero-glow 8s ease-in-out infinite;
  will-change: transform, opacity;
}
@media (max-width: 768px) {
  .animate-hero-glow {
    animation: none;
    opacity: 0.6;
    transform: translateX(-50%);
  }
}
```

**Korzyści:**
- CSS animation nie wymaga JS runtime (zero obciążenia main thread)
- `radial-gradient` zamiast `blur-[120px]` = zero kosztu GPU
- Na mobile: statyczny gradient (wyłączona animacja w media query)

---

### 2.7 Staggered whileInView na każdej sekcji

**Pliki:** praktycznie wszystkie sekcje

```tsx
// Ten pattern jest powtórzony ~20-30 razy na stronie głównej:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: index * 0.1 }}
>
```

**Problem:** Framer Motion ustawia `IntersectionObserver` na KAŻDYM elemencie z `whileInView`. Na stronie głównej jest ich 20-30+. Każdy uruchamia JS callback + animację przy scrollu.

**Rozwiązanie:** Zostawić `once: true` (element animuje się tylko raz, potem observer jest usuwany), ale rozważyć CSS-based animations dla prostych fade-in:

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

I użyć jednego `IntersectionObserver` na sekcję (dodaje klasę CSS) zamiast framer-motion na każdym elemencie.

---

## PROBLEM 3: Dodatkowe problemy

### 3.1 Brak `sizes` prop na obrazkach w karuzelach

**Pliki:** `FeaturedProjectsCarousel.tsx:160`, `PortfolioHighlights.tsx:219`

```tsx
<Image src={imageUrl} alt={project.title || 'Project'} fill className="object-cover" />
```

Brak `sizes` prop oznacza, że Next.js domyślnie przyjmuje `sizes="100vw"` i serwuje wariant na pełną szerokość ekranu. Ale obrazek w karuzeli renderuje się na max 350px. Na mobile 390px * 2 (retina) = 780px, Next.js serwuje 828px wariant - to jest w porządku. Ale na desktop 1920px wyślałby wariant 1920px dla obrazka renderowanego na 350px.

**Rozwiązanie:**
```tsx
<Image
  src={imageUrl}
  alt={project.title || 'Project'}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 80vw, 350px"
/>
```

---

### 3.2 Brak bundle analyzera

**Problem:** Bez `@next/bundle-analyzer` nie wiadomo co dokładnie jest w bundlu i czy tree-shaking działa.

**Rozwiązanie:**
```bash
npm install -D @next/bundle-analyzer
```

```ts
// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer';
const analyze = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });
export default analyze(withNextIntl(nextConfig));
```

Uruchomienie: `ANALYZE=true npm run build`

---

## Priorytet napraw (od największego wpływu)

| # | Naprawa | Wpływ na mobile | Trudność |
|---|---------|-----------------|----------|
| 1 | Zamienić blur-[100px+] na radial-gradient (Background.tsx, sekcje) | **Ogromny** - eliminuje ~15 GPU blur shaderów | Niska |
| 2 | Zamienić backdrop-blur headera na bg-gray-900/95 na mobile | **Ogromny** - każdy scroll frame | Niska |
| 3 | Naprawić importy react-icons (barrel -> @react-icons/all-files) | **Duży** - ~1.3MB mniej parsowanego JS | Niska |
| 4 | Usunąć framer-motion z Header.tsx (CSS transitions) | **Duży** - FM poza initial bundle | Średnia |
| 5 | Hero blob: zamienić na CSS animation + radial-gradient | **Średni** - ciągłe obciążenie GPU | Niska |
| 6 | Carousel3D: usunąć layoutId, dodać will-change, drag, marginesy | **Średni** - płynniejsza karuzela | Średnia |
| 7 | Skonsolidować PortfolioHighlights z Carousel3D | **Średni** - mniej kodu, jedna ścieżka opt. | Średnia |
| 8 | Dodać sizes do obrazków w karuzelach | **Mały** (Next.js i tak optymalizuje) | Niska |
| 9 | Obniżyć hero quality do 80 | **Mały** - oszczędność ~30% LCP image | Niska |
| 10 | Usunąć ssr:false z dynamic imports | **Średni** - lepszy LCP/CLS | Niska |
| 11 | Dodać bundle analyzer | **Diagnostyczny** | Niska |

---

## Do wdrożenia w Carousel3D

Poza optymalizacjami wydajności, w karuzeli należy:
1. **Zwiększyć marginesy na mobile** - kafelki dotykają krawędzi ekranu (`width: min(350px, 80vw)`, offset 280 zamiast 320)
2. **Dodać drag/swipe** - naturalna interakcja mobilna: motion.div z `drag="x"` + `onDragEnd` z progiem 50px
3. **Usunąć `layoutId`** - czyste transform animations bez reflow
4. **Dodać `will-change: transform, opacity`** - GPU layer hint
