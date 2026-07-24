import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../ThemeContext';
import { serif } from '../fonts';

// Wordmark + step indicator + utility chips, shared by every ordering screen.
// The step dots tell the customer how far through the flow they are.
export function Chip({ label, onPress }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.chip, { borderColor: colors.lineStrong }]}
    >
      <Text style={[styles.chipText, { color: colors.inkDim }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export function StepDots({ step, total = 3 }) {
  const { colors } = useTheme();
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }, (_, i) => {
        const on = i === step - 1;
        return (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: on ? colors.crema : colors.lineStrong },
              on && [styles.dotOn, { borderColor: colors.cremaSoft }],
            ]}
          />
        );
      })}
    </View>
  );
}

export default function TopBar({ label, step, right }) {
  const { colors } = useTheme();
  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <Text style={[styles.brandName, { color: colors.ink }]}>CREMA</Text>
        {!!label && <Text style={[styles.brandLabel, { color: colors.crema }]}>{label}</Text>}
      </View>

      {step ? <StepDots step={step} /> : <View />}

      <View style={styles.util}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    flexShrink: 1,
  },
  brandName: {
    fontFamily: serif,
    fontWeight: '700',
    fontSize: 24,
    letterSpacing: 0.5,
  },
  brandLabel: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  dotOn: {
    borderWidth: 4,
    // The ring reads as a halo around the active dot.
    width: 17,
    height: 17,
    borderRadius: 9,
  },
  util: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});
