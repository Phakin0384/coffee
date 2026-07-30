// Amount-encoded PromptPay QR payloads (pure, dependency-free).
//
// Builds the EMVCo "QR Code Payment Standard" string that Thai banking apps
// scan for PromptPay transfers, following the Bank of Thailand spec. When an
// amount is supplied the payload is a one-time (dynamic) QR whose total is baked
// in, so the customer doesn't have to type the price — they just scan and
// confirm. The <QRCode /> renderer turns this string into the pixels.
//
// NOTE: this is a DEMO. PROMPTPAY_ID in ../data/menu is a placeholder number;
// point it at a real PromptPay phone / national ID to take real payments.

// EMVCo top-level tags
const ID_PAYLOAD_FORMAT = '00';
const ID_POI_METHOD = '01';
const ID_MERCHANT_INFO = '29';
const ID_COUNTRY = '58';
const ID_CURRENCY = '53';
const ID_AMOUNT = '54';
const ID_CRC = '63';

const PAYLOAD_FORMAT_EMV = '01';
const POI_STATIC = '11'; // reusable QR, no amount
const POI_DYNAMIC = '12'; // one-time QR, amount included
const MERCHANT_AID = 'A000000677010111'; // PromptPay application id
const COUNTRY_TH = 'TH';
const CURRENCY_THB = '764'; // ISO 4217

// PromptPay merchant sub-tags (inside tag 29)
const SUB_AID = '00';
const SUB_PHONE = '01';
const SUB_NATIONAL_ID = '02';

// Encode one field as EMVCo tag-length-value, e.g. tlv('54', '50.00') -> '540550.00'.
function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

// A PromptPay target is either a mobile number or a 13-digit national / tax id.
// Phones are carried as 13 digits: the leading 0 becomes the 66 country code,
// then the whole thing is left-padded (0812345678 -> 0066812345678).
function encodeTarget(target: string): string {
  const digits = target.replace(/\D/g, '');
  if (digits.length >= 13) {
    return tlv(SUB_NATIONAL_ID, digits);
  }
  const intl = `0000000000000${digits.replace(/^0/, '66')}`.slice(-13);
  return tlv(SUB_PHONE, intl);
}

// CRC-16/CCITT-FALSE over the payload, as required by tag 63.
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Build a PromptPay QR payload for `target`, optionally locking in `amount`
 * (in baht). A positive amount yields a dynamic, amount-encoded QR; omitting it
 * (or passing 0) yields a static QR the customer keys the amount into.
 */
export function promptPayPayload(target: string, amount?: number): string {
  const hasAmount = typeof amount === 'number' && Number.isFinite(amount) && amount > 0;

  const merchant = tlv(SUB_AID, MERCHANT_AID) + encodeTarget(target);

  // Tag order follows the reference PromptPay implementations: format, POI,
  // merchant, country, currency, amount — then CRC last, computed over
  // everything before it (including the '6304' tag+length of the CRC itself).
  let payload =
    tlv(ID_PAYLOAD_FORMAT, PAYLOAD_FORMAT_EMV) +
    tlv(ID_POI_METHOD, hasAmount ? POI_DYNAMIC : POI_STATIC) +
    tlv(ID_MERCHANT_INFO, merchant) +
    tlv(ID_COUNTRY, COUNTRY_TH) +
    tlv(ID_CURRENCY, CURRENCY_THB);

  if (hasAmount) {
    payload += tlv(ID_AMOUNT, amount.toFixed(2));
  }

  payload += `${ID_CRC}04`;
  return payload + crc16(payload);
}
