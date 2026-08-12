---
title: Egzobeast
tagline: CMS-driven company website for a reptile pet store
description: A modern company website with a blog and gallery for a reptile pet store and reptile hotel in Słupsk. Next.js, Tina CMS, Schema.org, and performance optimization.
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
screenshot: /portfolio/websites/egzobeast.png
---

# Exobist — a website with a passion for reptiles

A reptile pet store is a niche where customers must feel commitment, expertise, and trust at first sight. Exobist, a reptile pet store and hotel in Słupsk, needed a website that would present its offer, animal collection, expert blog, and contact details in an aesthetic, smooth, and fast package.

For Bitspire-Dev, this meant building an extended Next.js company website with an editable CMS where the owner can manage content independently: from homepage sections to blog posts and gallery photos.

<!-- INSERT IMAGE: egzobeast-hero.png — hero section with a gecko and the tagline "Your passion for reptiles starts here" -->

## Client and project goal

Exobist is a real reptile pet store in Słupsk, run by enthusiasts of reptiles and amphibians. It offers healthy animals, professional equipment, 1:1 advice, and a reptile hotel for vacation time. The goal was to create a website that:

- builds trust through an educational blog and clear offer descriptions,
- presents the animal collection in an extensive gallery of categories,
- lets visitors quickly find the address, opening hours, and route,
- enables the owner to edit content and photos independently,
- is fast, responsive, and visible in local search results.

Key requirements:
- **Product-level design system** — consistent color palette and typography from day one.
- **Speed and SEO** — good search ranking and smooth mobile experience.
- **Editable CMS** — easy updates to sections, blog, and gallery.
- **Local presence** — Słupsk and the surrounding area as natural context.

<!-- INSERT IMAGE: egzobeast-about.png — "About us" section with forest color palette and cards -->

## Who is it for?

- Reptile, amphibian, and exotic pet lovers in Słupsk and the region.
- Beginner terrarists looking for their first pet and guidance.
- Returning customers checking the offer, gallery, or opening hours.
- People in need of a safe reptile hotel while traveling.
- The store owner, who updates content and writes the blog independently.

<!-- INSERT IMAGE: egzobeast-gallery.png — gallery view with animal categories -->

## How it works

The site is built with Next.js 16 and the App Router. Homepage content, blog posts, legal pages, and gallery items are managed by **Tina CMS** — a headless CMS that works directly on the Git repository. The owner logs into the `/admin` panel, edits sections (Hero, About, Collection, FAQ, Location, Blog), saves changes, and the site is ready to rebuild.

Main sections and features:

1. **Hero** — main tagline, mission emphasis, CTA, and a gecko background image.
2. **About us** — store history, expert team, and a "Reptile hotel" card.
3. **Collection / Gallery** — categories: geckos, snakes, lizards, turtles, chameleons, bugs, shop.
4. **Features** — icons (1:1 Advice, Healthy Animals, Reptile Hotel, Local Passion).
5. **FAQ** — expandable answers to the most common customer questions.
6. **Location** — address, "Get directions" button to Google Maps, opening hours.
7. **Blog** — educational articles on terraristics, care, and animal selection.
8. **Legal pages** — privacy policy and terms managed from the CMS.

Technically:
- **Next.js 16 + App Router** — SSR/SSG, clean URLs, and fast transitions.
- **React 19 + TypeScript 5** — modern code with full typing.
- **Tailwind CSS 4** — utility-first styles based on a custom design system.
- **Plus Jakarta Sans** — modern, readable typography.
- **Tina CMS 3.7.5** — markdown and image editing with Git versioning.
- **Radix UI + shadcn/ui** — accessible, ready-made components.
- **Framer Motion** — subtle animations and micro-interactions.
- **Embla Carousel** — carousels for multi-item sections.
- **next/image + AVIF/WebP** — automatic image optimization.
- **Schema.org** — `PetStore`, `Organization`, `WebSite`, `Blog`, `FAQPage`, `CollectionPage`, `BreadcrumbList`.
- **SEO** — sitemap, robots.ts, canonical, OpenGraph, Twitter Cards.
- **Vercel** — hosting with CI/CD and preview deployments.

<!-- INSERT IMAGE: egzobeast-cms.png — Tina CMS editing panel for the homepage -->

## Challenge: system design and optimization

The most time-consuming part was building a **cohesive design system** and matching it to the brand's unusual forest color palette (Deep Forest Green, Lime Green, Off-White), then optimizing the site for performance and local SEO. Key decisions:

- **Custom `DESIGN.md`** — documentation of palette, typography, spacing, components, and icons.
- **Tailwind CSS 4 with custom configuration** — full control over colors, spacing, and effects.
- **UI primitives** — using ready-made primitives from `src/components/ui/primitives` for consistency.
- **Static page generation** — `force-static` for the fastest possible TTFB.
- **Image optimization** — `next/image`, AVIF/WebP formats, `fetchPriority="high"` for the hero, lazy gallery loading.
- **Schema.org `PetStore`** — structured data for a pet store with address, hours, and geolocation.
- **Local keywords** — Słupsk, terraristics, reptile pet store, reptile hotel.
- **Mobile-first** — most traffic comes from mobile users.
- **Custom domain `exobist.com`** — full SEO, Vercel preview.

<!-- INSERT IMAGE: egzobeast-pagespeed.png — PageSpeed Insights results -->
<!-- INSERT IMAGE: egzobeast-gallery-detail.png — detailed gallery category view -->

## Results

Launching the site on `exobist.com` gave Exobist a professional business card that builds an expert image in the terraristics industry. The site is easy for the owner to update, allowing regular blog posts, new animal photos, and current offer information. Strong performance and SEO support organic visibility in Słupsk and the surrounding area.

<!-- INSERT IMAGE: egzobeast-mockup.png — website preview on mobile and desktop -->

## What's next?

The site is ready for further growth: expanded blog with guides and videos, integration with a reptile hotel reservation system, customer testimonials section, event analytics (phone, directions, form), and dedicated landing pages for long-tail SEO phrases.

## See the website

[exobist.com](https://exobist.com)
