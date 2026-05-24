# Cullify Design System

## Overview

Cullify should read as a quietly confident developer brand that believes in editorial calm over IDE darkness. The base canvas is warm cream (`#f7f7f4`) holding warm near-black ink (`#26251e`) for body and display alike. The single brand voltage is Cursor Orange (`#f54e00`) reserved for primary CTAs and the wordmark, used scarcely.

Type uses CursorGothic as the single sans family. Display sits at weight 400 with negative letter-spacing: a magazine-editorial voice rather than tech bombast. JetBrains Mono carries every code surface, and code surfaces are expected to make up a meaningful portion of the product marketing experience.

The strongest visual signature is the AI timeline pill palette: five pastel pills marking AI-action stages inside in-product timeline visualizations. These colors belong only inside product UI and should never become general system action colors.

## Key Characteristics

- Warm cream canvas, not white.
- Warm ink (`#26251e`), not pure black.
- Single CTA color: Cursor Orange (`#f54e00`), used scarcely.
- Display weight stays at 400.
- Magazine editorial voice.
- AI timeline pastels are dedicated to in-product agent action stages.
- Compact 8px CTA radius.
- Hairline-only depth.
- No drop shadows.
- 80px section rhythm.

## Colors

### Brand And Accent

| Token | Value | Use |
| --- | --- | --- |
| `colors.primary` | `#f54e00` | Primary CTA pills, wordmark, hero accent. Use scarcely. |
| `colors.primary-active` | `#d04200` | Press state. |

### Surface

| Token | Value | Use |
| --- | --- | --- |
| `colors.canvas` | `#f7f7f4` | Warm cream page floor. |
| `colors.canvas-soft` | `#fafaf7` | IDE-pane background inside mockups. |
| `colors.surface-card` | `#ffffff` | Pure white card surface with slight contrast against the cream canvas. |
| `colors.surface-strong` | `#e6e5e0` | Badges and tag pills. |

### Hairlines

| Token | Value | Use |
| --- | --- | --- |
| `colors.hairline` | `#e6e5e0` | 1px dividers and card outlines. |
| `colors.hairline-soft` | `#efeee8` | Lighter divider. |
| `colors.hairline-strong` | `#cfcdc4` | Stronger panel outline. |

### Text

| Token | Value | Use |
| --- | --- | --- |
| `colors.ink` | `#26251e` | Display and body emphasis. |
| `colors.body` | `#5a5852` | Default running text. |
| `colors.body-strong` | `#26251e` | Strong body text. |
| `colors.muted` | `#807d72` | Subtitles. |
| `colors.muted-soft` | `#a09c92` | Disabled text. |
| `colors.on-primary` | `#ffffff` | Text on Cursor Orange. |

### Timeline

These are the AI-action signature colors. Use them only inside in-product agent timeline visualizations.

| Token | Value | Use |
| --- | --- | --- |
| `colors.timeline-thinking` | `#dfa88f` | Peach. Thinking stage. |
| `colors.timeline-grep` | `#9fc9a2` | Mint. Grepping stage. |
| `colors.timeline-read` | `#9fbbe0` | Pastel blue. Reading stage. |
| `colors.timeline-edit` | `#c0a8dd` | Lavender. Editing stage. |
| `colors.timeline-done` | `#c08532` | Warm gold. Done stage. |

### Semantic

| Token | Value | Use |
| --- | --- | --- |
| `colors.semantic-success` | `#1f8a65` | Confirmation indicators. |
| `colors.semantic-error` | `#cf2d56` | Validation errors. |

## Typography

CursorGothic is the licensed display and body family. Fallback: `system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif`.

Code surfaces use JetBrains Mono.

| Token | Size | Weight | Line Height | Letter Spacing | Use |
| --- | --- | --- | --- | --- | --- |
| `typography.display-mega` | 72px | 400 | 1.1 | -2.16px | Homepage hero h1 |
| `typography.display-lg` | 36px | 400 | 1.2 | -0.72px | Section heads |
| `typography.display-md` | 26px | 400 | 1.25 | -0.325px | Sub-section heads |
| `typography.display-sm` | 22px | 400 | 1.3 | -0.11px | Card group titles |
| `typography.title-md` | 18px | 600 | 1.4 | 0 | Component titles |
| `typography.title-sm` | 16px | 600 | 1.4 | 0 | List labels |
| `typography.body-md` | 16px | 400 | 1.5 | 0 | Default body |
| `typography.body-tracked` | 16px | 400 | 1.5 | 0.08px | Tracked editorial body |
| `typography.body-sm` | 14px | 400 | 1.5 | 0 | Footer body |
| `typography.caption` | 13px | 400 | 1.4 | 0 | Photo captions |
| `typography.caption-uppercase` | 11px | 600 | 1.4 | 0.88px | Section labels and timeline pill labels |
| `typography.code` | 13px | 400 | 1.5 | 0 | Code blocks in JetBrains Mono |
| `typography.button` | 14px | 500 | 1.0 | 0 | CTA pill labels |
| `typography.nav-link` | 14px | 500 | 1.4 | 0 | Top-nav menu |

### Typography Principles

- Display weight stays at 400.
- Negative letter-spacing is for display only.
- JetBrains Mono is used on every code surface.
- CursorGothic is licensed; Inter at weight 400 with roughly -1.5% letter-spacing is the open-source substitute.

## Layout

### Spacing

- Base unit: 4px.
- `spacing.xxs`: 4px.
- `spacing.xs`: 8px.
- `spacing.sm`: 12px.
- `spacing.base`: 16px.
- `spacing.md`: 20px.
- `spacing.lg`: 24px.
- `spacing.xl`: 32px.
- `spacing.xxl`: 48px.
- `spacing.section`: 80px.

Section padding defaults to 80px.

### Grid And Container

- Max content width: approximately 1200px.
- Editorial body: 12-column grid.
- Feature card grids: 2-up at desktop for splits, 3-up for benefits.
- Footer: 5-column at desktop.

### Whitespace

Use generous editorial pacing, closer to a print magazine than a typical tech site. The cream canvas should breathe. Cards inside bands can sit closer together with 16px to 24px gaps.

## Elevation And Depth

The system uses hairline-only depth. There are no shadows or elevation tiers. Cards float above the canvas through 1px hairlines and the slight white-on-cream contrast.

| Level | Treatment | Use |
| --- | --- | --- |
| Flat canvas | `colors.canvas` | Body bands and footer |
| Card | `colors.surface-card` | Content cards |
| Hairline border | 1px `colors.hairline` | Card outlines and dividers |
| IDE pane | `colors.canvas-soft` | Inside IDE mockup cards |

IDE mockup cards are the only elevated-feeling element. Timeline pastel pills add chromatic depth without surface elevation.

## Shapes

| Token | Value | Use |
| --- | --- | --- |
| `rounded.none` | 0px | Reserved |
| `rounded.xs` | 4px | Inline tags |
| `rounded.sm` | 6px | Compact rows |
| `rounded.md` | 8px | CTA buttons and form inputs |
| `rounded.lg` | 12px | Cards and IDE panes |
| `rounded.xl` | 16px | Larger feature cards, rare |
| `rounded.pill` | 9999px | Timeline pills and badges |
| `rounded.full` | 9999px | Avatars, rare |

## Components

### Top Navigation

`top-nav` uses `colors.canvas` background, `colors.ink` text, and 64px height. Layout: wordmark left, primary horizontal menu, sign in, and primary download CTA right.

Primary menu items:

- Pricing
- Features
- Enterprise
- Blog
- Forum
- Careers

### Buttons

`button-primary` is the signature Cursor Orange CTA. It uses `colors.primary` background, `colors.on-primary` text, `typography.button`, 10px by 18px padding, 40px height, and `rounded.md`.

`button-primary-active` uses `colors.primary-active`.

`button-secondary` is a white card pill on cream canvas. It uses `colors.surface-card` background, `colors.ink` text, and a 1px `colors.hairline-strong` border.

`button-tertiary-text` is an inline ink text link.

`button-download` is a larger ink-on-canvas CTA. It uses `colors.ink` background, `colors.canvas` text, 12px by 20px padding, and 44px height.

### Hero And IDE Mockups

`hero-band` uses the cream canvas, a full-width display headline in `typography.display-mega`, a `typography.body-md` subhead, two CTAs, and a centered IDE mockup card below the hero copy.

`ide-mockup-card` is a white card containing a multi-pane IDE mockup: sidebar, main editor, chat panel, and terminal. It uses `colors.surface-card`, `rounded.lg`, a 1px `colors.hairline` border, and no padding so panes fill the card edge-to-edge.

`ide-pane` uses `colors.canvas-soft`, `colors.body`, `typography.code`, `rounded.md`, and 16px padding.

### Cards

`feature-card` uses `colors.surface-card`, `colors.ink`, `typography.title-md`, `rounded.lg`, 24px padding, and a 1px `colors.hairline` border.

`comparison-card` follows the same surface treatment and splits internally into two columns.

`testimonial-card` uses `colors.surface-card`, `colors.body`, `rounded.lg`, and 24px padding.

### AI Timeline

`timeline-pill-thinking` uses `colors.timeline-thinking`, `colors.ink`, `typography.caption-uppercase`, `rounded.pill`, and 4px by 10px padding.

`timeline-pill-grep` uses `colors.timeline-grep` with the same shape and type.

`timeline-pill-read` uses `colors.timeline-read` with the same shape and type.

`timeline-pill-edit` uses `colors.timeline-edit` with the same shape and type.

`timeline-pill-done` uses `colors.timeline-done`, `colors.on-primary`, and the same shape and type.

### Code

`code-block` uses `colors.surface-card`, `colors.ink`, `typography.code`, `rounded.lg`, 20px padding, and a 1px `colors.hairline` border.

### Pricing

`pricing-tier-card` uses `colors.surface-card`, `rounded.lg`, 32px padding, and a 1px `colors.hairline` border.

`pricing-tier-featured` inverts to ink: `colors.ink` background and `colors.canvas` text. This dark inversion signals emphasis without a colored ribbon.

### Forms And Tags

`text-input` uses `colors.surface-card`, `colors.ink`, `rounded.md`, 12px by 16px padding, and 44px height.

`badge-pill` uses `colors.surface-strong`, `colors.ink`, `typography.caption-uppercase`, `rounded.pill`, and 4px by 10px padding.

### CTA And Footer

`cta-band` is a pre-footer band using `colors.canvas`, a centered `typography.display-lg` headline, a single Cursor Orange CTA, and 96px vertical padding.

`footer` uses `colors.canvas`, `colors.body`, a 5-column link list, and 64px by 48px padding.

`footer-link` uses transparent background, `colors.body`, and `typography.body-sm`.

## Responsive Behavior

| Name | Width | Key Changes |
| --- | --- | --- |
| Mobile | < 640px | Hero h1 scales from 72px to 32px; IDE mockup collapses to single pane preview; feature grid becomes 1-up; nav becomes hamburger. |
| Tablet | 640-1024px | Hero h1 uses 56px; IDE mockup compresses; feature grid becomes 2-up. |
| Desktop | 1024-1280px | Full 72px hero h1; full multi-pane IDE mockup; feature grid can be 3-up. |
| Wide | > 1280px | Content caps at 1200px. |

Touch targets:

- Primary CTA: 40px height.
- Download CTA: 44px height.

Collapsing strategy:

- Top nav switches to hamburger below 768px.
- IDE mockup multi-pane collapses to a single primary pane preview on mobile.
- Feature grid goes 3-up to 2-up to 1-up.

## Do

- Reserve Cursor Orange for primary CTAs and the wordmark.
- Keep display weight at 400.
- Use the cream canvas instead of pure white.
- Render every code surface in JetBrains Mono.
- Use timeline pastels only inside in-product agent visualizations.
- Use cards with hairline borders rather than shadows.

## Don't

- Do not introduce a secondary brand action color.
- Do not use bold display weights.
- Do not add drop shadows.
- Do not use timeline pastels on non-timeline UI.
- Do not extract CTA colors from third-party widgets.
- Do not make the interface feel like a dark IDE by default.

## Iteration Guide

1. Focus on one component at a time.
2. CTAs default to `rounded.md`.
3. Cards default to `rounded.lg`.
4. Variants live as separate component entries.
5. Use token references everywhere instead of inline hex values once tokens exist in code.
6. Hover states are implemented in code but do not need to be documented as separate design tokens.
7. CursorGothic uses 400 for display and 400, 500, or 600 for body.
8. JetBrains Mono appears on every code surface.
9. Cursor Orange stays scarce.
10. Timeline pastels stay scoped to in-product agent visualizations.

## Known Gaps

- CursorGothic is licensed; Inter is the substitute.
- Animation timings for timeline pill entrance and IDE pane reveal are out of scope.
- In-app surfaces are captured through marketing IDE mockups, not full product UI.
- Form validation states beyond focus are not fully specified.
