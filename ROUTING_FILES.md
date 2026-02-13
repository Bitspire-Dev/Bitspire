# Pliki związane z routingiem

Poniżej lista plików w projekcie, które zawierają treści powiązane z routingiem (App Router, i18n routing, middleware, redirecty, sitemap, linkowanie, itp.).

n
- DATAFLOW.MD
- PIPELINE.MD
- README.md
- problems.md
- next.config.ts
- next-env.d.ts

## content/
- content/blog/en/how-to-choose-web-technology.mdx
- content/blog/en/jamstack-future-web-development.mdx
- content/blog/en/nextjs-performance-optimization.mdx
- content/blog/en/web-design-mistakes-costing-customers.mdx
- content/blog/pl/bledy-w-projektowaniu-stron.mdx
- content/blog/pl/jak-wybrac-technologie-webowa.mdx
- content/blog/pl/jamstack-przyszlosc-tworzenia-stron.mdx
- content/blog/pl/optymalizacja-wydajnosci-nextjs.mdx
- content/portfolio/en/eduvantage.mdx
- content/portfolio/en/skladamy.mdx
- content/portfolio/pl/eduvantage.mdx
- content/portfolio/pl/skladamy.mdx

## src/app/
- src/app/layout.tsx
- src/app/sitemap.ts
- src/app/admin/page.tsx
- src/app/admin/[locale]/layout.tsx
- src/app/admin/[locale]/page.tsx
- src/app/admin/[locale]/blog/page.tsx
- src/app/admin/[locale]/blog/[slug]/page.tsx
- src/app/admin/[locale]/portfolio/page.tsx
- src/app/admin/[locale]/portfolio/[slug]/page.tsx
- src/app/admin/[locale]/polityka-cookies/page.tsx
- src/app/admin/[locale]/polityka-prywatnosci/page.tsx
- src/app/admin/[locale]/regulamin/page.tsx
- src/app/[locale]/layout.tsx
- src/app/[locale]/polityka-cookies/page.tsx
- src/app/[locale]/polityka-prywatnosci/page.tsx
- src/app/[locale]/regulamin/page.tsx
- src/app/[locale]/blog/[slug]/page.tsx
- src/app/[locale]/portfolio/[slug]/page.tsx
- src/app/api/contact/route.ts

## src/components/layout/
- src/components/layout/BackLink.tsx
- src/components/layout/Footer.tsx
- src/components/layout/Header.tsx

## src/components/sections/
- src/components/sections/blog/AuthorBox.tsx
- src/components/sections/blog/BlogCard.tsx
- src/components/sections/blog/RelatedArticles.tsx
- src/components/sections/home-page/Hero.tsx
- src/components/sections/home-page/PortfolioHighlights.tsx
- src/components/sections/portfolio/PortfolioCard.tsx
- src/components/sections/portfolio/PortfolioHighlights.tsx

## src/components/pages/
- src/components/pages/BlogPageWrapper.tsx
- src/components/pages/BlogPostWrapper.tsx
- src/components/pages/PortfolioPageWrapper.tsx

## src/components/ui/
- src/components/ui/buttons/LanguageSwitcher.tsx
- src/components/ui/composites/SearchBarRouter.tsx
- src/components/ui/cookie-consent/CookieBanner.tsx

## src/hooks/
- src/hooks/useAdminLink.ts

## src/i18n/
- src/i18n/request.ts
- src/i18n/routing.ts

## src/lib/
- src/lib/seo/metadata.ts
- src/lib/routing/adminLink.ts
- src/lib/routing/legal-pages/config.ts
- src/lib/tina/params.ts

## src/
- src/proxy.ts

## tina/
- tina/__generated__/config.prebuild.jsx
- tina/schemas/blog.ts
- tina/schemas/pages.ts
- tina/schemas/portfolio.ts
