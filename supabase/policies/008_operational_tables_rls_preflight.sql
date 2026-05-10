-- Preflight only: inspect current RLS/policies/grants/columns before applying
-- 008_operational_tables_rls_hardening.sql

-- 1) RLS status for operational tables
select
  n.nspname as table_schema,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in ('staff', 'resources', 'drills', 'evacuation_routes')
order by c.relname;

-- 2) Existing policies for operational tables
select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('staff', 'resources', 'drills', 'evacuation_routes')
order by tablename, policyname;

-- 3) Current grants for anon/authenticated on operational tables
select
  table_schema,
  table_name,
  grantee,
  privilege_type,
  is_grantable
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('staff', 'resources', 'drills', 'evacuation_routes')
  and grantee in ('anon', 'authenticated')
order by table_name, grantee, privilege_type;

-- 4) Column inventory for operational tables
select
  table_schema,
  table_name,
  ordinal_position,
  column_name,
  data_type,
  udt_name,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('staff', 'resources', 'drills', 'evacuation_routes')
order by table_name, ordinal_position;
