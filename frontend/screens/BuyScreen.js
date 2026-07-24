import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDrink, SWEETNESS_LEVELS, artFor } from '../data/menu';
import { createOrder } from '../api/client';
import { cardRadius } from '../theme';
import { useTheme } from '../ThemeContext';
import { serif } from '../fonts';
import TopBar, { Chip } from '../ui/TopBar';
import Steam from '../ui/Steam';
import Cup, { RIM_FROM_BOTTOM } from '../ui/Cup';

// One screen for every drink. The chosen product is passed from the menu as a
// route param (it comes from the live /products API); we fall back to the
// static lookup if only a legacy drinkId was passed.
export default function BuyScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Side-by-side preview and controls once there is room; stacked below that.
  const wide = width - insets.left - insets.right >= 900;

  const drink = route.params?.product ?? getDrink(route.params?.drinkId);

  const [sweetness, setSweetness] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!drink) {
    return (
      <View style={[styles.container, styles.centre, { backgroundColor: colors.ground }]}>
        <Text style={{ color: colors.ink }}>Sorry, that drink is not on the menu.</Text>
      </View>
    );
  }

  const needsSweetness = drink.hasSweetness;
  const canConfirm = temperature !== null && (!needsSweetness || sweetness !== null);

  // Tell the customer what is still missing instead of leaving a dead button.
  const note = canConfirm
    ? `พร้อม · Ready: ${[
        temperature === 'hot' ? 'ร้อน · Hot' : 'เย็น · Cold',
        needsSweetness ? `${sweetness}% หวาน` : null,
      ]
        .filter(Boolean)
        .join('  ·  ')}`
    : temperature === null
      ? 'เลือกอุณหภูมิ · Choose a temperature to continue.'
      : 'เลือกระดับความหวาน · Choose a sweetness level to continue.';

  const handleConfirm = async () => {
    if (!canConfirm || submitting) return;
    const order = {
      name: drink.name,
      price: drink.price,
      sweetness: needsSweetness ? sweetness : null,
      temperature,
    };

    setSubmitting(true);
    try {
      const created = await createOrder(order);
      // Forward the id so the confirmation can show an order number.
      navigation.navigate('Payment', { product: drink, ...order, orderId: created?._id });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Could not place your order. Please check your connection and try again.';
      Alert.alert('Order failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  const previewArt = wide ? 210 : 150;

  return (
    <LinearGradient colors={[colors.groundAlt, colors.ground]} style={styles.container}>
      <TopBar
        label="Customize"
        step={2}
        right={<Chip label="‹ Back" onPress={() => navigation.goBack()} />}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingLeft: styles.scroll.paddingHorizontal + insets.left,
            paddingRight: styles.scroll.paddingHorizontal + insets.right,
            paddingBottom: styles.scroll.paddingBottom + insets.bottom,
          },
        ]}
      >
        <View style={[styles.cust, wide ? styles.custWide : styles.custStacked]}>
          {/* ---- Preview ---- */}
          <View
            style={[
              styles.previewOuter,
              wide ? styles.previewWide : null,
              { borderColor: colors.line },
            ]}
          >
            <LinearGradient colors={[colors.card, colors.cardAlt]} style={styles.preview}>
              <View style={[styles.cupWrap, { width: previewArt, height: previewArt }]}>
                <Cup art={artFor(drink)} size={previewArt} />
                {/* Anchored to the rim, not the top of the drawing. */}
                <Steam
                  style={[styles.previewSteam, { bottom: previewArt * RIM_FROM_BOTTOM }]}
                  scale={0.9}
                />
              </View>
              <Text style={[styles.previewName, { color: colors.ink }]}>{drink.name}</Text>
              {!!drink.nameThai && (
                <Text style={[styles.previewThai, { color: colors.inkDim }]}>{drink.nameThai}</Text>
              )}
            </LinearGradient>
          </View>

          {/* ---- Controls ---- */}
          <View style={[styles.panel, wide ? styles.panelWide : null]}>
            {needsSweetness && (
              <View style={styles.field}>
                <View style={styles.label}>
                  <Text style={[styles.labelText, { color: colors.inkDim }]}>
                    SWEETNESS · ความหวาน
                  </Text>
                  <Text style={[styles.labelValue, { color: colors.inkFaint }]}>
                    {sweetness !== null ? `${sweetness}%` : ''}
                  </Text>
                </View>
                <View style={styles.segment}>
                  {SWEETNESS_LEVELS.map((level) => (
                    <Seg
                      key={level}
                      label={`${level}%`}
                      selected={sweetness === level}
                      onPress={() => setSweetness(level)}
                    />
                  ))}
                </View>
              </View>
            )}

            <View style={styles.field}>
              <View style={styles.label}>
                <Text style={[styles.labelText, { color: colors.inkDim }]}>
                  TEMPERATURE · อุณหภูมิ
                </Text>
              </View>
              <View style={styles.segment}>
                <Seg
                  glyph="♨"
                  label="ร้อน · Hot"
                  selected={temperature === 'hot'}
                  tint={colors.hot}
                  onTint={colors.onHot}
                  onPress={() => setTemperature('hot')}
                />
                <Seg
                  glyph="❄"
                  label="เย็น · Cold"
                  selected={temperature === 'cold'}
                  tint={colors.cold}
                  onTint={colors.onCold}
                  onPress={() => setTemperature('cold')}
                />
              </View>
            </View>

            <View style={styles.field}>
              <View style={styles.label}>
                <Text style={[styles.labelText, { color: colors.inkDim }]}>NOTE</Text>
              </View>
              <Text style={[styles.note, { color: colors.inkFaint }]}>{note}</Text>
            </View>

            {/* ---- Action bar ---- */}
            <View style={[styles.actionbar, { borderTopColor: colors.line }]}>
              <View>
                <Text style={[styles.totalLabel, { color: colors.inkDim }]}>TOTAL</Text>
                <Text style={[styles.totalValue, { color: colors.ink }]}>฿{drink.price}</Text>
              </View>

              <View style={styles.grow} />

              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [
                  styles.btn,
                  styles.btnGhost,
                  { borderColor: colors.lineStrong, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={[styles.btnGhostText, { color: colors.ink }]}>ยกเลิก</Text>
              </Pressable>

              <Pressable
                onPress={handleConfirm}
                disabled={!canConfirm || submitting}
                style={({ pressed }) => [
                  styles.btn,
                  {
                    backgroundColor: canConfirm ? colors.crema : colors.lineStrong,
                    opacity: pressed && canConfirm ? 0.88 : 1,
                  },
                ]}
              >
                {submitting ? (
                  <ActivityIndicator color={colors.onCrema} />
                ) : (
                  <Text
                    style={[
                      styles.btnText,
                      { color: canConfirm ? colors.onCrema : colors.inkFaint },
                    ]}
                  >
                    ยืนยันคำสั่งซื้อ · Confirm ›
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// A full-width segmented option. `tint` lets temperature carry its own colour
// instead of the crema accent, so hot and cold stay distinguishable.
function Seg({ label, glyph, selected, onPress, tint, onTint }) {
  const { colors } = useTheme();
  const bg = selected ? (tint ?? colors.crema) : colors.card;
  const fg = selected ? (onTint ?? colors.onCrema) : colors.ink;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.seg,
        {
          backgroundColor: bg,
          borderColor: selected ? bg : colors.lineStrong,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {!!glyph && <Text style={[styles.segGlyph, { color: fg }]}>{glyph}</Text>}
      <Text style={[styles.segText, { color: fg, fontWeight: selected ? '700' : '400' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centre: { alignItems: 'center', justifyContent: 'center' },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    flexGrow: 1,
  },
  cust: {
    flex: 1,
    gap: 22,
  },
  custWide: { flexDirection: 'row', alignItems: 'stretch' },
  custStacked: { flexDirection: 'column' },

  previewOuter: {
    borderWidth: 1,
    borderRadius: cardRadius,
    overflow: 'hidden',
  },
  preview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 26,
    paddingHorizontal: 18,
    gap: 4,
  },
  previewWide: { flex: 0.9 },
  cupWrap: { alignItems: 'center', justifyContent: 'flex-end' },
  previewSteam: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  previewName: {
    fontFamily: serif,
    fontSize: 30,
    fontWeight: '700',
    marginTop: 14,
  },
  previewThai: { fontSize: 15 },

  panel: { gap: 18 },
  panelWide: { flex: 1.1 },

  field: { gap: 9 },
  label: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  labelText: { fontSize: 11, letterSpacing: 2.2, fontWeight: '600' },
  labelValue: { fontSize: 13 },

  segment: { flexDirection: 'row', gap: 10 },
  seg: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 6,
  },
  segGlyph: { fontSize: 18 },
  segText: { fontSize: 16 },

  note: { fontSize: 14, lineHeight: 20 },

  actionbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 'auto',
    paddingTop: 18,
    borderTopWidth: 1,
    flexWrap: 'wrap',
  },
  grow: { flex: 1 },
  totalLabel: { fontSize: 11, letterSpacing: 2, fontWeight: '600' },
  totalValue: { fontFamily: serif, fontSize: 26, fontWeight: '700' },
  btn: {
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
  },
  btnGhost: { borderWidth: 1, backgroundColor: 'transparent' },
  btnGhostText: { fontSize: 15 },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.4 },
});
