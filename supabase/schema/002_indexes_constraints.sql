-- CCES DRRM Supabase schema baseline (indexes + constraints)
-- Apply after 001_core_tables.sql.

alter table public.checkins
  add constraint checkins_staff_date_unique unique (staff_id, date);

create index if not exists idx_staff_name on public.staff (name);
create index if not exists idx_profiles_staff_id on public.profiles (staff_id);
create index if not exists idx_profiles_role_active on public.profiles (role, active);

create index if not exists idx_alerts_created_at_desc on public.alerts (created_at desc);
create index if not exists idx_alerts_active_created_at on public.alerts (active, created_at desc);

create index if not exists idx_incidents_created_at_desc on public.incidents (created_at desc);
create index if not exists idx_incidents_status_created_at on public.incidents (status, created_at desc);
create index if not exists idx_incidents_hazard_created_at on public.incidents (hazard_type, created_at desc);

create index if not exists idx_checkins_date on public.checkins (date);
create index if not exists idx_checkins_staff_date on public.checkins (staff_id, date);

create index if not exists idx_resources_category_name on public.resources (category, name);
create index if not exists idx_resources_last_checked on public.resources (last_checked desc);

create index if not exists idx_evacuation_routes_hazard on public.evacuation_routes (hazard_type);

create index if not exists idx_drills_date_desc on public.drills (date desc);
