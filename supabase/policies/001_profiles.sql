-- 001_profiles.sql
-- Profiles RLS + helper functions for role-aware access control.

alter table if exists public.profiles enable row level security;

-- Helper: current user profile role if active, otherwise null.
create or replace function public.active_role()
returns text
language sql
stable
as $$
  select p.role
  from public.profiles p
  where p.id = auth.uid()
    and coalesce(p.active, true) = true
  limit 1;
$$;

-- Helper: true when current user has active admin role.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(public.active_role() = 'admin', false);
$$;

-- Helper: current profile's linked staff_id.
create or replace function public.current_staff_id()
returns uuid
language sql
stable
as $$
  select p.staff_id
  from public.profiles p
  where p.id = auth.uid()
    and coalesce(p.active, true) = true
  limit 1;
$$;

revoke all on function public.active_role() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.current_staff_id() from public;
grant execute on function public.active_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.current_staff_id() to authenticated;

drop policy if exists profiles_select_self_or_admin on public.profiles;
create policy profiles_select_self_or_admin
on public.profiles
for select
to authenticated
using (
  coalesce((select active from public.profiles where id = auth.uid()), true) = true
  and (id = auth.uid() or public.is_admin())
);

drop policy if exists profiles_update_admin_only on public.profiles;
create policy profiles_update_admin_only
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (
  public.is_admin()
  and not (id = auth.uid() and role <> 'admin')
);

-- Optional: allow users to update only non-privileged self fields.
drop policy if exists profiles_update_self_non_privileged on public.profiles;
create policy profiles_update_self_non_privileged
on public.profiles
for update
to authenticated
using (id = auth.uid() and coalesce(active, true) = true)
with check (
  id = auth.uid()
  and role = (select role from public.profiles where id = auth.uid())
  and active = (select active from public.profiles where id = auth.uid())
);
