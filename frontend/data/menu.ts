import type { Product } from '../types';

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
export type Foam = 'none' | 'crema' | 'cocoa' | 'art' | 'dome';

export interface DrinkArt {
  liquid: string;
  foam: Foam;
  tag: string;
  small?: boolean;
}

// Hand-tuned for the drinks we ship with, matching the design concept.
export const DRINK_ART: Record<string, DrinkArt> = {
  mocca: { liquid: '#3A2216', foam: 'cocoa', tag: 'Choc' },
  americano: { liquid: '#241610', foam: 'none', tag: 'Black' },
  espresso: { liquid: '#2A160D', foam: 'crema', tag: 'Shot', small: true },
  cappuccino: { liquid: '#6E4A2D', foam: 'dome', tag: 'Foam' },
  latte: { liquid: '#7C5838', foam: 'art', tag: 'Milk' },
};

// Anything staff add from the admin page still needs a cup. Pick one
// deterministically from the drink's id so the same drink always looks the
// same, and let the admin's `category` supply the badge when they set one.
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

export function artFor(product: Pick<Product, 'id' | 'category'>): DrinkArt {
  const known = DRINK_ART[product.id];
  if (known) return known;
  const base = FALLBACK_ART[hash(product.id) % FALLBACK_ART.length];
  return { ...base, tag: product.category?.trim() || 'New' };
}
