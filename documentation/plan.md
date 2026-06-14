# Aldofa — MVP Build Plan

> The executable build sequence for the first test release (no real money).
> Decisions: [general-doc.md](general-doc.md) · System design: [architecture.md](architecture.md) · Stack: [tech-stack.md](tech-stack.md) · Prototype: [UI.md](UI.md)

| | |
|---|---|
| **Status** | Planning → ready to build |
| **Target** | The core loop: list → browse → chat → meetup → dual-code → simulated donation |

---

## How to read this

The prototype already implements the **full UI with mock data** ([UI.md](UI.md)). Each milestone below is mostly "replace the mock data with the real Supabase backend" for one slice of the core loop, in dependency order.

**Build sequencing (locked):** the non-payment loop first; the Stripe payment module is built **last**, only after the legal spike clears. The legal spike runs **in parallel** starting now.

---

## Milestones

### M0 — Foundation

- Create the Supabase project + Vercel project; wire env (`.env.local`, Vercel env).
- Add the Supabase client (browser + server/SSR) to the app.
- Apply the schema from [architecture.md §2](architecture.md#2-data-model): enums, tables, indexes, constraints; enable RLS on every table; `handle_new_user` trigger.
- Create the `listing-images` Storage bucket + policies.
- Seed 5–10 `approved` nonprofits.
- **Done when:** migrations apply cleanly and the seeded nonprofits are queryable.

### M1 — Auth & profiles

- Supabase Auth (email) with SSR cookies; middleware session refresh.
- Wire login / register / verify pages to real auth (replace the mock role cookie).
- `profiles` auto-created by the trigger; profile + settings pages read/write real data.
- **Done when:** a real user can sign up, log in, and see their profile.

### M2 — Listings & browse

- `createListing` + `uploadListingImage` (Storage, max 5, client compression).
- `browseListings` / `getListing` as Server Components from Supabase; filters (city, category, condition, search).
- `updateListing` / `withdrawListing`.
- **Done when:** a user can create a listing with photos and see it in browse + detail.

### M3 — Interest & chat (realtime)

- `expressInterest` (open chat); `sendMessage`; Supabase Realtime subscription on `messages`; `markChatRead`.
- Wire the inbox + thread; in-app notifications for interest / message.
- **Done when:** two users can chat in real time about a listing.

### M4 — Transaction core loop (dual-code, no money)

- `confirmDeal` (create transaction, snapshot amount + nonprofit, generate codes, listing → `pending_meetup`).
- `getTransaction` via a security-definer function (own code only); `confirmCode` (server compare; both confirmed → `completed` + simulated donation + listing `completed` + chat `locked`).
- `cancelTransaction` / `disputeTransaction`; lazy-expire on read.
- Wire the transactions list + detail (share-your-code / enter-the-other's-code).
- **Done when:** a full deal completes end-to-end and records a simulated donation; cancel works.

### M5 — Nonprofit pages & impact

- Nonprofit browse / profile from real data; computed raised / supporters from completed transactions.
- **Done when:** a nonprofit profile shows real donations from completed deals.

### M6 — Hardening & closed pilot

- RLS policy review; enforce confirmation-code confidentiality; zod validation on every mutation; error handling.
- Founder moderation runbook (DB-level): remove / withdraw bad listings, resolve disputes.
- Deploy to Vercel; run a closed pilot (seeded nonprofits + invited users).
- **Done when:** the pilot is live and the core loop works for invited users.

---

## Running in parallel

- **Legal spike** — charitable-solicitation + quid-pro-quo research / attorney consult. Gates the payment module; does **not** block M0–M6. See the legal items in [general-doc.md](general-doc.md).

---

## Deferred (post-pilot / payment era)

- **Stripe Connect payment module** (replaces the simulated donation) + webhooks + Vercel Cron auto-expire — only after the legal spike clears.
- Ratings / reputation, reports + admin UI, nonprofit analytics dashboard, sponsorship payments, email / push notifications, phone verification, Google auth, distance / geocoding.

---

## Still open (decide before the pilot's go-to-market, not before the build)

- **GTM decisions:** positioning, target audience, launch scope, north-star metric.
