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
      expect(artFor({ id, category: '' })).toEqual(DRINK_ART[id]);
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

  test('uses the cup the admin set over any built-in art', () => {
    const cup = { liquid: '#4A7A3A', foam: 'dome', small: true };
    expect(artFor({ id: 'latte', category: 'Green', cup })).toEqual({ ...cup, tag: 'Green' });
    expect(artFor({ id: 'thai-tea', category: '', cup })).toEqual({ ...cup, tag: 'New' });
  });

  // The admin's Category is the badge for every drink, seeded ones included.
  test('the admin-set category is the badge even for seeded drinks', () => {
    expect(artFor({ id: 'latte', category: 'Iced' }).tag).toBe('Iced');
    expect(artFor({ id: 'latte', category: '' }).tag).toBe('Milk');
  });

  // backend.py _FALLBACK_ART / _fallback_art() must pick the same cup, or a
  // drink would change look when the server backfills its art.
  test('fallback picks match the server', () => {
    expect(artFor({ id: 'thai-tea' })).toMatchObject({ liquid: '#5A3A22', foam: 'crema' });
    expect(artFor({ id: 'old-drink' })).toMatchObject({ liquid: '#3A2216', foam: 'cocoa' });
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
