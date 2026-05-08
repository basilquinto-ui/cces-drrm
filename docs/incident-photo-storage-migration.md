# Incident Photo Storage Migration (Public URL -> Private Bucket + Signed URL)

## Goal
Move `incident-photos` storage from public-read behavior to private bucket access, while keeping mobile incident submission working.

## Current and target behavior
- **Legacy behavior:** mobile uploads and stores a public `photo_url` generated from `getPublicUrl(...)`.
- **Target behavior:** mobile uploads to `incident-photos` and stores the object path (for example `incidents/{userId}/{timestamp}.jpg`).
- **Read behavior during migration:**
  - If stored value is already a public URL, keep using it.
  - If stored value is an object path, create a signed URL at read time.

## Upload path policy
The upload path remains:
- `incidents/{userId}/{timestamp}.jpg`

This keeps compatibility with existing storage policy assumptions and folder structure.

## Signed URL flow
1. Upload image to `incident-photos` using object path naming above.
2. Store path string in the incident photo field during migration.
3. When rendering/downloading photo, call a helper that:
   - returns value unchanged if it is already an absolute URL, or
   - requests `createSignedUrl(path, expiresInSeconds)` when it is a storage path.

## Bucket privacy change plan
1. Deploy and verify signed URL read flow in all clients that consume incident photos.
2. Backfill or normalize existing records if needed.
3. Set `incident-photos` bucket to **private**.
4. Re-run QA for incident submission, incident listing, and image view/download.

## Field migration guidance (`photo_url` -> path/signed URL strategy)
To avoid a breaking schema migration, keep using current field name (`photo_url`) temporarily:
- store path values for new uploads,
- keep legacy public URLs untouched,
- resolve both formats at read time.

Later, optionally migrate schema to a clearer name (for example `photo_path`) once all consumers are updated.
