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
