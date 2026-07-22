import type { Product, ProductDTO } from '../types';

// Map a backend product document to the shape the screens use. Kept pure (no
// network, no React) so it is trivial to unit-test.
export function normalizeProduct(p: ProductDTO): Product {
  return {
    id: p._id,
    name: p.name,
    nameThai: p.nameThai ?? '',
    price: p.price,
    hasSweetness: p.hasSweetness !== false,
    image: p.image ?? '',
  };
}

export function normalizeProducts(data: unknown): Product[] {
  if (!Array.isArray(data)) return [];
  return data.map((p) => normalizeProduct(p as ProductDTO));
}
