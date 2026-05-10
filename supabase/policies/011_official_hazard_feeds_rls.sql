begin;

alter table public.official_advisories enable row level security;
alter table public.earthquake_events enable row level security;
alter table public.feed_sync_logs enable row level security;

grant select on public.official_advisories to authenticated;
grant insert, update, delete on public.official_advisories to authenticated;
grant select on public.earthquake_events to authenticated;
grant insert, update, delete on public.earthquake_events to authenticated;
grant select, insert, update, delete on public.feed_sync_logs to authenticated;

drop policy if exists "authenticated_read_active_relevant_official_advisories" on public.official_advisories;
create policy "authenticated_read_active_relevant_official_advisories" on public.official_advisories
for select to authenticated
using (
  (((select public.is_admin()) = false)
   and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
  )
   and active = true
   and is_relevant_to_school = true
   and relevance_scope in ('quezon_city', 'camp_crame', 'ncr'))
  or ((select public.is_admin()) = true)
);

drop policy if exists "admin_insert_official_advisories" on public.official_advisories;
create policy "admin_insert_official_advisories" on public.official_advisories
for insert to authenticated
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "admin_update_official_advisories" on public.official_advisories;
create policy "admin_update_official_advisories" on public.official_advisories
for update to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null)
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "admin_delete_official_advisories" on public.official_advisories;
create policy "admin_delete_official_advisories" on public.official_advisories
for delete to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null);



drop policy if exists "official_advisories_insert_anon_block" on public.official_advisories;
create policy "official_advisories_insert_anon_block" on public.official_advisories
for insert to anon
with check (false);

drop policy if exists "official_advisories_update_anon_block" on public.official_advisories;
create policy "official_advisories_update_anon_block" on public.official_advisories
for update to anon
using (false)
with check (false);

drop policy if exists "official_advisories_delete_anon_block" on public.official_advisories;
create policy "official_advisories_delete_anon_block" on public.official_advisories
for delete to anon
using (false);


drop policy if exists "authenticated_read_active_relevant_earthquake_events" on public.earthquake_events;
create policy "authenticated_read_active_relevant_earthquake_events" on public.earthquake_events
for select to authenticated
using (
  (((select public.is_admin()) = false)
   and exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.active, true) = true
  )
   and active = true
   and is_relevant_to_school = true
   and relevance_scope in ('quezon_city', 'camp_crame', 'ncr'))
  or ((select public.is_admin()) = true)
);

drop policy if exists "admin_insert_earthquake_events" on public.earthquake_events;
create policy "admin_insert_earthquake_events" on public.earthquake_events
for insert to authenticated
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "admin_update_earthquake_events" on public.earthquake_events;
create policy "admin_update_earthquake_events" on public.earthquake_events
for update to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null)
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "admin_delete_earthquake_events" on public.earthquake_events;
create policy "admin_delete_earthquake_events" on public.earthquake_events
for delete to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null);



drop policy if exists "earthquake_events_insert_anon_block" on public.earthquake_events;
create policy "earthquake_events_insert_anon_block" on public.earthquake_events
for insert to anon
with check (false);

drop policy if exists "earthquake_events_update_anon_block" on public.earthquake_events;
create policy "earthquake_events_update_anon_block" on public.earthquake_events
for update to anon
using (false)
with check (false);

drop policy if exists "earthquake_events_delete_anon_block" on public.earthquake_events;
create policy "earthquake_events_delete_anon_block" on public.earthquake_events
for delete to anon
using (false);


drop policy if exists "admin_select_feed_sync_logs" on public.feed_sync_logs;
create policy "admin_select_feed_sync_logs" on public.feed_sync_logs
for select to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "admin_insert_feed_sync_logs" on public.feed_sync_logs;
create policy "admin_insert_feed_sync_logs" on public.feed_sync_logs
for insert to authenticated
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "admin_update_feed_sync_logs" on public.feed_sync_logs;
create policy "admin_update_feed_sync_logs" on public.feed_sync_logs
for update to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null)
with check ((select public.is_admin()) = true and (select auth.uid()) is not null);

drop policy if exists "admin_delete_feed_sync_logs" on public.feed_sync_logs;
create policy "admin_delete_feed_sync_logs" on public.feed_sync_logs
for delete to authenticated
using ((select public.is_admin()) = true and (select auth.uid()) is not null);



drop policy if exists "feed_sync_logs_insert_anon_block" on public.feed_sync_logs;
create policy "feed_sync_logs_insert_anon_block" on public.feed_sync_logs
for insert to anon
with check (false);

drop policy if exists "feed_sync_logs_update_anon_block" on public.feed_sync_logs;
create policy "feed_sync_logs_update_anon_block" on public.feed_sync_logs
for update to anon
using (false)
with check (false);

drop policy if exists "feed_sync_logs_delete_anon_block" on public.feed_sync_logs;
create policy "feed_sync_logs_delete_anon_block" on public.feed_sync_logs
for delete to anon
using (false);

commit;
