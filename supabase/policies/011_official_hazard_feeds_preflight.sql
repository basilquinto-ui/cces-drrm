select to_regclass('public.official_advisories') as official_advisories_table;
select to_regclass('public.earthquake_events') as earthquake_events_table;
select to_regclass('public.feed_sync_logs') as feed_sync_logs_table;

select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where oid in (
  'public.official_advisories'::regclass,
  'public.earthquake_events'::regclass,
  'public.feed_sync_logs'::regclass
)
order by relname;

select tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('official_advisories', 'earthquake_events', 'feed_sync_logs')
order by tablename, policyname;

select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('official_advisories', 'earthquake_events', 'feed_sync_logs')
order by table_name, grantee, privilege_type;

select table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('official_advisories', 'earthquake_events', 'feed_sync_logs')
order by table_name, ordinal_position;
