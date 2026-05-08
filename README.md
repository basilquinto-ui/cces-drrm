# CCES DRRM Portal

**Camp Crame Elementary School — Disaster Risk Reduction and Management Portal**

Built with React + Vite + Supabase + Vercel

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env` and fill in your keys:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_WEATHER_API_KEY=your_openweathermap_key
```

### 3. Set up Supabase
- Go to supabase.com → your project → SQL Editor
- Run the contents of `supabase_setup.sql`
- This creates all tables + seeds default data

### 4. Set up Supabase Storage
- Go to Storage → New bucket → name it `incident-photos` → set to **Private** (recommended)

### 5. Create admin account
- Go to Supabase → Authentication → Users → Invite user
- Use your admin email + password
- This is what you use to log in to the Admin Panel

### 6. Replace the logo
- Replace `src/assets/logo.png` with the actual CCES logo file

### 7. Run locally
```bash
npm run dev
```
Open http://localhost:5173

---

## 📦 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables → add all 4 from .env
```

Or connect your GitHub repo to Vercel for automatic deploys on every push.

---

## 🗄️ Database Tables

| Table | Purpose |
|---|---|
| `staff` | School staff list |
| `alerts` | Emergency alerts |
| `incidents` | Incident reports |
| `checkins` | Daily staff check-ins |
| `resources` | Emergency supply inventory |
| `evacuation_routes` | Hazard-specific routes |
| `hazard_areas` | Campus area risk assessments |
| `drills` | Drill history log |

---

## 🔑 API Keys Needed

| Service | URL | Cost |
|---|---|---|
| Supabase | supabase.com | Free |
| Google Gemini | aistudio.google.com | Free |
| OpenWeatherMap | openweathermap.org | Free |
| Vercel | vercel.com | Free |

---

## 📱 Features

- ✅ Real-time weather (OpenWeatherMap)
- ✅ Animated weather header + weather card
- ✅ Daily hazard map with add/edit/delete areas
- ✅ Incident reporting with AI photo description (Gemini)
- ✅ Staff check-in system
- ✅ Emergency alerts
- ✅ Resource inventory management
- ✅ Emergency contacts (one-tap call)
- ✅ Evacuation routes
- ✅ Drill history
- ✅ Admin panel with Supabase Auth
- ✅ Deployable to Vercel

---

## 🏫 School Info

- **Name:** Camp Crame Elementary School
- **Address:** Castañeda St., Camp Crame, Brgy. Bagong Lipunan ng Crame, QC
- **Contact:** (02) 7754-2648
- **District:** QC District XVII · Est. 1952

---

## 👤 Required `profiles` table

The app expects every authenticated account to have an optional row in `profiles` with this schema:

- `id uuid references auth.users(id)`
- `full_name text`
- `role text check (role in ('admin','staff','viewer'))`
- `staff_id text null`
- `active boolean default true`

Example SQL:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin','staff','viewer')),
  staff_id text null,
  active boolean not null default true
);
```

If a profile row does not exist, the UI falls back to `viewer` role.

## 🔒 RLS is required (UI checks are not enough)

Client-side role checks only control what users can see/click. You must enforce the same rules in Supabase Row Level Security policies:

- Admin-only alert create/update
- Admin-only incident verification/status update
- Staff own check-in
- Authenticated incident submit

Without RLS, non-admin users can still call Supabase APIs directly.

---

## 🛡️ Supabase RLS security migration (required)

Use the policy set in `supabase/policies/` for production-style access control:

1. `001_profiles.sql`
2. `002_alerts.sql`
3. `003_incidents.sql`
4. `004_checkins.sql`
5. `005_storage.sql`

### Required policy outcomes checklist

- Profiles: self-read + admin read-all; admin-only role/active updates; no self-promotion; inactive users lose access.
- Alerts: authenticated read; admin-only create/update/cancel; hard delete disabled by default.
- Incidents: authenticated create; reporter read-own; admin read-all; admin-only escalation/status updates.
- Check-ins: staff can write only their own linked `staff_id`; admin can read/reset/update all; viewers cannot modify.
- Storage (`incident-photos`): private bucket, owner-folder upload/read, admin read-all.

### Supabase setup checklist (security)

- Ensure `profiles` exists and `profiles.id = auth.users.id`.
- Ensure `profiles.role` and `profiles.active` are present and populated.
- Create Storage bucket `incident-photos` as **Private**.
- Apply each SQL file in order via Supabase SQL Editor.
- Test with admin/staff/viewer accounts before release.

### Local testing note

SQL migrations in `supabase/policies/` are authored in this repo but are **not auto-applied** here. Run them manually in Supabase SQL Editor.

### Launch-readiness warning

This app should be treated as **not public-launch-ready** until these policies are applied and verified in the target Supabase project.
