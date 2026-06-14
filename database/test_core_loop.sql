-- Core database/RLS verification for Supabase SQL Editor.
-- Run after 0001-0008. The script uses one transaction and rolls back all test data.

begin;

create temp table _core_ids (
  name text primary key,
  id uuid not null
) on commit drop;

create temp table _core_values (
  name text primary key,
  value text not null
) on commit drop;

grant all on table _core_ids to authenticated;
grant all on table _core_values to authenticated;

create or replace function pg_temp.assert_true(p_name text, p_ok boolean)
returns void language plpgsql as $$
begin
  if not coalesce(p_ok, false) then
    raise exception 'FAIL: %', p_name;
  end if;

  raise notice 'PASS: %', p_name;
end;
$$;

create or replace function pg_temp.expect_insufficient_privilege(p_name text, p_sql text)
returns void language plpgsql security invoker as $$
begin
  begin
    execute p_sql;
  exception
    when insufficient_privilege then
      raise notice 'PASS: %', p_name;
      return;
  end;

  raise exception 'FAIL: %, expected insufficient_privilege', p_name;
end;
$$;

create or replace function pg_temp.act_as(p_user_id uuid)
returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', p_user_id::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config(
    'request.jwt.claims',
    json_build_object('sub', p_user_id::text, 'role', 'authenticated')::text,
    true
  );
end;
$$;

grant execute on function pg_temp.assert_true(text, boolean) to authenticated;
grant execute on function pg_temp.expect_insufficient_privilege(text, text) to authenticated;
grant execute on function pg_temp.act_as(uuid) to authenticated;

insert into _core_ids (name, id) values
  ('seller', gen_random_uuid()),
  ('buyer', gen_random_uuid()),
  ('outsider', gen_random_uuid());

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
select
  '00000000-0000-0000-0000-000000000000'::uuid,
  id,
  'authenticated',
  'authenticated',
  name || '-' || replace(id::text, '-', '') || '@example.test',
  crypt('test-password', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('name', 'Core Test ' || initcap(name)),
  now(),
  now()
from _core_ids
where name in ('seller', 'buyer', 'outsider');

select pg_temp.assert_true(
  'signup trigger created profiles',
  (
    select count(*)
    from profiles
    where id in (select id from _core_ids where name in ('seller', 'buyer', 'outsider'))
  ) = 3
);

with inserted as (
  insert into nonprofits (name, ein, mission, category, city, state, verification)
  values (
    'Core Loop Test Nonprofit',
    '99-9999999',
    'Temporary nonprofit for database tests.',
    'community',
    'Dallas',
    'TX',
    'approved'
  )
  returning id
)
insert into _core_ids (name, id)
select 'nonprofit', id from inserted;

select pg_temp.assert_true(
  'all public tables have RLS enabled',
  (
    select count(*)
    from pg_tables
    where schemaname = 'public'
      and tablename in (
        'profiles',
        'nonprofits',
        'listings',
        'listing_images',
        'chats',
        'messages',
        'transactions',
        'notifications'
      )
      and rowsecurity
  ) = 8
);

select pg_temp.assert_true(
  'transactions.buyer_code is not selectable by authenticated',
  not has_column_privilege('authenticated', 'transactions', 'buyer_code', 'select')
);

select pg_temp.assert_true(
  'transactions.amount_cents is selectable by authenticated',
  has_column_privilege('authenticated', 'transactions', 'amount_cents', 'select')
);

select pg_temp.assert_true(
  'messages.content is not updatable by authenticated',
  not has_column_privilege('authenticated', 'messages', 'content', 'update')
);

select pg_temp.assert_true(
  'messages.read_at is updatable by authenticated',
  has_column_privilege('authenticated', 'messages', 'read_at', 'update')
);

select pg_temp.act_as((select id from _core_ids where name = 'seller'));
set local role authenticated;

with inserted as (
  insert into listings (
    seller_id,
    title,
    description,
    category,
    condition,
    price_cents,
    city,
    pickup_area,
    nonprofit_id
  )
  select
    (select id from _core_ids where name = 'seller'),
    'Core Loop Test Listing',
    'Temporary listing for database tests.',
    'books',
    'good',
    2500,
    'Dallas',
    'Bishop Arts',
    (select id from _core_ids where name = 'nonprofit')
  returning id
)
insert into _core_ids (name, id)
select 'listing', id from inserted;

select pg_temp.expect_insufficient_privilege(
  'seller cannot open a chat with self',
  format(
    'insert into public.chats (listing_id, buyer_id, seller_id) values (%L::uuid, %L::uuid, %L::uuid)',
    (select id from _core_ids where name = 'listing'),
    (select id from _core_ids where name = 'seller'),
    (select id from _core_ids where name = 'seller')
  )
);

reset role;

select pg_temp.act_as((select id from _core_ids where name = 'buyer'));
set local role authenticated;

select pg_temp.assert_true(
  'buyer can see active listing',
  exists (
    select 1
    from listings
    where id = (select id from _core_ids where name = 'listing')
  )
);

select pg_temp.expect_insufficient_privilege(
  'buyer cannot open chat with the wrong seller_id',
  format(
    'insert into public.chats (listing_id, buyer_id, seller_id) values (%L::uuid, %L::uuid, %L::uuid)',
    (select id from _core_ids where name = 'listing'),
    (select id from _core_ids where name = 'buyer'),
    (select id from _core_ids where name = 'outsider')
  )
);

with inserted as (
  insert into chats (listing_id, buyer_id, seller_id)
  select
    (select id from _core_ids where name = 'listing'),
    (select id from _core_ids where name = 'buyer'),
    (select id from _core_ids where name = 'seller')
  returning id
)
insert into _core_ids (name, id)
select 'chat', id from inserted;

with inserted as (
  insert into messages (chat_id, sender_id, content)
  select
    (select id from _core_ids where name = 'chat'),
    (select id from _core_ids where name = 'buyer'),
    'Interested in this item.'
  returning id
)
insert into _core_ids (name, id)
select 'message', id from inserted;

select pg_temp.expect_insufficient_privilege(
  'buyer cannot update message.content',
  format(
    'update public.messages set content = %L where id = %L::uuid',
    'edited',
    (select id from _core_ids where name = 'message')
  )
);

update messages
set read_at = now()
where id = (select id from _core_ids where name = 'message');

select pg_temp.assert_true(
  'buyer can update message.read_at',
  exists (
    select 1
    from messages
    where id = (select id from _core_ids where name = 'message')
      and read_at is not null
  )
);

with result as (
  select public.confirm_deal((select id from _core_ids where name = 'chat')) as data
),
inserted_id as (
  insert into _core_ids (name, id)
  select 'transaction', (data->>'id')::uuid
  from result
  returning 1
)
insert into _core_values (name, value)
select 'buyer_code', data->>'my_code'
from result;

select pg_temp.assert_true(
  'buyer get_my_transaction returns only my_code',
  (
    select
      data ? 'my_code'
      and not (data ? 'buyer_code')
      and not (data ? 'seller_code')
      and data->>'my_code' = (select value from _core_values where name = 'buyer_code')
    from (
      select public.get_my_transaction((select id from _core_ids where name = 'transaction')) as data
    ) s
  )
);

select pg_temp.expect_insufficient_privilege(
  'buyer cannot select buyer_code directly',
  'select buyer_code from public.transactions limit 1'
);

reset role;

select pg_temp.act_as((select id from _core_ids where name = 'outsider'));
set local role authenticated;

select pg_temp.assert_true(
  'outsider cannot select transaction row',
  not exists (
    select 1
    from transactions
    where id = (select id from _core_ids where name = 'transaction')
  )
);

select pg_temp.assert_true(
  'outsider get_my_transaction returns null',
  public.get_my_transaction((select id from _core_ids where name = 'transaction')) is null
);

reset role;

select pg_temp.act_as((select id from _core_ids where name = 'seller'));
set local role authenticated;

insert into _core_values (name, value)
select
  'seller_code',
  public.get_my_transaction((select id from _core_ids where name = 'transaction'))->>'my_code';

select pg_temp.assert_true(
  'seller get_my_transaction returns a seller code',
  length((select value from _core_values where name = 'seller_code')) = 6
);

select public.confirm_code(
  (select id from _core_ids where name = 'transaction'),
  (select value from _core_values where name = 'buyer_code')
);

select pg_temp.assert_true(
  'seller confirmation timestamp is set',
  exists (
    select 1
    from transactions
    where id = (select id from _core_ids where name = 'transaction')
      and seller_confirmed_at is not null
      and buyer_confirmed_at is null
      and status = 'pending'
  )
);

reset role;

select pg_temp.act_as((select id from _core_ids where name = 'buyer'));
set local role authenticated;

select public.confirm_code(
  (select id from _core_ids where name = 'transaction'),
  (select value from _core_values where name = 'seller_code')
);

select pg_temp.assert_true(
  'transaction is completed after both codes',
  exists (
    select 1
    from transactions
    where id = (select id from _core_ids where name = 'transaction')
      and buyer_confirmed_at is not null
      and seller_confirmed_at is not null
      and completed_at is not null
      and status = 'completed'
  )
);

select pg_temp.assert_true(
  'chat is locked after completion',
  exists (
    select 1
    from chats
    where id = (select id from _core_ids where name = 'chat')
      and status = 'locked'
  )
);

select pg_temp.expect_insufficient_privilege(
  'buyer cannot message after chat is locked',
  format(
    'insert into public.messages (chat_id, sender_id, content) values (%L::uuid, %L::uuid, %L)',
    (select id from _core_ids where name = 'chat'),
    (select id from _core_ids where name = 'buyer'),
    'This should not insert.'
  )
);

reset role;

select pg_temp.assert_true(
  'listing is completed after both codes',
  exists (
    select 1
    from listings
    where id = (select id from _core_ids where name = 'listing')
      and status = 'completed'
  )
);

select 'PASS: core loop, RLS, column privileges, and dual-code flow verified' as result;

rollback;
