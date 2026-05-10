create table if not exists public.public_safety_updates (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  message text not null,
  category text not null default 'general',
  severity text not null default 'info',
  source text not null default 'school_drrm',
  active boolean not null default true,
  published boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references auth.users(id)
);
