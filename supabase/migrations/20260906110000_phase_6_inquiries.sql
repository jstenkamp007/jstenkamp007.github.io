-- Phase 6: retain historic records while making the protected workspace
-- suitable for neutral pharmacy enquiries. No public submission path is added.

alter table public.orders
  add column if not exists request_category text not null default 'legacy';

alter table public.orders
  drop constraint if exists orders_status_valid;

alter table public.orders
  drop constraint if exists orders_request_category_valid;

update public.orders
set status = 'feedback_required'
where status = 'ready';

alter table public.orders
  add constraint orders_status_valid
    check (status in ('new', 'processing', 'feedback_required', 'completed', 'archived')),
  add constraint orders_request_category_valid
    check (request_category in (
      'callback', 'contact', 'consultation', 'delivery',
      'equipment_rental', 'health_check', 'technical', 'legacy'
    ));

grant update (status, request_category) on table public.orders to authenticated;

