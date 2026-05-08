# CCES DRRM Mobile (Expo)

## Setup
1. `cd mobile`
2. `npm install`
3. Copy `.env.example` to `.env` and fill in public Supabase values.
4. `npm run start`

## Security notes
- Never store Gemini/private provider keys in Expo env.
- Use Supabase Edge Functions as server-side proxy for Gemini/weather.
- Role checks in UI depend on `profiles.role`; enforce real access with Supabase RLS policies.
- Configure push later with `expo-notifications` once backend token pipeline is ready.

## Required backend setup
- `profiles` table with `id uuid references auth.users(id)` and `role text check (role in ('admin','staff','viewer'))`.
- RLS policies for `incidents`, `alerts`, `checkins`, `resources`, etc. with least privilege.
- Storage bucket `incident-photos` with controlled upload/read policies.
