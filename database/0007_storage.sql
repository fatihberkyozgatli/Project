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
