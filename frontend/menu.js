import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getProducts } from './api/client';
import { MENU as FALLBACK_MENU, artFor } from './data/menu';
import { cardRadius, radius } from './theme';
import { useTheme } from './ThemeContext';
import { serif } from './fonts';
import TopBar, { Chip } from './ui/TopBar';
import Cup from './ui/Cup';

const GAP = 16;
const PAD = 24;

// Widest layout the kiosk screen uses; narrower windows step down so the same
// build works on a phone, a tablet and the machine itself.
function columnsFor(width) {
  if (width >= 1100) return 5;
  if (width >= 820) return 4;
  if (width >= 560) return 3;
  return 2;
}

// The menu is loaded live from the backend so staff can add or hide drinks from
// the admin page without shipping a new app build. If the server can't be
// reached we fall back to the built-in list so the machine still works.
export default function Menu() {
  const navigation = useNavigation();
  const { colors, toggle } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  // Lay the grid out inside the safe area, not the raw screen width.
  const usable = width - insets.left - insets.right;
  const cols = columnsFor(usable);
  const cardW = Math.floor((usable - PAD * 2 - GAP * (cols - 1)) / cols);

  const loadMenu = useCallback(async () => {
    setStatus('loading');
    try {
      const products = await getProducts();
      setItems(products.length ? products : FALLBACK_MENU);
      setStatus('ready');
    } catch {
      // Keep the machine usable offline rather than showing a dead screen.
      setItems(FALLBACK_MENU);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  return (
    <LinearGradient colors={[colors.groundAlt, colors.ground]} style={styles.container}>
      <TopBar label="Menu" step={1} right={<Chip label="Theme" onPress={toggle} />} />

      <View
        style={[styles.head, { paddingLeft: PAD + insets.left, paddingRight: PAD + insets.right }]}
      >
        <View style={styles.headLeft}>
          <Text style={[styles.eyebrow, { color: colors.crema }]}>STEP 1 OF 3</Text>
          <Text style={[styles.title, { color: colors.ink }]}>Choose your coffee</Text>
        </View>
        <Text style={[styles.headThai, { color: colors.inkDim }]}>เลือกเมนูที่ต้องการ</Text>
      </View>

      {status === 'loading' ? (
        <View style={styles.centre}>
          <ActivityIndicator size="large" color={colors.crema} />
          <Text style={[styles.hint, { color: colors.inkDim }]}>
            กำลังโหลดเมนู… · Loading menu…
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scroll,
            {
              paddingLeft: PAD + insets.left,
              paddingRight: PAD + insets.right,
              paddingBottom: styles.scroll.paddingBottom + insets.bottom,
            },
          ]}
        >
          {status === 'error' && (
            <TouchableOpacity
              style={[styles.offline, { backgroundColor: colors.cremaSoft }]}
              onPress={loadMenu}
            >
              <Text style={[styles.offlineText, { color: colors.ink }]}>
                ออฟไลน์ · Showing saved menu — tap to retry
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.grid}>
            {items.map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                width={cardW}
                onPress={() => navigation.navigate('Buy', { product: drink })}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </LinearGradient>
  );
}

// Lifts on hover (web/kiosk with a pointer) and dims on press (touch).
function DrinkCard({ drink, width, onPress }) {
  const { colors } = useTheme();
  const [hovered, setHovered] = useState(false);
  const art = artFor(drink);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({ pressed }) => [
        styles.cardOuter,
        {
          width,
          borderColor: hovered ? colors.crema : colors.line,
          shadowColor: colors.shadow,
          shadowOpacity: hovered ? 0.9 : 0.35,
          transform: [{ translateY: hovered && !pressed ? -6 : 0 }],
          opacity: pressed ? 0.9 : 1,
        },
      ]}
    >
      <LinearGradient colors={[colors.card, colors.cardAlt]} style={styles.cardInner}>
        <View style={[styles.tag, { borderColor: colors.lineStrong }]}>
          <Text style={[styles.tagText, { color: colors.inkDim }]} numberOfLines={1}>
            {art.tag}
          </Text>
        </View>

        <Cup art={art} size={width * 0.78} />

        <Text style={[styles.cardName, { color: colors.ink }]} numberOfLines={1}>
          {drink.name}
        </Text>
        {!!drink.nameThai && (
          <Text style={[styles.cardThai, { color: colors.cardSub }]} numberOfLines={1}>
            {drink.nameThai}
          </Text>
        )}
        <Text style={[styles.cardPrice, { color: colors.crema }]}>฿{drink.price}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Bound the scroll area to the screen so overflow scrolls on web.
  scrollView: { flex: 1 },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: PAD,
    paddingTop: 6,
    paddingBottom: 18,
  },
  headLeft: {
    flexShrink: 1,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    fontWeight: '600',
  },
  title: {
    fontFamily: serif,
    fontSize: 34,
    fontWeight: '700',
    marginTop: 2,
  },
  headThai: {
    fontSize: 15,
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  hint: {
    fontSize: 14,
  },
  scroll: {
    paddingHorizontal: PAD,
    paddingBottom: 28,
    gap: 14,
  },
  offline: {
    borderRadius: radius,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 13,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  cardOuter: {
    borderWidth: 1,
    borderRadius: cardRadius,
    // The gradient child paints the fill, so clip it to the rounded corners.
    overflow: 'hidden',
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },
  cardInner: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 16,
    paddingHorizontal: 10,
  },
  tag: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: '60%',
    zIndex: 2,
  },
  tagText: {
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  cardName: {
    fontFamily: serif,
    fontWeight: '700',
    fontSize: 20,
    marginTop: 6,
  },
  cardThai: {
    fontSize: 13,
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
});
