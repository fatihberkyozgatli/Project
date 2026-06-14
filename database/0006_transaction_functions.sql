revoke select on transactions from authenticated, anon;
grant select (
  id, listing_id, chat_id, buyer_id, seller_id, nonprofit_id,
  amount_cents, status, buyer_confirmed_at, seller_confirmed_at,
  completed_at, cancelled_at, cancel_reason, created_at
) on transactions to authenticated;

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

create or replace function public.confirm_code(p_tx_id uuid, p_code text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tx       transactions;
  v_is_buyer boolean;
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
