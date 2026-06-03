# Prototype Review — Last Session

> In-depth review of the `prototype/` app through three lenses — **/code-review**
> (correctness & quality), **/frontend-design** (craft & aesthetics), and
> **/ui-ux-pro-max** (UX, accessibility, responsive). Desktop and mobile are split
> into separate subsections per lens. Mock-data prototype; Next.js App Router +
> Tailwind + TypeScript.

**Reviewed:** all routes under `app/`, shared UI in `components/`, `lib/`, `middleware.ts`.
**Overall:** Strong, cohesive prototype. Build is clean (28+ routes), auth gating works,
design system is consistent. The gaps below are mostly prototype trade-offs plus a
handful of real polish/a11y items worth fixing before this becomes an MVP.

---

## 1. /code-review — Correctness & Quality

### What's good
- **Clean architecture:** route groups (`(site)`, `(auth)`, `admin`), shared `ui/`
  primitives, a single `lib/mock.ts` data layer, and typed domain models in `types/`.
- **Auth gating is real:** `middleware.ts` enforces role access server-side; in-app
  actions add a friendly `ProtectedAction` modal instead of a hard redirect.
- **Money handled correctly:** integer cents everywhere, `formatCents`, `tabular-nums`.
- **Build health:** compiles with no type errors; per-route JS ~109–124 kB (under budget).

### Needs work (applies to both desktop & mobile)
1. **Identity is hardcoded to `currentUser` (Alex) on server pages.** Pages like
   `/profile`, `/listings/[id]` (`isOwner`), and `/transactions` derive the viewer
   from `currentUser` regardless of the logged-in role cookie. Logged in as `admin`
   or `nonprofit`, `/profile` still shows "Alex Rivera". *Fix:* derive the active
   user from the session/role, or at least map role → persona.
2. **Non-persistent mutations (expected for a prototype, but flag for MVP):** sell,
   edit-listing, settings, nonprofit-settings, report, rating, admin actions all
   update local state only — nothing writes back to `lib/mock.ts`. Fine for a demo;
   needs a real data layer next.
3. **`randomCode()` runs per request** for listing-derived transactions
   (`/transactions/[id]` when no tx exists) → the code changes on refresh. Mitigated
   by the on-screen demo hint, but not stable. *Fix:* seed it from the listing id.
4. **`milesFor()` is a hash, not geography.** The distance filter is plausible-looking
   but fabricated. Fine for prototype; replace with real lat/lng + Haversine for MVP.
5. **Form labels aren't programmatically associated.** `Field` renders a visible
   `<label>` but inputs have no matching `id`/`htmlFor`. *Fix:* generate an id
   (`useId`) and wire `htmlFor`.
6. **Dropdown menu semantics:** the panel has `role="menu"` but items are plain
   `<a>`/`<button>` without `role="menuitem"`. Low severity.

---

## 2. /frontend-design — Craft & Aesthetics

### What's good
- **Distinctive, non-generic identity:** Bricolage Grotesque + Hanken Grotesk, warm
  cream surfaces, the three-color discipline (teal interactive / green impact / coral
  delight). No Inter-on-white, no emoji, no purple gradients.
- **Signature moment:** the coral impact banner with the big editorial donation number.
- **Cohesion:** one card system, consistent radii/shadows, real listing photos
  (picsum) with hover lift + image zoom, tasteful 150–300 ms micro-interactions, and
  a global `prefers-reduced-motion` guard.

### Desktop
**Good:** balanced two-column hero, strong "How it works" with connector line +
numbered nodes, clean nonprofit profile with an impact band, polished admin shell.
**Improve:**
- **"Why us?"** is informative but visually flat — it would hit harder as an explicit
  *us vs. Facebook Marketplace* comparison (two columns, ✓ vs ✗).
- **Listing gallery** shows four *different* random photos for one item — looks like
  four products. Use one seed (or real multi-angle photos) for believability.
- Minor: a couple of sections lean on similar card layouts back-to-back; vary rhythm
  (e.g., a full-bleed band) to reduce sameness.

### Mobile
**Good:** single-column stacking, bottom tab bar, sheet-style modals with a grab
handle, sticky "I'm interested" action bar on listing detail.
**Improve:**
- **Hero was too heavy** (oversized headline + large impact banner). Now reduced
  (`text-balance`, 2rem headline, compact banner) — verify on a 360 px device that
  nothing clips and the banner doesn't dominate the first screen.
- **Two stacked bottom bars** (sticky action bar at `bottom-16` above the tab bar)
  can feel cramped. Consider hiding the tab bar on the listing-detail/checkout flow,
  or merging the CTA into the tab bar zone.
- **Category chips** scroll horizontally with no edge affordance — add a right-edge
  fade so users know there's more.

---

## 3. /ui-ux-pro-max — UX, Accessibility & Responsive

### What's good
- Visible focus rings (token `focus-ring`), `prefers-reduced-motion` respected,
  semantic color tokens, `tabular-nums` for money, skip-to-content link, `aria-label`
  on icon-only buttons, `aria-expanded`/`aria-haspopup` on the menu triggers.
- Mobile-first layout, `min-h-dvh`, no horizontal scroll, bottom nav ≤ 5 items with
  icon **and** label, active-state highlighting, predictable native back.

### Desktop
**Good:** contrast passes AA for the main pairs (white on `#115E59` and `#16A34A`);
clear primary CTA per screen; consistent nav placement; good empty/skeleton-free but
fast static pages.
**Improve:**
- **Form a11y:** associate labels (see code-review #5); add inline validation on blur
  and `aria-live`/`role="alert"` consistently (login has it; other forms don't).
- **LCP image:** listing-detail hero image has no `priority`; add it for the main
  photo. Other images correctly use `fill` + `sizes`.
- **Heading order:** spot-check that section `h2/h3` never skip a level.

### Mobile
**Good:** touch targets mostly ≥ 44 px (icon buttons bumped to 44), sheet modals,
safe-area padding on the modal, dvh usage.
**Improve:**
- **Sticky action bar safe-area:** ensure the `bottom-16` action bar adds
  `env(safe-area-inset-bottom)` so it clears the iOS home indicator.
- **Tap target on chips:** category chips are ~40 px tall — nudge to 44 px for the
  comfortable minimum.
- **Search affordance:** the hero "search" is a link styled as an input; on mobile
  make it obviously tappable (it already navigates) — consider a real focusable input
  later.
- **Toasts/announcements:** report/rating use modals (fine); if toasts are added,
  use `aria-live="polite"` and don't steal focus.

---

## Prioritized Next Steps

**P1 — correctness/UX**
1. Make the logged-in identity reflect the role cookie (not always Alex).
2. Seed `randomCode()` and persist code/identity per transaction.
3. Mobile: safe-area on the sticky action bar; resolve the double-bottom-bar overlap.

**P2 — accessibility**
4. Associate form labels (`useId` + `htmlFor`); add `role="menuitem"` to dropdown items.
5. Consistent inline validation + `role="alert"` across all forms.
6. `priority` on the listing-detail LCP image.

**P3 — craft**
7. Turn "Why us?" into a real comparison (✓ us / ✗ Facebook Marketplace).
8. Single-seed (or real) listing gallery photos.
9. Category-chip edge fade + 44 px height.

**Later (MVP)**
10. Real data layer + persistence; real geo for distance; real auth; real images/CDN.

---

*Generated from a manual multi-lens review of the prototype. Live at
http://localhost:3000 (`npm run dev` from `prototype/`).*

---

## Verdict — Is it modern, startup-grade, and on-mission?

Honest take, no flattery — because that's what's useful.

**Short answer:** As a *prototype*, it's genuinely good — modern, free of the generic
"AI/template" look, and the color/design decisions are consistent with the mission.
But there's still a gap between this and a "fundable, real startup" feel — and that gap
is mostly **content and polish**, not foundations.

### Modern & nice-looking — Strong (~7.5/10 for a prototype)
Intentional design system: a distinctive Bricolage + Hanken pairing (not the ubiquitous
Inter), warm cream + petrol-teal that avoids the clinical-SaaS trap, consistent
cards/shadows/radii, and restrained micro-interactions. Better than most early-stage
landing pages.

### Startup vibe — Present, but on the "safe" side
The impact banner with the big editorial donation number is a good signature moment.
What's missing is one bold, memorable move — real photography, a touch of illustration/
texture, and sharper microcopy. The copy is functional but the brand *voice* is thin.
The visual skeleton reads startup; the soul isn't quite above-template yet.

### Mission/platform fit (color + design) — The strongest part
The three-color discipline lands exactly right: teal = trust (escrow/payments),
green = donation/impact, coral = the warmth of giving. For a charity marketplace that's
the correct emotional balance — neither cold fintech nor naive nonprofit. The colors
carry the message.

### Functionality (prototype) — Impressive scope, clear prototype limits
Covers a lot: role-based auth + gating, the full transaction loop (interest → chat →
pay → code → donation), nonprofit dashboard/onboarding/sponsorship, and admin
moderation — all walkable end to end. Limits are honest: mock data, no persistence,
single identity persona, picsum photos, simulated distance.

### Top 3 gaps to reach startup-grade
1. **Real content** — real product photos, real nonprofit logos/stories, real microcopy.
   ~30% of design is content; right now it's placeholder.
2. **Brand voice & a hero moment** — an emotional hook on the landing page (a real
   story/nonprofit, "this month we helped X"), and an illustration language.
3. **Consistency polish** — the P1/P2 items above (role-based identity, form a11y,
   mobile safe-area). Small, but this is the line between amateur and professional.

**Bottom line:** a solid, on-mission, modern *prototype* that sells the idea and the
direction. What's left to feel like a "real startup" is content + polish, not code.
