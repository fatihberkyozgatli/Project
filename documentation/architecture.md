# [APP_NAME] — Architecture

> Engineering source of truth: how the system is built.
> Tech choices in [tech-stack.md](tech-stack.md) · Product/business in [general-doc.md](general-doc.md).

| | |
|---|---|
| **Status** | In progress — filled section by section |
| **Scope** | Data model, API/route design, state machines, realtime, storage, auth/security, background jobs |

This document is authoritative for system design. It supersedes the technical sections of general-doc (§7 Listing System, §8 Payment Architecture, §10 Messaging, §15 Technical Architecture) as their content is migrated and refined here.

---

## 1. System overview

- **Single Next.js app on Vercel.** UI via React Server Components; server logic via API routes / server actions.
- **Supabase** is the backend platform: Postgres (data), Auth (sign-in), Realtime (chat), Storage (images).
- **Trust boundary:** all state transitions are enforced **server-side**. Client never advances transaction/listing state directly.

```
[Browser]
   |
   v
[Next.js app  (RSC + API routes / server actions)]
   |
   ├── Supabase Postgres   (data, Row Level Security)
   ├── Supabase Auth       (email; Google/phone later)
   ├── Supabase Realtime   (buyer↔seller chat)
   └── Supabase Storage    (listing images)

   ...later (payment module):
   ├── Stripe Connect      (payments, webhooks)
   └── Vercel Cron         (timeout sweeps)
```

---

## 2. Data model

Canonical Postgres schema (Supabase) for the MVP core loop. Conventions:

- All primary keys are `uuid`; timestamps are `timestamptz`.
- Money is stored as **integer cents** (`*_cents`), never floats.
- **Row Level Security is enabled on every table**; policies are defined in [§7](#7-auth--security).
- Reflects the locked decisions in the [general-doc Decision Log](general-doc.md) (fixed price, simulated donation, manually seeded nonprofits, no ratings in the first cut).

### 2.1 Enums

```sql
create type listing_category   as enum ('electronics','furniture','clothing','books','toys','sports','home','vehicles','music','art','other');
create type item_condition      as enum ('new','like_new','good','fair','poor');
create type listing_status      as enum ('active','interested','reserved','pending_meetup','completed','cancelled');
create type transaction_status  as enum ('pending','completed','cancelled','disputed');
create type verification_status as enum ('pending','approved','rejected','suspended');
create type nonprofit_category  as enum ('education','environment','health','animals','community','arts');
create type chat_status         as enum ('active','archived','locked');
create type message_type        as enum ('text','system');
create type notification_kind   as enum ('interest','message','transaction','system');
```

### 2.2 Tables

```sql
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text not null,
  city       text,
  bio        text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table nonprofits (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  ein               text not null,
  mission           text,
  about             text,
  website_url       text,
  logo_url          text,
  category          nonprofit_category not null,
  city              text,
  state             text,
  verification      verification_status not null default 'pending',
  stripe_account_id text,
  is_sponsored      boolean not null default false,
  created_at        timestamptz not null default now()
);

create table listings (
  id           uuid primary key default gen_random_uuid(),
  seller_id    uuid not null references profiles(id) on delete cascade,
  title        text not null,
  description  text,
  category     listing_category not null,
  condition    item_condition not null,
  price_cents  integer not null check (price_cents >= 0),
  city         text not null,
  pickup_area  text,
  nonprofit_id uuid not null references nonprofits(id),
  status       listing_status not null default 'active',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table listing_images (
  id           uuid primary key default gen_random_uuid(),
  listing_id   uuid not null references listings(id) on delete cascade,
  storage_path text not null,
  position     smallint not null default 0,
  created_at   timestamptz not null default now(),
  unique (listing_id, position)
);

create table chats (
  id              uuid primary key default gen_random_uuid(),
  listing_id      uuid not null references listings(id) on delete cascade,
  buyer_id        uuid not null references profiles(id) on delete cascade,
  seller_id       uuid not null references profiles(id) on delete cascade,
  status          chat_status not null default 'active',
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unique (listing_id, buyer_id)
);

create table messages (
  id         uuid primary key default gen_random_uuid(),
  chat_id    uuid not null references chats(id) on delete cascade,
  sender_id  uuid references profiles(id) on delete set null,
  content    text not null,
  type       message_type not null default 'text',
  created_at timestamptz not null default now(),
  read_at    timestamptz
);

create table transactions (
  id                  uuid primary key default gen_random_uuid(),
  listing_id          uuid not null references listings(id),
  chat_id             uuid references chats(id) on delete set null,
  buyer_id            uuid not null references profiles(id),
  seller_id           uuid not null references profiles(id),
  nonprofit_id        uuid not null references nonprofits(id),
  amount_cents        integer not null check (amount_cents >= 0),
  status              transaction_status not null default 'pending',
  buyer_code          text not null,
  seller_code         text not null,
  buyer_confirmed_at  timestamptz,
  seller_confirmed_at timestamptz,
  completed_at        timestamptz,
  cancelled_at        timestamptz,
  cancel_reason       text,
  created_at          timestamptz not null default now()
);

create table notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references profiles(id) on delete cascade,
  kind       notification_kind not null,
  title      text not null,
  body       text,
  href       text,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
```

**`transactions.nonprofit_id` and `amount_cents` are intentional snapshots** — the donation recipient and amount are locked when the transaction is created and must not follow later edits to the listing.

**`listings.pickup_area`** is a general area only; the exact address is never stored (privacy).

### 2.3 Constraints & indexes

```sql
create unique index one_active_tx_per_listing
  on transactions (listing_id) where status = 'pending';

create index on listings (status, city, category);
create index on listings (nonprofit_id);
create index on chats (buyer_id);
create index on chats (seller_id);
create index on messages (chat_id, created_at);
create index on transactions (buyer_id);
create index on transactions (seller_id);
create index on transactions (nonprofit_id);
create index on transactions (status);
create index on notifications (user_id, read_at);
```

- `one_active_tx_per_listing` prevents two concurrent pending transactions on the same listing.
- A trigger keeps `listings.updated_at` current (or it is set explicitly on update).
- Max 5 images per listing is enforced in the app (optionally a row-count trigger on `listing_images`).

### 2.4 Deferred tables (added later, not in the first cut)

- `ratings` — buyer/seller reputation (deferred; no ratings in the first test release).
- `reports` — user/listing/nonprofit reports (manual founder moderation for now).
- `payments`, `payouts`, `donation_receipts` — added with the Stripe payment module.
- `admin_logs` — added with the admin dashboard.

### 2.5 Locked modeling decisions (2026-06-13)

1. Transactions **snapshot** `nonprofit_id` + `amount_cents` at creation.
2. Transaction `status` is coarse (`pending`/`completed`/`cancelled`/`disputed`); confirmation progress lives in `buyer_confirmed_at` / `seller_confirmed_at`.
3. The **completed transaction is the donation record** in the first cut — no separate donations table until real money.
4. Listing photos live in a dedicated **`listing_images`** table (not an array).
5. Trust stats (donated total, completed count, raised) are **computed on read**, not stored.

---

## 3. API / route design

**Conventions.** Reads run inside **Server Components** querying Supabase directly (protected by RLS). Mutations are **Next.js Server Actions**. **Route Handlers** (`app/api/*`) are reserved for external HTTP endpoints — none in the first cut; the future Stripe webhook is the first. Every mutation:

- derives the **actor from the session** — never trusts a client-supplied user id;
- **validates input server-side** (zod) before any write;
- relies on RLS as **defense-in-depth** behind the server check;
- derives money and the donation recipient **server-side** (see `confirmDeal`).

### 3.1 Reads (Server Components)

| Surface | Returns |
|---|---|
| `browseListings(city?, category?, condition?, q?)` | `active` listings + cover image + nonprofit |
| `getListing(id)` | listing + images + seller + nonprofit |
| `listNonprofits()` | `approved` nonprofits (sponsored first) |
| `getNonprofit(id)` | nonprofit + supported listings + computed raised/supporters |
| `getProfile(id)` | profile + computed stats + their listings |
| `listChats()` | the participant's chats + last message |
| `getChat(id)` | chat + messages (participant only) |
| `listTransactions()` | the participant's transactions |
| `getTransaction(id)` | transaction (participant): your code to share + the field to enter the other's code |
| `listNotifications()` | the owner's notifications |

### 3.2 Mutations (Server Actions)

| Operation | Actor | Input | Transition / effect | Returns |
|---|---|---|---|---|
| `updateProfile` | owner | name?, city?, bio?, avatar_url? | update `profiles` | profile |
| `createListing` | authed (seller) | title, description, category, condition, price_cents, city, pickup_area, nonprofit_id | insert listing (`active`) | listing |
| `uploadListingImage` | listing owner | listing_id, file | upload to Storage + insert `listing_images` (max 5) | storage_path |
| `updateListing` | owner, listing `active` | editable fields | update listing | listing |
| `withdrawListing` | owner, no active tx | — | listing → `cancelled` | listing |
| `expressInterest` | buyer (not seller) | listing_id | upsert chat (listing, buyer); notify seller | chat |
| `sendMessage` | chat participant | chat_id, content | insert message; bump `last_message_at`; notify counterparty; realtime | message |
| `markChatRead` | participant | chat_id | set `read_at` on messages | ok |
| `confirmDeal` | **buyer** of the chat | chat_id | create `pending` transaction (codes; `amount_cents` + `nonprofit_id` snapshotted from the listing); listing → `pending_meetup`; notify seller | transaction |
| `confirmCode` | buyer or seller | transaction_id, code | validate vs the counterpart code; set `*_confirmed_at`; if both → `completed` + donation + listing `completed` + chat `locked`; notify | transaction |
| `cancelTransaction` | participant | transaction_id, reason? | → `cancelled`; listing → `active`; notify | transaction |
| `disputeTransaction` | participant | transaction_id, reason | → `disputed`; notify founder | transaction |
| `markNotificationRead` | owner | id \| all | set `read_at` | ok |

### 3.3 Cross-cutting rules

- **`confirmDeal` derives everything server-side** from `chat_id`: the seller, the listing, `price_cents` (→ `amount_cents`), and `nonprofit_id`. The client never sends an amount or recipient.
- **`confirmCode`** compares the submitted code to the *counterpart's* code: a buyer submits `seller_code` (→ `buyer_confirmed_at`), a seller submits `buyer_code` (→ `seller_confirmed_at`). A wrong code returns an error with no state change.
- **Guards:** `confirmDeal` is protected by the `one_active_tx_per_listing` unique index; state transitions re-check the current state inside the action.
- **Notifications** are created as server-side side-effects of the events above (interest, message, deal, confirmation, cancellation, dispute).
- **Profile creation:** a Postgres trigger on `auth.users` insert creates the matching `profiles` row.

### 3.4 Deferred

- Stripe webhook **Route Handler** (`app/api/stripe/webhook`) — payment era.
- Founder/admin actions run directly against the DB in the first cut (no admin endpoints/UI yet).

### 3.5 Locked decisions (2026-06-13)

1. Reads via Server Components; mutations via Server Actions; Route Handlers reserved for external webhooks.
2. Actor is always derived from the session; amount and recipient are derived server-side at deal time.
3. `profiles` rows are created by a trigger on `auth.users` insert.

---

## 4. State machines

All transitions are enforced **server-side** (API routes / server actions). The server validates the actor (session + RLS) and the current state before transitioning; the client never sets a terminal state.

### 4.1 Listing

States used in the first cut: `active`, `pending_meetup`, `completed`, `cancelled`. (`interested` and `reserved` remain in the enum but are unused until the payment module splits "agreed" from "paid".)

```
active ──(buyer confirms deal)──▶ pending_meetup ──(both codes confirmed)──▶ completed
  │                                   │
  │(seller withdraws)                 ├──(cancel / lazy-expire)──▶ active
  ▼                                   └──(either disputes)──▶ pending_meetup (locked, founder resolves)
cancelled
```

| From | To | Trigger (actor) | Effect / enforcement |
|---|---|---|---|
| — | `active` | seller publishes | visible in browse |
| `active` | `active` | buyer opens chat (interest) | no status change; interest = a chat exists |
| `active` | `pending_meetup` | **buyer** confirms deal | creates a `pending` transaction (snapshot + codes); `one_active_tx_per_listing` guarantees a single deal; listing leaves browse |
| `active` | `cancelled` | seller withdraws | listing removed |
| `pending_meetup` | `completed` | system (both codes confirmed) | records the simulated donation |
| `pending_meetup` | `active` | cancel (either party) or lazy-expire | transaction → `cancelled`; listing reopens |
| `pending_meetup` | (locked) | either party disputes | transaction → `disputed`; founder resolves |

### 4.2 Transaction + dual-code

States: `pending`, `completed`, `cancelled`, `disputed`.

```
(buyer confirms deal) ─▶ pending ─┬─ buyer enters seller_code → buyer_confirmed_at
                                  ├─ seller enters buyer_code → seller_confirmed_at
                                  └─ both set ─▶ completed (+ simulated donation)
pending ─(either cancels / lazy-expire >72h)─▶ cancelled   (listing → active)
pending ─(either disputes)─▶ disputed   (founder resolves → completed | cancelled)
```

| From | To | Trigger | Effect |
|---|---|---|---|
| — | `pending` | buyer confirms deal | two codes generated; `amount_cents` + `nonprofit_id` snapshotted |
| `pending` | (progress) | seller enters `buyer_code` | `seller_confirmed_at` set |
| `pending` | (progress) | buyer enters `seller_code` | `buyer_confirmed_at` set |
| `pending` | `completed` | both `*_confirmed_at` set | `completed_at` set; listing → `completed`; donation recorded |
| `pending` | `cancelled` | either party cancels / lazy-expire | `cancelled_at` + `cancel_reason`; listing → `active` |
| `pending` | `disputed` | either party disputes | founder resolves → `completed` \| `cancelled` |

**Dual-code mechanic (exact):** on creation, two codes are generated (6-char, random, non-sequential, unique per transaction).

- `buyer_code` is shown to the buyer to share; the **seller enters** it → sets `seller_confirmed_at`.
- `seller_code` is shown to the seller to share; the **buyer enters** it → sets `buyer_confirmed_at`.
- When both timestamps are set, the **server** sets `completed` and records the simulated donation (the completed transaction is the donation record). Code comparison is server-side only.
- **Known limitation:** a buyer can enter the code before actually receiving the item. Immaterial without funds; mitigated by UX warnings; becomes important in the paid flow.

### 4.3 Cancellation & timeout

No background job in the first cut. Cancellation is **manual** (either party) or **lazy-expired** — a `pending` transaction older than 72h may be cancelled on the next read/action. On cancel: transaction → `cancelled`, listing → `active`. The Vercel Cron auto-sweep is introduced with the payment module.

### 4.4 Dispute

Either party flags → transaction `disputed`; the listing stays `pending_meetup` (locked); the chat stays open; the founder resolves manually in the DB (no admin UI in the first cut) → `completed` or `cancelled`.

### 4.5 Chat & nonprofit

- **Chat:** `active` on creation → `locked` when the listing's transaction reaches `completed` or `cancelled` (no further messages).
- **Nonprofit:** `pending → approved / rejected / suspended` (founder action); seeded as `approved` in the first cut.

### 4.6 Locked decisions (2026-06-13)

1. The **buyer initiates the deal** ("confirm deal" → creates the `pending` transaction + codes, locks the listing); no separate seller-accept step (mirrors the future "Pay now").
2. First-cut listing states are `active → pending_meetup → completed/cancelled`; `interested` / `reserved` are unused for now.
3. No background job in the first cut; cancellation is manual + lazy-expire.

---

## 5. Realtime (chat)

Chat uses **Supabase Realtime** over the `messages` table (Postgres Changes).

- **Subscribe:** on opening a thread, the client subscribes to inserts on `messages` filtered by `chat_id`. Realtime respects **RLS**, so a subscriber only receives rows it is allowed to read (chat participants only).
- **Send:** `sendMessage` (server action) inserts the row and bumps `chats.last_message_at`; the insert propagates to both participants via Realtime; the UI appends optimistically and reconciles.
- **Read state:** `read_at` updates propagate the same way (for unread badges).
- **Lock-out:** when the chat is `locked` (transaction completed/cancelled), inserts are rejected server-side and by RLS.
- **Out of scope (MVP):** typing indicators and presence (would use Realtime Broadcast/Presence later).

---

## 6. Storage & images

Listing photos live in **Supabase Storage**.

- **Bucket:** `listing-images`, public-read (listings are public). Path: `listings/{listing_id}/{uuid}.{ext}` — stored in `listing_images.storage_path`.
- **Upload:** the client uploads directly to Storage (authenticated); a Storage policy permits writes only under a `listing_id` the user owns. `uploadListingImage` then records the `listing_images` row (with `position`).
- **Constraints:** max 5 images per listing (app-enforced); allowed MIME `image/jpeg|png|webp`; max ~5 MB; client-side compression before upload.
- **Serving:** browse uses Supabase image transformations for thumbnails; `position = 0` is the cover image.
- **Other media:** nonprofit logos are seeded; user avatars are deferred (same pattern, an `avatars` bucket).

---

## 7. Auth & security

### 7.1 Authentication

- **Supabase Auth**, email/password at MVP (Google + phone later). Sessions are cookie-based via Supabase SSR; Next.js middleware refreshes the session.
- A Postgres trigger (`handle_new_user`) creates the `profiles` row on signup.

### 7.2 Row Level Security

RLS is enabled on every table. Policies (summarized):

| Table | Select | Insert / Update / Delete |
|---|---|---|
| `profiles` | public | update own row only (`id = auth.uid()`) |
| `nonprofits` | `verification = 'approved'` (public) | founder / service role only |
| `listings` | browseable statuses, or owner | by owner (`seller_id = auth.uid()`) |
| `listing_images` | public (approved listings) | by listing owner |
| `chats` | participant only (`auth.uid() in (buyer_id, seller_id)`) | buyer can open a chat only for an `active` listing with that listing's seller |
| `messages` | chat participant | insert by participant while chat `active` (`sender_id = auth.uid()`) |
| `transactions` | participant only | insert via `confirmDeal` (buyer); update via actions |
| `notifications` | owner (`user_id = auth.uid()`) | update own only |

### 7.3 Confirmation-code confidentiality

Both codes sit on the same `transactions` row, so plain row-level RLS would leak the counterpart's code. Therefore:

- `select` on `buyer_code` / `seller_code` is **revoked** for the `authenticated` role.
- `getTransaction` returns only the **actor's own** code (the counterpart's is never sent to the client) via a security-definer function.
- `confirmCode` compares the submitted code **server-side** only.

This preserves the dual-code trust mechanic — you cannot read the other party's code without meeting.

### 7.4 Baseline

Server-side input validation (zod) on every mutation; HTTPS enforced (Vercel); secrets in environment variables; rate limiting on auth endpoints.

---

## 8. Background jobs

**Deferred to the payment era** (see [tech-stack.md](tech-stack.md)). In the first cut there is no job runner — stale `pending` transactions are handled by manual cancellation and lazy-expire on read ([§4.3](#43-cancellation--timeout)).

When payments land, a **Vercel Cron** job runs periodically to:

- expire stale `pending` transactions (>72h) → cancel + refund;
- reconcile / retry Stripe webhook effects (idempotent).

---

## Build sequencing

Per the *Pilot Payment & Build Sequencing* decision in [general-doc.md](general-doc.md): build the non-payment loop first; add the real Stripe payment module last, only after the legal spike clears.
