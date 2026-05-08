-- CCES DRRM Supabase schema baseline (core tables)
-- Apply first.

create extension if not exists pgcrypto;

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  role text not null,
  contact text,
  active boolean not null default true
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  full_name text,
  role text not null default 'staff' check (role in ('admin', 'staff', 'viewer')),
  staff_id uuid references public.staff(id) on delete set null,
  active boolean not null default true
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  hazard_type text not null,
  level text not null check (level in ('drill', 'watch', 'warning', 'emergency')),
  message text not null,
  issued_by text not null,
  active boolean not null default true,
  cancelled_at timestamptz
);

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  location text not null,
  hazard_type text not null,
  description text not null,
  severity text not null check (severity in ('minor', 'moderate', 'severe')),
  photo_url text,
  status text not null default 'reported' check (status in ('reported', 'acknowledged', 'responding', 'resolved')),
  reported_by text not null,
  admin_notes text
);

comment on table public.incidents is 'Current app writes incidents.reported_by (text). Future migration path: add nullable reported_by_user_id uuid references auth.users(id) and backfill from profile mapping before enabling strict per-user ownership rules.';

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  date date not null default current_date,
  status text not null check (status in ('safe', 'medical', 'evacuation', 'unknown')),
  checked_in_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  category text not null,
  quantity integer not null default 0,
  location text not null,
  condition text not null default 'good' check (condition in ('good', 'low', 'replace')),
  last_checked date not null default current_date
);

create table if not exists public.evacuation_routes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  hazard_type text not null,
  route_description text not null,
  assembly_area text not null,
  map_url text
);

create table if not exists public.drills (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  date date not null,
  type text not null,
  duration_mins integer,
  staff_present integer,
  total_staff integer,
  notes text,
  success boolean not null default true
);
