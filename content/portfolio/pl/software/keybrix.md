---
title: Keybrix
tagline: Wizualny kreator makr — automatyzacja bez kodu
description: Cross-platformowa aplikacja desktopowa do tworzenia makr i automatyzacji powtarzalnych zadań za pomocą bloków typu Scratch. Zbudowana w Electronie, Reakcie i TypeScript.
technologies:
  - Electron
  - React
  - TypeScript
  - Vite
  - Node.js
  - Blockly
  - Zustand
  - Zod
  - Tailwind CSS
websiteUrl: https://github.com/Jakub-Pujanek/Keybrix
screenshot: /portfolio/software/keybrix/keybrix.gif
---

# Keybrix — automatyzuj powtarzalne zadania bez pisania kodu

Powtarzalne czynności kosztują czas i energię — niezależnie od tego, czy chodzi o wypełnianie formularzy, obsługę gier czy codzienne operacje w aplikacjach. Istniejące narzędzia, takie jak AutoHotkey, dają ogromną moc, ale wymagają nauki składni i pisania skryptów. To bariera, która wyklucza większość użytkowników.

Keybrix powstał, żeby tę barierę usunąć.

![Animacja pokazująca budowanie makra z bloków](/portfolio/software/keybrix/keybrix.gif)

## Pomysł i cel projektu

Celem było stworzenie aplikacji desktopowej, w której użytkownik buduje makro jak układankę — przeciąga klocki, łączy je w sekwencje i przypisuje globalny skrót klawiszowy. Bez terminala, bez skryptów, bez syntaxu do zapamiętania. Inspiracja płynęła z obserwacji, że w wielu grach i narzędziach ludzie wykonują w kółko te same sekwencje klawiszowe i myszy, tracąc na to godziny tygodniowo.

## Dla kogo to rozwiązanie?

- **Gracze**, którzy chcą zautomatyzować monotonne mechaniki.
- **Freelancerzy i specjaliści**, którzy powtarzają te same operacje w różnych aplikacjach.
- **Użytkownicy nietechniczni**, którzy potrzebują automatyzacji, ale nie chcą uczyć się skryptów.
- **Osoby z ograniczoną mobilnością**, którym łatwiej uruchomić makro jednym skrótem niż wykonywać skomplikowane gesty.

![Widok edytora bloków Keybrix](/portfolio/software/keybrix/block-editor.png)

## Jak to działa?

Użytkownik otwiera edytor wizualny i układa bloki reprezentujące akcje: wciśnij klawisz, przytrzymaj, wpisz tekst, przesuń mysz, kliknij, poczekaj, powtórz. Każdy blok to mały, opisany komponent z walidowanymi polami. Po zapisaniu makra przypisuje się mu globalny skrót (np. `Ctrl + Shift + M`), który działa z dowolnego miejsca w systemie.

Pod maską aplikacja działa w trzech warstwach:

- **Electron main process** zarządza rejestracją skrótów, dostępem do systemu i wykonaniem makr.
- **Preload + IPC** tworzy bezpieczny, typowany mostek do interfejsu — każda wiadomość walidowana jest przez `zod`.
- **React + Vite** dostarcza szybki, responsywny interfejs z ciemnym/light motywem, animacjami i lokalizacją PL/EN.

![Widok dashboardu Keybrix ze statystykami](/portfolio/software/keybrix/dashboard.png)

## Stack technologiczny

- **Electron 39** — silnik aplikacji desktopowej na Windows, macOS i Linux.
- **React 19 + Vite** — nowoczesny interfejs i szybka iteracja.
- **TypeScript 5.9** — pełne typowanie, również komunikatów między procesami.
- **Blockly + react-blockly + custom runtime** — wizualny edytor i własny silnik wykonawczy makr.
- **Zod + Zustand** — walidacja danych i zarządzanie stanem.
- **Tailwind CSS 4 + Framer Motion** — UI i animacje.
- **nut.js** — niskopoziomowa symulacja klawiatury i myszy.
- **Vitest + Testing Library** — testy jednostkowe i integracyjne.
- **electron-builder** — pakiety `.exe`, `.dmg`, `.AppImage`, `.deb`, `.snap`.

## Wyzwania, które nas wciągnęły

Najciekawszym problemem okazała się obsługa **Waylanda na Linuxie**. Nowoczesne kompozytory blokują niskopoziomową symulację wejścia z powodów bezpieczeństwa. Zamiast zrezygnować z pełnego wsparcia Linuksa, zbudowaliśmy detekcję sesji (`X11` / `Wayland` / `UNKNOWN`) i dedykowany ekran z instrukcją przełączenia na X11/Ubuntu. To pozwoliło zachować obietnicę cross-platformowości bez obchodzenia polityk bezpieczeństwa.

Drugim wyzwaniem była **niezawodność globalnych skrótów** na trzech systemach operacyjnych. Każda platforma ma inne nazewnictwo modyfikatorów (`Ctrl` vs `Cmd`, `Alt` vs `Option`), więc zaimplementowaliśmy warstwę normalizacji akceleratorów, która zamienia ludzkie skróty w format rozumiany przez Electrona i zapobiega konfliktom między makrami.

![Widok ustawień Keybrix](/portfolio/software/keybrix/settings.png)

## Efekty i rozwój

Projekt powstał w około trzy tygodnie — od pierwszego prototypu edytora bloków po działającą aplikację z pakietami instalacyjnymi. Dziś Keybrix jest w wersji `1.0.1`, ma 13 gwiazdek na GitHubie, licencję MIT i jest aktywnie używany przez zespół w codziennej pracy. Plan rozwoju obejmuje bloki warunkowe `if`, głębsze integracje systemowe oraz system pluginów.

Co ważniejsze — Keybrix udowadnia, że można zbudować pełnoprawną aplikację desktopową, która jednocześnie jest intuicyjna dla osób nietechnicznych i technicznie dojrzała pod maską.

## Zobacz kod i pobierz

Repozytorium jest publiczne i otwarte na rozwój społeczności. Możesz przejrzeć kod, zgłosić issue lub pobrać najnowsze wydanie:

[github.com/Jakub-Pujanek/Keybrix](https://github.com/Jakub-Pujanek/Keybrix)
