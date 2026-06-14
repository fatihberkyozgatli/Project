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
