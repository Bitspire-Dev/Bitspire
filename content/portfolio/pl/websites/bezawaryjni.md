---
title: Bezawaryjni
tagline: Strona z CMS dla warsztatu samochodowego
description: Wydajna strona z edytowalnym CMS dla serwisu samochodowego i warsztatu samoobsługowego w Kobylnicy. Next.js, Tina CMS, SEO lokalne i optymalizacja wydajności.
technologies:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Tina CMS
  - Radix UI
  - Framer Motion
  - Vercel
websiteUrl: https://bezawaryjni.com
screenshot: /portfolio/websites/bezawaryjni/bezawaryjni.png
---

# Bezawaryjni — strona, która naprawia wizerunek warsztatu

Warsztat samochodowy to biznes, w którym zaufanie buduje się w kilka sekund — strona musi więc działać szybko, wyglądać profesjonalnie i dawać klientowi wszystko, czego potrzebuje, żeby zadzwonić lub przyjechać. Bezawaryjni, serwis i warsztat samoobsługowy w Kobylnicy koło Słupska, potrzebowali witryny, która przedstawi ofertę, lokalizację i kontakt bez zbędnego klikania.

Dla zespołu Bitspire-Dev oznaczało to zbudowanie lekkiego, szybkiego landing page'u z edytowalnym CMS-em, który właściciel może sam aktualizować bez pisania do programisty.

![Sekcja hero Bezawaryjni z żółtym samochodem i CTA](/portfolio/websites/bezawaryjni/bezawaryjni-hero.png)

## Klient i cel projektu

Bezawaryjni to prawdziwy warsztat samochodowy oferujący diagnostykę komputerową, mechanikę, serwis zawieszenia i układu hamulcowego, a także warsztat samoobsługowy z dostępem do profesjonalnych narzędzi. Celem była strona, która:

- wyjaśni zakres usług w przystępny sposób,
- pokaże lokalizację i godziny otwarcia,
- umożliwi szybki kontakt telefoniczny, mailowy i przez WhatsApp,
- będzie edytowalna przez właściciela bez kodowania,
- będzie ładować się błyskawicznie i dobrze pozycjonować w lokalnych wynikach wyszukiwania.

Najważniejsze wymagania:

- **Szybkość ładowania** — strona docelowa dla klientów mobilnych.
- **Lokalne SEO** — widoczność na frazy serwis / warsztat w okolicy Słupska.
- **Edycja treści bez programisty** — prosty CMS dla właściciela.
- **Wielokanałowy kontakt** — telefon, email, WhatsApp, mapa dojazdu.

## Dla kogo jest ta strona?

- Właściciele samochodów szukający serwisu w Słupsku, Kobylnicy i okolicach.
- Kierowcy potrzebujący diagnostyki komputerowej lub naprawy zawieszenia.
- Osoby chcące samodzielnie naprawiać auto pod okiem mechanika.
- Firmy flotowe poszukujące stałego, zaufanego warsztatu.

![Sekcja oferty Bezawaryjni z ikonami usług](/portfolio/websites/bezawaryjni/bezawaryjni-oferta.png)

## Jak to działa?

Strona opiera się na Next.js 16 z App Routerem. Treść głównej strony jest przechowywana w pliku markdown (`content/pages/home.md`) i zarządzana przez **Tina CMS** — headless CMS działający bezpośrednio na repozytorium Git. Właściciel loguje się do panelu `/admin`, edytuje sekcje (Hero, Oferta, Dlaczego my, Podnośnik, O nas, FAQ, Kontakt), zapisuje zmiany, a strona jest od razu gotowa do ponownego zbudowania.

Komponenty React renderują treść z Tina, dodają animacje, karuzelę i interaktywne elementy:

1. **Hero** — główne hasło, podkreślenie oferty, CTA do telefonu i mapy.
2. **Dlaczego my** — 4 argumenty (uczciwa wycena, szybkie terminy, jakość premium, doświadczenie).
3. **Oferta** — diagnostyka, mechanika, zawieszenie, układ hamulcowy, oleje, warsztat samoobsługowy.
4. **Podnośnik** — sekcja promująca możliwość wynajmu podnośnika.
5. **O nas** — opis firmy i podejścia.
6. **FAQ** — odpowiedzi na najczęstsze pytania.
7. **Kontakt** — formularz, zakodowany email (antyspam), WhatsApp, mapa Google.

Technicznie:

- **Next.js 16 + App Router** — SSR, szybkie ładowanie, czyste adresy.
- **Tina CMS 3.8.1** — edycja treści w markdown, wersjonowanie na GitHub.
- **TypeScript 5** — pełne typowanie komponentów i danych z CMS.
- **Tailwind CSS 4** — spójny design system w kolorystyce żółto-czarnej.
- **Radix UI + Framer Motion** — dostępne komponenty i płynne animacje.
- **Embla Carousel** — karuzela w sekcji oferty lub galerii.
- **next/image + sharp** — automatyczna optymalizacja obrazów do AVIF/WebP.
- **Geist** — nowoczesna typografia od Google.
- **Vitest + Testing Library** — testy jednostkowe komponentów.
- **Vercel** — hosting i deployment CI/CD.

## Wyzwanie: wydajność i SEO lokalne

Najwięcej czasu zajęło połączenie **szybkiej strony z dobrą widocznością w wyszukiwarce**. Warsztat działa lokalnie, więc liczy się każda sekunda ładowania i każda fraza związana z Słupskiem / Kobylnicą. Rozwiązania:

- **Preload hero image** — obraz żółtego samochodu ładowany z `fetchPriority="high"`.
- **Optymalizacja obrazów** przez `next/image` z formatami AVIF/WebP i atrybutem `sizes`.
- **Inline critical CSS + cachowanie zasobów statycznych** — `Cache-Control: public, max-age=31536000, immutable`.
- **Remove console logs** w produkcji i `optimizePackageImports` dla `react-icons`.
- **Preconnect do Google Maps i Google Fonts** — mniej czasu na nawiązanie połączenia.
- **Schema.org / LocalBusiness** — uporządkowane dane dla Google z adresem, godzinami i telefonem.
- **Sitemap, robots.ts, canonical, OpenGraph, Twitter Cards** — kompletna obsługa SEO.
- **Mobile-first** — większość klientów wchodzi z telefonu.

## Efekty

Wdrożenie strony na `bezawaryjni.com` poprawiło obecność warsztatu w internecie i usprawniło kontakt z klientami. Strona generuje zapytania telefoniczne i wizyty, a klienci docierają do niej organicznie z wyszukiwarki. Właściciel może samodzielnie aktualizować treści, cennik i godziny otwarcia — bez czekania na programistę i bez ryzyka popsucia kodu.

Czas ładowania i wyniki w PageSpeed Insights utrzymują się na wysokim poziomie, co przekłada się na lepsze doświadczenie użytkownika i wyższą konwersję.

## Co dalej?

Strona jest gotowa do dalszego rozwoju: integracja z systemem rezerwacji terminów, sekcja opinii klientów, rozbudowana analityka zdarzeń (telefon, WhatsApp, formularz), a także dedykowane podstrony dla każdego rodzaju usługi pod SEO long-tail.

## Zobacz stronę

[bezawaryjni.com](https://bezawaryjni.com)
