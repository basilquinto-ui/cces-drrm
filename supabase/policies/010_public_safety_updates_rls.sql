alter table public.public_safety_updates enable row level security;

grant select on public.public_safety_updates to anon;
grant select on public.public_safety_updates to authenticated;
grant insert, update, delete on public.public_safety_updates to authenticated;

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

create policy "authenticated_read_published_public_safety_updates"
on public.public_safety_updates
for select
to authenticated
using (
  ((select public.is_admin()) = false and (select auth.uid()) is not null and published = true and active = true)
  or ((select public.is_admin()) = true)
);

create policy "admin_insert_public_safety_updates"
on public.public_safety_updates
for insert
to authenticated
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

create policy "admin_update_public_safety_updates"
on public.public_safety_updates
for update
to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null)
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

create policy "admin_delete_public_safety_updates"
on public.public_safety_updates
for delete
to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null);
