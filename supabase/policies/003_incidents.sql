-- 003_incidents.sql
-- Incident reports: reporter ownership + admin escalation controls.

alter table if exists public.incidents enable row level security;

drop policy if exists incidents_insert_authenticated on public.incidents;
create policy incidents_insert_authenticated
on public.incidents
for insert
to authenticated
with check (
  public.active_role() is not null
  and reported_by = auth.uid()
);

drop policy if exists incidents_select_own_or_admin on public.incidents;
create policy incidents_select_own_or_admin
on public.incidents
for select
to authenticated
using (
  public.active_role() is not null
  and (reported_by = auth.uid() or public.is_admin())
);

drop policy if exists incidents_update_admin_only on public.incidents;
create policy incidents_update_admin_only
on public.incidents
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Non-admin users are intentionally blocked from verify/resolve/status edits
-- because update permission is granted to admins only.
