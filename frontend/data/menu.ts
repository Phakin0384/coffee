import type { Foam, Product } from '../types';

export type { Foam };

// Kiosk settings and cup art. The drinks themselves, with their names and
// prices, live only in the backend /products collection (managed from the
// admin page); the server prices every order from it.

// PromptPay account the payment QR pays into. DEMO placeholder — swap for a real
// PromptPay phone number or 13-digit national/tax id to accept real payments.
// The QR itself is generated per-order (with the amount) from this, see
// ./promptpay and screens/PaymentScreen.
export const PROMPTPAY_ID = '0812345678';

export const SWEETNESS_LEVELS: number[] = [25, 50, 75, 100];

// ---------------------------------------------------------------------------
// Cup illustration recipes
// ---------------------------------------------------------------------------
export interface DrinkArt {
  liquid: string;
  foam: Foam;
  tag: string;
  small?: boolean;
}

// Hand-tuned for the drinks we ship with, matching the design concept. The
// server now stores these on each product (backend.py _SEED_ART) and the admin
// can change them; this copy only covers a server that predates cup art.
export const DRINK_ART: Record<string, DrinkArt> = {
  mocca: { liquid: '#3A2216', foam: 'cocoa', tag: 'Choc' },
  americano: { liquid: '#241610', foam: 'none', tag: 'Black' },
  espresso: { liquid: '#2A160D', foam: 'crema', tag: 'Shot', small: true },
  cappuccino: { liquid: '#6E4A2D', foam: 'dome', tag: 'Foam' },
  latte: { liquid: '#7C5838', foam: 'art', tag: 'Milk' },
};

// A drink with no cup of its own still needs one. Pick one deterministically
// from the drink's id so the same drink always looks the same. backend.py
// _FALLBACK_ART / _fallback_art() must stay identical to this.
const FALLBACK_ART: Omit<DrinkArt, 'tag'>[] = [
  { liquid: '#7C5838', foam: 'art' },
  { liquid: '#6E4A2D', foam: 'dome' },
  { liquid: '#3A2216', foam: 'cocoa' },
  { liquid: '#5A3A22', foam: 'crema' },
];

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

// The cup to draw for a product: the admin's choice when it has one, else the
// built-in art. The admin's category is the badge whenever it is set.
export function artFor(product: Pick<Product, 'id' | 'category' | 'cup'>): DrinkArt {
  const known = DRINK_ART[product.id];
  const tag = product.category?.trim() || known?.tag || 'New';
  if (product.cup) return { ...product.cup, tag };
  if (known) return { ...known, tag };
  return { ...FALLBACK_ART[hash(product.id) % FALLBACK_ART.length], tag };
}
