begin;

alter table if exists public.checkins enable row level security;

-- Remove only clearly duplicate index name, and only if both objects exist.
do $$
begin
  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'checkins_staff_date_unique'
      and c.relkind = 'i'
  )
  and exists (
    select 1
    from information_schema.table_constraints tc
    where tc.table_schema = 'public'
      and tc.table_name = 'checkins'
      and tc.constraint_name = 'checkins_staff_id_date_key'
      and tc.constraint_type = 'UNIQUE'
  ) then
    execute 'drop index if exists public.checkins_staff_date_unique';
  end if;
end
$$;

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
