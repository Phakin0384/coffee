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
      category: '',
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

  test('trims whitespace around id and name', () => {
    const p = normalizeProduct({ _id: '  latte ', name: '  Latte  ', price: 50 });
    expect(p.id).toBe('latte');
    expect(p.name).toBe('Latte');
  });

  // A legacy row can hold the price as a string. The order API requires a
  // number, so coercing here is what keeps checkout from failing with a 400.
  test('coerces a numeric string price to a number', () => {
    const p = normalizeProduct({ _id: 'a', name: 'A', price: '50' });
    expect(p.price).toBe(50);
    expect(typeof p.price).toBe('number');
  });

  test('accepts a zero price', () => {
    expect(normalizeProduct({ _id: 'a', name: 'A', price: 0 }).price).toBe(0);
  });

  test('rejects unusable documents instead of throwing', () => {
    const bad = [
      null,
      undefined,
      'not an object',
      {},
      { _id: 'a' }, // no name
      { name: 'A', price: 1 }, // no id
      { _id: '   ', name: 'A', price: 1 }, // blank id
      { _id: 'a', name: '   ', price: 1 }, // blank name
      { _id: 'a', name: 'A' }, // no price
      { _id: 'a', name: 'A', price: 'free' }, // unparseable price
      // Number(null) / Number('') / Number([]) are all 0 — none of these may
      // slip through as a free drink.
      { _id: 'a', name: 'A', price: null },
      { _id: 'a', name: 'A', price: '' },
      { _id: 'a', name: 'A', price: [] },
      { _id: 'a', name: 'A', price: false },
      { _id: 'a', name: 'A', price: {} },
      { _id: 'a', name: 'A', price: -1 }, // negative price
      { _id: 'a', name: 'A', price: NaN },
      { _id: 'a', name: 'A', price: Infinity },
      { _id: 7, name: 'A', price: 1 }, // non-string id
    ];
    for (const doc of bad) {
      expect(normalizeProduct(doc)).toBeNull();
    }
  });

  test('ignores non-string optional fields rather than leaking them', () => {
    const p = normalizeProduct({
      _id: 'a',
      name: 'A',
      price: 1,
      nameThai: 5,
      image: {},
      category: 7,
    });
    expect(p.nameThai).toBe('');
    expect(p.image).toBe('');
    expect(p.category).toBe('');
  });

  test('keeps the category that drives the menu badge', () => {
    expect(normalizeProduct({ _id: 'a', name: 'A', price: 1, category: 'Milk' }).category).toBe(
      'Milk'
    );
  });
});

describe('normalizeProducts', () => {
  test('returns [] for non-array input', () => {
    expect(normalizeProducts(null)).toEqual([]);
    expect(normalizeProducts(undefined)).toEqual([]);
    expect(normalizeProducts({})).toEqual([]);
    expect(normalizeProducts('[]')).toEqual([]);
  });

  test('normalizes each item', () => {
    const out = normalizeProducts([
      { _id: 'a', name: 'A', price: 1 },
      { _id: 'b', name: 'B', price: 2, available: true },
    ]);
    expect(out).toHaveLength(2);
    expect(out[0].id).toBe('a');
  });

  // One malformed row must not blank out the kiosk's whole menu.
  test('drops bad entries but keeps the good ones', () => {
    const out = normalizeProducts([
      { _id: 'a', name: 'A', price: 1 },
      null,
      { _id: 'b' },
      { _id: 'c', name: 'C', price: 3 },
    ]);
    expect(out.map((p) => p.id)).toEqual(['a', 'c']);
  });

  test('never throws on hostile input', () => {
    expect(() => normalizeProducts([null, undefined, 0, '', [], () => {}])).not.toThrow();
    expect(normalizeProducts([null, undefined, 0, '', []])).toEqual([]);
  });
});
