-- 005_storage.sql
-- Storage RLS for bucket: incident-photos
-- Recommendation: keep this bucket private and serve files via signed URLs.

-- NOTE: In Supabase dashboard, set bucket "incident-photos" to PRIVATE.

-- Upload only to own folder: <auth.uid()>/<filename>
drop policy if exists incident_photos_insert_own_folder on storage.objects;
create policy incident_photos_insert_own_folder
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'incident-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Reporter can read only objects inside own folder.
drop policy if exists incident_photos_select_own_folder on storage.objects;
create policy incident_photos_select_own_folder
on storage.objects
for select
to authenticated
using (
  bucket_id = 'incident-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Admins can read all incident photos.
drop policy if exists incident_photos_select_admin_all on storage.objects;
create policy incident_photos_select_admin_all
on storage.objects
for select
to authenticated
using (
  bucket_id = 'incident-photos'
  and public.is_admin()
);

-- Optional hardening: only owner folder or admins can delete/replace.
drop policy if exists incident_photos_update_owner_or_admin on storage.objects;
create policy incident_photos_update_owner_or_admin
on storage.objects
for update
to authenticated
using (
  bucket_id = 'incident-photos'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
)
with check (
  bucket_id = 'incident-photos'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

drop policy if exists incident_photos_delete_owner_or_admin on storage.objects;
create policy incident_photos_delete_owner_or_admin
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'incident-photos'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);
