# Supabase Full SQL Audit Report

Date: 2026-05-10  
Scope reviewed: `supabase/schema/*`, `supabase/policies/*`, and SQL migration/policy revision files.  
Execution model: static audit only (no database execution).

## Executive Summary

This audit found several **high-priority security and operability gaps** concentrated in RLS coverage and missing production-grade data model elements. The most critical issue is that multiple tables (`staff`, `drills`, `evacuation_routes`, `resources`) are present in schema but currently have **no RLS policies**, and `staff` is explicitly in scope as sensitive. There are also non-destructive performance and maintainability improvements recommended for indexes, trigger hygiene, and function hardening.

## Inventory Reviewed

- Schema files: `001_core_tables.sql`, `002_indexes_constraints.sql`, `003_seed_minimum_reference_data.sql`
- Policy files: `001_profiles.sql` through `007_checkins_policy_revision.sql`
- SQL objects detected:
  - Tables: `staff`, `profiles`, `alerts`, `incidents`, `checkins`, `resources`, `evacuation_routes`, `drills`
  - Missing from requested audit table list: `hazard_areas` (not present)
  - Helper functions: `active_role()`, `is_admin()`, `current_staff_id_text()`
  - No trigger definitions found in repository SQL scope.

---

## Findings and Recommendations

### 1) `public.staff` has no RLS policies (sensitive table)
- **Object/table affected:** `public.staff`
- **Problem:** Table exists and contains personnel data (`name`, `role`, `contact`, `active`) but no RLS policy file enables/locks access.
- **Risk:** **High** — accidental broad exposure to authenticated/anon if grants are permissive; fails requirement that profiles/staff not be exposed to anon.
- **Exact recommended SQL fix:**

```sql
alter table if exists public.staff enable row level security;

revoke all on public.staff from anon;

drop policy if exists staff_select_admin_only on public.staff;
create policy staff_select_admin_only
on public.staff
for select
to authenticated
using ((select public.is_admin()));

drop policy if exists staff_write_admin_only on public.staff;
create policy staff_write_admin_only
on public.staff
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));
```
- **Priority:** **critical**
- **Separate PR?:** **Yes** (security behavior change)

### 2) `public.resources` has no RLS policies
- **Object/table affected:** `public.resources`
- **Problem:** No RLS policy coverage despite operational inventory data.
- **Risk:** **High** — unintended reads/writes, especially if table grants are broad.
- **Exact recommended SQL fix:**

```sql
alter table if exists public.resources enable row level security;

drop policy if exists resources_select_authenticated on public.resources;
create policy resources_select_authenticated
on public.resources
for select
to authenticated
using ((select public.active_role()) is not null);

drop policy if exists resources_write_admin_only on public.resources;
create policy resources_write_admin_only
on public.resources
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));
```
- **Priority:** **high**
- **Separate PR?:** **Yes**

### 3) `public.evacuation_routes` has no RLS policies
- **Object/table affected:** `public.evacuation_routes`
- **Problem:** No RLS restriction for evacuation route data.
- **Risk:** **medium** — data integrity risk from unauthorized modification.
- **Exact recommended SQL fix:**

```sql
alter table if exists public.evacuation_routes enable row level security;

drop policy if exists evacuation_routes_select_authenticated on public.evacuation_routes;
create policy evacuation_routes_select_authenticated
on public.evacuation_routes
for select
to authenticated
using ((select public.active_role()) is not null);

drop policy if exists evacuation_routes_write_admin_only on public.evacuation_routes;
create policy evacuation_routes_write_admin_only
on public.evacuation_routes
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));
```
- **Priority:** **medium**
- **Separate PR?:** **Yes**

### 4) `public.drills` has no RLS policies
- **Object/table affected:** `public.drills`
- **Problem:** Drill records have no RLS policy coverage.
- **Risk:** **medium** — unauthorized write/defacement risk.
- **Exact recommended SQL fix:**

```sql
alter table if exists public.drills enable row level security;

drop policy if exists drills_select_authenticated on public.drills;
create policy drills_select_authenticated
on public.drills
for select
to authenticated
using ((select public.active_role()) is not null);

drop policy if exists drills_write_admin_only on public.drills;
create policy drills_write_admin_only
on public.drills
for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));
```
- **Priority:** **medium**
- **Separate PR?:** **Yes**

### 5) `public.hazard_areas` table requested but not present
- **Object/table affected:** `public.hazard_areas` (missing)
- **Problem:** Requested target object does not exist in audited schema files.
- **Risk:** **medium** — missing feature foundation; potential app/database mismatch for geospatial hazards.
- **Exact recommended SQL fix:**

```sql
-- Example non-destructive foundation migration (new table) in separate PR:
create table if not exists public.hazard_areas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  hazard_type text not null,
  -- Upgrade to PostGIS geometry in follow-up if extension is approved.
  geojson jsonb,
  active boolean not null default true
);

alter table public.hazard_areas enable row level security;
```
- **Priority:** **medium**
- **Separate PR?:** **Yes**

### 6) Checkins has potential duplicate-index candidate
- **Object/table affected:** `public.checkins` indexes
- **Problem:** Both unique constraint index (`checkins_staff_date_unique`) and explicit `idx_checkins_staff_date` exist on same key order.
- **Risk:** **medium** — unnecessary write overhead and storage usage.
- **Exact recommended SQL fix:**

```sql
-- Verify both indexes map to identical key definitions first.
-- If identical, keep constraint-backed index and drop redundant non-constraint index.
drop index if exists public.idx_checkins_staff_date;
```
- **Priority:** **medium**
- **Separate PR?:** **Yes** (performance schema cleanup)

### 7) `incidents.reported_by` text ownership model limits least-privilege design
- **Object/table affected:** `public.incidents`
- **Problem:** Ownership is textual (`reported_by text`), preventing robust user-bound ownership policy.
- **Risk:** **high** — weak attribution and future policy ambiguity.
- **Exact recommended SQL fix:**

```sql
alter table public.incidents
  add column if not exists reported_by_user_id uuid references auth.users(id);

create index if not exists idx_incidents_reported_by_user_id
  on public.incidents (reported_by_user_id);

-- After client cutover + backfill, tighten SELECT policy in a follow-up migration.
```
- **Priority:** **high**
- **Separate PR?:** **Yes**

### 8) Function hardening: enforce explicit role ownership + EXECUTE scope review
- **Object/table affected:** `public.active_role()`, `public.is_admin()`, `public.current_staff_id_text()`
- **Problem:** Functions are correctly marked `SECURITY DEFINER` with search_path set, but ownership and EXECUTE grants should be standardized and periodically asserted.
- **Risk:** **medium** — if function owner drifts to untrusted role, privilege boundary weakens.
- **Exact recommended SQL fix:**

```sql
-- Ensure trusted ownership (example role: postgres)
alter function public.active_role() owner to postgres;
alter function public.is_admin() owner to postgres;
alter function public.current_staff_id_text() owner to postgres;

revoke all on function public.active_role() from public;
revoke all on function public.is_admin() from public;
revoke all on function public.current_staff_id_text() from public;

grant execute on function public.active_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.current_staff_id_text() to authenticated;
```
- **Priority:** **medium**
- **Separate PR?:** **Yes**

### 9) Trigger/function logic gaps: no automated profile bootstrap or `updated_at` maintenance
- **Object/table affected:** `profiles`, `alerts`, `incidents`, `checkins`, `drills`, `evacuation_routes`, `resources`, `staff`
- **Problem:** No SQL triggers found for `handle_new_user` or generic `updated_at` mutation tracking.
- **Risk:** **medium** — onboarding fragility and weaker auditability.
- **Exact recommended SQL fix:**

```sql
-- Example: add updated_at and trigger in separate migration.
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- handle_new_user (example) should be defined and attached to auth.users insert path.
```
- **Priority:** **medium**
- **Separate PR?:** **Yes**

### 10) Anonymous access posture needs explicit table-level deny policies where required
- **Object/table affected:** `profiles`, `staff`, and non-public operational tables
- **Problem:** `checkins` has explicit anon deny policies in revision file, but comparable explicit deny is not standardized across other tables.
- **Risk:** **low/medium** — future grants or policy drift can reopen access unintentionally.
- **Exact recommended SQL fix:**

```sql
-- Example explicit deny for anon on sensitive tables.
create policy profiles_select_anon_block
on public.profiles
for select
to anon
using (false);

create policy staff_select_anon_block
on public.staff
for select
to anon
using (false);
```
- **Priority:** **low**
- **Separate PR?:** **Yes**

---

## RLS Audit Matrix (Current State)

| Table | RLS Enabled in Repo SQL | Policies Present | Key Notes |
|---|---:|---:|---|
| `profiles` | Yes | Yes | Admin + self update protections present. |
| `staff` | No evidence | No | Sensitive table; gap. |
| `alerts` | Yes | Yes | Auth read/admin write pattern. |
| `incidents` | Yes | Yes | Auth read due to text reporter compatibility. |
| `checkins` | Yes | Yes | Revised policies include anon-block + SELECT-wrapped helper calls. |
| `drills` | No evidence | No | Gap. |
| `evacuation_routes` | No evidence | No | Gap. |
| `hazard_areas` | N/A | N/A | Table missing. |
| `resources` | No evidence | No | Gap. |

---

## Migration Safety and Sequencing (No Execution)

Recommended safe migration PR sequence:
1. **PR-A (Critical Security):** add/enable RLS + policies for `staff`, `resources`, `drills`, `evacuation_routes`, explicit anon blocks for sensitive tables.
2. **PR-B (Ownership Hardening):** add `incidents.reported_by_user_id`, backfill strategy, policy tightening after client cutover.
3. **PR-C (Index Cleanup):** remove duplicate `idx_checkins_staff_date` only after verifying constraint-backed equivalent.
4. **PR-D (Triggers/Auditability):** add `updated_at` columns/triggers and optional user-bootstrap (`handle_new_user`) function.
5. **PR-E (Platform Features):** add `hazard_areas`, PostGIS readiness, and production ops entities.

All above are **non-destructive when implemented carefully**, but each changes behavior and should be isolated with rollback notes.

---

## Production Gap Assessment

1. **Notification delivery tracking**
   - Gap: No `notification_deliveries` table for send status/attempt counts/errors.
   - Recommendation: add durable event table with provider metadata and retry state.

2. **Audit logs**
   - Gap: No immutable `audit_logs` table for admin actions / policy-sensitive updates.
   - Recommendation: append-only log table + trigger/function instrumentation.

3. **Geospatial/PostGIS needs**
   - Gap: hazards/routes currently text-first; no geometry type usage.
   - Recommendation: planned PostGIS extension and geometry columns for hazard polygons and route lines.

4. **On-call schedule**
   - Gap: no staffing schedule table to support incident escalation.
   - Recommendation: `on_call_rotations` + `on_call_assignments` with date ranges.

5. **Anonymous public incident reporting**
   - Gap: current incident insert policy is authenticated-only.
   - Recommendation: add moderated `public_reports` intake table (anon insert only, no select) and admin triage flow.

6. **Multi-barangay / multi-LGU tenancy**
   - Gap: no tenant/entity boundary columns or policies.
   - Recommendation: introduce `organization_id` keys and tenant-scoped RLS predicates before scaling.

---

## Notes on Policy Quality Checks

- No `USING true`/`WITH CHECK true` write-open patterns detected in reviewed RLS files.
- Newer checkins revision uses `SELECT` wrappers for helper/auth calls, which aligns with Supabase RLS performance recommendations.
- Duplicate permissive policy risk is actively mitigated in `007_checkins_policy_revision.sql` via explicit `DROP POLICY IF EXISTS` before re-creation.


## Follow-up status

Critical RLS hardening for `staff`, `resources`, `drills`, and `evacuation_routes` is addressed by:
- `supabase/policies/008_operational_tables_rls_preflight.sql`
- `supabase/policies/008_operational_tables_rls_hardening.sql`

These migrations must be applied manually in the Supabase SQL Editor after preflight review.
