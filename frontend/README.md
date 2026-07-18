# Practising Good Grief — mobile app

The Expo (React Native) client for Practising Good Grief. Product overview, architecture, and design decisions live in the [root README](../README.md).

```
npm i
npx expo start        # Expo Go / simulator
```

Before running, point the app at a backend in [app/constants/config.ts](app/constants/config.ts) — on a physical device `API_BASE_URL` must be your machine's LAN IP (e.g. `http://192.168.1.x:8080`), not `localhost`. Supabase auth config lives in [app/services/api/supabaseConfig.ts](app/services/api/supabaseConfig.ts).

Screens are file-based routes under `app/` (expo-router), state is in `app/store/` (Zustand), and all API access goes through `app/services/api/`.
