-- 003_incidents.sql
-- Incident reports: compatible with CURRENT app schema.
-- CURRENT app writes `reported_by` as display text (full_name/email), not auth.uid().
-- Therefore strict per-user ownership CANNOT be enforced with this column alone.
-- Future hardening: add `reported_by_user_id uuid references auth.users(id)`.

alter table if exists public.incidents enable row level security;

drop policy if exists incidents_insert_authenticated on public.incidents;
create policy incidents_insert_authenticated
on public.incidents
for insert
to authenticated
with check (public.active_role() is not null);

-- Current compatibility mode: authenticated users can read incidents.
-- This avoids false ownership assumptions against text `reported_by`.
drop policy if exists incidents_select_authenticated on public.incidents;
create policy incidents_select_authenticated
on public.incidents
for select
to authenticated
using (public.active_role() is not null);

drop policy if exists incidents_update_admin_only on public.incidents;
create policy incidents_update_admin_only
on public.incidents
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- FUTURE STRICT OWNERSHIP MIGRATION (recommended):
-- 1) alter table public.incidents add column reported_by_user_id uuid references auth.users(id);
-- 2) backfill where possible; update client to write auth.uid() into reported_by_user_id;
-- 3) replace select policy with: reported_by_user_id = auth.uid() or public.is_admin().
