begin;

alter table if exists public.checkins enable row level security;

-- NOTE: Constraint-backed indexes (e.g., checkins_staff_date_unique) must not be
-- dropped in this RLS migration. Duplicate-index cleanup is deferred to a dedicated
-- schema migration so this file only revises checkins RLS policies.

-- 004_checkins.sql policy names are covered by the DROP POLICY IF EXISTS block below.
-- Drop legacy checkins policies from 004_checkins.sql (and current names)
-- before creating revised policies to avoid duplicate permissive policies.
drop policy if exists checkins_select_staff_own on public.checkins;
drop policy if exists checkins_select_admin_all on public.checkins;
drop policy if exists checkins_insert_staff_own on public.checkins;
drop policy if exists checkins_update_staff_own on public.checkins;
drop policy if exists checkins_admin_manage_all on public.checkins;
drop policy if exists checkins_insert_anon_block on public.checkins;
drop policy if exists checkins_update_anon_block on public.checkins;
drop policy if exists checkins_delete_anon_block on public.checkins;

create policy checkins_select_staff_own
on public.checkins
for select
to authenticated
using (
  (select public.active_role()) in ('staff', 'admin')
  and checkins.staff_id = (
    select p.staff_id
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
    limit 1
  )
);

create policy checkins_select_admin_all
on public.checkins
for select
to authenticated
using ((select public.is_admin()));

create policy checkins_insert_staff_own
on public.checkins
for insert
to authenticated
with check (
  (select public.active_role()) in ('staff', 'admin')
  and checkins.staff_id = (
    select p.staff_id
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
    limit 1
  )
);

create policy checkins_update_staff_own
on public.checkins
for update
to authenticated
using (
  (select public.active_role()) in ('staff', 'admin')
  and checkins.staff_id = (
    select p.staff_id
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
    limit 1
  )
)
with check (
  (select public.active_role()) in ('staff', 'admin')
  and checkins.staff_id = (
    select p.staff_id
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
    limit 1
  )
);

create policy checkins_admin_manage_all
on public.checkins
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- Keep anon INSERT/UPDATE/DELETE blocked.
create policy checkins_insert_anon_block
on public.checkins
for insert
to anon
with check (false);

create policy checkins_update_anon_block
on public.checkins
for update
to anon
using (false)
with check (false);

create policy checkins_delete_anon_block
on public.checkins
for delete
to anon
using (false);

commit;
