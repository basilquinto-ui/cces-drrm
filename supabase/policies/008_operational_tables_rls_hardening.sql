begin;

alter table if exists public.staff enable row level security;
alter table if exists public.resources enable row level security;
alter table if exists public.drills enable row level security;
alter table if exists public.evacuation_routes enable row level security;

-- Revoke broad anonymous access from sensitive/operational tables.
revoke all on public.staff from anon;
revoke insert, update, delete on public.resources from anon;
revoke insert, update, delete on public.drills from anon;
revoke insert, update, delete on public.evacuation_routes from anon;

-- staff (sensitive): admin-only read/write
-- Optional explicit anon select block for defense-in-depth.
drop policy if exists staff_select_admin_only on public.staff;
drop policy if exists staff_write_admin_only on public.staff;
drop policy if exists staff_anon_select_block on public.staff;

create policy staff_select_admin_only
on public.staff
for select
to authenticated
using ((select public.is_admin()));

create policy staff_write_admin_only
on public.staff
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy staff_anon_select_block
on public.staff
for select
to anon
using (false);

-- resources: authenticated active-profile select; admin-only writes; anon writes blocked
drop policy if exists resources_select_authenticated on public.resources;
drop policy if exists resources_write_admin_only on public.resources;
drop policy if exists resources_insert_anon_block on public.resources;
drop policy if exists resources_update_anon_block on public.resources;
drop policy if exists resources_delete_anon_block on public.resources;

create policy resources_select_authenticated
on public.resources
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
  )
);

create policy resources_write_admin_only
on public.resources
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy resources_insert_anon_block
on public.resources
for insert
to anon
with check (false);

create policy resources_update_anon_block
on public.resources
for update
to anon
using (false)
with check (false);

create policy resources_delete_anon_block
on public.resources
for delete
to anon
using (false);

-- drills: authenticated active-profile select; admin-only writes; anon writes blocked
drop policy if exists drills_select_authenticated on public.drills;
drop policy if exists drills_write_admin_only on public.drills;
drop policy if exists drills_insert_anon_block on public.drills;
drop policy if exists drills_update_anon_block on public.drills;
drop policy if exists drills_delete_anon_block on public.drills;

create policy drills_select_authenticated
on public.drills
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
  )
);

create policy drills_write_admin_only
on public.drills
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy drills_insert_anon_block
on public.drills
for insert
to anon
with check (false);

create policy drills_update_anon_block
on public.drills
for update
to anon
using (false)
with check (false);

create policy drills_delete_anon_block
on public.drills
for delete
to anon
using (false);

-- evacuation_routes: conservative authenticated active-profile select; admin-only writes; anon writes blocked
drop policy if exists evacuation_routes_select_authenticated on public.evacuation_routes;
drop policy if exists evacuation_routes_write_admin_only on public.evacuation_routes;
drop policy if exists evacuation_routes_insert_anon_block on public.evacuation_routes;
drop policy if exists evacuation_routes_update_anon_block on public.evacuation_routes;
drop policy if exists evacuation_routes_delete_anon_block on public.evacuation_routes;

create policy evacuation_routes_select_authenticated
on public.evacuation_routes
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
  )
);

create policy evacuation_routes_write_admin_only
on public.evacuation_routes
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy evacuation_routes_insert_anon_block
on public.evacuation_routes
for insert
to anon
with check (false);

create policy evacuation_routes_update_anon_block
on public.evacuation_routes
for update
to anon
using (false)
with check (false);

create policy evacuation_routes_delete_anon_block
on public.evacuation_routes
for delete
to anon
using (false);

commit;
