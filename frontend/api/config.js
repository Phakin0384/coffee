import Constants from 'expo-constants';

// Resolve the backend base URL. Resolution order:
//   1. An explicit override in app.json -> expo.extra.apiUrl (use this in prod).
//   2. In Expo dev, derive the LAN IP of the machine running Metro so a phone or
//      emulator can reach the Flask server on port 5000 (localhost on a device
//      points at the device itself, not your computer).
//   3. Fall back to localhost (fine for web or same-machine testing).
const BACKEND_PORT = 5000;

const EXPLICIT_URL = Constants.expoConfig?.extra?.apiUrl;

function devHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri;
  if (!hostUri) return null;
  return hostUri.split(':')[0];
}

const host = devHost();

export const API_BASE_URL =
  EXPLICIT_URL || (host ? `http://${host}:${BACKEND_PORT}` : `http://localhost:${BACKEND_PORT}`);
