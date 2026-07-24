import type { Product, ProductDTO } from '../types';

// Map a backend product document to the shape the screens use. Kept pure (no
// network, no React) so it is trivial to unit-test.
//
// Returns null when the document cannot make a usable menu item. A kiosk must
// not blank out the whole menu because one row in the database is malformed.
export function normalizeProduct(p: ProductDTO): Product | null {
  if (!p || typeof p !== 'object') return null;

  const id = typeof p._id === 'string' ? p._id.trim() : '';
  const name = typeof p.name === 'string' ? p.name.trim() : '';
  if (!id || !name) return null;

  // Mongo may hold a price as a string on older rows; the order API requires a
  // number, so coerce here rather than letting the POST fail at checkout.
  // Only numbers and numeric strings qualify: Number(null), Number('') and
  // Number([]) are all 0, which would put a free drink on the menu.
  const raw: unknown = p.price;
  let price: number;
  if (typeof raw === 'number') {
    price = raw;
  } else if (typeof raw === 'string' && raw.trim() !== '') {
    price = Number(raw);
  } else {
    return null;
  }
  if (!Number.isFinite(price) || price < 0) return null;

  return {
    id,
    name,
    nameThai: typeof p.nameThai === 'string' ? p.nameThai : '',
    price,
    hasSweetness: p.hasSweetness !== false,
    image: typeof p.image === 'string' ? p.image : '',
    category: typeof p.category === 'string' ? p.category : '',
  };
}

export function normalizeProducts(data: unknown): Product[] {
  if (!Array.isArray(data)) return [];
  const out: Product[] = [];
  for (const raw of data) {
    const product = normalizeProduct(raw as ProductDTO);
    if (product) out.push(product);
  }
  return out;
}
