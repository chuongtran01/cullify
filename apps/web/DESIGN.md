# Cullify Design System

## Overview

Cullify should read as a controlled enterprise AI product: editorial white space, near-black actions, deep product bands, rounded media cards, and data-rich surfaces that feel calm rather than flashy. The visual direction is inspired by Cohere's public design language: white-first pages, sober AI infrastructure tone, deep green-black or navy showcase sections, thin rules, and large restrained type.

The system should make image curation feel like serious infrastructure. Use open white canvas for strategy, trust, and explanation. Use dark product bands for workflow proof, processing states, dashboards, and high-confidence AI moments. Color should usually arrive through image content, product previews, status chips, and sparse warm accents rather than decorative gradients.

This file defines the target design direction for future app component updates. It should not be treated as a request to immediately modify existing components.

## Key Characteristics

- White editorial canvas with strong near-black text.
- Deep green-black and dark navy bands for product showcases.
- Near-black or white pill CTAs, depending on surface contrast.
- Rounded media cards, especially 22px on major product and image surfaces.
- Thin borders, rules, and surface alternation instead of drop shadows.
- Large display headlines at weight 400 with tight line height.
- Data-rich dashboard areas that stay quiet, structured, and scannable.
- Warm coral used only for metadata, taxonomy, warnings, or small editorial accents.
- Blue reserved for links, focus states, and secondary interaction emphasis.

## Colors

### Brand And Accent

| Token | Value | Use |
| --- | --- | --- |
| `colors.primary` | `#17171c` | Primary light-surface CTA, dark product cards, strongest UI emphasis. |
| `colors.black` | `#000000` | Announcement strips, maximum-emphasis text, rare high-contrast anchors. |
| `colors.ink` | `#212121` | Default body and heading text on light surfaces. |
| `colors.deep-green` | `#003c33` | Product workflow bands, AI processing showcases, high-trust dark sections. |
| `colors.dark-navy` | `#071829` | Security, analytics, billing, and operational dashboard bands. |
| `colors.action-blue` | `#1863dc` | Links, hover emphasis, active states, pagination, and secondary interactive cues. |
| `colors.focus-blue` | `#4c6ee6` | Keyboard focus rings. |
| `colors.coral` | `#ff7759` | Taxonomy chips, warning markers, editorial labels, and small warm accents. |
| `colors.coral-soft` | `#ffad9b` | Soft chip borders and secondary warm accents. |

### Surface

| Token | Value | Use |
| --- | --- | --- |
| `colors.canvas` | `#ffffff` | Default page background and primary card surface. |
| `colors.surface-stone` | `#eeece7` | Product cards, image placeholders, comparison blocks, and warm neutral bands. |
| `colors.surface-green-wash` | `#edfce9` | Pale support background behind dark product modules. |
| `colors.surface-blue-wash` | `#f1f5ff` | Lightweight editorial or empty-state CTA backgrounds. |
| `colors.surface-card` | `#ffffff` | Cards, forms, dialogs, and table surfaces. |
| `colors.surface-dark` | `#17171c` | Dark panels, console previews, and inverted cards. |
| `colors.surface-dark-soft` | `#24302f` | Secondary dark cards inside deep green sections. |

### Text And Rules

| Token | Value | Use |
| --- | --- | --- |
| `colors.body` | `#616161` | Running copy on light surfaces. |
| `colors.muted` | `#93939f` | Metadata, captions, dates, disabled labels. |
| `colors.slate` | `#75758a` | Tertiary labels and dense table metadata. |
| `colors.hairline` | `#d9d9dd` | Standard dividers, form borders, table rules. |
| `colors.hairline-light` | `#e5e7eb` | Secondary dividers and light utility rules. |
| `colors.card-border` | `#f2f2f2` | Soft card containment on white canvas. |
| `colors.on-primary` | `#ffffff` | Text on near-black, deep green, and navy surfaces. |
| `colors.error` | `#b30000` | Validation errors and destructive warnings. |

## Typography

Use a Cohere-like split: a distinctive display face for major declarations, a precise sans for UI, and a mono face for technical labels. If proprietary fonts are unavailable, use the fallbacks below.

- Display: `Space Grotesk`, `Inter`, `ui-sans-serif`, `system-ui`.
- Body/UI: `Inter`, `Arial`, `ui-sans-serif`, `system-ui`.
- Technical labels and code: `JetBrains Mono`, `ui-monospace`, `SFMono-Regular`, `Menlo`, monospace.

| Token | Tailwind Utility | Weight | Line Height | Letter Spacing | Use |
| --- | --- | --- | --- | --- | --- |
| `typography.hero-display` | `text-6xl sm:text-7xl lg:text-8xl` | 400 | 1.0 | -1.92px | Homepage or major product hero. |
| `typography.product-display` | `text-5xl sm:text-6xl lg:text-7xl` | 400 | 1.0 | -1.44px | Product workflow and dashboard hero sections. |
| `typography.section-display` | `text-4xl sm:text-5xl lg:text-6xl` | 400 | 1.0 | -1.2px | Large section headings. |
| `typography.section-heading` | `text-3xl sm:text-4xl lg:text-5xl` | 400 | 1.2 | -0.48px | Standard section headings. |
| `typography.card-heading` | `text-2xl sm:text-3xl` | 400 | 1.2 | -0.32px | Card groups and feature titles. |
| `typography.feature-heading` | `text-xl sm:text-2xl` | 400 | 1.3 | 0 | Feature cards, filter headings, dashboard panels. |
| `typography.body-large` | `text-lg` | 400 | 1.4 | 0 | Lead copy and larger descriptions. |
| `typography.body` | `text-base` | 400 | 1.5 | 0 | Default body, links, labels. |
| `typography.button` | `text-sm` | 500 | 1.7 | 0 | CTA and compact control labels. |
| `typography.caption` | `text-sm` | 400 | 1.4 | 0 | Metadata and helper text. |
| `typography.mono-label` | `text-sm uppercase` | 400 | 1.4 | 0.28px | Technical labels, status markers, categories. |
| `typography.micro` | `text-xs` | 400 | 1.4 | 0 | Footer, fine print, compact metadata. |
| `typography.code` | `text-sm` | 400 | 1.5 | 0 | Code blocks, logs, and processing traces. |

### Typography Principles

- Use massive type sparingly; one large headline per view is enough.
- Avoid heavy bold display weights. Hierarchy comes from scale, space, and contrast.
- Keep display lines tight and deliberate.
- Use mono labels for system states, AI job types, queue labels, and image-processing metadata.
- Do not let dense dashboard text inherit hero-scale styling.

## Layout

### Spacing

Use an 8px base with a few practical intermediate values for alignment.

| Token | Value | Use |
| --- | --- | --- |
| `spacing.xxs` | `2px` | Hairline offsets and micro alignment. |
| `spacing.xs` | `6px` | Tight inline gaps. |
| `spacing.sm` | `8px` | Compact control spacing. |
| `spacing.md` | `12px` | Form and chip padding. |
| `spacing.lg` | `16px` | Default component gaps. |
| `spacing.xl` | `24px` | Card padding and grid gaps. |
| `spacing.xxl` | `32px` | Larger cards and stacked sections. |
| `spacing.section-sm` | `56px` | Compact page bands. |
| `spacing.section` | `80px` | Default section rhythm. |

### Grid And Container

- Max content width: approximately 1200px for app and marketing content.
- Global nav uses three zones: brand left, primary navigation center, account/actions right.
- Product showcase sections can use a two-column composition: dashboard or image preview beside supporting proof.
- Dense app views should prefer rule-separated rows, tables, split panes, and compact cards over decorative marketing card grids.
- Feature and settings grids can be 3-up on desktop, 2-up on tablet, and 1-up on mobile.
- Forms use two-column rows on desktop and stack on mobile.

### Whitespace

Whitespace is a trust signal. Leave large empty intervals around brand claims, customer proof, and workflow proof. Dense content is welcome inside product surfaces, but it should be organized with rules, labels, and consistent row heights.

## Elevation And Depth

Cullify should be nearly shadow-free. Depth comes from contrast between white canvas, dark product fields, rounded media, thin borders, and image content.

| Level | Treatment | Use |
| --- | --- | --- |
| Flat | No shadow, open white or dark field | Page backgrounds, hero copy, editorial text. |
| Bordered | 1px `colors.hairline`, `colors.hairline-light`, or `colors.card-border` | Cards, forms, tables, panels, dialogs. |
| Media Lift | Rounded image or product preview over contrasting field | Image previews, culling workflows, hero media. |
| Dark Product Field | Deep green or navy full-width band | AI workflow demos, analytics dashboards, security claims. |

Drop shadows are not part of the default system. Use them only for unavoidable overlays, and keep them subtle.

## Shapes

| Token | Value | Use |
| --- | --- | --- |
| `rounded.xs` | `4px` | Utility controls, compact thumbnails, search fields. |
| `rounded.sm` | `8px` | Dialogs, chips, small cards, table row controls. |
| `rounded.md` | `16px` | Medium product cards and grouped blocks. |
| `rounded.lg` | `22px` | Signature media cards, large product previews, major placeholders. |
| `rounded.xl` | `30px` | Large taxonomy filters and segmented pill groups. |
| `rounded.pill` | `32px` | Primary CTA buttons and prominent chips. |
| `rounded.full` | `9999px` | Avatars, circular status dots, fully pill-shaped controls. |

### Image Treatment

Images are the product. Show them clearly, with real inspection value. Use 22px rounded media cards for major previews, before/after comparisons, culling groups, and hero visuals. Avoid blurred, dark, or overly cropped imagery when users need to judge quality.

## Components

### Top Navigation

`top-nav` uses a white canvas, ink text, and a quiet three-zone layout. Keep it thin, functional, and predictable. Primary actions use `button-primary`; secondary navigation is text-only.

### Buttons

`button-primary` is a near-black pill on light surfaces. It uses `colors.primary`, `colors.on-primary`, `typography.button`, `rounded.pill`, and roughly `px-6 py-3`.

`button-primary-inverted` is a white pill on dark green, navy, or near-black surfaces. It uses `colors.canvas`, `colors.primary`, `typography.button`, and `rounded.pill`.

`button-secondary` is text-only or underlined. It has no filled background and uses `colors.ink` on light surfaces or `colors.on-primary` on dark surfaces.

`button-pill-outline` is a transparent outlined pill for filters and taxonomy controls. It uses a 1px border, `rounded.xl`, and compact horizontal padding.

### Hero And Product Showcase

`hero-band` uses white canvas, a centered or split hero declaration, one primary CTA, one text secondary action, and a clear product or image-preview surface.

`product-showcase-band` uses `colors.deep-green` or `colors.dark-navy`, white text, generous padding, and dashboard or workflow previews. Cards inside the band use dark softened surfaces and pale borders.

`hero-photo-card` is a rounded 22px image or product preview card. It can include subtle overlay metadata, but text must not obscure image inspection.

### App Shell

`app-shell` should feel like a professional operations surface. Use white or very pale backgrounds, clear navigation, compact row heights, and scannable filters. Reserve dark surfaces for focused previews, processing consoles, or high-emphasis panels.

`sidebar` uses white or stone surfaces, 1px rules, compact text labels, and clear active states. Avoid saturated background fills for active navigation.

### Dashboard And Tables

`dashboard-panel` uses `colors.surface-card`, `rounded.sm` or `rounded.md`, 1px `colors.hairline-light`, and no shadow.

`data-table` uses rule-separated rows, sticky or clearly repeated column labels, compact metadata, and visible empty/loading/error states.

`metric-card` should be quiet: small mono label, large but not heroic value, muted trend text, and one optional accent marker.

### Image Review

`image-grid-card` uses visible image content, `rounded.sm` or `rounded.lg` depending on size, and restrained metadata below or overlaid only in safe corners.

`image-inspection-panel` uses a dark or neutral background when judging contrast, sharpness, and exposure. Controls should be compact icon buttons with tooltips where needed.

`selection-chip` uses pill shape, mono or caption text, and restrained color. Use coral only for warning-like statuses or taxonomy, not for normal selection.

### AI Workflow

`agent-console-card` is a dark panel for AI processing traces, model decisions, job states, and generated summaries. It uses `colors.surface-dark`, white text, muted metadata, mono labels, and compact status chips.

`workflow-step-card` uses thin borders, small mono labels, and clear status markers. Prefer rows or compact cards over decorative timeline art.

`status-chip` uses pill shape, caption or mono label text, and semantic color only when the state needs it.

### Cards

`feature-card` uses `colors.surface-card`, `colors.ink`, `typography.feature-heading`, `rounded.sm` or `rounded.md`, `p-6`, and a 1px border.

`media-card` uses `rounded.lg`, no shadow, and either an image, video, or product screenshot as the dominant content.

`product-card` uses `colors.surface-stone`, `rounded.sm`, generous padding, a divider line, and compact action controls.

### Forms And Inputs

`text-input` uses white background, ink text, 1px `colors.hairline`, `rounded.xs` or `rounded.sm`, and 12px-16px padding. Focus uses `colors.focus-blue` ring or `colors.action-blue` outline.

`contact-form-card` and larger form panels use `colors.surface-card`, `rounded.lg`, 1px border, and two-column field grouping on desktop.

Validation errors use `colors.error` sparingly with clear text, not only color.

### Tags And Filters

`taxonomy-chip` uses transparent or pale fill, a thin border, `rounded.xl`, and caption text. Coral can mark editorial category groups or cautionary states.

`filter-chip` uses outlined pill styling, compact spacing, and clear selected/unselected states.

### Footer

`footer` may invert to near-black or deep green. Use white section labels, muted links, and thin dividers. Newsletter or CTA areas should use a single input row and one clear action.

## Responsive Behavior

| Name | Width | Key Changes |
| --- | --- | --- |
| Small Mobile | < 425px | Single-column cards, compact nav, reduced hero scale, stacked media. |
| Mobile | 425-640px | Hero media stacks, forms become one column, tables collapse metadata below titles. |
| Large Mobile | 640-768px | Larger one-column previews, two-up compact controls only when comfortable. |
| Tablet | 768-1024px | Two-column cards begin, nav spacing tightens, dashboards compress sidebars. |
| Desktop | 1024-1440px | Full nav, 3-column grids, split product showcases, full tables. |
| Wide | > 1440px | Keep content capped; add whitespace rather than stretching dense UI. |

Touch targets:

- Primary CTAs: at least 44px height.
- Icon buttons: at least 36px square, 40px preferred for touch-heavy areas.
- Filter chips: comfortable horizontal padding and at least 32px height.

Collapsing strategy:

- Top nav collapses below tablet width.
- Product showcase media stacks below supporting copy on mobile.
- Card grids move 3-up to 2-up to 1-up.
- Data tables preserve row hierarchy; metadata stacks rather than disappearing.
- Image inspection controls collapse into grouped icon toolbars.

## Do

- Use white canvas as the default surface.
- Use deep green or navy for full-width product proof sections.
- Keep primary CTAs pill-shaped and near-black on light surfaces.
- Use 22px radius on major media and product-preview cards.
- Use thin borders and rules instead of shadows.
- Let real images, product screenshots, and data surfaces carry visual interest.
- Use mono labels for AI workflow states, processing metadata, and technical categories.
- Keep dense app views compact, aligned, and highly scannable.

## Don't

- Do not update existing app components just because this document changed.
- Do not turn coral or blue into broad decorative backgrounds.
- Do not use saturated gradients as normal UI surfaces.
- Do not add heavy drop shadows to cards.
- Do not make every section a floating card.
- Do not obscure image previews with large text overlays.
- Do not use hero-scale typography inside dashboards, sidebars, tables, or compact panels.
- Do not make the app feel like a dark IDE by default.

## Iteration Guide

1. Start from white canvas or a full-width deep green/navy product band.
2. Pick one primary action per view; use secondary actions as text links or outlined pills.
3. Use major rounded media cards when the page needs visual energy.
4. Prefer rows, rules, and compact panels for operational app workflows.
5. Use token references everywhere once tokens exist in code.
6. Keep component examples structurally honest; avoid invented product data that implies unsupported behavior.
7. Treat gradients as media or illustration, not generic surface styling.
8. Check mobile layouts for text fit, image inspectability, and non-overlapping controls.

## Known Gaps

- Proprietary Cohere fonts are not bundled; use the documented fallbacks.
- Animation timing, route transitions, and micro-interactions are not fully specified.
- Exact implementation tokens may need mapping to the current Tailwind and component setup.
- Existing components have not been updated to match this document yet.
