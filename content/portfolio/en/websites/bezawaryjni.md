---
title: Bezawaryjni
tagline: Website with a CMS for an auto repair shop
description: A fast, CMS-driven landing page for an auto repair shop and self-service garage in Kobylnica near Słupsk. Next.js, Tina CMS, local SEO, and performance optimization.
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

# Bezawaryjni — a website that fixes the workshop's image

An auto repair shop is a business where trust is built in seconds, so the website must be fast, look professional, and give the customer everything they need to call or drive over. Bezawaryjni, a car service and self-service garage in Kobylnica near Słupsk, needed a site that would present the offer, location, and contact without unnecessary clicks.

For the Bitspire-Dev team, this meant building a lightweight, fast landing page with an editable CMS that the owner can update themselves without calling a developer.

![Bezawaryjni hero section with yellow car and CTA](/portfolio/websites/bezawaryjni/bezawaryjni-hero.png)

## Client and project goal

Bezawaryjni is a real auto repair shop offering computer diagnostics, general mechanics, suspension and brake service, and a self-service garage with professional tools. The goal was a website that:

- explains the service range in an accessible way,
- shows location and opening hours,
- enables quick phone, email, and WhatsApp contact,
- is editable by the owner without coding,
- loads instantly and ranks well in local search results.

Key requirements:
- **Fast loading** — a destination page for mobile customers.
- **Local SEO** — visibility for service / garage queries near Słupsk.
- **No-code content editing** — a simple CMS for the owner.
- **Multi-channel contact** — phone, email, WhatsApp, route map.

## Who is it for?

- Car owners looking for a repair shop in Słupsk, Kobylnica, and the surrounding area.
- Drivers needing computer diagnostics or suspension repairs.
- People who want to repair their car themselves under a mechanic's supervision.
- Fleet companies looking for a trusted, regular workshop.

![Bezawaryjni offer section with service icons](/portfolio/websites/bezawaryjni/bezawaryjni-oferta.png)

## How it works

The site is built on Next.js 16 with the App Router. The main page content is stored in a markdown file (`content/pages/home.md`) and managed by **Tina CMS** — a headless CMS that works directly on the Git repository. The owner logs into the `/admin` panel, edits sections (Hero, Offer, Why Us, Lift, About Us, FAQ, Contact), saves changes, and the site is ready to rebuild.

React components render content from Tina, add animations, a carousel, and interactive elements:

1. **Hero** — main headline, offer emphasis, CTA to phone and map.
2. **Why us** — 4 arguments (fair pricing, quick scheduling, premium quality, experience).
3. **Offer** — diagnostics, mechanics, suspension, brakes, oil, self-service garage.
4. **Lift** — a section promoting lift rental.
5. **About us** — company description and approach.
6. **FAQ** — answers to common questions.
7. **Contact** — form, obfuscated email (anti-spam), WhatsApp, Google Map.

Technically:
- **Next.js 16 + App Router** — SSR, fast loading, clean URLs.
- **Tina CMS 3.8.1** — content editing in markdown, version control on GitHub.
- **TypeScript 5** — full typing of components and CMS data.
- **Tailwind CSS 4** — consistent design system in yellow and black.
- **Radix UI + Framer Motion** — accessible components and smooth animations.
- **Embla Carousel** — carousel in offer or gallery section.
- **next/image + sharp** — automatic image optimization to AVIF/WebP.
- **Geist** — modern typography from Google.
- **Vitest + Testing Library** — unit tests for components.
- **Vercel** — hosting and CI/CD deployment.

## Challenge: performance and local SEO

The most time-consuming part was combining a **fast site with good search visibility**. The garage operates locally, so every second of load time and every keyword related to Słupsk / Kobylnica matters. Solutions:

- **Preload hero image** — yellow car image loaded with `fetchPriority="high"`.
- **Image optimization** via `next/image` with AVIF/WebP formats and `sizes` attribute.
- **Inline critical CSS + static asset caching** — `Cache-Control: public, max-age=31536000, immutable`.
- **Remove console logs in production** and `optimizePackageImports` for `react-icons`.
- **Preconnect to Google Maps and Google Fonts** — less time spent establishing connections.
- **Schema.org / LocalBusiness** — structured data for Google with address, hours, and phone.
- **Sitemap, robots.ts, canonical, OpenGraph, Twitter Cards** — full SEO coverage.
- **Mobile-first** — most customers visit from their phones.

## Results

Deploying the site to `bezawaryjni.com` improved the workshop's online presence and streamlined customer contact. The site generates phone inquiries and visits, and customers reach it organically from search. The owner can independently update content, pricing, and opening hours — without waiting for a developer and without risking breaking the code.

Load time and PageSpeed Insights results remain at a high level, which translates into a better user experience and higher conversion.

## What's next?

The site is ready for further growth: integration with an appointment booking system, a customer testimonials section, enhanced event analytics (phone, WhatsApp, form), and dedicated subpages for each service type for long-tail SEO.

## See the website

[bezawaryjni.com](https://bezawaryjni.com)
