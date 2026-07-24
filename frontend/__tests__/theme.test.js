import { lightColors, darkColors, palettes } from '../theme';

// Screens read tokens by name from whichever palette is active. A key present
// in one palette but not the other resolves to `undefined` at runtime, which
// renders as invisible text rather than throwing — so assert the shape here.
describe('palettes', () => {
  test('light and dark define exactly the same tokens', () => {
    expect(Object.keys(lightColors).sort()).toEqual(Object.keys(darkColors).sort());
  });

  test('every token is a usable colour string', () => {
    // Catches the stray typo (e.g. "#9A8straints") that still parses as a
    // string. Collecting the offenders makes a failure name them directly.
    const COLOUR = /^(#[0-9A-Fa-f]{3,8}|rgba?\([\d\s.,]+\))$/;
    const bad = [];
    for (const [name, palette] of Object.entries(palettes)) {
      for (const [token, value] of Object.entries(palette)) {
        if (typeof value !== 'string' || !COLOUR.test(value.trim())) {
          bad.push(`${name}.${token} = ${JSON.stringify(value)}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  test('text is not the same colour as the surface it sits on', () => {
    for (const palette of Object.values(palettes)) {
      expect(palette.ink).not.toBe(palette.ground);
      expect(palette.ink).not.toBe(palette.card);
      expect(palette.onCrema).not.toBe(palette.crema);
      expect(palette.onHot).not.toBe(palette.hot);
      expect(palette.onCold).not.toBe(palette.cold);
    }
  });

  // The dark theme exists because the menu was hard to read at night.
  test('dark theme ink is genuinely light and its ground genuinely dark', () => {
    const luminance = (hex) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };
    expect(luminance(darkColors.ink)).toBeGreaterThan(0.7);
    expect(luminance(darkColors.ground)).toBeLessThan(0.2);
    expect(luminance(lightColors.ink)).toBeLessThan(0.3);
    expect(luminance(lightColors.ground)).toBeGreaterThan(0.7);
  });
});
