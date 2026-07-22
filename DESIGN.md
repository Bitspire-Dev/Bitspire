---
name: Obsidian Sapphire
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c5d9'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e90a2'
  outline-variant: '#434656'
  surface-tint: '#b8c3ff'
  primary: '#b8c3ff'
  on-primary: '#002388'
  primary-container: '#2e5bff'
  on-primary-container: '#efefff'
  inverse-primary: '#124af0'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#ffb59b'
  on-tertiary: '#5b1a00'
  tertiary-container: '#c24100'
  on-tertiary-container: '#ffece6'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c3ff'
  on-primary-fixed: '#001356'
  on-primary-fixed-variant: '#0035be'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812800'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  headline-xl:
    fontFamily: Nippo
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Nippo
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Nippo
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  code-sm:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-xs:
    fontFamily: IBM Plex Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The design system is engineered for high-performance developer tools and technical environments. It targets a sophisticated audience that values precision, speed, and long-term visual comfort. The brand personality is authoritative yet refined—moving away from the aggressive "hacker" tropes toward a premium, industrial aesthetic.

The chosen style is **Minimalist Glassmorphism**. By combining a pitch-black foundation with translucent, sapphire-tinted overlays, the UI achieves a sense of immense physical depth and structural integrity. This approach ensures that technical complexity is managed through clear visual layering rather than clutter. The emotional response is one of calm focus, high reliability, and understated luxury.

## Colors

The palette is anchored by an absolute black (`#000000`) background to maximize OLED efficiency and minimize eye strain. The primary accent, **Sapphire**, is a refined electric blue that retains technical vibrancy while appearing softer and more integrated than standard cobalt.

- **Primary (Sapphire):** Used for critical actions, active states, and focus indicators. It provides a sharp, professional contrast against the void.
- **Secondary (Deep Slate):** A muted, blue-tinted dark grey used for container backgrounds and subtle borders.
- **Surface:** Semi-transparent layers of the primary and secondary colors allow for background blurring effects.
- **Text:** High-contrast white for primary content, with reduced-opacity silver for metadata and secondary labels.

## Typography

This design system utilizes a dual-font strategy to balance modern interface aesthetics with technical utility.

**Nippo** is the primary typeface for all headings and display text. Its modern geometric character provides a confident, technical presence. **Inter** is used for all body text and UI elements, ensuring high legibility across long-form content and dense interfaces. **IBM Plex Mono** is reserved for code snippets, data readouts, logs, and small labels to provide a distinct visual cue for "functional data."

Headlines use tight letter spacing and heavy weights to create impact, while body text remains neutral and highly legible. All typography is rendered with subpixel antialiasing to maintain sharpness against the deep black background.

## Layout & Spacing

The layout is built on a strict **4px baseline grid** and a **12-column fluid system**. This ensures that every element, from an icon to a dashboard widget, aligns to a predictable mathematical rhythm.

- **Desktop:** 12 columns, 24px gutters, 48px outer margins. Max-width of 1440px to ensure line lengths remain readable.
- **Tablet:** 8 columns, 16px gutters, 24px outer margins.
- **Mobile:** 4 columns, 16px gutters, 16px outer margins.

Spacing is applied using a geometric scale (4, 8, 16, 24, 48). Use larger spacing (`xl`) to separate major functional sections and smaller spacing (`sm`, `md`) for internal component padding.

## Elevation & Depth

In a dark, obsidian environment, depth is not created by shadows but by **Tonal Layering** and **Backdrop Blurs**.

1.  **Level 0 (Background):** Pure `#000000`. No light reflection.
2.  **Level 1 (Surface):** Deep Slate (`#0F172A`) with 40% opacity.
3.  **Level 2 (Active/Floating):** Use a subtle Sapphire-tinted inner glow (1px stroke) instead of a drop shadow.
4.  **Glass Effect:** Apply a `blur(20px)` to any surface above Level 0 to create a sense of translucency.

Borders are the primary tool for separation. Use low-contrast 1px strokes in Slate for containers and high-contrast 1px Sapphire strokes for active/focused states.

## Shapes

The shape language is **Soft (0.25rem)**. This provides just enough rounding to feel modern and premium without sacrificing the "industrial" and "precise" nature of the design system.

- Standard components (Inputs, Buttons) use `4px` (0.25rem).
- Larger containers and cards use `8px` (0.5rem).
- Selection indicators and tags use `4px` to maintain a sharp, technical profile.
- Avoid pill shapes or heavy rounding, as they conflict with the grid-based, professional aesthetic.

## Components

**Buttons**

- **Primary:** Solid Sapphire background with white text. High-contrast.
- **Secondary:** Transparent background with a 1px Sapphire stroke.
- **Ghost:** No background or stroke; text turns Sapphire on hover.

**Input Fields**

- Background should be a dark translucent grey (`rgba(255,255,255,0.05)`).
- 1px border that turns Sapphire on focus.
- Monospaced font (IBM Plex Mono) for input text.

**Cards**

- Subtle 1px Slate border.
- Background blur enabled for any overlay cards.
- No drop shadows; use the border-glow technique for emphasis.

**Chips & Tags**

- Small, uppercase monospaced text.
- Sapphire background at 10% opacity with a solid 1px Sapphire left-border for high visibility in lists.

**Progress Bars & Data Viz**

- Use the Sapphire accent for all data-carrying elements.
- Success states: Emerald. Warning: Amber. Error: Crimson. These should be desaturated to match the "Sapphire" aesthetic.
