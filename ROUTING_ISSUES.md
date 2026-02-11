# Problemy i konflikty w routingu

Poniżej lista problemów wykrytych po pełnym przeglądzie plików wskazanych w ROUTING_FILES.md.

## Krytyczne (blokują działanie routingu)

1) i18n middleware jest w src/proxy.ts (middleware.ts jest deprecated)
- Objaw: /portfolio, /blog, /polityka-prywatnosci itd. dają 404 w PL, mimo że default locale ma być „as-needed”.
- Przyczyna: App Router ma segment [locale] (src/app/[locale]/...), więc bez aktywnego middleware nie ma route dla /portfolio. Zgodnie z aktualnym stanem projektu logika middleware jest w src/proxy.ts (zastępuje middleware.ts).
- Konflikt z deklaracjami w dokumentacji (DATAFLOW.MD, PIPELINE.MD) i z ustawieniem localePrefix = as-needed w src/i18n/routing.ts.
- Powiązane pliki: src/proxy.ts, src/i18n/routing.ts, src/app/[locale]/layout.tsx, DATAFLOW.MD, PIPELINE.MD.

**Rozwiązanie (szczegółowo):**
1) Traktuj src/proxy.ts jako właściwy middleware (middleware.ts jest deprecated):
	- Cała logika i18n powinna być konfigurowana wyłącznie w src/proxy.ts.
2) Sprawdź matcher w src/proxy.ts:
	- matcher powinien obejmować wszystkie ścieżki publiczne, w tym /portfolio i /blog, oraz root ("/").
	- upewnij się, że nie wykluczasz przypadkiem routów publicznych przez zbyt szeroki regex w matcher.
3) Weryfikacja localePrefix="as-needed":
	- w src/i18n/routing.ts pozostaw localePrefix = "as-needed" oraz defaultLocale = "pl".
	- middleware powinien usuwać /pl z URL-i (lub nie dodawać go), a /en powinien być zachowany jako prefiks.
4) Sprawdź stronę główną i sub-routy:
	- / powinno działać jako PL i przekierowywać tylko przy geo-redirect na /en (zależy od kraju),
	- /portfolio i /blog powinny działać bez /pl,
	- /en/portfolio i /en/blog powinny działać z prefiksem.
5) Po zmianach zweryfikuj w UI: linki w Header/Footer/LanguageSwitcher powinny generować ścieżki bez /pl dla PL i z /en dla EN.

2) /admin nie przekierowuje do panelu SPA Tina
- Objaw: wejście na /admin przekierowuje do /admin/pl, a nie do /admin/index.html#/~/admin.
- Przyczyna: src/app/admin/page.tsx robi redirect do /admin/pl. Middleware (src/proxy.ts) omija /admin i nie robi redirectu do SPA. Brak redirectu/rewritów w next.config.ts.
- Konflikt z oczekiwaniem i opisem w PIPELINE.MD oraz z routingiem preview w schematach Tina.
- Powiązane pliki: src/app/admin/page.tsx, src/proxy.ts, next.config.ts, PIPELINE.MD, tina/schemas/*.ts.

## Funkcjonalne i UX (nie blokują, ale psują nawigację)

3) Brak mapowania /blog w src/i18n/routing.ts
- Objaw: LanguageSwitcher nie ma klucza routingu dla /blog, przez co nie korzysta z router.replace i prefetch (robi twardy reload przez window.location).
- Powiązane pliki: src/i18n/routing.ts, src/components/ui/buttons/LanguageSwitcher.tsx.

4) Sitemap generuje URL-e bez /pl, ale routing nie obsługuje ich bez middleware
- Objaw: sitemap zawiera /portfolio, /blog, /polityka-* bez prefiksu /pl, które mogą dawać 404 w środowisku bez działającego middleware.
- Powiązane pliki: src/app/sitemap.ts, src/proxy.ts, src/i18n/routing.ts.

## Rozbieżności w dokumentacji

5) Dokumentacja deklaruje aktywny middleware i redirecty, których nie ma w kodzie
- Objaw: PIPELINE.MD opisuje middleware jako aktywne i wymuszające redirecty /pl i /admin → /admin/index.html#/..., podczas gdy faktyczny kod nie realizuje tych reguł.
- Powiązane pliki: PIPELINE.MD, src/proxy.ts, src/app/admin/page.tsx.
