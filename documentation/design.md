# [APP_NAME] — Design System

> A warm, trustworthy marketplace where the charitable outcome is always the hero.

| | |
|---|---|
| **Status** | Draft v0.3 |
| **Last updated** | June 2026 |
| **Brand direction** | "Modern Trust" |
| **Related** | [projectplanning1.md](projectplanning1.md) · [UI.md](UI.md) · [../CLAUDE.md](../CLAUDE.md) |

---

## At a Glance

| Role | Token | Hex | One-liner |
|---|---|---|---|
| Interactive / trust | Teal | `#115E59` | Everything you click |
| Status / impact | Green | `#16A34A` | Giving and "done" |
| Delight | Coral | `#E76F51` | The rare "wow" |
| Ink | Navy | `#0F172A` | Headings, dark surfaces |
| Background | Cream | `#FAF7F2` | Warm, not clinical |

**Type:** Bricolage Grotesque (display) · Hanken Grotesk (body / UI)
**Theme:** Light only (MVP) · **Icons:** Lucide (line), never emoji

---

## Contents

1. [Brand Direction](#1-brand-direction)
2. [The Three-Color Rule](#2-the-three-color-rule)
3. [Design Tokens](#3-design-tokens)
4. [Typography](#4-typography)
5. [Components](#5-components)
6. [Usage & Accessibility](#6-usage--accessibility)
7. [Deferred](#7-deferred)

---

## 1. Brand Direction

**"Modern Trust."** The product does two emotional jobs at once, and the design has
to carry both without one drowning the other:

- **Trust** — this is an escrow / payment product. People are handing over money
  before they receive an item. The interface must feel safe and credible.
- **Warmth** — every sale becomes a donation. Giving should feel good, human, and
  worth celebrating.

The system resolves this with **three brand colors, each with exactly one job that
never overlaps** — so the interface stays calm and every color carries clear meaning.

**Principles**

- Trust is the baseline → a deep, calm anchor color (teal).
- Generosity is the payoff → a rare, celebratory accent (coral).
- Green means "giving / done" in the user's head → reserved for impact and success,
  never for ordinary actions.
- Warm, light surfaces (cream), not clinical white and gray.
- Restraint over decoration: limited gradients, real line/SVG icons, no emojis.

---

## 2. The Three-Color Rule

| Color | Role | Where it appears | Never |
|---|---|---|---|
| **Teal** `#115E59` | Interactive / trust | Buttons, links, active tabs, focus rings | — |
| **Green** `#16A34A` | Status / impact | Donation badges, success toasts, completed states, donation totals | A primary action color |
| **Coral** `#E76F51` | Delight | Onboarding, impact metrics, banners, special highlights | A primary button |

Teal and green sit close on the color wheel, so two rules keep them readable:

1. **Separation by role** — teal lives on interactive elements, green on status; they
   never sit adjacent doing different jobs.
2. **Never color alone** — status is always carried by an icon *and* a label, not
   color by itself (WCAG 1.4.1).

---

## 3. Design Tokens

### 3.1 Brand — Teal (interactive)

| Token | Hex | Use |
|---|---|---|
| `brand/primary` | `#115E59` | Primary buttons, links, active state, focus |
| `brand/primary-hover` | `#0E4D49` | Hover |
| `brand/primary-pressed` | `#0B3D3A` | Pressed / active |
| `brand/primary-subtle` | `#E7F1EF` | Selected background, active nav tint |
| `brand/on-primary` | `#FFFFFF` | Text / icon on teal |

### 3.2 Charity & Success — Green (status / impact)

| Token | Hex | Use |
|---|---|---|
| `status/charity` | `#16A34A` | Donation badge, success, donation totals |
| `status/charity-subtle` | `#E3F5E9` | Badge / toast background |
| `status/charity-text` | `#15803D` | Green text on a subtle background (AA) |
| `status/on-charity` | `#FFFFFF` | Text / icon on green |

### 3.3 Accent — Coral (delight only)

| Token | Hex | Use |
|---|---|---|
| `accent/coral` | `#E76F51` | Impact banners, onboarding, highlights |
| `accent/coral-hover` | `#DD5C3C` | Hover (rare — accent is mostly non-interactive) |
| `accent/coral-subtle` | `#FBEAE4` | Tinted background |
| `accent/coral-text` | `#C24A2E` | Coral text on a subtle background |
| `accent/on-coral` | `#FFFFFF` | Text / icon on coral |

> **Budget:** at most one coral element per screen region. Overuse kills the "wow."

### 3.4 Ink & Surfaces

| Token | Hex | Use |
|---|---|---|
| `ink/navy` | `#0F172A` | Headings, primary text, dark surfaces (nav / footer) |
| `surface/card` | `#FFFFFF` | Cards, sheets, modals |
| `bg/app` | `#FAF7F2` | App background (warm cream) |

### 3.5 Neutrals (warm gray scale)

| Token | Hex | Use |
|---|---|---|
| `neutral/50` | `#F6F2EC` | Subtle background, hover rows |
| `neutral/100` | `#EDE8E0` | Subtle border |
| `neutral/200` | `#E0D9CE` | Default border, dividers |
| `neutral/300` | `#CBC3B6` | Input border, strong border |
| `neutral/400` | `#ABA293` | Placeholder, disabled text |
| `neutral/500` | `#877E6E` | Muted text, secondary icons |
| `neutral/600` | `#6A6253` | Secondary text |
| `neutral/700` | `#4E4840` | — |
| `neutral/800` | `#34302A` | — |
| `neutral/900` | `#211D18` | Warm near-black (alternate ink) |

### 3.6 Text

| Token | Hex |
|---|---|
| `text/primary` | `#0F172A` |
| `text/secondary` | `#4E4840` |
| `text/muted` | `#877E6E` |
| `text/disabled` | `#ABA293` |
| `text/inverse` | `#FFFFFF` |
| `text/link` | `#115E59` |

### 3.7 Semantic Feedback

| Token | Default | Subtle bg | Text |
|---|---|---|---|
| `feedback/success` | `#16A34A` | `#E3F5E9` | `#15803D` |
| `feedback/warning` | `#E08A1E` | `#FBEEDA` | `#B45309` |
| `feedback/error` | `#DC2626` | `#FCE9E9` | `#B91C1C` |

> Pending / in-progress states (e.g. "payment held — awaiting meetup") use a neutral
> surface with navy text — no extra blue is introduced.

### 3.8 States, Elevation, Radius

| Token | Value |
|---|---|
| `focus-ring` | `0 0 0 3px rgba(17,94,89,.40)`, 2px offset |
| `overlay/scrim` | `rgba(15,23,42,.48)` |
| `shadow-sm` | `0 1px 2px rgba(15,23,42,.06)` |
| `shadow-md` | `0 4px 14px rgba(15,23,42,.06)` |
| `shadow-lg` | `0 12px 32px rgba(15,23,42,.10)` |
| `radius-sm` | `6px` |
| `radius-md` | `10px` |
| `radius-lg` | `14px` |
| `radius-pill` | `9999px` |

### 3.9 Spacing & Layout

4px base unit.

| Token | Value | Token | Value |
|---|---|---|---|
| `space-1` | `4px` | `space-6` | `24px` |
| `space-2` | `8px` | `space-8` | `32px` |
| `space-3` | `12px` | `space-10` | `40px` |
| `space-4` | `16px` | `space-12` | `48px` |
| `space-5` | `20px` | `space-16` | `64px` |

- **Container max-width:** `1200px`; page gutter `space-4` (mobile) → `space-6` (desktop).
- **Listing grid:** responsive auto-fill, card min-width ~`220px`, gap `space-4`.
- **Vertical rhythm:** section spacing `space-8`–`space-12`.

---

## 4. Typography

A **two-font system**: a characterful display face for headlines and hero numbers,
plus a warm humanist sans for body and UI. This avoids the generic single-font
(Inter / Geist) look while keeping dense UI and the many price figures highly legible.

| Token | Family | Role |
|---|---|---|
| `font/display` | **Bricolage Grotesque** | Headlines, hero impact numbers — distinctive and warm |
| `font/body` | **Hanken Grotesk** | Body, controls, labels, tables — warm and highly legible |

- **Fallback:** Inter, system-ui.
- **Money & numbers:** always `tabular-nums`; amounts use integer-cents formatting
  (see `projectplanning1.md` money convention).

### Type Scale

| Style | Family | Size / Weight |
|---|---|---|
| Display | Bricolage Grotesque | 36 / 800 |
| H1 | Bricolage Grotesque | 28 / 700 |
| H2 | Bricolage Grotesque | 22 / 700 |
| H3 | Hanken Grotesk | 18 / 700 |
| Body L | Hanken Grotesk | 17 / 400 |
| Body | Hanken Grotesk | 15 / 400 |
| Body S | Hanken Grotesk | 13 / 400 |
| Caption | Hanken Grotesk | 12 / 500 |
| Label | Hanken Grotesk | 11 / 600, uppercase, wide tracking |

---

## 5. Components

All components are built from the tokens above. Every interactive element gets the
`focus-ring` on keyboard focus.

### 5.1 Buttons

Radius `radius-md`. Sizes: **sm** (height 32, padding `space-3`, Body S) · **md**
(height 40, padding `space-4`, Body) · **lg** (height 48, padding `space-5`, Body L).

| Variant | Default | Hover | Pressed | Disabled |
|---|---|---|---|---|
| **Primary** | bg `brand/primary`, text `brand/on-primary` | bg `brand/primary-hover` | bg `brand/primary-pressed` | bg `neutral/200`, text `neutral/400` |
| **Secondary** | bg `surface/card`, border `neutral/300`, text `text/primary` | bg `neutral/50` | bg `neutral/100` | border `neutral/200`, text `neutral/400` |
| **Ghost** | transparent, text `text/link` | bg `brand/primary-subtle` | bg `brand/primary-subtle` | text `neutral/400` |
| **Destructive** | bg `feedback/error`, text `#FFFFFF` | bg `#B91C1C` | bg `#991B1B` | bg `neutral/200`, text `neutral/400` |

> Primary action is **always teal**. Green and coral are never buttons. Destructive
> is reserved for irreversible actions (delete listing, cancel transaction).

### 5.2 Inputs & Forms

- **Field:** height 40, `radius-md`, bg `surface/card`, border `neutral/300`, text
  `text/primary`, placeholder `text/disabled`.
- **Focus:** border `brand/primary` + `focus-ring`.
- **Error:** border `feedback/error`; message below in `feedback/error` text + icon.
- **Disabled:** bg `neutral/50`, text `neutral/400`.
- **Label:** Label style, `text/secondary`. **Helper text:** Body S, `text/muted`.

### 5.3 Cards

- bg `surface/card`, border `neutral/200`, `radius-lg`, `shadow-sm`, padding `space-4`.
- **Clickable (listing card):** `shadow-md` on hover, pointer cursor; whole card is the
  hit target. Donation recipient shown as a charity badge (§5.4).

### 5.4 Badges & Pills

`radius-pill`, Label style, optional leading line icon.

| Badge | Background | Text |
|---|---|---|
| **Charity** ("Donates to …") | `status/charity-subtle` | `status/charity-text` |
| **Neutral** (condition, category) | `neutral/100` | `text/secondary` |
| **Status** (success / warning / error) | semantic subtle bg | semantic text |

### 5.5 Alerts, Toasts & Banners

- **Inline alert:** semantic subtle bg + semantic text + leading icon, `radius-md`,
  padding `space-3`.
- **Toast:** bg `surface/card`, `shadow-lg`, `radius-md`, leading status icon, auto-dismiss.
- **Impact banner (the coral moment):** `accent/coral` → lighter gradient, text
  `accent/on-coral`, `radius-lg`. Used for community impact totals and milestones —
  one per view at most.

### 5.6 Navigation

- **Header:** bg `surface/card`, bottom border `neutral/200`, `shadow-sm` on scroll.
  Active item: `text/link` with a `brand/primary-subtle` pill.
- **Footer (optional dark surface):** bg `ink/navy`, text `text/inverse`.

### 5.7 Overlays

- **Modal / sheet:** bg `surface/card`, `radius-lg`, `shadow-lg`; scrim `overlay/scrim`.
  Dialog max-width ~480px; bottom sheet on mobile.

---

## 6. Usage & Accessibility

- **Contrast:** target WCAG AA — 4.5:1 for text, 3:1 for large text and UI elements.
  White on `#115E59` and white on `#16A34A` both pass; verify all token pairs at build.
- **Never color alone:** every status communicates with an icon and label as well as
  color (WCAG 1.4.1).
- **Teal vs green:** never adjacent doing different jobs (see [§2](#2-the-three-color-rule)).
- **Coral budget:** at most one coral element per screen region.
- **Focus:** every interactive element shows the `focus-ring` on keyboard focus.
- **No emojis:** use line / SVG icons (Lucide).
- **Layout:** modern marketplace; warm cream surfaces, white cards.

---

## 7. Deferred

- Dark mode (light theme only for MVP).
- Motion / animation guidelines.
- Illustration and photography style.

> **Icons:** Lucide is the chosen line-icon family (used in the prototype).

---

## Changelog

- **v0.3** — Added spacing & layout tokens (§3.9) and full component specs (§5):
  buttons, inputs, cards, badges, alerts/toasts/banners, navigation, overlays.
- **v0.2** — Full token system. Palette reworked to the three-color rule (teal /
  green / coral on warm cream); typography moved to Bricolage Grotesque + Hanken
  Grotesk.
- **v0.1** — Initial "Modern Trust" draft (single green + navy, default Tailwind palette).
