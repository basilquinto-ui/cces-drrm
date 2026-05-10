select to_regclass('public.public_safety_updates') as table_exists;

select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where oid = 'public.public_safety_updates'::regclass;

select policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public' and tablename = 'public_safety_updates'
order by policyname;

select grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name = 'public_safety_updates'
order by grantee, privilege_type;

select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'public_safety_updates'
order by ordinal_position;
