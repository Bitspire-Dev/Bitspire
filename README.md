# Bitspire

Strona firmowa zbudowana na Next.js (App Router) z treściami w TinaCMS i obsługą i18n (pl/en) przez next-intl.

## Wymagania

- Node.js 18+

## Szybki start

```bash
npm install
npm run dev
```

Aplikacja uruchomi się pod adresem http://localhost:3000.

## Skrypty

- `npm run dev` — dev + TinaCMS
- `npm run build` — build TinaCMS + build Next.js
- `npm run start` — start produkcyjny (bez build TinaCMS)
- `npm run lint` — lint

## Konfiguracja (.env)

Repo uzywa pliku `.env` w katalogu glownym. W repo jest tez [`./.env.example`](.env.example) z kompletem zmiennych i komentarzami.

1. Skopiuj `.env.example` do `.env`.
2. Uzupelnij wartosci dla uslug, z ktorych korzystasz.
3. Przy deployu ustaw te same zmienne w panelu hostingu, np. Vercel Project Settings -> Environment Variables.

### Minimalny zestaw

- TinaCMS: `NEXT_PUBLIC_TINA_CLIENT_ID` albo `TINA_CLIENT_ID`, oraz `TINA_TOKEN`
- Formularz kontaktowy: `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_EMAIL`
- Rate limit: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

### Pelna lista zmiennych

- `NEXT_PUBLIC_TINA_CLIENT_ID` - preferowany Tina client ID
- `TINA_CLIENT_ID` - serwerowy alias/fallback dla Tina client ID
- `TINA_TOKEN` - wymagany w produkcji, chyba ze swiadomie ustawisz `TINA_ALLOW_PUBLIC_CONTENT_API=true`
- `NEXT_PUBLIC_TINA_BRANCH` albo `TINA_BRANCH` - opcjonalny branch Tina; jesli brak, aplikacja sprobuje uzyc `VERCEL_GIT_COMMIT_REF`, a potem fallback `redesign`
- `NEXT_PUBLIC_TINA_CONTENT_API_URL` albo `TINA_CONTENT_API_URL` - opcjonalny jawny URL do Tina Content API; zwykle niepotrzebny, bo jest skladany automatycznie z client ID i brancha
- `TINA_LOCAL_API_URL` - opcjonalny lokalny endpoint Tina; domyslnie `http://localhost:4001/graphql`
- `TINA_ALLOW_PUBLIC_CONTENT_API` - opcjonalne `true` tylko jesli celowo uzywasz publicznego Tina Content API bez tokenu
- `RESEND_API_KEY` - klucz API Resend do wysylki formularza kontaktowego
- `CONTACT_FROM` - adres nadawcy dla maili wysylanych przez Resend
- `CONTACT_EMAIL` - adres odbiorcy wiadomosci z formularza
- `UPSTASH_REDIS_REST_URL` - URL bazy Redis w Upstash do rate limitu
- `UPSTASH_REDIS_REST_TOKEN` - token REST do Upstash

`NODE_ENV` i `VERCEL_GIT_COMMIT_REF` sa ustawiane automatycznie przez Next.js / platforme deployowa i nie musisz wpisywac ich recznie do `.env`.