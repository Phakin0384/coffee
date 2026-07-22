// CREMA visual identity — a warm "oat-milk / espresso" coffee palette.
// A palette change is a one-file edit; every screen reads these tokens.
export const colors = {
  // Grounds & surfaces
  background: '#EFE6D6', // oat milk
  surface: '#FFFDF8', // card / paper
  surfaceAlt: '#F6EDDD',

  // Ink
  text: '#2A1C12', // espresso
  dim: '#6E5A47',

  // Lines / borders
  border: '#2A1C12',
  line: '#D8C7A8',

  // Signature accent
  accent: '#B4762A', // crema
  accentSoft: '#EAD6B0',
  onAccent: '#1C130B',

  // Selection / pills
  pill: '#F4ECDD',
  selected: '#B4762A',
  onSelected: '#1C130B',
  sweetHeader: '#EBD9BE',

  // Temperature semantics (separate from the accent)
  hot: '#BE5F2A', // amber
  cold: '#35726E', // teal
  onTemp: '#FFF7EC',

  // Actions
  confirm: '#B4762A',
  confirmDisabled: '#D9CDB6',
  thanks: '#E0C5B1',
} as const;

export const radius = 20;
