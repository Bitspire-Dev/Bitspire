---
title: EduVantage
tagline: Landing page dla korepetycji matematyka i angielski
description: Wydajna strona wizytówka dla firmy korepetycyjnej w Słupsku. Next.js, App Router, Tailwind CSS, SEO lokalne i optymalizacja wydajności.
technologies:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Radix UI
  - Framer Motion
  - Vercel
websiteUrl: https://eduvantage.pl
screenshot: /portfolio/websites/eduvantage.webp
---

# EduVantage — strona, która przyciąga uczniów i rodziców

Lokalny biznes korepetycyjny potrzebował strony, która w jednym miejscu wyjaśni ofertę, zbuduje zaufanie i skieruje klienta do kontaktu. Bez logowania, bez CMS, bez zbędnej złożoności — strona musiała działać szybko, wyglądać profesjonalnie i być widoczna w Google dla osób szukających korepetycji w okolicy.

Dla zespołu Bitspire-Dev oznaczało to stworzenie lekkiego, skalowalnego landing page'u zoptymalizowanego pod lokalne SEO i konwersję.

<!-- WSTAW GRAFIKĘ: eduvantage-hero.png — widok sekcji hero z tłem i CTA -->

## Klient i cel projektu

EduVantage to firma oferująca indywidualne korepetycje z matematyki i języka angielskiego. Celem projektu było zbudowanie strony wizytówki, która w jasnym, przystępnym języku przedstawi ofertę, cennik, metodę nauki i dane kontaktowe — oraz ułatwi rodzicom i uczniom natychmiastowy kontakt telefoniczny lub przez WhatsApp.

Najważniejsze wymagania:
- **Szybkość ładowania** — strona docelowa dla użytkowników mobilnych z okolicy.
- **Lokalne SEO** — widoczność na frazy takie jak „korepetycje Słupsk”, „matura matematyka Słupsk”.
- **Pozwolenie i zaufanie** — jasny regulamin, polityka prywatności i cookies.
- **Łatwa konserwacja** — treści w komponentach, wszystko pod kontrolą wersji na GitHub.

## Dla kogo jest ta strona?

- Rodzice i uczniowie szukający korepetycji z matematyki i angielskiego.
- Uczniowie przygotowujący się do egzaminu ósmoklasisty i matury.
- Osoby preferujące zajęcia stacjonarne lub z dojazdem w Słupsku i okolicach.

<!-- WSTAW GRAFIKĘ: eduvantage-subjects.png — widok sekcji przedmiotów i cennika -->

## Jak to działa?

Strona składa się z sekcji pionowo zorganizowanych w logicznym flow decyzji użytkownika:

1. **Hero** — jasne hasło, główne przedmioty, CTA telefoniczne i statystyki (4 lata doświadczenia, elastyczna stawka).
2. **Dlaczego warto** — argumenty dla rodzica/ucznia.
3. **O nas** — metoda pracy i podejście.
4. **Przedmioty** — matematyka i angielski z podziałem na poziomy.
5. **Cennik** — transparentne stawki 60/80/100 zł/h.
6. **Metoda** — opis procesu nauki.
7. **Opinie** — sekcja gotowa do prezentacji feedbacku od uczniów.
8. **FAQ i kontakt** — odpowiedzi na najczęstsze pytania i dane teleadresowe.

Technicznie:
- **Next.js 16 + App Router** — szybkie renderowanie po stronie serwera i czyste adresy.
- **TypeScript** — pełne typowanie komponentów i danych.
- **Tailwind CSS 4** — utility-first styling, spójny system wizualny.
- **Radix UI + Framer Motion** — dostępne komponenty i płynne animacje.
- **next/image** — automatyczna optymalizacja obrazów do formatów AVIF/WebP.
- **Schema.org LocalBusiness** — uporządkowane dane dla Google.
- **Sitemap + robots.ts** — indeksacja i zarządzanie dostępem robotów.
- **Cookie consent + lazy analytics** — zgodność z RODO i wydajne ładowanie tagów.
- **WhatsAppButton + mobile menu** — szybki kontakt na każdym urządzeniu.

<!-- WSTAW GRAFIKĘ: eduvantage-pagespeed.png — wyniki PageSpeed Insights dla eduvantage.pl -->

## Wyzwanie: wydajność i widoczność lokalna

Największym wyzwaniem było połączenie **atrakcyjnego designu z szybkością**. Strona zawiera duże zdjęcia i dekoracje, ale użytkownicy mobilni — szczególnie w lokalnym wyszukiwaniu — nie czekają na ładowanie. Rozwiązanie:

- **Optymalizacja obrazów** przez `next/image` z atrybutami `priority`, `sizes` i `quality`.
- **Inline critical CSS** — najważniejsze style ładowane od razu w `<head>`.
- **Dynamic importy sekcji** — leniwe ładowanie komponentów poza krytyczną ścieżką.
- **Lazy loading GTM/GA** — skrypty analityczne dopiero po zgodzie użytkownika.
- **Schema.org LocalBusiness + adres Słupsk** — lepsza widoczność w wynikach lokalnych.
- **Mobile-first design** — najpierw telefon, potem desktop.

## Efekty

Wdrożenie strony na `eduvantage.pl` poprawiło obecność firmy w internecie i usprawniło proces pozyskiwania klientów. Strona generuje pierwsze kontakty telefoniczne, a użytkownicy docierają do niej organicznie z wyszukiwarki. Czas ładowania został utrzymany na niskim poziomie, co przekłada się na lepsze doświadczenie i wyższą ocenę w PageSpeed Insights.

<!-- WSTAW GRAFIKĘ: eduvantage-mockup.png — podgląd strony na mobile i desktop -->

## Co dalej?

Strona jest gotowa do dalszego rozwoju: integracja realnych opinii, blog edukacyjny pod SEO long-tail, rozbudowana analityka zdarzeń `tel:` i przycisku WhatsApp, a także rozszerzenie o strony poszczególnych kierunków (np. „matematyka matura Słupsk”).

## Zobacz stronę

[eduvantage.pl](https://eduvantage.pl)
