-- 004_checkins.sql
-- Check-ins: staff can read/write only their own linked staff row; admins can manage all.
-- Assumes comparable staff id types between profiles.staff_id and checkins.staff_id.

alter table if exists public.checkins enable row level security;

drop policy if exists checkins_select_staff_own on public.checkins;
create policy checkins_select_staff_own
on public.checkins
for select
to authenticated
using (
  public.active_role() in ('staff', 'admin')
  and checkins.staff_id::text = public.current_staff_id_text()
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
  and checkins.staff_id::text = public.current_staff_id_text()
);

drop policy if exists checkins_update_staff_own on public.checkins;
create policy checkins_update_staff_own
on public.checkins
for update
to authenticated
using (
  public.active_role() in ('staff', 'admin')
  and checkins.staff_id::text = public.current_staff_id_text()
)
with check (
  public.active_role() in ('staff', 'admin')
  and checkins.staff_id::text = public.current_staff_id_text()
);

drop policy if exists checkins_admin_manage_all on public.checkins;
create policy checkins_admin_manage_all
on public.checkins
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Viewers cannot modify by omission (no insert/update/delete policy for viewer).
