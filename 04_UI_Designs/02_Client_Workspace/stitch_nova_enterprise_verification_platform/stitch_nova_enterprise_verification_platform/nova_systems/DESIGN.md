---
name: Nova Systems
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  mono-label:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is engineered for high-stakes enterprise background verification. The aesthetic is rooted in **Modern SaaS Minimalism**, prioritizing clarity, precision, and perceived security. It draws inspiration from the functional rigor of developer-centric platforms, moving away from "friendly" startup tropes toward a more authoritative, "instrument-grade" interface.

The visual narrative is built on:
- **Pragmatic Professionalism:** Every element serves a functional purpose; decorative flourishes are eliminated to reduce cognitive load.
- **Extreme Precision:** Tight alignment, consistent rhythmic spacing, and razor-sharp borders convey reliability.
- **Architectural Depth:** Using subtle shifts in value and thin lines rather than heavy shadows to create hierarchy.

## Colors
This design system utilizes a high-contrast palette focused on readability and status clarity. 

- **Primary Blue (#2563EB):** Reserved for primary actions, progress indicators, and verified status marks.
- **Pure White Background:** Essential for maintaining the "large whitespace" philosophy and ensuring maximum contrast for data-heavy views.
- **Slate Scale:** A neutral range from Slate-50 (#F8FAFC) for surface backgrounds to Slate-900 (#0F172A) for primary text.
- **Functional Tinting:** Success and Error colors are used sparingly but with high saturation to ensure critical verification results are unmistakable.

## Typography
The typography system relies exclusively on **Inter** to maintain a systematic, utilitarian appearance. 

- **Weight as Hierarchy:** Use Semibold (600) for section headers and Bold (700) for primary headlines to create a strong vertical rhythm.
- **Data Readability:** Body text is set at 14px (body-md) for enterprise density, ensuring large amounts of verification data can be scanned quickly without fatigue.
- **Monospace Accents:** For IDs, hashes, or reference codes, use a monospaced font at small sizes to distinguish machine-generated data from human-readable text.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1280px max-width grid on desktop, while internal dashboards use a fluid 12-column system.

- **The 4px Rule:** All spacing and sizing must be a multiple of 4px.
- **Density Management:** For "List Views" and "Data Tables," use a compact 8px/12px padding. For "Onboarding" or "Verification Reports," increase padding to 24px+ to evoke a premium, document-like feel.
- **Breakpoints:**
  - Mobile: < 640px (1-column, 16px margins)
  - Tablet: 640px - 1024px (Fluid columns, 24px margins)
  - Desktop: > 1024px (12-column grid)

## Elevation & Depth
Elevation in this design system is achieved through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional shadows.

- **The Base Layer:** Pure white (#FFFFFF) background.
- **The Surface Layer:** Cards and containers use a 1px border (#E2E8F0).
- **The Elevation Shadow:** For interactive elements (cards, menus), use a "Soft Enterprise Shadow": `0px 1px 2px rgba(0, 0, 0, 0.05), 0px 4px 6px -1px rgba(0, 0, 0, 0.02)`.
- **Z-Index Logic:** Avoid stacking more than three layers (Base > Card > Modal). Use subtle Slate-50 backgrounds for header or sidebar areas to differentiate them from the primary workspace.

## Shapes
The shape language is disciplined and consistent. A standard 12px (0.75rem) corner radius is applied to all primary containers and buttons.

- **Input Fields & Buttons:** 12px (rounded-lg equivalent).
- **Large Cards:** 12px.
- **Status Tags/Chips:** 6px (rounded-sm equivalent) to provide a sharper, more professional distinction from the softer UI buttons.
- **Table Rows:** Sharp corners to maintain the structural integrity of the grid.

## Components
- **Buttons:** Primary buttons use a solid #2563EB fill with white text. Secondary buttons use a white fill with a 1px #E2E8F0 border and #0F172A text. Height should be fixed at 40px for standard actions.
- **Input Fields:** Use 1px #E2E8F0 borders that transition to 1px #2563EB on focus. Labels must always be visible (no floating labels) and positioned 8px above the field.
- **Data Tables:** The core of the enterprise experience. Use 12px vertical padding for rows, #F8FAFC for the header background, and thin #E2E8F0 horizontal dividers only. No vertical dividers.
- **Verification Cards:** Use a 1px border. The top section should include a clear status indicator (e.g., "Clear", "Flagged", "Pending") using the functional color palette.
- **Progress Steppers:** Use a thin 2px line with 24px circular icons to represent verification stages, ensuring a high-contrast path to completion.