-- CCES DRRM Supabase schema baseline (minimum reference seed data)
-- Apply after 001 and 002.

insert into public.staff (name, role, contact, active)
values
  ('DRRM Coordinator', 'Coordinator', '', true)
on conflict do nothing;

insert into public.resources (name, category, quantity, location, condition, last_checked)
values
  ('First Aid Kits', 'medical', 1, 'Clinic', 'good', current_date),
  ('Fire Extinguishers', 'fire', 1, 'Main Building', 'good', current_date)
on conflict do nothing;

insert into public.evacuation_routes (hazard_type, route_description, assembly_area, map_url)
values
  ('earthquake', 'Classroom → Hallway → Main Gate → Assembly Area', 'Main Assembly Area', ''),
  ('fire', 'Classroom → Fire Exit → Open Grounds', 'Open Grounds', '')
on conflict do nothing;

insert into public.drills (date, type, duration_mins, staff_present, total_staff, notes, success)
values
  (current_date, 'Orientation Drill', 15, 0, 0, 'Baseline seed drill record.', true)
on conflict do nothing;
