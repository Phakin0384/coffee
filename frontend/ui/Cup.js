import React from 'react';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { useTheme } from '../ThemeContext';

// Where the cup's rim sits, as a fraction of the drawing's height measured from
// the bottom. The rim is at y=92 in a 200-unit box; sitting the steam a little
// below that (0.52 rather than 0.54) lets it rise out of the drink instead of
// hovering over it. Callers use this to anchor Steam — the top ~46% of the box
// is empty, so anything stacked above the cup would float well clear of it.
export const RIM_FROM_BOTTOM = 0.52;

// The CREMA cup, ported 1:1 from design/kiosk-concept.html.
//
// Drawing the drinks instead of photographing them is what makes the menu look
// like one product: every cup shares the ceramic tone from the active palette,
// and only the liquid and the foam on top change per drink.

function Foam({ foam }) {
  switch (foam) {
    case 'dome': // cappuccino — a proud head of milk foam
      return (
        <>
          <Ellipse cx={100} cy={82} rx={50} ry={16} fill="#F3E7D0" />
          <Ellipse cx={100} cy={80} rx={40} ry={10} fill="#FBF3E2" />
        </>
      );
    case 'crema': // espresso — a thin hazelnut crema
      return (
        <>
          <Ellipse cx={100} cy={90} rx={44} ry={8.5} fill="#B98544" />
          <Ellipse cx={100} cy={89} rx={30} ry={5} fill="#CE9A57" />
        </>
      );
    case 'cocoa': // mocca — dusted with chocolate
      return (
        <>
          <Ellipse cx={100} cy={90} rx={45} ry={8.5} fill="#5A3A24" />
          <Circle cx={86} cy={89} r={1.6} fill="#3A2416" />
          <Circle cx={104} cy={90} r={1.6} fill="#3A2416" />
          <Circle cx={114} cy={88} r={1.4} fill="#3A2416" />
        </>
      );
    case 'art': // latte — a poured rosetta
      return (
        <>
          <Ellipse cx={100} cy={90} rx={45} ry={8.5} fill="#C89A66" />
          <Path d="M100 84 q10 4 0 12 q-10 -8 0 -12z" fill="#EFE0C6" />
          <Path d="M100 96 l0 -2" stroke="#EFE0C6" strokeWidth={1.4} />
        </>
      );
    default:
      return null;
  }
}

export default function Cup({ art, size = 160 }) {
  const { colors } = useTheme();
  const { liquid = '#7C5838', foam = 'art', small = false } = art ?? {};
  const s = small ? 0.82 : 1;

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      {/* Contact shadow keeps the cup sitting on the card rather than floating. */}
      <Ellipse cx={100} cy={182} rx={58 * s} ry={9} fill={colors.shadow} opacity={0.5} />

      <G transform={`translate(100 118) scale(${s}) translate(-100 -118)`}>
        <Path
          d="M150 96 q36 2 36 28 t-36 28"
          fill="none"
          stroke={colors.ceramic}
          strokeWidth={11}
        />
        <Path
          d="M150 98 q26 2 26 24 t-26 24"
          fill="none"
          stroke={colors.ceramicRim}
          strokeWidth={4}
        />

        <Path
          d="M48 92 h104 l-9 60 q-2.5 16 -19 16 h-48 q-16.5 0 -19 -16 z"
          fill={colors.ceramic}
        />
        <Path d="M48 92 h104 l-1.4 9 h-101.2 z" fill={colors.ceramicRim} />

        <Ellipse cx={100} cy={92} rx={52} ry={12.5} fill={colors.ceramicRim} />
        <Ellipse cx={100} cy={92} rx={46} ry={9.5} fill={liquid} />

        {/* Liquid surface, unless a foam dome hides it entirely. */}
        {foam === 'none' && <Ellipse cx={100} cy={90} rx={45} ry={8.5} fill={liquid} />}
        {foam !== 'none' && foam !== 'dome' && (
          <Ellipse cx={100} cy={91} rx={45} ry={8.5} fill={liquid} />
        )}

        <Foam foam={foam} />
      </G>
    </Svg>
  );
}
