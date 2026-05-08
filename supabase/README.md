# Supabase RLS for CCES DRRM

This folder contains focused SQL policy files for core CCES DRRM domains.

## Warning

The app is **not public-launch-ready** until these RLS policies are applied in your Supabase project and validated with real role-based test accounts.

## Setup checklist

1. Confirm required tables exist (`profiles`, `alerts`, `incidents`, `checkins`) and are mapped to your app columns.
2. Confirm `profiles.id` maps to `auth.users.id` and includes role/active metadata.
3. Create a **private** Storage bucket named `incident-photos`.
4. Run policy files in order from `supabase/policies/001_profiles.sql` through `005_storage.sql`.
5. Test with at least 3 users: admin, staff/reporter, viewer.
6. Verify forbidden actions fail (self-promotion, non-admin alert write, non-owner photo reads, viewer check-in edits).

## Required tables and assumed columns

### `profiles`
- `id uuid primary key` (same value as `auth.users.id`)
- `staff_id uuid null`
- `role text` (recommended values: `admin`, `staff`, `viewer`)
- `active boolean default true`
- optional audit fields (`created_at`, `updated_at`)

### `alerts`
- `id uuid primary key`
- `active boolean` and optional `cancelled_at`
- any app alert payload columns

### `incidents`
- `id uuid primary key`
- `reported_by uuid` (should map to `auth.users.id`)
- status/severity and response/admin fields used by your workflow

### `checkins`
- `id uuid primary key`
- `staff_id uuid`
- status/timestamp fields used by your workflow

## Required policy outcomes

- Profiles: self-read + admin read-all; admin-only role/active updates; no self-promotion; inactive accounts lose access.
- Alerts: authenticated read; admin-only create/update/cancel; delete only if you intentionally allow it.
- Incidents: authenticated create; reporter read-own; admin read-all; admin-only status/severity/response updates.
- Check-ins: staff can write only own linked staff row; admin full control; viewer cannot modify.
- Storage (`incident-photos`): private bucket, owner-path upload/read, admin read-all.

## Local testing notes

This repository does not run Supabase SQL automatically in this environment. Apply these scripts manually in **Supabase Dashboard → SQL Editor**.

Suggested quick test flow:
- Open SQL editor, run each file sequentially.
- Use Supabase policy tester or client sessions for admin/staff/viewer.
- Validate both allowed and denied operations before deploying.
