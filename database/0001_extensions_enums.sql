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
