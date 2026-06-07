# Cullify Design System

## Overview

Expo's marketing site reads like a quietly-confident React-Native developer platform. The base canvas is **pure white** (`bg-canvas`) with a soft **sky-blue gradient atmospheric wash** behind the hero band. Near-black ink (`text-ink`) carries body and display alike. The single brand voltage is **pure black** (`bg-primary`) for primary CTAs — minimal and editorial-feeling. A small blue text-link accent (`text-text-link`) is reserved for inline body links, never as a CTA.

Type runs **Inter** as the single sans family at modest weights (`font-semibold` for display, `font-normal` for body). JetBrains Mono (`font-mono`) carries every code surface. No custom typeface — the brand trusts Inter's editorial neutrality.

The brand's strongest visual signature is the **device-mockup hero** — a centered MacBook + iPhone composite showing real product surfaces — over a sky-blue gradient atmospheric wash. The composite is the page's chrome instead of an illustration.

**Key Characteristics:**
- Pure white canvas with sky-blue gradient atmospheric backdrop in hero only.
- Single primary CTA: pure black at `rounded-md` — compact developer-tool dialect.
- `text-text-link` for inline links only — never on a CTA.
- Inter as the single sans family — no custom display typeface.
- JetBrains Mono on every code surface.
- Device-mockup hero with real product surfaces is the brand chrome.
- Hairline + soft drop depth; no atmospheric brand decoration outside the hero.
- `py-24` section rhythm.

## Tailwind Conventions

Implement sizing with **Tailwind utilities**, not hardcoded pixel values in components.

- **Colors:** `bg-*`, `text-*`, `border-*` using theme tokens (`canvas`, `ink`, `primary`, `hairline-strong`, etc.).
- **Spacing:** default scale (`p-4`, `gap-6`, `py-24`). Base unit is `1` = `0.25rem` (4px at default root).
- **Type:** `text-*`, `font-*`, `leading-*`, `tracking-*`.
- **Radius:** `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-full` (badges only).
- **Layout:** `max-w-[1200px]`, breakpoint prefixes `sm:`, `md:`, `lg:`, `xl:`.
- **Arbitrary values:** use only when the scale has no close match (e.g. `text-[11px]` for caption-uppercase, `max-w-[1200px]` for content width).

Custom radius tokens in `globals.css` map to Tailwind as:

| Token | Tailwind | Use |
|---|---|---|
| `--radius-xs` | `rounded-xs` | Inline tags |
| `--radius-sm` | `rounded-sm` | Compact rows |
| `--radius-md` | `rounded-md` | CTAs, inputs, ecosystem tiles |
| `--radius-lg` | `rounded-lg` | Feature cards, code blocks, pricing |
| `--radius-xl` | `rounded-xl` | Device mockup cards |
| `--radius-2xl` | `rounded-2xl` | Larger atmospheric cards (rare) |

## Colors

### Brand & Accent
- **Black** (`bg-primary` / `text-primary`): Primary CTA fill. Used scarcely.
- **Black Active** (`bg-primary-active`): Press state.
- **Text Link Blue** (`text-text-link`): Inline body links inside long-form copy. Scoped narrowly — never on CTAs.
- **Legal Link Blue** (`text-text-link-secondary`): Inline links inside legal copy footer.
- **Bright Cyan** (`text-accent-link-bright`): Used very sparingly inside docs widget links.

### Surface
- **Canvas** (`bg-canvas`): Pure white page floor.
- **Canvas Soft** (`bg-canvas-soft`): Subtle alternating band.
- **Surface Card** (`bg-surface-card`): Pure white card.
- **Surface Strong** (`bg-surface-strong`): Badges, ecosystem tiles, secondary buttons.
- **Surface Dark** (`bg-surface-dark`): Dark feature cards, code blocks, IDE mockups, featured pricing.
- **Surface Dark Elevated** (`bg-surface-dark-elevated`): One step lighter inside dark cards.

### Atmospheric Backdrop
- **Sky Light** (`from-gradient-sky-light`) + **Sky Mid** (`via-gradient-sky-mid`): Soft sky-blue gradient wash behind the homepage hero only. Not a brand action color.

### Hairlines
- **Hairline** (`border-hairline`): Default 1px divider.
- **Hairline Soft** (`border-hairline-soft`): Lighter divider.
- **Hairline Strong** (`border-hairline-strong`): Stronger panel outline.

### Text
- **Ink** (`text-ink`): Display, body emphasis.
- **Body** (`text-body`): Default running-text — slightly cool gray.
- **Body Strong** (`text-body-strong`): Same as ink.
- **Muted** (`text-muted`): Sub-titles.
- **Muted Soft** (`text-muted-soft`): Disabled text.
- **On Primary** (`text-on-primary`): White text on black CTA.
- **On Dark** (`text-on-dark`): White text on dark cards.
- **On Dark Soft** (`text-on-dark-soft`): Muted off-white on dark.

### Semantic
- **Warning** (`text-accent-warning`): Warning text inside docs callouts.
- **Preview** (`text-accent-preview`): "Preview" tag color.
- **Success** (`text-semantic-success`): Confirmation.
- **Error** (`text-semantic-error`): Validation errors.

## Typography

### Font Family
**Inter** (`font-sans`) is the single sans family across every text role. **JetBrains Mono** (`font-mono`) carries every code surface.

### Hierarchy

| Token | Tailwind | Weight | Line Height | Tracking | Use |
|---|---|---|---|---|---|
| `display-mega` | `text-[32px] sm:text-5xl lg:text-6xl` | `font-semibold` | `leading-[1.05]` | `tracking-[-0.03em]` | Homepage hero h1 |
| `display-xl` | `text-5xl` | `font-semibold` | `leading-tight` | `tracking-[-0.03em]` | Subsidiary heroes |
| `display-lg` | `text-[28px] sm:text-4xl` | `font-semibold` | `leading-[1.15]` | `tracking-[-0.03em]` | Section heads |
| `display-md` | `text-3xl` | `font-semibold` | `leading-snug` | `tracking-[-0.02em]` | Sub-section heads |
| `display-sm` | `text-[22px]` | `font-semibold` | `leading-snug` | `tracking-[-0.02em]` | Card group titles |
| `title-md` | `text-lg` | `font-semibold` | `leading-snug` | — | Component titles |
| `title-sm` | `text-base` | `font-semibold` | `leading-snug` | — | List labels |
| `body-md` | `text-base` | `font-normal` | `leading-normal` | — | Default body |
| `body-sm` | `text-sm` | `font-normal` | `leading-normal` | — | Footer body |
| `caption` | `text-[13px]` | `font-normal` | `leading-snug` | — | Photo captions |
| `caption-uppercase` | `text-[11px]` | `font-semibold uppercase` | `leading-snug` | `tracking-[0.88px]` | Section labels, badges |
| `code` | `text-[13px] font-mono` | `font-normal` | `leading-normal` | — | Code blocks |
| `button` | `text-sm` | `font-medium` | `leading-none` | — | CTA labels |
| `nav-link` | `text-sm` | `font-medium` | `leading-5` | — | Top-nav menu |

### Principles
- **Display weight stays at `font-semibold` (600)** — confident but not bombastic.
- **Negative letter-spacing on display** — `tracking-[-0.03em]` to `tracking-[-0.02em]`.
- **`font-mono` on every code surface.**

## Layout

### Spacing System

Use the Tailwind spacing scale. Common tokens:

| Token | Tailwind | Use |
|---|---|---|
| xxs | `1` | Tight inline gaps |
| xs | `2` | Compact padding |
| sm | `3` | Chip padding |
| base | `4` | Default card padding unit |
| md | `5` | Form padding |
| lg | `6` | Card padding (`p-6`) |
| xl | `8` | Section inner gaps (`gap-8`) |
| xxl | `12` | Large section gaps |
| section | `24` | Section padding (`py-24`) |

- **Section padding:** `py-24` (vertical), `px-5` (horizontal gutter on marketing pages).

### Grid & Container
- Max content width: `max-w-[1200px] mx-auto px-5`.
- Editorial body: 12-column grid.
- Feature card grids: `md:grid-cols-2`, `lg:grid-cols-3`.
- Ecosystem tile grid: up to 8 columns at desktop.
- Footer: 5-column at `md:` breakpoint.

### Whitespace Philosophy
Generous editorial pacing. The white canvas does not compete with the hero's gradient sky wash; cards inside dense workflow sections sit close (`gap-4` to `gap-6`).

## Elevation & Depth

| Level | Tailwind / treatment | Use |
|---|---|---|
| Flat (canvas) | `bg-canvas` | Body bands, footer |
| Card | `bg-surface-card` | Content cards |
| Hairline border | `border border-hairline` | Card outlines |
| Soft drop | `shadow-sm` or custom `shadow-[0_4px_12px_rgba(0,0,0,0.04)]` | Hovered cards (single shadow tier) |
| Atmospheric gradient | Radial sky wash in hero | Hero backdrop only |
| Dark inversion | `bg-surface-dark text-on-dark` | Dark feature cards, code blocks, featured pricing |

### Decorative Depth
- **Sky-blue gradient backdrop** in the hero only — atmospheric depth without claiming to be a brand color.
- **Device mockup composite** as page chrome.

## Shapes

### Border Radius Scale

| Token | Tailwind | Use |
|---|---|---|
| none | `rounded-none` | Reserved |
| xs | `rounded-xs` | Inline tags |
| sm | `rounded-sm` | Compact rows |
| md | `rounded-md` | CTA buttons, form inputs, ecosystem tiles |
| lg | `rounded-lg` | Feature cards, code blocks, pricing tiers |
| xl | `rounded-xl` | Device mockup cards |
| 2xl | `rounded-2xl` | Larger atmospheric cards (rare) |
| pill | `rounded-full` | Badges only |
| full | `rounded-full` | Avatar plates (rare) |

Compact developer-ergonomic radii — `rounded-md` CTAs, `rounded-lg` cards. Pill geometry is reserved for badges, never CTAs.

## Components

### Top Navigation

**`top-nav`** — `bg-canvas`, `text-ink`, `h-16`. Layout: wordmark left, primary horizontal menu (`text-sm font-medium leading-5 text-body`), Sign In + Get started CTA right.

### Buttons

**`button-primary`** — `bg-primary text-on-primary text-sm font-medium h-10 px-[18px] rounded-md`.

**`button-primary-active`** — Press state. `bg-primary-active`.

**`button-secondary`** — `bg-surface-card text-ink border border-hairline-strong h-10 px-[18px] rounded-md`.

**`button-tertiary-text`** — `text-text-link text-sm font-medium` (inline link, not a button fill).

### Hero & Device Mockup

**`hero-band`** — `bg-canvas` with sky-blue radial gradient wash behind centered headline. Headline uses `display-mega`, subhead uses `body-md`, single primary CTA, then device mockup composite below.

**`device-mockup-card`** — Layered product composite. `bg-surface-dark rounded-xl` outer shell; inner panels `rounded-lg`.

### Cards

**`feature-card`** — `bg-surface-card text-ink text-lg font-semibold rounded-lg p-6 border border-hairline-strong`.

**`feature-card-dark`** — `bg-surface-dark text-on-dark rounded-lg`. Same shape, dark inversion.

**`workflow-step-card`** — `bg-surface-card text-body rounded-lg p-5 sm:p-6`. Layout: `size-8` square `workflow-step-icon` + step number + label + body.

**`workflow-step-icon`** — `size-8 grid place-items-center bg-surface-strong rounded-md`.

**`testimonial-card`** — `bg-surface-card text-body rounded-lg p-6`.

### Code & IDE

**`code-block`** — `bg-surface-dark text-on-dark font-mono text-[13px] rounded-lg p-5`.

**`ide-mockup-card`** — `bg-surface-dark rounded-lg`. Multi-pane editor + terminal preview.

### Pricing

**`pricing-tier-card`** — `bg-surface-card rounded-lg p-8 border border-hairline-strong`.

**`pricing-tier-featured`** — `bg-surface-dark text-on-dark rounded-lg p-8`.

### Ecosystem

**`ecosystem-tile`** — `size-16 bg-surface-card rounded-md border border-hairline`.

### Forms & Tags

**`text-input`** — `bg-surface-card text-ink rounded-md px-4 py-3 h-11 border border-hairline-strong`. Focus: `border-2 border-ink`.

**`badge-pill`** — `bg-surface-strong text-ink text-[11px] font-semibold uppercase tracking-[0.88px] rounded-full px-2.5 py-1`.

### CTA / Footer

**`cta-band`** — `bg-canvas py-24 text-center`. Display headline in `display-lg`, single black `button-primary`.

**`footer-light`** — `bg-canvas text-body border-t border-hairline py-16 px-5`. 5-column link list at `md:`.

**`footer-link`** — `text-sm text-body`. Legal links: `text-text-link-secondary`.

## Do's and Don'ts

### Do
- Reserve `bg-primary` for primary CTAs.
- Use `text-text-link` for inline body links only — never on CTAs or buttons.
- Set every CTA at `rounded-md`.
- Use `font-semibold` for display, `font-normal` for body.
- Render every code surface with `font-mono`.
- Pair the hero with the device-mockup composite — it's the page chrome.
- Express sizing with Tailwind utilities (`p-6`, `text-lg`, `h-10`) instead of inline pixel styles.

### Don't
- Don't introduce a saturated brand action color. Black is the only CTA fill.
- Don't use `text-text-link` on a CTA. Inline links only.
- Don't drop display below `font-semibold` or use `font-bold` for marketing display.
- Don't use `rounded-full` on CTAs — pills are for badges only.
- Don't replicate the sky-blue gradient backdrop outside the hero.
- Don't hardcode pixel dimensions in components when a Tailwind class exists.

## Responsive Behavior

### Breakpoints

| Name | Tailwind | Key Changes |
|---|---|---|
| Mobile | default | Hero h1 `text-[32px]`; device mockup → single screen; feature grid 1-up; nav hamburger below `md:`. |
| Tablet | `sm:` / `md:` | Hero h1 `sm:text-5xl`; device mockup compresses; feature grid 2-up. |
| Desktop | `lg:` | Full hero h1 `lg:text-6xl`; full composite; feature grid 3-up. |
| Wide | `xl:`+ | Content caps at `max-w-[1200px]`. |

Default Tailwind breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.

### Touch Targets
- Primary CTA: `h-10` (WCAG AA minimum).
- Search input: `h-11` (WCAG AAA).

### Collapsing Strategy
- Top nav switches to hamburger below `md:`.
- Device mockup collapses to a single preview on mobile.
- Feature grid: `lg:grid-cols-3` → `md:grid-cols-2` → 1-up.
- Ecosystem tile grid: 8-up → 4-up → 3-up → 2-up.

## Iteration Guide

1. Focus on a single component at a time.
2. CTAs default to `rounded-md`. Cards use `rounded-lg`.
3. Variants live as separate entries.
4. Use theme color tokens (`bg-canvas`, `text-ink`) — never inline hex.
5. Use Tailwind spacing and type scale — avoid raw pixel values in JSX/CSS.
6. Hover state never documented.
7. `font-semibold` for display, `font-normal` for body. `font-mono` on code.
8. Black stays the only CTA color; text-link blue stays inline-only.

## Known Gaps

- Inter and JetBrains Mono are freely available — no licensing concerns.
- Animation timings (device mockup parallax, hero entrance) out of scope.
- In-app surfaces only partially captured via marketing mockups.
- Form validation states beyond focus not visible on captured surfaces.
- `text-[11px]`, `text-[13px]`, `text-[22px]`, `text-[28px]`, and `max-w-[1200px]` use arbitrary values where the default Tailwind scale has no exact match.
