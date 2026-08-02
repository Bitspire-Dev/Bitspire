---
name: Clinical Vanguard
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#434656'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004dea'
  primary: '#0041c8'
  on-primary: '#ffffff'
  primary-container: '#0055ff'
  on-primary-container: '#e3e6ff'
  inverse-primary: '#b6c4ff'
  secondary: '#5f5e5f'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2e3'
  on-secondary-container: '#656465'
  tertiary: '#4a5057'
  on-tertiary: '#ffffff'
  tertiary-container: '#62686f'
  on-tertiary-container: '#e2e8f0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b3'
  secondary-fixed: '#e5e2e3'
  secondary-fixed-dim: '#c8c6c7'
  on-secondary-fixed: '#1c1b1c'
  on-secondary-fixed-variant: '#474647'
  tertiary-fixed: '#dde3eb'
  tertiary-fixed-dim: '#c1c7cf'
  on-tertiary-fixed: '#161c22'
  on-tertiary-fixed-variant: '#41474e'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 76px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  mono-label:
    fontFamily: Courier Prime
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 24px
  margin-sm: 16px
  margin-md: 40px
  margin-lg: 80px
  container-max: 1280px
---

## Brand & Style

The design system embodies a "Clinical Vanguard" aesthetic, specifically tailored for a high-end software agency. It prioritizes surgical precision, technical authority, and a high-tech "armor" feel. The emotional response is one of absolute reliability and advanced engineering.

The style moves away from organic shapes and soft shadows, favoring a high-contrast, structured environment. It utilizes a mix of **Minimalism** for clarity and **Glassmorphism** for technical depth, reinforced by a rigid **Brutalist** underlying grid. Every element should feel like a piece of a high-performance machine: modular, reinforced, and purposeful.

## Colors

The palette is rooted in a "Technical White" spectrum to ensure a clinical and clean atmosphere.

- **Primary (Cobalt Blue):** Used exclusively for high-priority actions, critical status indicators, and subtle "glow" effects on technical micro-details.
- **Surface Hierarchy:**
  - `Base`: #FFFFFF (Pure White) for the main canvas.
  - `Muted`: #F8FAFC for background sections and secondary containers.
  - `Border`: #E2E8F0 for the 1px technical lines that define structure.
- **Typography & Accents:** #0A0A0B (Deep Charcoal) provides high-contrast legibility for headings and essential text.

## Typography

The system relies on **Inter** to maintain a systematic and utilitarian feel. To achieve "commanding authority," headlines utilize heavy weights (Bold and ExtraBold) and tight letter spacing.

- **Headlines:** High-contrast, heavy-weight, and sharp. Use `display-lg` for hero sections to establish immediate dominance.
- **Body:** Optimized for legibility with standard weights.
- **Labels:** Use uppercase and increased letter spacing to mimic technical schematics or blueprints.
- **Technical Detail:** A secondary monospaced font (Courier Prime) may be used sparingly for version numbers, timestamps, or code-related micro-copy.

## Layout & Spacing

The layout follows a strict **Fixed Grid** system to reflect engineering precision. A 12-column grid is used for desktop, shifting to a 4-column grid for mobile.

- **The Grid Overlay:** Use a subtle background pattern of 24px squares (rendered in 1px #F1F5F9 lines) to emphasize the "underlying architecture" of the UI.
- **Rhythm:** All spacing must be multiples of 4px. Use generous margins between sections to maintain the clinical, airy feel, but keep internal component padding tight and "efficient."
- **Breakpoints:**
  - Mobile: 0 - 599px (16px margins)
  - Tablet: 600px - 1023px (24px margins)
  - Desktop: 1024px+ (Dynamic margins to center 1280px container)

## Elevation & Depth

Elevation is expressed through **Layered Precision** rather than shadows.

1.  **Technical Borders:** Use 1px borders (#E2E8F0) to separate all UI modules. For active states, these borders transition to the primary Cobalt Blue.
2.  **Glassmorphism:** Use "Frosted Glass" overlays for floating panels (like navigation bars or modals).
    - _Properties:_ Background Blur: 12px; Background Opacity: 80% White.
3.  **The "Z-Layer" Stack:**
    - `Level 0 (Floor)`: The grid-patterned white background.
    - `Level 1 (Module)`: Solid white surfaces with 1px borders.
    - `Level 2 (Overlay)`: Frosted glass panels that allow the background grid to remain partially visible, creating a sense of depth and translucency.

## Shapes

The shape language is strictly **Sharp (0px)**. All corners are 90 degrees to reinforce the surgical and powerful nature of the brand.

Avoid all rounded corners on buttons, inputs, and cards. For specific technical accents (like status pips or progress bars), use strictly rectangular or diagonal geometric shapes. Small 45-degree "clipped corners" can be used on decorative border elements to enhance the armor aesthetic.

## Components

- **Buttons:**
  - `Primary`: Solid Cobalt Blue background, White text, 0px radius. No shadow.
  - `Secondary`: White background, 1px #0A0A0B border, Black text.
  - `Ghost`: Transparent background, 1px #E2E8F0 border.
- **Input Fields:** Sharp 1px #E2E8F0 borders. On focus, the border turns Cobalt Blue with a subtle 2px "glow" (inner-shadow) of the primary color. Use Monospaced font for data entry fields.
- **Cards:** Pure white background, 1px border. No shadows. Use a "Technical Header" on cards—a 4px vertical Cobalt Blue line on the left side of the card's title.
- **Chips/Tags:** Small, rectangular, with light gray backgrounds (#F1F5F9). Labels in `mono-label` style.
- **Status Indicators:** Use sharp squares instead of circles. A "Pulse" animation can be applied to the Cobalt Blue primary color for "Active" states.
- **Navigation:** A top-bar utilizing the "Frosted Glass" effect. Items use `label-md` typography with a 2px Cobalt Blue bottom border appearing only on the active link.
