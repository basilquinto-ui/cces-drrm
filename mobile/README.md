# CCES DRRM Mobile

Expo Router mobile foundation for CCES DRRM operations.

## Setup

1. Copy `.env.example` to `.env` and supply Supabase credentials.
2. Install dependencies from the `mobile` directory: `npm install`.
3. Run type checks: `npm run typecheck`.
4. Validate Expo setup: `npx expo-doctor`.
5. Start Expo: `npm run start`.

## Notes

- This app targets Expo SDK 54 and uses `lucide-react-native` for icons.
- If `npm install` or `npx expo-doctor` fails with a registry `403`, verify your npm registry/auth policy and retry.

## Status

- Mobile foundation only.
- Not public-launch-ready.
- Requires Supabase RLS configuration.
- Requires successful local mobile install and typecheck.
- Requires Expo Go and on-device testing.
- Incident photo URLs depend on Supabase storage policy allowing public read; otherwise signed URL handling is required.
