---
title: EduVantage
tagline: Landing page for math and English tutoring
description: A fast, SEO-optimized landing page for a local tutoring business in Słupsk. Built with Next.js, App Router, Tailwind CSS, and local SEO best practices.
technologies:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Radix UI
  - Framer Motion
  - Vercel
websiteUrl: https://eduvantage.pl
screenshot: /portfolio/websites/eduvantage/eduvantage.png
---

# EduVantage — a website that attracts students and parents

A local tutoring business needed a website that could explain the offer, build trust, and drive contact in one place. No login, no CMS, no unnecessary complexity — it had to be fast, look professional, and be visible on Google for people searching for tutoring nearby.

For the Bitspire-Dev team, this meant building a lightweight, scalable landing page optimized for local SEO and conversion.

![EduVantage hero section with background and CTA](/portfolio/websites/eduvantage/eduvantage-hero.png)

## Client and project goal

EduVantage offers individual math and English tutoring. The goal was to build a landing page that presents the offer, pricing, teaching method, and contact details in clear, accessible language — and makes it easy for parents and students to call or message immediately.

Key requirements:

- **Fast loading** — a destination page for mobile users in the local area.
- **Local SEO** — visibility for queries like „tutoring Słupsk", „matura math Słupsk".
- **Compliance and trust** — clear terms, privacy policy, and cookie consent.
- **Easy maintenance** — content inside components, everything version-controlled on GitHub.

## Who is it for?

- Parents and students looking for math and English tutoring.
- Students preparing for eighth-grade exams and high school finals.
- People who prefer in-person lessons or home tutoring in Słupsk and the surrounding area.

![EduVantage subjects and pricing section](/portfolio/websites/eduvantage/eduvantage-subjects.png)

## How it works

The page is structured as a vertical decision flow:

1. **Hero** — clear headline, main subjects, phone CTA, and stats (4 years of experience, flexible pricing).
2. **Why us** — value propositions for parents and students.
3. **About** — teaching approach and method.
4. **Subjects** — math and English split by level.
5. **Pricing** — transparent rates at 60/80/100 PLN/h.
6. **Method** — the learning process.
7. **Testimonials** — a section ready for student feedback.
8. **FAQ and contact** — answers to common questions and contact details.

Technically:

- **Next.js 16 + App Router** — fast server-side rendering and clean URLs.
- **TypeScript** — full component and data typing.
- **Tailwind CSS 4** — utility-first styling, consistent visual system.
- **Radix UI + Framer Motion** — accessible components and smooth animations.
- **next/image** — automatic image optimization to AVIF/WebP.
- **Schema.org LocalBusiness** — structured data for Google.
- **Sitemap + robots.ts** — indexing and crawler control.
- **Cookie consent + lazy analytics** — GDPR compliance and efficient tag loading.
- **WhatsAppButton + mobile menu** — quick contact on any device.

![PageSpeed Insights results for eduvantage.pl](/portfolio/websites/eduvantage/eduvantage-pagespeed.png)

## Challenge: performance and local visibility

The biggest challenge was combining **attractive design with speed**. The page includes large photos and decorations, but mobile users — especially from local search — do not wait for slow pages. The solution:

- **Image optimization** via `next/image` with `priority`, `sizes`, and `quality` attributes.
- **Inline critical CSS** — key styles loaded immediately in `<head>`.
- **Dynamic section imports** — lazy loading for non-critical components.
- **Lazy GTM/GA loading** — analytics scripts only after user consent.
- **Schema.org LocalBusiness + Słupsk address** — better visibility in local results.
- **Mobile-first design** — phone first, then desktop.

## Results

Deploying the site to `eduvantage.pl` improved the business's online presence and streamlined client acquisition. The site generates first phone inquiries and is reached organically from search. Loading time is kept low, which translates into a better user experience and a higher PageSpeed Insights score.

![EduVantage website preview on mobile and desktop](/portfolio/websites/eduvantage/bitspire-mockup.png)

## What's next?

The site is ready for further growth: real testimonials, an educational blog for long-tail SEO, enhanced event analytics for `tel:` links and the WhatsApp button, and dedicated landing pages for specific paths (e.g. „matura math Słupsk").

## See the website

[eduvantage.pl](https://eduvantage.pl)
