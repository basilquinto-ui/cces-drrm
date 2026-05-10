begin;

create table if not exists public.official_advisories (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  advisory_type text not null,
  warning_level text not null,
  source text not null,
  title text not null,
  message text not null,
  affected_area text,
  location_tags text[] default '{}'::text[],
  relevance_scope text default 'quezon_city',
  is_relevant_to_school boolean not null default true,
  source_url text,
  effective_at timestamptz,
  expires_at timestamptz,
  active boolean not null default true,
  published_publicly boolean not null default false,
  created_by uuid references auth.users(id),
  constraint official_advisories_advisory_type_check check (advisory_type in ('typhoon','rainfall','thunderstorm','flood','heat_index','general_weather')),
  constraint official_advisories_warning_level_check check (warning_level in ('none','monitoring','yellow','orange','red','signal_1','signal_2','signal_3_plus')),
  constraint official_advisories_source_check check (source in ('pagasa','lgu','school_drrm','manual'))
);

create table if not exists public.earthquake_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_time timestamptz not null,
  magnitude numeric,
  depth_km numeric,
  location text not null,
  latitude numeric,
  longitude numeric,
  intensity text,
  distance_km numeric,
  relevance_scope text default 'quezon_city',
  is_relevant_to_school boolean not null default true,
  bulletin_title text,
  bulletin_url text,
  source text not null default 'phivolcs',
  raw_payload jsonb,
  active boolean not null default true,
  published_publicly boolean not null default false,
  constraint earthquake_events_source_check check (source in ('phivolcs','manual','school_drrm'))
);

create table if not exists public.feed_sync_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null,
  status text not null,
  message text,
  last_synced_at timestamptz,
  metadata jsonb
);

create index if not exists idx_official_advisories_active_scope on public.official_advisories (active, relevance_scope, is_relevant_to_school);
create index if not exists idx_earthquake_events_active_scope_time on public.earthquake_events (active, relevance_scope, is_relevant_to_school, event_time desc);
create index if not exists idx_feed_sync_logs_source_created_at on public.feed_sync_logs (source, created_at desc);

commit;
