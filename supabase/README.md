# Supabase RLS for CCES DRRM

This folder contains focused SQL policy files for core CCES DRRM domains.

## Warning

The app is **not public-launch-ready** until these RLS policies are applied in your Supabase project and validated with real role-based test accounts.

## Setup checklist

1. Confirm required tables exist (`profiles`, `alerts`, `incidents`, `checkins`) and are mapped to your app columns.
2. Confirm `profiles.id` maps to `auth.users.id` and includes role/active metadata.
3. Create Storage bucket named `incident-photos` and match its visibility to your URL strategy (see alignment section).
4. Run policy files in order from `supabase/policies/001_profiles.sql` through `005_storage.sql`.
5. Test with at least 3 users: admin, staff/reporter, viewer.
6. Verify forbidden actions fail (self-promotion, non-admin alert write, viewer check-in edits).

## Required tables and assumed columns

### `profiles`
- `id uuid primary key` (same value as `auth.users.id`)
- `staff_id` (type must match/comparably cast to `checkins.staff_id`)
- `role text` (recommended values: `admin`, `staff`, `viewer`)
- `active boolean default true`

### `alerts`
- `id uuid primary key`
- `active boolean` and optional `cancelled_at`

### `incidents`
- `id uuid primary key`
- `reported_by text` (current app behavior)
- future: `reported_by_user_id uuid` for strict ownership RLS

### `checkins`
- `id uuid primary key`
- `staff_id` (must align with `profiles.staff_id` type)

## Known app alignment requirements

- Incident ownership: strict per-user RLS requires `incidents.reported_by_user_id uuid` and client writes of `auth.uid()`.
- Storage visibility: current app uses `getPublicUrl()`, so public bucket is required until signed URLs are implemented.
- Staff ID typing: `profiles.staff_id`, `staff.id`, and `checkins.staff_id` must use compatible types.
- All policies must be applied and tested in Supabase before public launch.

## Required policy outcomes

- Profiles: self-read + admin read-all; admin-only role/active updates; no self-promotion; inactive accounts lose access.
- Alerts: authenticated read; admin-only create/update/cancel; delete only if you intentionally allow it.
- Incidents: authenticated create; current-schema compatible read policy; admin-only status/severity/response updates.
- Check-ins: staff can read/write own linked staff row; admin full control; viewer cannot modify.
- Storage (`incident-photos`): path checks aligned with `incidents/{userId}/{file}` uploads.

## Local testing notes

This repository does not run Supabase SQL automatically in this environment. Apply these scripts manually in **Supabase Dashboard → SQL Editor**.


## Schema baseline apply order

Apply in this order:

1. **Schema**
   - `supabase/schema/001_core_tables.sql`
   - `supabase/schema/002_indexes_constraints.sql`
   - `supabase/schema/003_seed_minimum_reference_data.sql`
2. **Policies**
   - `supabase/policies/001_profiles.sql`
   - `supabase/policies/002_alerts.sql`
   - `supabase/policies/003_incidents.sql`
   - `supabase/policies/004_checkins.sql`
   - `supabase/policies/005_storage.sql`
3. **Manual test**
   - Re-run app flows (alerts, incidents, check-ins, resources, routes, drills) with role-based accounts.

## Baseline scope note

This baseline is a starting point for local/project setup only. It is **not production-ready** until applied and validated in your Supabase project with manual and role-based tests.
