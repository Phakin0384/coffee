// CREMA visual identity — a warm "oat-milk / espresso" coffee palette.
//
// Two palettes share one key set, so every screen styles itself from tokens and
// a theme switch is a one-line change. Ported from design/kiosk-concept.html.

export interface Palette {
  // Grounds & surfaces
  ground: string; // page background
  groundAlt: string; // background gradient partner / inset panels
  panel: string; // the kiosk surface
  card: string;
  cardAlt: string; // card gradient partner
  cardSub: string; // secondary text on a card

  // Ink
  ink: string;
  inkDim: string;
  inkFaint: string;

  // Signature accent
  crema: string;
  cremaSoft: string;
  onCrema: string; // text/icon on a crema fill

  // Temperature semantics (deliberately not the accent)
  hot: string;
  cold: string;
  onHot: string;
  onCold: string;

  // Lines
  line: string;
  lineStrong: string;

  // Cup illustration / QR card
  ceramic: string;
  ceramicRim: string;

  shadow: string;
  ok: string;
}

export const lightColors: Palette = {
  ground: '#E7DAC6',
  groundAlt: '#DFD0B8',
  panel: '#F5EEE1',
  card: '#FFFDF8',
  cardAlt: '#F7EFE1',
  cardSub: '#6E5A47',

  ink: '#291B11',
  inkDim: '#6E5A47',
  inkFaint: '#97836C',

  crema: '#B4762A',
  cremaSoft: '#E7CFA6',
  onCrema: '#1C130B',

  hot: '#BE5F2A',
  cold: '#35726E',
  onHot: '#1C130B',
  onCold: '#08201F',

  line: 'rgba(41,27,17,0.14)',
  lineStrong: 'rgba(41,27,17,0.24)',

  ceramic: '#FBF4E7',
  ceramicRim: '#E4D6BE',

  shadow: 'rgba(41,27,17,0.16)',
  ok: '#3E7A44',
};

// Evening service. Menu text is deliberately bright here — a kiosk is read at a
// glance, often in a dim room, so contrast wins over mood.
export const darkColors: Palette = {
  ground: '#17100B',
  groundAlt: '#1E1510',
  panel: '#241A13',
  card: '#3A2A1E',
  cardAlt: '#453324',
  cardSub: '#E7D8C2',

  ink: '#FBF3E6',
  inkDim: '#D8C8B2',
  inkFaint: '#A8967E',

  crema: '#E0A85D',
  cremaSoft: '#46341F',
  onCrema: '#1C130B',

  hot: '#E68B4B',
  cold: '#7FB0AC',
  onHot: '#1C130B',
  onCold: '#08201F',

  line: 'rgba(224,168,93,0.20)',
  lineStrong: 'rgba(224,168,93,0.34)',

  ceramic: '#EFE3D0',
  ceramicRim: '#CDBB9C',

  shadow: 'rgba(0,0,0,0.45)',
  ok: '#7FB985',
};

export type ThemeName = 'light' | 'dark';

export const palettes: Record<ThemeName, Palette> = {
  light: lightColors,
  dark: darkColors,
};

export const radius = 20;
export const cardRadius = 22;
