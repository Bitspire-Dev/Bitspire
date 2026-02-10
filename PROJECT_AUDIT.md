# Audyt techniczny projektu Bitspire (2026-02-09)

## Streszczenie
Zidentyfikowano **7** obszarów do poprawy: spójność dokumentacji i konfiguracji i18n/SEO, stabilność builda (Tina + sitemap), bezpieczeństwo/utrzymanie API kontaktu oraz jakość dokumentacji i skryptów uruchomieniowych.

### 2) Niespójne canonical/alternates względem i18n
**Problem:** Routing wymusza prefiks `/pl` i `/en` ([src/i18n/routing.ts](src/i18n/routing.ts#L5-L9)), natomiast `metadata.alternates` wskazuje canonical i wersję PL bez prefiksu ([src/app/layout.tsx](src/app/layout.tsx#L86-L91)).

**Skutek:** Duplikacja treści (kanoniczny URL niezgodny z realnym routingiem) i ryzyko błędnej indeksacji.

**Rekomendacja:**
- Albo zmienić canonical na `/pl`, albo ustawić `localePrefix: 'as-needed'` dla domyślnego języka.
- Ujednolicić `alternates` z faktycznym routingiem.

---

### 3) Tina: fallback do localhost w produkcji
**Problem:** Gdy brak tokenu, klient Tina przełącza się na lokalny endpoint (`http://localhost:4001/graphql`) ([src/lib/tina/client.ts](src/lib/tina/client.ts#L16-L26)).

**Skutek:** W środowisku produkcyjnym build/sitemap może próbować łączyć się z lokalnym serwerem i kończyć błędem lub timeoutem.

**Rekomendacja:**
- Wymusić poprawną konfigurację env w produkcji (np. rzucać błąd, gdy `NODE_ENV === 'production'` i brak tokenu/URL).
- Alternatywnie jawnie pozwolić na publiczny `contentApiUrl` tylko, gdy jest ustawiony.

---

### 4) Sitemap: inicjalizacja klienta na poziomie modułu
**Problem:** `getTinaClient()` jest wykonywany podczas importu modułu ([src/app/sitemap.ts](src/app/sitemap.ts#L10-L13)).

**Skutek:** Brak env lub błąd klienta może zablokować build już na etapie ładowania modułu.

**Rekomendacja:**
- Przenieść `getTinaClient()` do wnętrza funkcji `sitemap()` lub do funkcji fetchujących z bezpiecznym fallbackiem.
- Dodać obsługę sytuacji bez dostępu do Tina w czasie budowy.

---

### 5) Rate limit w API kontaktu jest nietrwały
**Problem:** Rate limit oparty o `Map` trzymaną w pamięci procesu ([src/app/api/contact/route.ts](src/app/api/contact/route.ts#L17-L41)).

**Skutek:** W środowiskach serverless rate limit jest nieskuteczny (brak współdzielenia stanu), a mapa może rosnąć bez czyszczenia.

**Rekomendacja:**
- Użyć zewnętrznego store’a (np. Upstash Redis/KV) lub gotowego limitera (np. `@upstash/ratelimit`).
- Dodać TTL/cleanup entries.

Dodatkowo warto weryfikować konfigurację Resend:
- [src/app/api/contact/route.ts](src/app/api/contact/route.ts#L14-L15) — brak walidacji `RESEND_API_KEY`
- [src/app/api/contact/route.ts](src/app/api/contact/route.ts#L78-L83) — domyślny `from` i `to` testowe

---

### 6) README jest szablonem i zawiera uszkodzone znaki
**Problem:** README to domyślny template Next.js, nie opisuje faktycznej architektury i zawiera śmieciowe znaki na końcu.

**Dowody:** [README.md](README.md#L1-L40)

**Skutek:** Trudniejszy onboarding oraz ryzyko wprowadzenia w błąd nowych osób.

**Rekomendacja:**
- Uaktualnić README o realny setup (TinaCMS, i18n, build/start) i usunąć uszkodzone znaki.

---

### 7) Skrypt `start` buduje TinaCMS za każdym uruchomieniem
**Problem:** `start` uruchamia `tinacms build && next start` ([package.json](package.json#L6-L10)).

**Skutek:** Zbędne wydłużenie startu i ryzyko błędów builda w środowisku runtime.

**Rekomendacja:**
- Zostawić `tinacms build` tylko w `build`, a `start` ograniczyć do `next start`.

---

## Priorytety wdrożeniowe (skrót)
1. Middleware entrypoint + dokumentacja (Problem 1)
2. Canonical/alternates vs i18n (Problem 2)
3. Tina client + sitemap init (Problemy 3–4)
4. Rate limit i konfiguracja Resend (Problem 5)
5. Dokumentacja i skrypty (Problemy 6–7)
