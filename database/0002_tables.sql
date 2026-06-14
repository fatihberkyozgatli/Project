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
