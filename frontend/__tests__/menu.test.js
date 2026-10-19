import { SWEETNESS_LEVELS, artFor, DRINK_ART } from '../data/menu';

// The drinks the backend seeds a fresh database with (backend.py _SEED_PRODUCTS).
const SEEDED_IDS = ['mocca', 'americano', 'espresso', 'cappuccino', 'latte'];

// Every drink must render a cup — including ones staff add from the admin page
// long after this code was written.
describe('artFor', () => {
  const FOAMS = ['none', 'crema', 'cocoa', 'art', 'dome'];

  test('every seeded drink has hand-tuned art', () => {
    for (const id of SEEDED_IDS) {
      expect(DRINK_ART[id]).toBeDefined();
      expect(artFor({ id, category: '' })).toBe(DRINK_ART[id]);
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

  // The server rejects any other level (backend.py ALLOWED_SWEETNESS), so a
  // button the kiosk offers but the server refuses would fail every order.
  test('match the levels the server accepts', () => {
    expect(SWEETNESS_LEVELS).toEqual([25, 50, 75, 100]);
  });
});
