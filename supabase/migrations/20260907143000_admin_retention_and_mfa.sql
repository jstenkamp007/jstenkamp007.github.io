-- Deletes only enquiries explicitly completed more than 90 days ago.
-- The job runs in the database and deliberately ignores active and archived records.
create extension if not exists pg_cron;

drop policy if exists require_mfa_for_admin_orders on public.orders;
create policy require_mfa_for_admin_orders
on public.orders
as restrictive
for all
to authenticated
using ((select auth.jwt()->>'aal') = 'aal2')
with check ((select auth.jwt()->>'aal') = 'aal2');

do $$
declare
  existing_job_id bigint;
begin
  select jobid
  into existing_job_id
  from cron.job
  where jobname = 'delete_expired_completed_orders';

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;

  perform cron.schedule(
    'delete_expired_completed_orders',
    '17 3 * * *',
    $job$
      delete from public.orders
      where status = 'completed'
        and completed_at < now() - interval '90 days';
    $job$
  );
end;
$$;
