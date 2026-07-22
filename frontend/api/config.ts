import Constants from 'expo-constants';

// Resolve the backend base URL. Resolution order:
//   1. An explicit override in app.json -> expo.extra.apiUrl (use this in prod).
//   2. In Expo dev, derive the LAN IP of the machine running Metro so a phone or
//      emulator can reach the Flask server on port 5000 (localhost on a device
//      points at the device itself, not your computer).
//   3. Fall back to localhost (fine for web or same-machine testing).
const BACKEND_PORT = 5000;

// Older Expo runtimes expose the host in different places; describe them here
// rather than reaching for `any`.
const runtime = Constants as unknown as {
  expoConfig?: { hostUri?: string; extra?: { apiUrl?: string } };
  expoGoConfig?: { debuggerHost?: string };
  manifest2?: { extra?: { expoClient?: { hostUri?: string } } };
};

const EXPLICIT_URL = runtime.expoConfig?.extra?.apiUrl;

function devHost(): string | null {
  const hostUri =
    runtime.expoConfig?.hostUri ||
    runtime.expoGoConfig?.debuggerHost ||
    runtime.manifest2?.extra?.expoClient?.hostUri;
  if (!hostUri) return null;
  return hostUri.split(':')[0];
}

const host = devHost();

export const API_BASE_URL: string =
  EXPLICIT_URL || (host ? `http://${host}:${BACKEND_PORT}` : `http://localhost:${BACKEND_PORT}`);
