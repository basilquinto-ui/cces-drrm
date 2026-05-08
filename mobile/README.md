# CCES DRRM Mobile

Expo Router mobile foundation for CCES DRRM operations.

## Setup

1. Copy `.env.example` to `.env` and supply Supabase credentials.
2. Install dependencies from the `mobile` directory: `npm install`.
3. Run type checks: `npm run typecheck`.
4. Validate Expo setup: `npx expo-doctor`.
5. Start Expo: `npm run start`.

## Brand

- App name: CCES DRRM Command Center (short app name: CCES DRRM).
- Design direction: official school safety command center, calm and trustworthy, modern public-safety interface.
- Mobile icon rule: use `lucide-react-native` icons only.
- Mobile UI rule: do not use emojis.
- Color system source: `src/constants/theme.ts` and `src/constants/brand.ts`.

## Notes

- This app targets Expo SDK 54 and uses `lucide-react-native` for icons.
- If `npm install` or `npx expo-doctor` fails with a registry `403`, verify your npm registry/auth policy and retry.

## Status

- Mobile foundation only.
- Not public-launch-ready.
- Requires Supabase RLS configuration.
- Requires successful local mobile install and typecheck.
- Requires Expo Go and on-device testing.
- Incident photos should be uploaded as storage object paths (for example: `incidents/{userId}/{timestamp}.jpg`) so the `incident-photos` bucket can be private.
- Legacy records may still use public `photo_url` values; newer reads should resolve either a public URL or a storage path via signed URLs.
