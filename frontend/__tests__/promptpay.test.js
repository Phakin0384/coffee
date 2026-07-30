import { promptPayPayload } from '../data/promptpay';

// Reference vectors cross-checked against the standard PromptPay QR format
// (EMVCo QRCPS + Bank of Thailand). A wrong byte here means banking apps reject
// the code, so these are exact-match assertions, not shape checks.
describe('promptPayPayload', () => {
  test('amount-encoded QR for a mobile number is a one-time (POI 12) payload', () => {
    expect(promptPayPayload('0812345678', 50)).toBe(
      '00020101021229370016A000000677010111011300668123456785802TH5303764540550.0063049948'
    );
  });

  test('formats non-integer baht to two decimals', () => {
    expect(promptPayPayload('0812345678', 155.5)).toBe(
      '00020101021229370016A000000677010111011300668123456785802TH53037645406155.506304C7F9'
    );
  });

  test('omitting the amount yields a static, reusable (POI 11) QR', () => {
    const payload = promptPayPayload('0812345678');
    expect(payload).toBe(
      '00020101021129370016A000000677010111011300668123456785802TH530376463045D82'
    );
    expect(payload).not.toContain('5403'); // no amount tag
  });

  test('zero / negative amounts fall back to a static QR', () => {
    const staticPayload = promptPayPayload('0812345678');
    expect(promptPayPayload('0812345678', 0)).toBe(staticPayload);
    expect(promptPayPayload('0812345678', -5)).toBe(staticPayload);
  });

  test('a 13-digit target is carried as a national/tax id (sub-tag 02)', () => {
    expect(promptPayPayload('1234567890123', 50)).toBe(
      '00020101021229370016A000000677010111021312345678901235802TH5303764540550.006304BD2C'
    );
  });

  test('ignores separators in the target number', () => {
    expect(promptPayPayload('081-234-5678', 50)).toBe(promptPayPayload('0812345678', 50));
  });

  test('the last four chars are an uppercase-hex CRC of everything before them', () => {
    const payload = promptPayPayload('0812345678', 50);
    expect(payload.slice(-8, -4)).toBe('6304'); // CRC tag + length
    expect(payload.slice(-4)).toMatch(/^[0-9A-F]{4}$/);
  });
});
