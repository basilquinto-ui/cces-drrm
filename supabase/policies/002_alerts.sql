-- 002_alerts.sql
-- Alerts are readable by authenticated users; writable by admins only.

alter table if exists public.alerts enable row level security;

drop policy if exists alerts_select_authenticated on public.alerts;
create policy alerts_select_authenticated
on public.alerts
for select
to authenticated
using (public.active_role() is not null);

drop policy if exists alerts_insert_admin_only on public.alerts;
create policy alerts_insert_admin_only
on public.alerts
for insert
to authenticated
with check (public.is_admin());

drop policy if exists alerts_update_admin_only on public.alerts;
create policy alerts_update_admin_only
on public.alerts
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Deletion is denied by default. If your retention policy allows hard delete,
-- replace this with an admin-only delete policy.
drop policy if exists alerts_delete_admin_only on public.alerts;
