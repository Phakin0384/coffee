// Import the pure module directly: ../api/config pulls in expo-constants,
// which is untransformed ESM under this jest setup.
import { resolveApiBaseUrl, hostFromUri } from '../api/resolve';

describe('hostFromUri', () => {
  test('strips the port', () => {
    expect(hostFromUri('192.168.1.51:8081')).toBe('192.168.1.51');
    expect(hostFromUri('localhost:19000')).toBe('localhost');
  });

  test('keeps bracketed IPv6 intact', () => {
    // A naive split(':') would return "[" here.
    expect(hostFromUri('[::1]:8081')).toBe('[::1]');
    expect(hostFromUri('[fe80::1ff:fe23:4567:890a]:8081')).toBe('[fe80::1ff:fe23:4567:890a]');
  });

  test('tolerates a bare host and junk', () => {
    expect(hostFromUri('192.168.1.51')).toBe('192.168.1.51');
    expect(hostFromUri(null)).toBeNull();
    expect(hostFromUri(undefined)).toBeNull();
    expect(hostFromUri('')).toBeNull();
  });
});

describe('resolveApiBaseUrl', () => {
  test('an explicit url wins over everything', () => {
    expect(
      resolveApiBaseUrl({
        explicitUrl: 'https://api.crema.example',
        hostUri: '192.168.1.51:8081',
        webHostname: 'shop.example',
      })
    ).toBe('https://api.crema.example');
  });

  // The case that makes a phone browser work: the page's own host is reachable
  // from the phone, whereas localhost would mean the phone itself.
  test('on the web, follows the host serving the page', () => {
    expect(resolveApiBaseUrl({ webHostname: '192.168.1.51', webProtocol: 'http:' })).toBe(
      'http://192.168.1.51:5000'
    );
    expect(resolveApiBaseUrl({ webHostname: 'localhost', webProtocol: 'http:' })).toBe(
      'http://localhost:5000'
    );
  });

  test('an https page requests https, so the browser does not block it', () => {
    expect(resolveApiBaseUrl({ webHostname: 'kiosk.example', webProtocol: 'https:' })).toBe(
      'https://kiosk.example:5000'
    );
  });

  test('the web host beats the dev-server hostUri', () => {
    expect(resolveApiBaseUrl({ hostUri: '10.0.0.9:8081', webHostname: '192.168.1.51' })).toBe(
      'http://192.168.1.51:5000'
    );
  });

  test('on native, falls back to the Metro LAN host', () => {
    expect(resolveApiBaseUrl({ hostUri: '192.168.1.51:8081' })).toBe('http://192.168.1.51:5000');
  });

  test('with nothing to go on, uses localhost', () => {
    expect(resolveApiBaseUrl({})).toBe('http://localhost:5000');
    expect(resolveApiBaseUrl({ explicitUrl: '', hostUri: '', webHostname: '' })).toBe(
      'http://localhost:5000'
    );
  });

  test('honours a custom port', () => {
    expect(resolveApiBaseUrl({ webHostname: 'localhost', port: 8000 })).toBe(
      'http://localhost:8000'
    );
  });

  test('never returns a url with an empty or undefined host', () => {
    const cases = [
      {},
      { hostUri: null },
      { hostUri: ':8081' },
      { webHostname: null, hostUri: undefined },
    ];
    for (const c of cases) {
      const url = resolveApiBaseUrl(c);
      expect(url).toMatch(/^https?:\/\/[^:/]+(:\d+)?$/);
      expect(url).not.toContain('undefined');
      expect(url).not.toContain('//:');
    }
  });
});
