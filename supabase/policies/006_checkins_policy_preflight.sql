-- Preflight only: run and inspect output before applying 007_checkins_policy_revision.sql

-- 1) checkins.staff_id column type
select
  table_schema,
  table_name,
  column_name,
  data_type,
  udt_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'checkins'
  and column_name = 'staff_id';

-- 2) profiles.staff_id column type
select
  table_schema,
  table_name,
  column_name,
  data_type,
  udt_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'profiles'
  and column_name = 'staff_id';

-- 3) staff.id column type
select
  table_schema,
  table_name,
  column_name,
  data_type,
  udt_name
from information_schema.columns
where table_schema = 'public'
  and table_name = 'staff'
  and column_name = 'id';

-- 4) existing checkins policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'checkins'
order by policyname;

-- 5) existing profiles policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'profiles'
order by policyname;

-- 6) existing staff policies
select schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'staff'
order by policyname;

-- 7) existing indexes and constraints relevant to checkins duplicate check
select
  n.nspname as schema_name,
  t.relname as table_name,
  i.relname as index_name,
  pg_get_indexdef(i.oid) as index_def
from pg_class t
join pg_namespace n on n.oid = t.relnamespace
join pg_index x on x.indrelid = t.oid
join pg_class i on i.oid = x.indexrelid
where n.nspname = 'public'
  and t.relname = 'checkins'
order by i.relname;

select
  tc.constraint_name,
  tc.constraint_type,
  kcu.column_name,
  kcu.ordinal_position
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
 and tc.table_schema = kcu.table_schema
 and tc.table_name = kcu.table_name
where tc.table_schema = 'public'
  and tc.table_name = 'checkins'
  and tc.constraint_type in ('PRIMARY KEY', 'UNIQUE')
order by tc.constraint_name, kcu.ordinal_position;
