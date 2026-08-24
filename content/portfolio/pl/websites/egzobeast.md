---
title: Egzobeast
tagline: Strona firmowa z CMS dla sklepu terrarystycznego
description: Nowoczesna strona firmowa z blogiem i galerią dla sklepu terrarystycznego i hotelu dla gadów w Słupsku. Next.js, Tina CMS, Schema.org i optymalizacja wydajności.
technologies:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Tina CMS
  - Radix UI
  - Framer Motion
  - Vercel
websiteUrl: https://exobist.com
screenshot: /portfolio/websites/egzobeast/egzobeast.png
---

# Egzobeast — strona, która pokazuje pasję do gadów

Sklep terrarystyczny to nisza, w której klient musi poczuć zaangażowanie, wiedzę i zaufanie od pierwszego wejrzenia. Egzobeast, sklep terrarystyczny i hotel dla gadów w Słupsku, potrzebował witryny, która pokaże ofertę, kolekcję zwierząt, blog ekspercki i dane kontaktowe — wszystko w estetycznym, płynnym i szybkim opakowaniu.

Dla Bitspire-Dev oznaczało to zbudowanie rozbudowanej strony firmowej opartej na Next.js z edytowalnym CMS-em, gdzie właściciel może samodzielnie zarządzać treścią: od sekcji na stronie głównej, przez wpisy blogowe, po zdjęcia w galerii.

![Sekcja hero Egzobeast z gekonem i hasłem](/portfolio/websites/egzobeast/egzobeast-hero.png)

## Klient i cel projektu

Egzobeast to prawdziwy sklep terrarystyczny w Słupsku, prowadzony przez pasjonatów gadów i płazów. Oferuje zdrowe zwierzęta, profesjonalny sprzęt, doradztwo 1:1 oraz hotel dla gadów na czas urlopu. Celem projektu było stworzenie strony, która:

- buduje zaufanie przez edukacyjny blog i jasne opisy oferty,
- prezentuje kolekcję zwierząt w rozbudowanej galerii kategorii,
- pozwala szybko znaleźć adres, godziny otwarcia i trasę dojazdu,
- umożliwia właścicielowi samodzielną edycję treści i zdjęć,
- jest szybka, responsywna i dobrze widoczna w lokalnych wynikach wyszukiwania.

Najważniejsze wymagania:
- **Design system na poziomie produktu** — spójna kolorystyka i typografia od samego startu.
- **Szybkość i SEO** — dobra pozycja w wyszukiwarce i płynna obsługa na telefonie.
- **Edytowalny CMS** — łatwa aktualizacja sekcji, bloga i galerii.
- **Lokalna obecność** — Słupsk i okolice jako naturalny kontekst.

![Sekcja "O nas" Egzobeast z kolorystyką leśną i kartami](/portfolio/websites/egzobeast/egzobeast-about.png)

## Dla kogo jest ta strona?

- Miłośników gadów, płazów i zwierząt egzotycznych w Słupsku i regionie.
- Początkujących terrarystów szukających pierwszego zwierzaka i porady.
- Stałych klientów chcących sprawdzić ofertę, galerię lub godziny otwarcia.
- Osób potrzebujących bezpiecznego hotelu dla gadów na czas wyjazdu.
- Właściciela sklepu, który sam aktualizuje treści i prowadzi blog.

![Galeria Egzobeast z kategoriami zwierząt](/portfolio/websites/egzobeast/egzobeast-gallery.png)

## Jak to działa?

Strona zbudowana jest w Next.js 16 z App Routerem. Treść strony głównej, wpisy blogowe, strony prawne i elementy galerii zarządzane są przez **Tina CMS** — headless CMS działający bezpośrednio na repozytorium Git. Właściciel loguje się do panelu `/admin`, edytuje sekcje (Hero, O nas, Kolekcja, FAQ, Lokalizacja, Blog), zapisuje zmiany, a strona jest gotowa do ponownego zbudowania.

Główne sekcje i funkcjonalności:

1. **Hero** — główne hasło, podkreślenie misji, CTA i obraz gekona w tle.
2. **O nas** — historia sklepu, zespół ekspertów i karta "Hotel dla gadów".
3. **Kolekcja / Galeria** — kategorie: gekony, węże, jaszczurki, żółwie, kameleony, robaki, sklep.
4. **Cechy** — ikony (Doradztwo 1:1, Zdrowe zwierzęta, Hotel dla gadów, Lokalna pasja).
5. **FAQ** — rozwijane odpowiedzi na najczęstsze pytania klientów.
6. **Lokalizacja** — adres, przycisk "Wyznacz trasę" do Google Maps, godziny otwarcia.
7. **Blog** — edukacyjne artykuły o terrarystyce, pielęgnacji i wyborze zwierząt.
8. **Strony prawne** — polityka prywatności i regulamin zarządzane z CMS.

Technicznie:
- **Next.js 16 + App Router** — SSR/SSG, czyste adresy i szybkie przejścia.
- **React 19 + TypeScript 5** — nowoczesny kod, pełne typowanie.
- **Tailwind CSS 4** — utility-first style oparte na własnym design systemie.
- **Plus Jakarta Sans** — nowoczesna, czytelna typografia.
- **Tina CMS 3.7.5** — edycja markdown i obrazów z wersjonowaniem.
- **Radix UI + shadcn/ui** — dostępne, gotowe komponenty.
- **Framer Motion** — subtelne animacje i mikrointerakcje.
- **Embla Carousel** — karuzele w sekcjach z wieloma elementami.
- **next/image + AVIF/WebP** — automatyczna optymalizacja obrazów.
- **Schema.org** — `PetStore`, `Organization`, `WebSite`, `Blog`, `FAQPage`, `CollectionPage`, `BreadcrumbList`.
- **SEO** — sitemap, robots.ts, canonical, OpenGraph, Twitter Cards.
- **Vercel** — hosting z CI/CD i podglądem preview.

![Panel edycji Tina CMS Egzobeast](/portfolio/websites/egzobeast/egzobeast-cms.png)

## Wyzwanie: system design i optymalizacja

Najwięcej czasu zajęło zbudowanie **spójnego design systemu** i dopasowanie go do nietypowej, leśnej kolorystyki marki (Deep Forest Green, Lime Green, Off-White), a następnie zoptymalizowanie strony pod wydajność i SEO lokalne. Kluczowe decyzje:

- **Własny `DESIGN.md`** — dokumentacja palety, typografii, spacingu, komponentów i ikon.
- **Tailwind CSS 4 z customową konfiguracją** — pełna kontrola nad kolorami, spacingiem i efektami.
- **UI primitives** — użycie gotowych prymitywów z `src/components/ui/primitives` dla spójności.
- **Statyczne generowanie stron** — `force-static` dla jak najszybszego TTFB.
- **Optymalizacja obrazów** — `next/image`, formaty AVIF/WebP, `fetchPriority="high"` dla hero, lazy loading galerii.
- **Schema.org `PetStore`** — uporządkowane dane sklepu zoologicznego z adresem, godzinami i geolokalizacją.
- **Lokalne słowa kluczowe** — Słupsk, terrarystyka, sklep terrarystyczny, hotel dla gadów.
- **Mobile-first** — większość ruchu to użytkownicy telefonów.
- **Własna domena `exobist.com`** — pełne SEO, preview na Vercel.

![Wyniki PageSpeed Insights Egzobeast](/portfolio/websites/egzobeast/egzobeast-pagespeed.png)

## Efekty

Wdrożenie strony na `exobist.com` dało Egzobeast profesjonalną wizytówkę, która buduje wizerunek eksperta w branży terrarystycznej. Strona jest łatwa do aktualizacji przez właściciela, co pozwala regularnie dodawać wpisy na blogu, nowe zdjęcia zwierząt i aktualne informacje o ofercie. Dobra wydajność i SEO wspierają organiczną widoczność w Słupsku i okolicach.

![Podgląd strony Egzobeast na mobile i desktop](/portfolio/websites/egzobeast/egzobeast-mockup.png)

## Co dalej?

Strona jest gotowa do dalszego rozwoju: rozbudowa bloga o poradniki i filmy, integracja z systemem rezerwacji hotelu dla gadów, sekcja opinii klientów, analityka zdarzeń (telefon, kierunek, formularz) oraz dedykowane landing page'e pod długie frazy SEO.

## Zobacz stronę

[exobist.com](https://exobist.com)
