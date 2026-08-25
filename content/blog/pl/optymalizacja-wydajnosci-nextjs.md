---
title: Optymalizacja wydajności Next.js
canonical: nextjs-performance-optimization
description: Sprawdzone techniki przyspieszania aplikacji opartych na Next.js.
cover: /blog/nextjs-performance-optimization.png
tags:
  - Next.js
  - Wydajność
  - Optymalizacja
date: '2024-02-20'
author:
  name: Bitspire Team
  role: Autor
  bio: Artykuł przygotowany przez Bitspire. Tworzymy szybkie i nowoczesne strony oraz aplikacje webowe.
  link: /o-nas
---

## Wprowadzenie

Next.js to jeden z najpopularniejszych frameworków React do budowania nowoczesnych aplikacji webowych. Oferuje wiele narzędzi wydajnościowych out of the box, ale uzyskanie dobrych Core Web Vitals i płynnego doświadczenia użytkownika wymaga świadomych decyzji. Ten przewodnik wyjaśnia, jak optymalizować aplikację Next.js: od strategii renderowania i obrazów, przez cache'owanie, czcionki, aż po monitoring.

Niezależnie od tego, czy używasz App Router czy Pages Router, poniższe zasady pomogą przyspieszyć stronę, poprawić pozycję w wyszukiwarkach i utrzymać zaangażowanie użytkowników.

## Dlaczego wydajność Next.js ma znaczenie

Wydajność to nie tylko kwestia techniczna. Wpływa bezpośrednio na satysfakcję użytkownika, współczynniki konwersji i rankingi w wyszukiwarkach. Google używa Core Web Vitals jako sygnałów rankingowych, a użytkownicy szybko opuszczają wolne strony. Optymalizacja Next.js to jeden z najskuteczniejszych sposobów na poprawę:

- **Widoczności organicznej** — szybsze strony mają większe szanse na wyższą pozycję.
- **Zaangażowania użytkowników** — niższy współczynnik odrzuceń i dłuższe sesje.
- **Konwersji** — każda sekunda opóźnienia może obniżać współczynnik konwersji.
- **Dostępności** — wolne strony są trudniejsze w użyciu na słabszych urządzeniach i sieciach.

## Wybór odpowiedniej strategii renderowania

### App Router vs Pages Router

Next.js 13 wprowadził App Router, oparty na React Server Components. Daje większą kontrolę nad tym, co działa na serwerze, a co trafia do przeglądarki. Pages Router wykorzystuje `getStaticProps`, `getServerSideProps` i `getInitialProps`. Oba mogą być szybkie, ale App Router zazwyczaj ułatwia redukcję JavaScriptu po stronie klienta.

### React Server Components

React Server Components renderują się na serwerze i nigdy nie wysyłają swojego kodu do przeglądarki. Użyj ich do treści statycznych, szkieletów layoutu, list i każdego UI, które nie wymaga interakcji. To jeden z najskuteczniejszych sposobów na zmniejszenie rozmiaru paczki klienta.

### Client Components

Client Components są potrzebne do formularzy, karuzel, map, animacji i wszystkiego, co korzysta z API przeglądarki lub stanu React. Trzymaj dyrektywę `'use client'` jak najbliżej liści drzewa komponentów, aby nie zamieniać dużych jego części na bundle klienta.

### Static Site Generation (SSG)

Przy SSG strony renderowane są w czasie budowania. To najszybsza opcja dla użytkowników, ponieważ otrzymują gotowy plik HTML. Użyj SSG dla stron marketingowych, dokumentacji, blogów i treści, które nie zmieniają się per użytkownik.

### Server-Side Rendering (SSR)

SSR renderuje stronę na serwerze przy każdym żądaniu. Jest przydatny, gdy treść musi być spersonalizowana lub nie może być zbudowana z wyprzedzeniem. SSR poprawia TTFB dla danych dynamicznych, ale zwiększa obciążenie serwera i może dodać opóźnienia.

### Incremental Static Regeneration (ISR)

ISR pozwala aktualizować strony statyczne po buildzie bez pełnego redeployu. Łączy szybkość SSG ze świeżością treści dynamicznych. Skonfiguruj interwały `revalidate`, aby strony były aktualne, a jednocześnie obsługiwać większość ruchu z cache.

### Kiedy używać której strategii

| Zastosowanie                            | Rekomendowana strategia               |
| --------------------------------------- | ------------------------------------- |
| Strona marketingowa, blog, dokumentacja | SSG lub ISR                           |
| Spersonalizowany dashboard              | SSR z cache                           |
| Dane w czasie rzeczywistym              | SSR lub pobieranie po stronie klienta |
| Interaktywne widgety                    | Client Components w szkielecie SSG    |

## Optymalizacja obrazów w Next.js

### Używaj komponentu Image

`next/image` to jedna z najbardziej wpływowych optymalizacji. Zapewnia automatyczny lazy loading, responsywne rozmiary i nowoczesne formaty. Zamień natywne `img` na `<Image>` i podaj `sizes` oraz `priority` dla treści nad foldem.

### Nowoczesne formaty obrazów

Używaj `webp` lub `avif` dla zdjęć. `avif` oferuje mniejszy rozmiar przy podobnej jakości, a Next.js może generować go automatycznie. Dla logo i ikon preferuj SVG lub zoptymalizowany PNG.

### Responsywne rozmiary

Atrybut `sizes` mówi przeglądarce, który obraz pobrać dla danego viewportu. Bez niego przeglądarka może pobrać zbyt duży obraz, pogarszając LCP na urządzeniach mobilnych.

### Obrazy nad foldem

Dodaj `priority` do największego obrazu widocznego w początkowym viewportcie. To informuje Next.js, aby wstępnie załadował obraz, poprawiając LCP. Nie używaj `priority` dla wszystkich obrazów, tylko dla tych najważniejszych przy pierwszym renderze.

### Placeholdery obrazów

Użyj `placeholder="blur"` lub stałego koloru podczas ładowania obrazu. To redukuje Cumulative Layout Shift i poprawia odczuwaną wydajność.

## Dzielenie kodu i optymalizacja bundle

### Automatyczne dzielenie według tras

Next.js automatycznie dzieli kod według stron. Każda trasa ładuje tylko potrzebny JavaScript. Trzymaj strony skupione i unikaj globalnego importowania dużych bibliotek w głównym layoutcie.

### Dynamiczne importy z next/dynamic

Ładuj ciężkie komponenty, wykresy, mapy czy widgety zewnętrzne dopiero, gdy pojawią się w viewportcie lub będą potrzebne. `next/dynamic` działa zarówno w App, jak i Pages Router i może znacząco zmniejszyć początkową paczkę.

### Tree shaking

Next.js i nowoczesne bundlery usuwają nieużywane eksporty, jeśli biblioteka to wspiera. Sprawdź swój bundle, aby potwierdzić, że zawiera tylko kod faktycznie używany.

### Bundle analyzer

Uruchom `@next/bundle-analyzer`, aby zobaczyć, które zależności najbardziej zwiększają rozmiar. Zastąp duże biblioteki mniejszymi alternatywami lub ładuj je na żądanie.

### Skrypty zewnętrzne

Używaj `next/script` dla analityki, reklam i widgetów. Ustaw `strategy` na `lazyOnload` lub `afterInteractive`, aby uniknąć blokowania głównego wątku podczas początkowego renderu. Audytuj każdy skrypt i usuwaj te, których nie potrzebujesz.

## Buforowanie i strategie danych

### Pobieranie danych w App Router

W App Router `fetch` jest rozszerzone o obsługę cache'owania. Użyj `cache: 'force-cache'` dla stabilnych danych, `cache: 'no-store'` dla danych w czasie rzeczywistym oraz `next.revalidate` dla aktualizacji w stylu ISR.

### Konfiguracja segmentów

Użyj `export const revalidate` w plikach stron lub layoutów, aby ustawić domyślny czas życia cache. Połącz to z `generateStaticParams` do prerenderowania najważniejszych stron.

### Wzorzec stale-while-revalidate

Wzorzec SWR pozwala serwować cache'owaną treść natychmiast, aktualizując ją w tle. To utrzymuje szybkie doświadczenie użytkownika bez utraty świeżości.

### Cache tras API

Dodaj nagłówki `Cache-Control` do tras API dla danych, które można cache'ować w przeglądarce lub CDN. To redukuje powtarzającą się pracę backendu i poprawia czas odpowiedzi.

## Czcionki i style

### Optymalizacja przez next/font

`next/font` pobiera i hostuje lokalnie czcionki Google Fonts lub lokalne. Usuwa zewnętrzne żądania, wspiera font-display: swap i redukuje layout shift. Używaj małej liczby wag i podzbiorów.

### Systemowe stacki czcionek

Dla najszybszego pierwszego renderu rozważ systemowy stack czcionek. Nie wymaga pobierania i jest znajomy użytkownikom. Ładuj czcionkę niestandardową tylko wtedy, gdy wymaga tego brand.

### Critical CSS

Dzięki Tailwind CSS lub podejściu utility-first do pliku trafiają tylko używane klasy. Unikaj ładowania nieużywanego CSS z dużych bibliotek komponentów. W razie potrzeby wstawiaj najważniejsze style nad foldem inline.

## JavaScript i optymalizacja runtime

### Minimalizuj JavaScript po stronie klienta

Każdy kilobajt JavaScript ma swoją cenę. Wysyłaj mniej kodu do przeglądarki, używając Server Components, lazy loadingu i mniejszych zależności. Unikaj duplikowania danych między serwerem a klientem.

### Unikaj ciężkich bibliotek klienckich

Wykresy, date pickery i edytory rich text mogą być duże. Używaj mniejszych alternatyw, ładuj je leniwie lub renderuj na serwerze, gdy App Router to umożliwia.

### Memoizacja

`useMemo` i `useCallback` mogą pomóc, ale tylko tam, gdzie jest mierzalna korzyść. Nie owijaj każdej wartości czy funkcji. Skup się na kosztownych obliczeniach i renderowaniu list.

### Koszty hydratacji

Hydratacja po stronie klienta może być droga na słabszych urządzeniach. Redukuj liczbę komponentów klienta, unikaj niezgodności hydratacji i używaj `suppressHydrationWarning` tylko w ostateczności.

## Konfiguracja serwera i buildu

### next.config.js

Włącz kompresję, ustaw formaty obrazów i skonfiguruj sekcję `headers` dla cache control. Ustaw `productionBrowserSourceMaps: false` i ostrożnie korzystaj z flag `experimental`.

### Tryby wyjściowe

`output: 'export'` tworzy w pełni statyczną stronę gotową do wdrożenia na CDN. `output: 'standalone'` produkuje minimalny obraz serwera. Wybierz ten, który pasuje do strategii hostingu i cache'owania.

### Wydajność middleware

Middleware uruchamia się przy każdym żądaniu. Trzymaj je szybkie, unikaj długich obliczeń i uruchamiaj tylko na trasach, które tego wymagają. Użyj konfiguracji `matcher`, aby ograniczyć wykonanie.

## Core Web Vitals i pomiar

### Largest Contentful Paint (LCP)

LCP mierzy, jak szybko ładuje się największy widoczny element. Popraw go, wstępnie ładując hero image, używając `next/font`, redukując czas odpowiedzi serwera i usuwając zasoby blokujące render.

### First Input Delay i Interaction to Next Paint

FID jest zastępowane przez Interaction to Next Paint (INP). INP mierzy responsywność. Trzymaj główny wątek wolnym, dzieląc długie zadania, odkładając niekrytyczne skrypty i minimalizując wykonanie JavaScript.

### Cumulative Layout Shift (CLS)

CLS mierzy stabilność wizualną. Używaj jawnych `width` i `height` na obrazach, rezerwuj miejsca na reklamy i osadzenia, unikaj wstawiania treści nad istniejącą i używaj `next/font`, aby zapobiec zamianie czcionek.

### Time to First Byte (TTFB)

TTFB to czas do pierwszego bajtu odpowiedzi. Redukuj go za pomocą SSG, ISR, funkcji edge i wydajnego pobierania danych. Użyj CDN blisko użytkowników.

### Narzędzia do pomiaru

- **Lighthouse** — automatyczne audyty i wyniki.
- **PageSpeed Insights** — dane z laboratorium i terenu oraz rekomendacje.
- **Panel Performance w Chrome DevTools** — szczegółowa analiza głównego wątku.
- **Rozszerzenie Web Vitals** — śledzenie metryk w czasie rzeczywistym.
- **Real User Monitoring (RUM)** — dane terenowe od rzeczywistych użytkowników.

## Checklista wydajności Next.js

- [ ] Używaj `next/image` dla wszystkich obrazów z `sizes` i `priority`.
- [ ] Ogranicz Client Components do interaktywnych części UI.
- [ ] Wybierz SSG lub ISR dla stron, które nie zmieniają się per użytkownik.
- [ ] Ładuj leniwie ciężkie komponenty i skrypty zewnętrzne.
- [ ] Korzystaj z `next/font` z minimalną liczbą wag i podzbiorów.
- [ ] Dodawaj nagłówki cache i `revalidate` tam, gdzie to sensowne.
- [ ] Analizuj bundle i usuwaj nieużywane zależności.
- [ ] Testuj na realnych urządzeniach i wolnych sieciach.
- [ ] Skonfiguruj RUM lub raportowanie Web Vitals w produkcji.

## Częste błędy, których należy unikać

### Nadmierne użycie Client Components

Oznaczanie zbyt wielu komponentów jako klienckich niszczy korzyści Server Components. Przenieś jak najwięcej na serwer.

### Zapominanie o wymiarach obrazów

Obrazy bez jawnych wymiarów powodują layout shift. Zawsze podawaj `width` i `height` lub użyj layoutu rezerwującego miejsce.

### Ignorowanie nagłówków cache

Bez odpowiednich nagłówków cache użytkownicy i CDN nie mogą ponownie wykorzystywać statycznych zasobów. Skonfiguruj `Cache-Control` i wartości `revalidate` dla każdego typu treści.

### Ładowanie zbyt wielu skryptów zewnętrznych

Każdy dodatkowy skrypt może blokować główny wątek. Ładuj analitykę i skrypty marketingowe asynchronicznie lub po interakcji.

### Pomijanie testów mobilnych

Duża część ruchu często pochodzi z urządzeń mobilnych. Testuj na prawdziwych telefonach i używaj throttlingu sieci w DevTools.

## Zaawansowane techniki wydajnościowe w Next.js

### Funkcje edge

Middleware i Vercel Edge Functions uruchamiają się blisko użytkowników i mogą zwracać odpowiedzi szybko. Użyj ich do przekierowań, personalizacji i testów A/B bez odwoływania się do serwera źródłowego.

### Streaming i Suspense

App Router wspiera streaming. Granice Suspense pozwalają dostarczać części strony progresywnie, podczas gdy wolniejsze sekcje ładują się w tle.

### Partial Prerendering

Partial Prerendering łączy statyczny szkielet z dynamicznymi dziurami. Szkielet serwowany jest natychmiast z CDN, a treść dynamiczna strumieniowana. To utrzymuje niski LCP nawet dla spersonalizowanych stron.

### Service workery i cache offline

Aplikacje PWA mogą cache'ować szkielet i zasoby do użytku offline. Użyj `next-pwa` lub własnego service workera do przechowywania krytycznych zasobów lokalnie.

## Najczęściej zadawane pytania

### Czy Next.js automatycznie poprawia wydajność?

Next.js dostarcza wiele optymalizacji domyślnie, takich jak dzielenie kodu, optymalizacja obrazów i szybkie odświeżanie. Rzeczywista wydajność zależy jednak od struktury komponentów, obrazów, pobierania danych i cache'owania.

### Czy lepiej używać App Router czy Pages Router pod kątem wydajności?

App Router z React Server Components może zmniejszyć JavaScript po stronie klienta i uprościć cache'owanie. Jeśli zaczynasz nowy projekt, App Router zazwyczaj jest lepszym wyborem na dłuższą metę.

### Jak poprawić LCP w Next.js?

Wstępnie załaduj największy obraz nad foldem, użyj `next/font`, zmniejsz czas odpowiedzi serwera i usuń zasoby blokujące render. Użyj atrybutu `priority` na obrazie hero.

### Czy Next.js poradzi sobie z milionami użytkowników?

Tak. Dzięki SSG, ISR, cache'owaniu CDN i funkcjom bezserwerowym Next.js może obsługiwać duże odbiorców. Kluczem jest minimalizacja żądań do origin i agresywne cache'owanie na krawędzi.

### Jaki jest najlepszy sposób na monitorowanie wydajności Next.js w produkcji?

Połącz Lighthouse i PageSpeed Insights dla danych laboratoryjnych z Real User Monitoring dla danych terenowych. Śledź LCP, INP, CLS, TTFB i FCP w czasie.

## Podsumowanie

Optymalizacja aplikacji Next.js polega na połączeniu odpowiedniej strategii renderowania, wydajnego ładowania mediów, ostrożnego dzielenia kodu i przemyślanego cache'owania. Skup się na podróży użytkownika od pierwszego żądania do pierwszej interakcji. Używaj App Router do redukcji JavaScriptu po stronie klienta, `next/image` do optymalizacji mediów i `next/font` do efektywnej dostawy tekstu. Mierz często, testuj na realnych urządzeniach i traktuj wydajność jako proces ciągły, a nie jednorazowe zadanie.
