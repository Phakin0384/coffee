import type { Product } from '../types';

// The live menu comes from the backend /products API (managed via the admin
// page). The MENU list below is a built-in OFFLINE FALLBACK so the machine can
// still serve if it briefly can't reach the server on startup.

export const HOT_ICON = 'https://www.freeiconspng.com/uploads/black-flame-icon-png-24.png';
export const COLD_ICON = 'https://static.thenounproject.com/png/1184671-200.png';

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

export const MENU: Product[] = [
  {
    id: 'mocca',
    name: 'Mocca',
    nameThai: 'มอคค่า',
    price: 50,
    hasSweetness: true,
    category: 'Choc',
    image:
      'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
  },
  {
    id: 'americano',
    name: 'Americano',
    nameThai: 'อเมริกาโน่',
    price: 50,
    hasSweetness: false,
    category: 'Black',
    image: 'https://www.acouplecooks.com/wp-content/uploads/2022/01/Iced-Americano-008s.jpg',
  },
  {
    id: 'espresso',
    name: 'Espresso',
    nameThai: 'เอสเพรสโซ่',
    price: 50,
    hasSweetness: true,
    category: 'Shot',
    image:
      'https://www.thespruceeats.com/thmb/HJrjMfXdLGHbgMhnM0fMkDx9XPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/what-is-espresso-765702-hero-03_cropped-ffbc0c7cf45a46ff846843040c8f370c.jpg',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    nameThai: 'คาปูชิโน่',
    price: 50,
    hasSweetness: true,
    category: 'Foam',
    image:
      'https://coffeeaffection.com/wp-content/uploads/2021/02/does-a-cappuccino-have-caffeine.jpg',
  },
  {
    id: 'latte',
    name: 'Latte',
    nameThai: 'ลาเต้',
    price: 50,
    hasSweetness: true,
    category: 'Milk',
    image:
      'https://coffeeaffection.com/wp-content/uploads/2021/05/Spanish-latte-milk-and-espresso.jpg',
  },
];

export const getDrink = (id: string | undefined): Product | undefined =>
  MENU.find((drink) => drink.id === id);
