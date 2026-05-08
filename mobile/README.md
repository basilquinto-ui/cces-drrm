# CCES DRRM Mobile

Expo Router mobile foundation for CCES DRRM operations.

## Setup

1. Copy `.env.example` to `.env` and supply Supabase credentials.
2. Install dependencies: `npm install`
3. Run type checks: `npm run typecheck`
4. Start Expo: `npm run start`

## Status

- Mobile foundation only.
- Not public-launch-ready.
- Requires Supabase RLS configuration.
- Requires successful local mobile install and typecheck.
- Requires Expo Go and on-device testing.
- Incident photo URLs depend on Supabase storage policy allowing public read; otherwise signed URL handling is required.
