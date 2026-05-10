begin;

alter table public.public_safety_updates enable row level security;

grant select on public.public_safety_updates to anon;
grant select on public.public_safety_updates to authenticated;
grant insert, update, delete on public.public_safety_updates to authenticated;

drop policy if exists "anon_read_published_public_safety_updates" on public.public_safety_updates;
create policy "anon_read_published_public_safety_updates"
on public.public_safety_updates
for select
to anon
using (
  published = true
  and active = true
  and (starts_at is null or starts_at <= now())
  and (ends_at is null or ends_at >= now())
);

drop policy if exists "authenticated_read_published_public_safety_updates" on public.public_safety_updates;
create policy "authenticated_read_published_public_safety_updates"
on public.public_safety_updates
for select
to authenticated
using (
  (
    (select public.is_admin()) = false
    and exists (
      select 1
      from public.profiles p
      where p.id = (select auth.uid())
        and coalesce(p.active, true) = true
    )
    and published = true
    and active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  )
  or ((select public.is_admin()) = true)
);

drop policy if exists "admin_insert_public_safety_updates" on public.public_safety_updates;
create policy "admin_insert_public_safety_updates"
on public.public_safety_updates
for insert
to authenticated
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "admin_update_public_safety_updates" on public.public_safety_updates;
create policy "admin_update_public_safety_updates"
on public.public_safety_updates
for update
to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null)
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "admin_delete_public_safety_updates" on public.public_safety_updates;
create policy "admin_delete_public_safety_updates"
on public.public_safety_updates
for delete
to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "public_safety_updates_insert_anon_block" on public.public_safety_updates;
create policy "public_safety_updates_insert_anon_block"
on public.public_safety_updates
for insert
to anon
with check (false);

drop policy if exists "public_safety_updates_update_anon_block" on public.public_safety_updates;
create policy "public_safety_updates_update_anon_block"
on public.public_safety_updates
for update
to anon
using (false)
with check (false);

drop policy if exists "public_safety_updates_delete_anon_block" on public.public_safety_updates;
create policy "public_safety_updates_delete_anon_block"
on public.public_safety_updates
for delete
to anon
using (false);

commit;
