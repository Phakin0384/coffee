// Pure backend-URL resolution, kept free of expo-constants and `window` so it
// can be unit-tested directly (the same split as data/product.ts). config.ts
// supplies the platform values.

export const BACKEND_PORT = 5000;

/**
 * Take the host out of a `host:port` pair, keeping bracketed IPv6 intact.
 * A naive split(':') turns "[::1]:8081" into "[", which is not a host.
 */
export function hostFromUri(hostUri: string | null | undefined): string | null {
  if (!hostUri) return null;
  const match = hostUri.match(/^(\[[^\]]+\]|[^:/]+)/);
  return match ? match[1] : null;
}

export interface ResolveOptions {
  explicitUrl?: string | null;
  /** `host:port` reported by the Expo dev server (native). */
  hostUri?: string | null;
  /** `window.location.hostname` when running in a browser. */
  webHostname?: string | null;
  /** `window.location.protocol`, so an https page does not request http. */
  webProtocol?: string | null;
  port?: number;
}

/**
 * Resolution order:
 *   1. An explicit override in app.json -> expo.extra.apiUrl (use this in prod).
 *   2. On the web, the host serving the page. That address is reachable from
 *      this device by definition — which is what makes opening the dev server
 *      on a phone browser work, where "localhost" would mean the phone itself.
 *   3. On native in Expo dev, the LAN host of the machine running Metro (again,
 *      localhost on a device points at the device).
 *   4. Fall back to localhost, correct for same-machine testing.
 */
export function resolveApiBaseUrl({
  explicitUrl,
  hostUri,
  webHostname,
  webProtocol,
  port = BACKEND_PORT,
}: ResolveOptions): string {
  if (explicitUrl) return explicitUrl;

  if (webHostname) {
    // Mirror the page's scheme: a browser blocks http requests from an https
    // page as mixed content.
    const scheme = webProtocol === 'https:' ? 'https:' : 'http:';
    return `${scheme}//${webHostname}:${port}`;
  }

  const host = hostFromUri(hostUri);
  if (host) return `http://${host}:${port}`;

  return `http://localhost:${port}`;
}
