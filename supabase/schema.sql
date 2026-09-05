-- Security-hardened schema snapshot for Supabase project iezjojbuyzugfguhizyw.
-- The Vault secret named order_notification_webhook_secret is provisioned
-- separately and must never be committed in plaintext.
-- The Edge Function secret ORDER_RATE_LIMIT_SALT is provisioned separately.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create table if not exists private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table private.admin_users enable row level security;
revoke all on table private.admin_users from public, anon, authenticated;

drop policy if exists deny_direct_admin_user_access on private.admin_users;
create policy deny_direct_admin_user_access
on private.admin_users
as restrictive
for all
to public
using (false)
with check (false);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

create or replace function public.is_order_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_admin();
$$;

revoke all on function public.is_order_admin() from public, anon, authenticated;
grant execute on function public.is_order_admin() to authenticated;

create table if not exists public.order_submission_rate_limits (
  rate_key text not null check (rate_key ~ '^[0-9a-f]{64}$'),
  window_name text not null check (window_name in ('quarter_hour', 'day')),
  window_started_at timestamptz not null,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  primary key (rate_key, window_name, window_started_at)
);

alter table public.order_submission_rate_limits enable row level security;
revoke all on table public.order_submission_rate_limits from public, anon, authenticated;

drop policy if exists deny_direct_order_rate_limit_access on public.order_submission_rate_limits;
create policy deny_direct_order_rate_limit_access
on public.order_submission_rate_limits
as restrictive
for all
to public
using (false)
with check (false);

create or replace function public.reserve_order_submission(p_rate_key text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_quarter_hour_start timestamptz;
  v_day_start timestamptz;
  v_quarter_hour_count integer;
  v_day_count integer;
begin
  if p_rate_key !~ '^[0-9a-f]{64}$' then
    return false;
  end if;

  delete from public.order_submission_rate_limits
  where window_started_at < now() - interval '2 days';

  v_quarter_hour_start := date_trunc('hour', now())
    + (floor(extract(minute from now()) / 15) * interval '15 minutes');
  v_day_start := date_trunc('day', now());

  insert into public.order_submission_rate_limits (
    rate_key, window_name, window_started_at, attempt_count
  ) values (p_rate_key, 'quarter_hour', v_quarter_hour_start, 1)
  on conflict (rate_key, window_name, window_started_at)
  do update set attempt_count = public.order_submission_rate_limits.attempt_count + 1
  returning attempt_count into v_quarter_hour_count;

  insert into public.order_submission_rate_limits (
    rate_key, window_name, window_started_at, attempt_count
  ) values (p_rate_key, 'day', v_day_start, 1)
  on conflict (rate_key, window_name, window_started_at)
  do update set attempt_count = public.order_submission_rate_limits.attempt_count + 1
  returning attempt_count into v_day_count;

  if v_quarter_hour_count > 5 or v_day_count > 20 then
    return false;
  end if;

  return true;
end;
$$;

revoke all on function public.reserve_order_submission(text)
from public, anon, authenticated;
grant execute on function public.reserve_order_submission(text) to service_role;

alter table public.orders
  alter column first_name set not null,
  alter column last_name set not null,
  alter column phone set not null,
  alter column medicine set not null,
  alter column callback set default false,
  alter column callback set not null,
  alter column created_at set default now(),
  alter column created_at set not null,
  alter column status set default 'new',
  alter column status set not null;

alter table public.orders drop constraint if exists orders_first_name_valid;
alter table public.orders drop constraint if exists orders_last_name_valid;
alter table public.orders drop constraint if exists orders_phone_valid;
alter table public.orders drop constraint if exists orders_medicine_valid;
alter table public.orders drop constraint if exists orders_message_valid;
alter table public.orders drop constraint if exists orders_status_valid;
alter table public.orders drop constraint if exists orders_internal_note_valid;

alter table public.orders
  add constraint orders_first_name_valid
    check (char_length(btrim(first_name)) between 1 and 100),
  add constraint orders_last_name_valid
    check (char_length(btrim(last_name)) between 1 and 100),
  add constraint orders_phone_valid
    check (
      char_length(btrim(phone)) between 5 and 50
      and phone ~ '^[0-9+() ./-]+$'
    ) not valid,
  add constraint orders_medicine_valid
    check (char_length(btrim(medicine)) between 1 and 500),
  add constraint orders_message_valid
    check (message is null or char_length(message) <= 2000),
  add constraint orders_status_valid
    check (status in ('new', 'processing', 'ready', 'completed')),
  add constraint orders_internal_note_valid
    check (internal_note is null or char_length(internal_note) <= 2000);

alter table public.orders enable row level security;

drop policy if exists allow_authenticated_order_read on public.orders;
drop policy if exists allow_authenticated_order_update on public.orders;
drop policy if exists allow_admin_order_read on public.orders;
drop policy if exists allow_admin_order_update on public.orders;

create policy allow_admin_order_read
on public.orders
for select
to authenticated
using ((select private.is_admin()));

create policy allow_admin_order_update
on public.orders
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

revoke all on table public.orders from anon, authenticated;
grant select on table public.orders to authenticated;
grant update (status) on public.orders to authenticated;

revoke all on sequence public.orders_id_seq from anon, authenticated;

create or replace function private.set_order_completion_timestamp()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.status = 'completed' and old.status is distinct from new.status then
    new.completed_at := now();
  elsif new.status <> 'completed' then
    new.completed_at := null;
  end if;

  return new;
end;
$$;

revoke all on function private.set_order_completion_timestamp()
from public, anon, authenticated;

drop trigger if exists set_order_completion_timestamp on public.orders;
create trigger set_order_completion_timestamp
before update of status on public.orders
for each row
execute function private.set_order_completion_timestamp();

create or replace function private.notify_new_order()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  webhook_secret text;
begin
  if tg_op <> 'INSERT' or tg_table_schema <> 'public' or tg_table_name <> 'orders' then
    raise exception 'Invalid notification trigger context';
  end if;

  select decrypted_secret
  into webhook_secret
  from vault.decrypted_secrets
  where name = 'order_notification_webhook_secret';

  if webhook_secret is null then
    raise exception 'Order notification secret is not configured';
  end if;

  perform net.http_post(
    url := 'https://iezjojbuyzugfguhizyw.supabase.co/functions/v1/send-order-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-order-webhook-secret', webhook_secret
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'schema', 'public',
      'table', 'orders',
      'order_id', new.id
    ),
    timeout_milliseconds := 5000
  );

  return new;
end;
$$;

revoke all on function private.notify_new_order()
from public, anon, authenticated;

drop trigger if exists "send-order-notification" on public.orders;
create trigger "send-order-notification"
after insert on public.orders
for each row
execute function private.notify_new_order();

