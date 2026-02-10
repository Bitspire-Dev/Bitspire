Poniżej lista wykrytych problemów i ryzyk wraz z proponowanymi rozwiązaniami (bez zapisu do .md). Skupiłem się na src/, components/, tina/ oraz root.

Middleware dla next-intl nie działa
Plik proxy.ts wygląda jak middleware, ale nie ma wymaganej nazwy. W rezultacie nie ma lokalizacji bez prefiksu (np. /portfolio), a część routingu może 404.
Propozycja: przenieś/zmień nazwę na src/middleware.ts (albo middleware.ts w root). Zachowaj matcher i warunek if (pathname.startsWith('/admin')).

Formularz kontaktowy zawsze zwraca 500 bez Upstash (także w dev)
W route.ts gdy getRatelimit() zwraca null, endpoint od razu kończy 500. To blokuje wysyłkę lokalnie.
Propozycja: jeśli brak konfiguracji i to nie produkcja – pominąć rate‑limit i kontynuować.

Brak sanitizacji HTML w mailu
W route.ts message trafia do HTML bez escapingu. To ryzyko wstrzyknięcia HTML w mailu.
Propozycja: escapuj name/email/subject/message (np. mała funkcja escapeHtml lub biblioteka).

Strona główna zawsze dynamiczna i kosztowna
W page.tsx użycie headers() + dynamic = "force-dynamic" powoduje brak cache i pobieranie danych z Tina na każde żądanie.
Propozycja: przenieś georedirect do middleware (edge) i ustaw revalidate lub cache dla zapytań. To przywróci statyczność i poprawi TTFB.

Wyszukiwarka wywołuje pełny rerender i pobranie danych na każde wpisanie
W SearchBarRouter.tsx każda zmiana query robi router.replace, co w src/app/[locale]/blog/page.tsx i src/app/[locale]/portfolio/page.tsx oznacza nowe zapytania do Tina.
Propozycja: filtrować klientowo (przekazać listę i użyć useSearch), a URL aktualizować np. tylko po submit lub po dłuższym debounce. Alternatywnie API search.

Możliwy konflikt slugów bloga
W BlogGrid.tsx przekazujesz slug={post._sys.filename} – ignorujesz pole slug. Jeśli slug w CMS różni się od nazwy pliku, linki będą błędne.
Propozycja: użyj post.slug z mapera i traktuj _sys.filename jako fallback.

Spis treści nie gwarantuje unikalnych id
W TableOfContents.tsx nagłówki o identycznym tekście dostaną ten sam id, co psuje nawigację.
Propozycja: wykrywaj duplikaty i dodawaj sufiks (-2, -3).

window.open bez noopener/noreferrer
W ShareButtons.tsx window.open nie ustawia noopener/noreferrer. To ryzyko bezpieczeństwa i wydajności.
Propozycja: użyj window.open(url, '_blank', 'noopener,noreferrer,width=600,height=400') albo ustaw newWin.opener = null.

Niestabilne klucze w listach portfolio
W PortfolioGrid.tsx używasz key={idx}. Przy zmianach kolejności lub filtrach może to powodować błędne renderowanie.
Propozycja: użyj stabilnego klucza (np. _sys.relativePath lub slug).

Brak mapowania /blog w pathnames
W routing.ts nie ma /blog. To powoduje brak prefetch i przejść bez pełnego reloadu w LanguageSwitcher.
Propozycja: dodaj /blog do pathnames (tak jak /portfolio).