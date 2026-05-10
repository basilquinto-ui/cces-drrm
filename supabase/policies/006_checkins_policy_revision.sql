-- Verification queries (run first, inspect results before applying migration section)

-- 1) checkins.staff_id column type
select
  table_schema,
  table_name,
  column_name,
  data_type,
  udt_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'checkins'
  and column_name = 'staff_id';

-- 2) profiles.staff_id column type
select
  table_schema,
  table_name,
  column_name,
  data_type,
  udt_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
  and column_name = 'staff_id';

-- 3) staff.id column type
select
  table_schema,
  table_name,
  column_name,
  data_type,
  udt_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'staff'
  and column_name = 'id';

-- 4) existing checkins policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'checkins'
order by policyname;

-- 5) existing profiles policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles'
order by policyname;

-- 6) existing staff policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'staff'
order by policyname;

-- 7) existing indexes and constraints relevant to checkins duplicate check
select
  n.nspname as schema_name,
  t.relname as table_name,
  i.relname as index_name,
  pg_get_indexdef(i.oid) as index_def
from pg_class t
join pg_namespace n on n.oid = t.relnamespace
join pg_index x on x.indrelid = t.oid
join pg_class i on i.oid = x.indexrelid
where n.nspname = 'public'
  and t.relname = 'checkins'
order by i.relname;

select
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  kcu.ordinal_position
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
 and tc.table_schema = kcu.table_schema
 and tc.table_name = kcu.table_name
where tc.table_schema = 'public'
  and tc.table_name = 'checkins'
  and tc.constraint_type in ('PRIMARY KEY', 'UNIQUE')
order by tc.constraint_name, kcu.ordinal_position;


-- Migration section
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

-- CHECKINS policies

drop policy if exists checkins_select_staff_own on public.checkins;
create policy checkins_select_staff_own
on public.checkins
for select
to authenticated
using (
  public.active_role() in ('staff', 'admin')
  and checkins.staff_id = (
    select p.staff_id
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
    limit 1
  )
);

drop policy if exists checkins_select_admin_all on public.checkins;
create policy checkins_select_admin_all
on public.checkins
for select
to authenticated
using (public.is_admin());

drop policy if exists checkins_insert_staff_own on public.checkins;
create policy checkins_insert_staff_own
on public.checkins
for insert
to authenticated
with check (
  public.active_role() in ('staff', 'admin')
  and checkins.staff_id = (
    select p.staff_id
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
    limit 1
  )
);

drop policy if exists checkins_update_staff_own on public.checkins;
create policy checkins_update_staff_own
on public.checkins
for update
to authenticated
using (
  public.active_role() in ('staff', 'admin')
  and checkins.staff_id = (
    select p.staff_id
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
    limit 1
  )
)
with check (
  public.active_role() in ('staff', 'admin')
  and checkins.staff_id = (
    select p.staff_id
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
    limit 1
  )
);

drop policy if exists checkins_admin_manage_all on public.checkins;
create policy checkins_admin_manage_all
on public.checkins
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Ensure explicit anon write blocks on checkins.
drop policy if exists checkins_insert_anon_block on public.checkins;
create policy checkins_insert_anon_block
on public.checkins
for insert
to anon
with check (false);

drop policy if exists checkins_update_anon_block on public.checkins;
create policy checkins_update_anon_block
on public.checkins
for update
to anon
using (false)
with check (false);

drop policy if exists checkins_delete_anon_block on public.checkins;
create policy checkins_delete_anon_block
on public.checkins
for delete
to anon
using (false);

commit;
