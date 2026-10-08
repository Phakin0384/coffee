import Constants from 'expo-constants';
import { resolveApiBaseUrl } from './resolve';

// Platform wiring only — the resolution rules live in ./resolve.ts, which stays
// importable from tests without pulling in native modules.

// Older Expo runtimes expose the host in different places; describe them here
// rather than reaching for `any`.
const runtime = Constants as unknown as {
  expoConfig?: { hostUri?: string; extra?: { apiUrl?: string } };
  expoGoConfig?: { debuggerHost?: string };
  manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
};

// React Native defines a global `window`, but only a browser gives it a
// `location`, so this doubles as the web check.
const webLocation = typeof window !== 'undefined' && window.location ? window.location : undefined;

export const API_BASE_URL: string = resolveApiBaseUrl({
  explicitUrl: runtime.expoConfig?.extra?.apiUrl,
  hostUri:
    runtime.expoConfig?.hostUri ||
    runtime.expoGoConfig?.debuggerHost ||
    runtime.manifest2?.extra?.expoClient?.hostUri,
  webHostname: webLocation?.hostname,
  webProtocol: webLocation?.protocol,
});

export { resolveApiBaseUrl, hostFromUri, BACKEND_PORT } from './resolve';
