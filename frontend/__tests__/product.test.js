import { normalizeProduct, normalizeProducts } from '../data/product';

describe('normalizeProduct', () => {
  test('maps _id to id and fills defaults', () => {
    expect(normalizeProduct({ _id: 'mocca', name: 'Mocca', price: 50 })).toEqual({
      id: 'mocca',
      name: 'Mocca',
      nameThai: '',
      price: 50,
      hasSweetness: true,
      image: '',
    });
  });

  test('keeps provided fields', () => {
    const p = normalizeProduct({
      _id: 'thai-tea',
      name: 'Thai Tea',
      nameThai: 'ชาไทย',
      price: 55,
      hasSweetness: false,
      image: 'https://x/y.jpg',
    });
    expect(p.nameThai).toBe('ชาไทย');
    expect(p.hasSweetness).toBe(false);
    expect(p.image).toBe('https://x/y.jpg');
  });
});

describe('normalizeProducts', () => {
  test('returns [] for non-array input', () => {
    expect(normalizeProducts(null)).toEqual([]);
    expect(normalizeProducts(undefined)).toEqual([]);
    expect(normalizeProducts({})).toEqual([]);
  });

  test('normalizes each item', () => {
    const out = normalizeProducts([
      { _id: 'a', name: 'A', price: 1 },
      { _id: 'b', name: 'B', price: 2, available: true },
    ]);
    expect(out).toHaveLength(2);
    expect(out[0].id).toBe('a');
  });
});
