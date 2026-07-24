import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { palettes } from './theme';

// Theme follows the device by default; the Theme chip on the menu screen stamps
// an explicit override that wins in both directions (matching the concept).
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [override, setOverride] = useState(null);

  const name = override ?? (system === 'dark' ? 'dark' : 'light');

  const toggle = useCallback(() => {
    setOverride((current) => {
      const active = current ?? (system === 'dark' ? 'dark' : 'light');
      return active === 'dark' ? 'light' : 'dark';
    });
  }, [system]);

  const value = useMemo(
    () => ({ name, colors: palettes[name], isDark: name === 'dark', toggle }),
    [name, toggle]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside a ThemeProvider');
  return ctx;
}

// Build a StyleSheet from the active palette, rebuilding only when it changes.
export function useThemedStyles(factory) {
  const { colors, isDark } = useTheme();
  return useMemo(() => factory(colors, isDark), [factory, colors, isDark]);
}
