# Bitspire

Dwujęzyczna (PL/EN) strona firmowa Bitspire — Next.js 15 (App Router, SSG) + TinaCMS.

## Stack

- **Next.js 15.5** — App Router, static generation, `next-intl` (locales: `pl`, `en`)
- **TinaCMS** — headless CMS, local mode, admin pod `/admin`, treść w `content/` (Markdown)
- **Tailwind CSS v4** + Radix UI + CVA
- **Animacje** — motion/react (Framer Motion), PixiJS 8 (WebGL: `atmosphere/`, `plasma/`)
- **Testy** — Vitest + Testing Library

## Komendy

```bash
pnpm dev           # dev server + TinaCMS lokalnie (next dev na :3000, datalayer :4001, admin :9000)
pnpm build:local   # produkcyjny build: tinacms build --local + next build
pnpm lint          # eslint
pnpm test          # vitest
```

Uwaga: nie uruchamiaj `build:local` / `next build` gdy działa `pnpm dev` — oba piszą do `.next` i uszkodzą dev-server (brakujące vendor-chunki). Zatrzymaj dev przed buildem.

## Struktura

```
content/           # treść TinaCMS: pages/, blog/, portfolio/, cities/ (po locale)
src/app/[locale]/  # strony: home, blog, portfolio, contact, privacy, [city] (podstrony lokalne)
src/components/    # pages/ sections/ layout/ ui/ animations/
src/lib/
  cms/             # klient Tina (client.ts) + helpery kolekcji (blog, cities, portfolio, slug, toc)
  seo/             # metadata.ts, json-ld.ts, og-image.tsx
  config/          # company, navigation, routes, ui (copy PL/EN), fonts
  utils/           # cn, date, image
  contact.ts       # walidacja formularza, rate-limit, formatowanie e-mail
src/hooks/         # use-locale-switcher, use-mounted, use-content-list, use-theme-image, ...
tina/config.ts     # schemat kolekcji TinaCMS
```

Szczegółowa mapa systemów i konwencji: [`NEW-SESSION.MD`](./NEW-SESSION.MD).

## Podstrony lokalne

Route `/[locale]/[city]` (np. `/pl/slupsk`) renderuje podstrony SEO dla miast z `content/cities/`. `dynamicParams = false` — nieznane slugi dają 404. Nowe miasto = nowy plik `.md` w `content/cities/pl/` i `en/` + wpis w `src/lib/cms/cities.ts` (`CITIES`).

## Zmienne środowiskowe

- `NEXT_PUBLIC_SITE_URL` — kanoniczny URL (np. `https://bitspire.app`)
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL` — formularz kontaktowy
- `TINA_CLIENT_ID`, `TINA_TOKEN` — TinaCloud (opcjonalne w local mode)

## Deploy

Vercel — build przez `tinacms build` wypycha też schemat do TinaCloud.
