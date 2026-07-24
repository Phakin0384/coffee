import { MENU, SWEETNESS_LEVELS, getDrink, artFor, DRINK_ART } from '../data/menu';
import { normalizeProduct } from '../data/product';

// MENU is the offline fallback the machine serves from when it cannot reach the
// backend, so it has to be valid on its own — nothing normalizes it at runtime.
describe('offline MENU fallback', () => {
  test('is non-empty', () => {
    expect(MENU.length).toBeGreaterThan(0);
  });

  test('every entry is a well-formed product', () => {
    for (const drink of MENU) {
      expect(typeof drink.id).toBe('string');
      expect(drink.id.trim()).not.toBe('');
      expect(typeof drink.name).toBe('string');
      expect(drink.name.trim()).not.toBe('');
      expect(typeof drink.nameThai).toBe('string');
      expect(typeof drink.price).toBe('number');
      expect(Number.isFinite(drink.price)).toBe(true);
      expect(drink.price).toBeGreaterThanOrEqual(0);
      expect(typeof drink.hasSweetness).toBe('boolean');
      expect(typeof drink.image).toBe('string');
      expect(typeof drink.category).toBe('string');
    }
  });

  test('ids are unique', () => {
    const ids = MENU.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // The fallback and the API path must produce identical shapes, or a screen
  // that works offline can break the moment the backend comes back.
  test('matches the shape normalizeProduct produces', () => {
    for (const drink of MENU) {
      const viaApi = normalizeProduct({ ...drink, _id: drink.id });
      expect(viaApi).toEqual(drink);
    }
  });
});

describe('getDrink', () => {
  test('finds a drink by id', () => {
    expect(getDrink('latte').name).toBe('Latte');
  });

  test('returns undefined for unknown or missing ids', () => {
    expect(getDrink('not-a-drink')).toBeUndefined();
    expect(getDrink(undefined)).toBeUndefined();
    expect(getDrink('')).toBeUndefined();
  });
});

// Every drink must render a cup — including ones staff add from the admin page
// long after this code was written.
describe('artFor', () => {
  const FOAMS = ['none', 'crema', 'cocoa', 'art', 'dome'];

  test('every shipped drink has hand-tuned art', () => {
    for (const drink of MENU) {
      expect(DRINK_ART[drink.id]).toBeDefined();
      expect(artFor(drink)).toBe(DRINK_ART[drink.id]);
    }
  });

  test('all art recipes are renderable', () => {
    for (const art of Object.values(DRINK_ART)) {
      expect(art.liquid).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(FOAMS).toContain(art.foam);
      expect(art.tag.trim()).not.toBe('');
    }
  });

  test('an unknown drink still gets a usable cup', () => {
    const art = artFor({ id: 'thai-tea', category: '' });
    expect(art.liquid).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(FOAMS).toContain(art.foam);
    expect(art.tag).toBe('New');
  });

  test('an unknown drink uses the admin-set category as its badge', () => {
    expect(artFor({ id: 'thai-tea', category: ' Tea ' }).tag).toBe('Tea');
  });

  test('the same drink always looks the same', () => {
    expect(artFor({ id: 'thai-tea', category: '' })).toEqual(
      artFor({ id: 'thai-tea', category: '' })
    );
  });

  test('does not throw when category is missing entirely', () => {
    expect(() => artFor({ id: 'x' })).not.toThrow();
    expect(artFor({ id: 'x' }).tag).toBe('New');
  });
});

describe('SWEETNESS_LEVELS', () => {
  test('are ascending percentages within 0-100', () => {
    expect(SWEETNESS_LEVELS.length).toBeGreaterThan(0);
    for (const level of SWEETNESS_LEVELS) {
      expect(typeof level).toBe('number');
      expect(level).toBeGreaterThanOrEqual(0);
      expect(level).toBeLessThanOrEqual(100);
    }
    const sorted = [...SWEETNESS_LEVELS].sort((a, b) => a - b);
    expect(SWEETNESS_LEVELS).toEqual(sorted);
  });
});
