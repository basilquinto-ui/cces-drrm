# Role Security Manual QA Test Plan

## Purpose
This checklist verifies Supabase schema alignment, Row Level Security (RLS) behavior, role-based web controls, and mobile app behavior after applying schema and policy SQL.

## Scope and constraints
- Manual QA only (no code changes).
- Applies after database schema and policy SQL have been deployed.
- Focused on role/authorization correctness and key user flows.

## Required test accounts
Prepare and verify these accounts before testing:

1. **admin**
   - `profile.role = admin`
   - `profile.active = true`
   - linked `staff_id` optional
2. **staff**
   - `profile.role = staff`
   - `profile.active = true`
   - linked `staff_id` required
3. **viewer**
   - `profile.role = viewer`
   - `profile.active = true`
4. **inactive admin**
   - `profile.role = admin`
   - `profile.active = false`
5. **staff without staff_id**
   - `profile.role = staff`
   - `profile.active = true`
   - `staff_id = null`

## Test setup and evidence
- Record test date/time, app build/commit, and Supabase project/environment.
- For each test, capture result as **Pass/Fail**, plus screenshot/log snippet where relevant.
- Execute every area on:
  - Web app (desktop browser)
  - Mobile app (Expo Go and at least one physical device)

---

## A. Login and profile loading

### A1. Web login
- [ ] Login succeeds for admin, staff, viewer, inactive admin, and staff-without-staff_id.
- [ ] Session is created and app routes to authenticated area.

### A2. Mobile login
- [ ] Login succeeds for the same five accounts on mobile.
- [ ] Session persists across app restart.

### A3. Role display
- [ ] Web displays role correctly for admin/staff/viewer.
- [ ] Mobile displays role correctly for admin/staff/viewer.

### A4. Inactive profile handling
- [ ] Inactive admin is blocked from privileged actions.
- [ ] Inactive admin does not receive admin controls in web UI.
- [ ] Any inactive-state messaging is clear and consistent across web/mobile.

---

## B. Alerts

### B1. Admin write access
- [ ] Active admin can create an alert successfully.
- [ ] Created alert is visible to other authenticated roles.

### B2. Staff/viewer read access
- [ ] Staff can read alerts.
- [ ] Viewer can read alerts.

### B3. Staff/viewer write restrictions
- [ ] Staff cannot create alerts.
- [ ] Viewer cannot create alerts.
- [ ] Staff cannot update alerts.
- [ ] Viewer cannot update alerts.
- [ ] Staff cannot cancel alerts.
- [ ] Viewer cannot cancel alerts.
- [ ] Unauthorized attempts are denied by RLS (not just hidden in UI).

---

## C. Incidents

### C1. Submit incident (all authenticated users)
- [ ] Admin can submit an incident.
- [ ] Staff can submit an incident.
- [ ] Viewer can submit an incident.

### C2. Update incident status (admin only)
- [ ] Active admin can update incident status.
- [ ] Staff cannot update incident status.
- [ ] Viewer cannot update incident status.
- [ ] Inactive admin cannot update incident status.

### C3. Ownership note validation
- [ ] Confirm current behavior matches compatibility mode expectations.
- [ ] Document that incident ownership remains compatibility mode until `reported_by_user_id` exists.

---

## D. Check-ins

### D1. Staff with staff_id
- [ ] Staff account with linked `staff_id` can submit check-in.
- [ ] Staff can read own check-in records.

### D2. Staff without staff_id
- [ ] Staff account without `staff_id` is blocked from check-in submission.
- [ ] Block is enforced by policy/validation (not only UI).

### D3. Viewer restrictions
- [ ] Viewer cannot submit check-ins.

### D4. Admin management
- [ ] Active admin can read check-ins.
- [ ] Active admin can manage check-ins per intended admin capabilities.

---

## E. Storage

### E1. Incident photo upload path
- [ ] Authenticated user can upload incident photo with current path pattern:
  - `incidents/{userId}/{timestamp}.jpg`

### E2. Folder isolation
- [ ] User cannot upload into another user’s folder.
- [ ] RLS/storage policy denies cross-user writes.

### E3. Public URL behavior (current app)
- [ ] Verify bucket/public-read behavior supports current `getPublicUrl()` usage.
- [ ] Confirm uploaded incident photo is retrievable only as intended by current design.

### E4. Future signed URL test placeholder
- [ ] Add follow-up QA case for signed URL read/write access when feature is implemented.

---

## F. Web admin UI

### F1. Active admin
- [ ] Active admin sees admin controls.

### F2. Staff role
- [ ] Staff does not see admin controls.

### F3. Viewer role
- [ ] Viewer does not see admin controls.

### F4. Inactive admin
- [ ] Inactive admin does not get admin controls.

---

## G. Mobile app

### G1. Core screens and flows
- [ ] Dashboard loads.
- [ ] Alerts screen loads.
- [ ] Incident report submits.
- [ ] More/Operations screen loads.

### G2. Check-in behavior by role
- [ ] Check-in submits for staff with linked `staff_id`.
- [ ] Check-in is blocked for staff without `staff_id`.
- [ ] Check-in is blocked for viewer.

---

## RLS verification checklist (cross-cutting)
For every denied action above, verify denial is coming from backend policy enforcement.

- [ ] Attempt unauthorized writes via client flow and verify failure.
- [ ] If possible, reproduce one denied write via direct API/SQL client using same user token.
- [ ] Confirm error response indicates authorization/policy denial.
- [ ] Ensure no unauthorized write succeeds through alternate endpoint.

---

## Launch gate (must-pass)
**Do not public launch until all of the following are true:**

- [ ] All tests in this plan pass.
- [ ] Real admin/staff/viewer accounts are verified.
- [ ] RLS denies unauthorized writes.
- [ ] Expo Go and physical device testing pass.
- [ ] Incident photo strategy is finalized.
- [ ] Backup/export plan exists.

## Sign-off
- QA owner:
- Date:
- Environment:
- Notes/Risks:
