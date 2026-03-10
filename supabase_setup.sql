-- ============================================
-- CCES DRRM Portal — Supabase SQL Setup
-- Run this in Supabase > SQL Editor > New Query
-- ============================================

-- 1. STAFF TABLE
create table if not exists staff (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  role text not null,
  contact text,
  active boolean default true
);

-- 2. ALERTS TABLE
create table if not exists alerts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  hazard_type text not null,
  level text not null check (level in ('drill','watch','warning','emergency')),
  message text not null,
  issued_by text not null,
  active boolean default true,
  cancelled_at timestamptz
);

-- 3. INCIDENTS TABLE
create table if not exists incidents (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  location text not null,
  hazard_type text not null,
  description text not null,
  severity text not null check (severity in ('minor','moderate','severe')),
  photo_url text,
  status text default 'reported' check (status in ('reported','acknowledged','responding','resolved')),
  reported_by text not null,
  admin_notes text
);

-- 4. CHECKINS TABLE
create table if not exists checkins (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  staff_id uuid references staff(id) on delete cascade,
  date date default current_date,
  status text not null check (status in ('safe','medical','evacuation','unknown')),
  checked_in_at timestamptz default now(),
  unique(staff_id, date)
);

-- 5. RESOURCES TABLE
create table if not exists resources (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  category text not null,
  quantity integer default 0,
  location text not null,
  condition text default 'good' check (condition in ('good','low','replace')),
  last_checked date default current_date
);

-- 6. EVACUATION ROUTES TABLE
create table if not exists evacuation_routes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  hazard_type text not null,
  route_description text not null,
  assembly_area text not null,
  map_url text
);

-- 7. HAZARD AREAS TABLE
create table if not exists hazard_areas (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  icon text default '📍',
  risk_level text not null check (risk_level in ('high','moderate','low','safe')),
  risk_score integer default 50 check (risk_score between 0 and 100),
  description text,
  observations jsonb default '[]',
  assessed_by text,
  assessed_date date default current_date
);

-- 8. DRILLS TABLE
create table if not exists drills (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  date date not null,
  type text not null,
  duration_mins integer,
  staff_present integer,
  total_staff integer,
  notes text,
  success boolean default true
);

-- ============================================
-- SEED DATA — Default staff
-- ============================================
insert into staff (name, role, contact) values
  ('Mrs. Paz Jimenez', 'School Principal', ''),
  ('Mr. Freddie Soriano', 'DRRM Coordinator', ''),
  ('Mrs. Maria Santos', 'Grade 1 Teacher', ''),
  ('Mr. Jose Reyes', 'Grade 2 Teacher', ''),
  ('Mrs. Ana Cruz', 'Grade 3 Teacher', ''),
  ('Mr. Carlo Dela Cruz', 'Grade 4 Teacher', ''),
  ('Mrs. Rosa Gonzales', 'Grade 5 Teacher', ''),
  ('Mr. Pedro Flores', 'Grade 6 Teacher', ''),
  ('Mrs. Lina Bautista', 'MAPEH Teacher', ''),
  ('Mr. Marco Villanueva', 'Math Teacher', ''),
  ('Mrs. Perla Mendoza', 'Science Teacher', ''),
  ('Mr. Ramon Garcia', 'Filipino Teacher', ''),
  ('Mrs. Celia Torres', 'English Teacher', ''),
  ('Mr. Danny Ramos', 'Values Teacher', ''),
  ('Mrs. Nora Aquino', 'School Nurse', ''),
  ('Mr. Bert Castillo', 'Security Guard', '');

-- ============================================
-- SEED DATA — Default hazard areas
-- ============================================
insert into hazard_areas (name, icon, risk_level, risk_score, description, observations, assessed_by, assessed_date) values
  ('Main Building', '🏫', 'high', 85, 'High risk of structural damage during earthquakes. Older construction — priority evacuation zone.', '["Structural cracks on 2nd floor","Near fault line trajectory","Ceiling tiles loose in Rooms 4-6"]', 'Mr. Freddie Soriano', current_date),
  ('Gymnasium', '🏟️', 'low', 25, 'Low risk overall. Open structure handles seismic activity well. Used as typhoon shelter.', '["Solid reinforced structure","Wide open exits on 4 sides","Currently used as typhoon shelter"]', 'Mr. Freddie Soriano', current_date),
  ('Canteen', '🍽️', 'moderate', 55, 'Moderate flood risk during heavy rains. Ground level with poor drainage nearby.', '["Ground floor flooding reported","Drainage blocked near east wall","Food stocks should be elevated"]', 'Mr. Freddie Soriano', current_date),
  ('Flagpole Area', '🚩', 'safe', 5, 'Designated primary assembly area. Open space, away from all structures.', '["Primary earthquake assembly area","Clear line of sight for headcount","No overhead hazards"]', 'Mr. Freddie Soriano', current_date),
  ('Library', '📚', 'moderate', 45, 'Moderate risk. Heavy shelving units could fall during seismic events.', '["Unsecured bookshelves on east wall","Glass windows face the street","Good structural integrity"]', 'Mr. Freddie Soriano', current_date),
  ('Clinic', '🏥', 'low', 15, 'Low risk. Reinforced walls. Critical for emergency medical response.', '["Reinforced walls and ceiling","Emergency supplies stocked","Direct access from main gate"]', 'Mr. Freddie Soriano', current_date);

-- ============================================
-- SEED DATA — Default resources
-- ============================================
insert into resources (name, category, quantity, location, condition, last_checked) values
  ('First Aid Kits', 'medical', 5, 'Clinic', 'good', current_date),
  ('Emergency Medical Bag', 'medical', 1, 'Principal Office', 'good', current_date),
  ('Bandage Rolls', 'medical', 3, 'Clinic', 'low', current_date),
  ('Fire Extinguishers', 'fire', 5, 'Hallways & Canteen', 'good', current_date),
  ('Fire Sand Buckets', 'fire', 2, 'Canteen Area', 'replace', current_date),
  ('Megaphones', 'equipment', 2, 'Principal Office', 'good', current_date),
  ('Flashlights', 'equipment', 8, 'Storage Room', 'good', current_date),
  ('Water Containers 20L', 'supplies', 4, 'Storage Room', 'low', current_date),
  ('Emergency Food Packs', 'supplies', 20, 'Storage Room', 'good', current_date),
  ('Rope / Lifeline', 'equipment', 2, 'Storage Room', 'good', current_date);

-- ============================================
-- SEED DATA — Evacuation routes
-- ============================================
insert into evacuation_routes (hazard_type, route_description, assembly_area, map_url) values
  ('earthquake', 'Classroom → Hallway → Main Gate → Flagpole Area', 'Flagpole Assembly Area', 'https://maps.google.com/?q=Camp+Crame+Elementary+School+Quezon+City'),
  ('fire', 'Classroom → Fire Exit → Side Gate → Quadrangle', 'Quadrangle / Grounds', 'https://maps.google.com/?q=Camp+Crame+Elementary+School+Quezon+City'),
  ('flood', 'Ground Floor → Stairwell → 2nd Floor Assembly', '2nd Floor Assembly Point', ''),
  ('typhoon', 'Outdoor Areas → Indoors → Multi-Purpose Hall', 'Multi-Purpose Hall / Gymnasium', '');

-- ============================================
-- SEED DATA — Drill history
-- ============================================
insert into drills (date, type, duration_mins, staff_present, total_staff, notes, success) values
  ('2026-03-01', 'Earthquake Drill (Q1)', 45, 24, 24, 'Duck, Cover, Hold. All staff participated. Successful.', true),
  ('2026-01-15', 'Fire Drill', 30, 22, 24, 'Evacuation procedures. 2 staff absent.', true),
  ('2025-11-10', 'Typhoon Preparedness', 20, 24, 24, 'Shelter-in-place. All staff participated.', true),
  ('2025-09-05', 'Earthquake Drill (Q3)', 60, 23, 24, 'Full evacuation. 1 staff absent.', true);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Enable so only authenticated users can write
-- but anyone can read (for check-ins)
-- ============================================
alter table staff enable row level security;
alter table alerts enable row level security;
alter table incidents enable row level security;
alter table checkins enable row level security;
alter table resources enable row level security;
alter table evacuation_routes enable row level security;
alter table hazard_areas enable row level security;
alter table drills enable row level security;

-- Allow anyone to READ all tables (staff need to read without login)
create policy "Public read staff" on staff for select using (true);
create policy "Public read alerts" on alerts for select using (true);
create policy "Public read incidents" on incidents for select using (true);
create policy "Public read checkins" on checkins for select using (true);
create policy "Public read resources" on resources for select using (true);
create policy "Public read evacuation_routes" on evacuation_routes for select using (true);
create policy "Public read hazard_areas" on hazard_areas for select using (true);
create policy "Public read drills" on drills for select using (true);

-- Allow anyone to INSERT checkins (teachers check in without login)
create policy "Public insert checkins" on checkins for insert with check (true);
create policy "Public upsert checkins" on checkins for update using (true);

-- Allow anyone to INSERT incidents (teachers report without login)
create policy "Public insert incidents" on incidents for insert with check (true);

-- Allow authenticated (admin) to do everything else
create policy "Auth full access staff" on staff for all using (auth.role() = 'authenticated');
create policy "Auth full access alerts" on alerts for all using (auth.role() = 'authenticated');
create policy "Auth update incidents" on incidents for update using (auth.role() = 'authenticated');
create policy "Auth delete incidents" on incidents for delete using (auth.role() = 'authenticated');
create policy "Auth full access resources" on resources for all using (auth.role() = 'authenticated');
create policy "Auth full access evacuation" on evacuation_routes for all using (auth.role() = 'authenticated');
create policy "Auth full access hazard" on hazard_areas for all using (auth.role() = 'authenticated');
create policy "Auth full access drills" on drills for all using (auth.role() = 'authenticated');
