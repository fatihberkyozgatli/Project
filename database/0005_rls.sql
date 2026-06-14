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
