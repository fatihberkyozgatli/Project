# Aldofa — Database Runbook

> The executable database layer: migrations, RLS policies, functions, storage, and seed.
> The **design and rationale** live in [architecture.md §2 (Data model)](architecture.md#2-data-model) and [§7 (Auth & security)](architecture.md#7-auth--security) — that doc is canonical for *what* the schema is and *why*. This file is canonical for the *runnable SQL* and *how to stand it up*.

| | |
|---|---|
| **Status** | In progress — first cut (no-money core loop) |
| **Scope** | profiles, nonprofits, listings, listing_images, chats, messages, transactions, notifications |
| **Reflects** | Locked decisions in [general-doc Decision Log](general-doc.md) (fixed price, simulated donation, seeded nonprofits, no ratings) |

---

## Conventions

- All PKs are `uuid`; all timestamps are `timestamptz`.
- Money is **integer cents** (`*_cents`), never floats.
- **RLS is enabled on every table.** `service_role` bypasses RLS (used by trusted server code / seeds).
- Server-derived, trust-sensitive operations (deal creation, code confirmation) run as **security-definer functions**, called from Server Actions via Supabase RPC — so amounts, recipients, and codes are never trusted from the client.

---

## Prerequisites & tooling

- A Supabase project (created per environment when we deploy; nothing deployed yet).
- **No CLI.** The SQL is applied by hand in the Supabase **SQL Editor**, run in numeric order.
- The runnable files live in [`/database`](../database) at the repo root (this doc is their narrative):

| # | File | Contents |
|---|---|---|
| 0001 | `0001_extensions_enums.sql` | extensions + enum types |
| 0002 | `0002_tables.sql` | all tables |
| 0003 | `0003_indexes.sql` | indexes + partial unique constraints |
| 0004 | `0004_triggers.sql` | `handle_new_user`, `set_updated_at` |
| 0005 | `0005_rls.sql` | enable RLS + policies |
| 0006 | `0006_transaction_functions.sql` | code confidentiality + `confirm_deal` / `confirm_code` |
| 0007 | `0007_storage.sql` | `listing-images` bucket + policies |
| 0008 | `0008_seed_nonprofits.sql` | seeded approved nonprofits (placeholder) |

The SQL below is the same content, kept here for review; `/database/*.sql` is what you run.

---

## Environment variables

| Var | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Anon (RLS-bound) key |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | Bypasses RLS — never sent to the browser |

Set in `.env.local` (local) and Vercel env per environment. Secrets are never committed.

---

## 0001 — Extensions & enums

```sql
create extension if not exists pgcrypto;

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

---

## 0002 — Tables

Canonical DDL mirrors [architecture.md §2.2](architecture.md#2-data-model).

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

`transactions.nonprofit_id` and `amount_cents` are **snapshots** locked at creation — they must not follow later listing edits. `listings.pickup_area` is a general area only; the exact address is never stored.

---

## 0003 — Indexes & constraints

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

`one_active_tx_per_listing` is the guard that prevents two concurrent `pending` deals on a listing.

---

## 0004 — Triggers

A `profiles` row is created automatically on signup; `name` comes from signup metadata, falling back to the email local-part, then to a constant (the column is `not null`). A trigger keeps `chats.last_message_at` current on each message so participants never need direct write access to `chats`.

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'New user'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger listings_set_updated_at
  before update on listings
  for each row execute function public.set_updated_at();

create or replace function public.bump_chat_last_message()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update chats set last_message_at = now() where id = new.chat_id;
  return new;
end;
$$;

create trigger messages_bump_chat
  after insert on messages
  for each row execute function public.bump_chat_last_message();
```

---

## 0005 — Row Level Security

Enable RLS on every table, then add policies. Tables with **no write policy for `authenticated`** (e.g. `nonprofits`) are writable only by `service_role` (seeds / trusted server code). `auth.uid()` is wrapped as `(select auth.uid())` so Postgres evaluates it once per query instead of once per row (Supabase RLS performance guidance).

```sql
alter table profiles       enable row level security;
alter table nonprofits     enable row level security;
alter table listings       enable row level security;
alter table listing_images enable row level security;
alter table chats          enable row level security;
alter table messages       enable row level security;
alter table transactions   enable row level security;
alter table notifications  enable row level security;

create policy profiles_select_all on profiles
  for select using (true);
create policy profiles_update_own on profiles
  for update using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy nonprofits_select_approved on nonprofits
  for select using (verification = 'approved');

create policy listings_select_public_or_owner on listings
  for select using (status = 'active' or seller_id = (select auth.uid()));
create policy listings_insert_own on listings
  for insert with check (seller_id = (select auth.uid()));
create policy listings_update_own on listings
  for update using (seller_id = (select auth.uid())) with check (seller_id = (select auth.uid()));
create policy listings_delete_own on listings
  for delete using (seller_id = (select auth.uid()));

create policy listing_images_select_visible on listing_images
  for select using (
    exists (
      select 1 from listings l
      where l.id = listing_id and (l.status = 'active' or l.seller_id = (select auth.uid()))
    )
  );
create policy listing_images_insert_owner on listing_images
  for insert with check (
    exists (select 1 from listings l where l.id = listing_id and l.seller_id = (select auth.uid()))
  );
create policy listing_images_update_owner on listing_images
  for update using (
    exists (select 1 from listings l where l.id = listing_id and l.seller_id = (select auth.uid()))
  ) with check (
    exists (select 1 from listings l where l.id = listing_id and l.seller_id = (select auth.uid()))
  );
create policy listing_images_delete_owner on listing_images
  for delete using (
    exists (select 1 from listings l where l.id = listing_id and l.seller_id = (select auth.uid()))
  );

create policy chats_select_participant on chats
  for select using ((select auth.uid()) in (buyer_id, seller_id));
create policy chats_insert_buyer on chats
  for insert with check (
    buyer_id = (select auth.uid())
    and seller_id <> (select auth.uid())
    and exists (
      select 1 from listings l
      where l.id = chats.listing_id
        and l.seller_id = chats.seller_id
        and l.status = 'active'
    )
  );

create policy messages_select_participant on messages
  for select using (
    exists (select 1 from chats c where c.id = chat_id and (select auth.uid()) in (c.buyer_id, c.seller_id))
  );
create policy messages_insert_participant_active on messages
  for insert with check (
    sender_id = (select auth.uid())
    and exists (
      select 1 from chats c
      where c.id = chat_id and c.status = 'active' and (select auth.uid()) in (c.buyer_id, c.seller_id)
    )
  );

revoke update on messages from authenticated, anon;
grant update (read_at) on messages to authenticated;
create policy messages_update_read on messages
  for update using (
    exists (select 1 from chats c where c.id = chat_id and (select auth.uid()) in (c.buyer_id, c.seller_id))
  );

create policy transactions_select_participant on transactions
  for select using ((select auth.uid()) in (buyer_id, seller_id));

create policy notifications_select_own on notifications
  for select using (user_id = (select auth.uid()));
create policy notifications_update_own on notifications
  for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
```

Key access decisions:

- `transactions` has **no client insert/update policy** — writes happen only through the security-definer functions in 0006. Reads are participant-only, and the code columns are revoked separately (0006).
- `messages` updates are **column-restricted to `read_at`** (table `update` revoked, only `read_at` granted) so a participant can mark messages read but cannot rewrite the counterparty's `content` or `sender_id`.
- `chats` has **no participant update policy**; `last_message_at` is bumped by the `messages_bump_chat` trigger and the chat is locked by `confirm_code` — neither needs client write access.

---

## 0006 — Transaction functions & code confidentiality

Both codes live on the same `transactions` row, so plain row RLS would leak the counterpart's code. A column-level `revoke` is **not** enough: Supabase grants `authenticated`/`anon` table-level `SELECT`, and in Postgres a table-level grant covers every column — a column `revoke` cannot subtract from it. So we **revoke the table-level `SELECT`** and re-grant `SELECT` on an explicit column list that **omits the codes**. Data is then exposed only through functions that return the actor's **own** code.

```sql
revoke select on transactions from authenticated, anon;
grant select (
  id, listing_id, chat_id, buyer_id, seller_id, nonprofit_id,
  amount_cents, status, buyer_confirmed_at, seller_confirmed_at,
  completed_at, cancelled_at, cancel_reason, created_at
) on transactions to authenticated;
```

`get_my_transaction` returns the transaction with both raw codes stripped and only the caller's own code surfaced as `my_code` (buyer shares `buyer_code`, seller shares `seller_code`).

```sql
create or replace function public.get_my_transaction(p_id uuid)
returns jsonb language sql security definer set search_path = public as $$
  select (to_jsonb(t) - 'buyer_code' - 'seller_code')
         || jsonb_build_object(
              'my_code',
              case when t.buyer_id = auth.uid() then t.buyer_code
                   when t.seller_id = auth.uid() then t.seller_code end)
  from transactions t
  where t.id = p_id and auth.uid() in (t.buyer_id, t.seller_id);
$$;
```

`confirm_deal` is called by the **buyer** with only `chat_id`; it derives the seller, price, and recipient server-side, snapshots them, generates both codes, creates the `pending` transaction, and locks the listing. The `one_active_tx_per_listing` index prevents duplicates.

```sql
create or replace function public.confirm_deal(p_chat_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_chat        chats;
  v_listing     listings;
  v_tx_id       uuid;
  v_buyer_code  text := upper(substr(md5(gen_random_uuid()::text), 1, 6));
  v_seller_code text := upper(substr(md5(gen_random_uuid()::text), 1, 6));
begin
  select * into v_chat from chats where id = p_chat_id;
  if v_chat is null or v_chat.buyer_id <> auth.uid() then
    raise exception 'not authorized';
  end if;

  select * into v_listing from listings where id = v_chat.listing_id for update;
  if v_chat.seller_id <> v_listing.seller_id then
    raise exception 'chat seller mismatch';
  end if;

  if v_listing.status <> 'active' then
    raise exception 'listing not available';
  end if;

  insert into transactions
    (listing_id, chat_id, buyer_id, seller_id, nonprofit_id, amount_cents, buyer_code, seller_code)
  values
    (v_listing.id, v_chat.id, v_chat.buyer_id, v_listing.seller_id,
     v_listing.nonprofit_id, v_listing.price_cents, v_buyer_code, v_seller_code)
  returning id into v_tx_id;

  update listings set status = 'pending_meetup' where id = v_listing.id;

  return public.get_my_transaction(v_tx_id);
exception
  when unique_violation then
    raise exception 'a deal is already in progress for this listing';
end;
$$;
```

`confirm_code` compares the submitted code to the **counterpart's** code server-side, sets the matching timestamp, and completes the deal (records the simulated donation, marks the listing completed, locks the chat) once both sides have confirmed.

```sql
create or replace function public.confirm_code(p_tx_id uuid, p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tx        transactions;
  v_is_buyer  boolean;
begin
  select * into v_tx from transactions where id = p_tx_id for update;
  if v_tx is null then raise exception 'not found'; end if;

  v_is_buyer := v_tx.buyer_id = auth.uid();
  if not (v_is_buyer or v_tx.seller_id = auth.uid()) then raise exception 'not authorized'; end if;
  if v_tx.status <> 'pending' then raise exception 'transaction not pending'; end if;

  if v_is_buyer then
    if upper(p_code) <> v_tx.seller_code then raise exception 'invalid code'; end if;
    update transactions set buyer_confirmed_at = coalesce(buyer_confirmed_at, now()) where id = p_tx_id;
  else
    if upper(p_code) <> v_tx.buyer_code then raise exception 'invalid code'; end if;
    update transactions set seller_confirmed_at = coalesce(seller_confirmed_at, now()) where id = p_tx_id;
  end if;

  select * into v_tx from transactions where id = p_tx_id;
  if v_tx.buyer_confirmed_at is not null and v_tx.seller_confirmed_at is not null then
    update transactions set status = 'completed', completed_at = now() where id = p_tx_id;
    update listings set status = 'completed' where id = v_tx.listing_id;
    update chats set status = 'locked' where id = v_tx.chat_id;
  end if;

  return public.get_my_transaction(p_tx_id);
end;
$$;

revoke all on function public.confirm_deal(uuid)       from public;
revoke all on function public.confirm_code(uuid, text) from public;
revoke all on function public.get_my_transaction(uuid) from public;
grant execute on function public.confirm_deal(uuid)       to authenticated;
grant execute on function public.confirm_code(uuid, text) to authenticated;
grant execute on function public.get_my_transaction(uuid) to authenticated;
```

`cancelTransaction` / `disputeTransaction` (per [architecture.md §3.2](architecture.md#3-api--route-design)) follow the same security-definer pattern and are added alongside the relevant UI.

---

## 0007 — Storage (listing images)

Public-read bucket; writes restricted to the listing owner. Path convention: `listings/{listing_id}/{uuid}.{ext}`. The owner check compares the listing id **as text** to the path's second folder — a malformed path simply matches no row (no `uuid` cast that could throw).

```sql
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

create policy listing_images_public_read on storage.objects
  for select using (bucket_id = 'listing-images');

create policy listing_images_owner_write on storage.objects
  for insert to authenticated with check (
    bucket_id = 'listing-images'
    and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[2] and l.seller_id = (select auth.uid())
    )
  );

create policy listing_images_owner_modify on storage.objects
  for update to authenticated using (
    bucket_id = 'listing-images'
    and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[2] and l.seller_id = (select auth.uid())
    )
  );

create policy listing_images_owner_delete on storage.objects
  for delete to authenticated using (
    bucket_id = 'listing-images'
    and exists (
      select 1 from public.listings l
      where l.id::text = (storage.foldername(name))[2] and l.seller_id = (select auth.uid())
    )
  );
```

App-enforced: max 5 images per listing, MIME `image/jpeg|png|webp`, ~5 MB cap, client-side compression. Thumbnails via Supabase image transforms; `position = 0` is the cover.

---

## 0008 — Seed nonprofits

The first cut ships with **manually seeded, approved** nonprofits (self-serve registration + EIN/IRS verification are deferred). Run as `service_role`. EINs/logos below are placeholders — replace with the real anchor partners before launch.

```sql
insert into nonprofits (name, ein, mission, category, city, state, verification) values
  ('Dallas Public Library Foundation', '00-0000001', 'Funding literacy and learning across Dallas.', 'education',   'Dallas', 'TX', 'approved'),
  ('Trinity River Conservancy',        '00-0000002', 'Restoring and protecting the Trinity River corridor.', 'environment', 'Dallas', 'TX', 'approved'),
  ('North Texas Food Bank',            '00-0000003', 'Providing meals to neighbors facing hunger.', 'community',   'Plano',  'TX', 'approved'),
  ('DFW Animal Rescue',                '00-0000004', 'Rescue, foster, and adoption for local animals.', 'animals',     'Fort Worth', 'TX', 'approved'),
  ('Community Health Clinic of Dallas','00-0000005', 'Accessible healthcare for the uninsured.', 'health',      'Dallas', 'TX', 'approved');
```

---

## Verification checklist

After applying all migrations:

```sql
select count(*) from nonprofits where verification = 'approved';

select tablename, rowsecurity
from pg_tables where schemaname = 'public' order by tablename;

select has_column_privilege('authenticated', 'transactions', 'buyer_code', 'select');  -- false
select has_column_privilege('authenticated', 'transactions', 'amount_cents', 'select'); -- true
select has_column_privilege('authenticated', 'messages', 'content', 'update');          -- false
select has_column_privilege('authenticated', 'messages', 'read_at', 'update');          -- true
```

- All eight public tables show `rowsecurity = true`.
- Code columns are not selectable (`buyer_code`/`seller_code` → `false`); ordinary columns are (`amount_cents` → `true`).
- `messages.content` is not updatable by `authenticated`; only `read_at` is.
- Sign up a test user → a matching `profiles` row exists.
- As a buyer, `select buyer_code from transactions` is rejected; `get_my_transaction` returns only `my_code`.

---

## Resolved & open

**Resolved (2026-06-13):**
- **Tooling:** plain SQL run by hand in the Supabase SQL Editor (no CLI). Files in [`/database`](../database).
- **Transaction logic:** lives in the DB as security-definer functions (atomicity + codes never reach the client). A separate backend will consume these later; for now we build only the database.
- **Seed:** placeholder nonprofits are fine for now (not deployed yet).

**Open / later:**
- Replace placeholder nonprofits with the real 5–10 anchor partners (name, EIN, mission, logo) before launch.
- `cancel` / `dispute` functions — written when the transactions UI lands.
