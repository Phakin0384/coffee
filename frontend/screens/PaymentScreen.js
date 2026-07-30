import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Animated,
  Easing,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDrink, PROMPTPAY_ID } from '../data/menu';
import { promptPayPayload } from '../data/promptpay';
import { cardRadius } from '../theme';
import { useTheme } from '../ThemeContext';
import { serif } from '../fonts';
import TopBar, { Chip } from '../ui/TopBar';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
const RETURN_HOME_MS = 4200;

// Payment, then the confirmation. Both live here so the flow stays three steps
// on the step indicator — the "done" state is an outcome, not a new step.
export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const wide = width - insets.left - insets.right >= 900;

  const { product, drinkId, price, temperature, sweetness, orderId } = route.params ?? {};
  const drink = product ?? getDrink(drinkId);
  const amount = price ?? drink?.price ?? 0;

  // A fresh, amount-encoded PromptPay QR for this exact order — the customer
  // scans and the total is already filled in, no typing the price.
  const qrPayload = promptPayPayload(PROMPTPAY_ID, amount);

  const [paid, setPaid] = useState(false);

  const options = [
    temperature === 'hot' ? 'ร้อน · Hot' : temperature === 'cold' ? 'เย็น · Cold' : null,
    sweetness !== null && sweetness !== undefined ? `${sweetness}% sweet` : null,
  ]
    .filter(Boolean)
    .join('  ·  ');

  if (paid) {
    return (
      <DoneScreen
        drink={drink}
        orderId={orderId}
        onHome={() => navigation.popToTop()}
        colors={colors}
      />
    );
  }

  return (
    <LinearGradient colors={[colors.groundAlt, colors.ground]} style={styles.container}>
      <TopBar
        label="Payment"
        step={3}
        right={<Chip label="‹ Back" onPress={() => navigation.goBack()} />}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scroll,
          {
            paddingLeft: styles.scroll.paddingHorizontal + insets.left,
            paddingRight: styles.scroll.paddingHorizontal + insets.right,
            paddingBottom: styles.scroll.paddingBottom + insets.bottom,
          },
        ]}
      >
        <View style={[styles.pay, wide ? styles.payWide : styles.payStacked]}>
          <View style={styles.qrCol}>
            <View
              style={[styles.qrCard, { backgroundColor: colors.ceramic, borderColor: colors.line }]}
            >
              <View style={styles.qr}>
                <QRCode value={qrPayload} size={210} backgroundColor="transparent" />
              </View>
              <Text style={styles.qrCap}>พร้อมเพย์ · PROMPTPAY</Text>
            </View>
          </View>

          <View style={styles.details}>
            <Text style={[styles.eyebrow, { color: colors.crema }]}>
              สแกนเพื่อจ่าย · SCAN TO PAY
            </Text>
            <Text style={[styles.name, { color: colors.ink }]}>{drink ? drink.name : 'Order'}</Text>

            {!!options && (
              <View style={[styles.rowline, { borderBottomColor: colors.lineStrong }]}>
                <Text style={[styles.rowMuted, { color: colors.inkFaint }]}>{options}</Text>
              </View>
            )}

            <View style={[styles.rowline, { borderBottomColor: colors.lineStrong }]}>
              <Text style={[styles.rowLabel, { color: colors.inkDim }]}>ราคา · Price</Text>
              <Text style={[styles.rowValue, { color: colors.ink }]}>฿{amount}</Text>
            </View>

            <View style={styles.total}>
              <Text style={[styles.totalLabel, { color: colors.inkDim }]}>TOTAL</Text>
              <Text style={[styles.totalValue, { color: colors.crema }]}>฿{amount}</Text>
            </View>

            <Waiting colors={colors} />

            <View style={styles.actionbar}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [
                  styles.btn,
                  styles.btnGhost,
                  { borderColor: colors.lineStrong, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={[styles.btnGhostText, { color: colors.ink }]}>‹ Back</Text>
              </Pressable>
              <Pressable
                onPress={() => setPaid(true)}
                style={({ pressed }) => [
                  styles.btn,
                  { backgroundColor: colors.crema, opacity: pressed ? 0.88 : 1 },
                ]}
              >
                <Text style={[styles.btnText, { color: colors.onCrema }]}>
                  ชำระเงินแล้ว · I&apos;ve paid
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function Waiting({ colors }) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 650,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <View style={styles.waiting}>
      <Animated.View
        style={[styles.waitingDot, { backgroundColor: colors.crema, opacity: pulse }]}
      />
      <Text style={[styles.waitingText, { color: colors.inkDim }]}>
        รอการชำระเงิน · Waiting for payment…
      </Text>
    </View>
  );
}

// Confirmation, then back to the attract screen so the kiosk is ready for the
// next customer without anyone having to touch it.
function DoneScreen({ drink, orderId, onHome, colors }) {
  useEffect(() => {
    const timer = setTimeout(onHome, RETURN_HOME_MS);
    return () => clearTimeout(timer);
  }, [onHome]);

  return (
    <Pressable
      onPress={onHome}
      style={[styles.container, styles.done, { backgroundColor: colors.ground }]}
    >
      <View style={[styles.check, { backgroundColor: colors.cremaSoft }]}>
        <Text style={[styles.checkMark, { color: colors.crema }]}>✓</Text>
      </View>
      <Text style={[styles.eyebrow, { color: colors.crema }]}>ORDER CONFIRMED</Text>
      <Text style={[styles.doneTitle, { color: colors.ink }]}>ขอบคุณค่ะ</Text>
      <Text style={[styles.doneKick, { color: colors.inkDim }]}>
        Thank you! Your {drink ? drink.name : 'coffee'} is being brewed. Please collect it from the
        tray below.
      </Text>
      {orderId !== undefined && orderId !== null && (
        <Text style={[styles.orderNo, { color: colors.crema }]}>
          Order · {String(orderId).padStart(3, '0')}
        </Text>
      )}
      <View style={[styles.homePill, { borderColor: colors.lineStrong }]}>
        <View style={[styles.homeDot, { backgroundColor: colors.crema }]} />
        <Text style={[styles.homeText, { color: colors.ink }]}>RETURNING HOME…</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 28, flexGrow: 1 },

  // flex:1 only on the wide layout — on a phone the content must size to itself
  // so the ScrollView can scroll to the pay button.
  pay: { gap: 26, alignItems: 'center' },
  payWide: { flexDirection: 'row', justifyContent: 'center', flex: 1 },
  payStacked: { flexDirection: 'column' },

  qrCol: { alignItems: 'center', justifyContent: 'center' },
  qrCard: {
    borderWidth: 1,
    borderRadius: cardRadius,
    padding: 18,
    alignItems: 'center',
  },
  qr: { width: 210, height: 210, borderRadius: 8 },
  qrCap: {
    marginTop: 10,
    fontSize: 11,
    letterSpacing: 2.4,
    color: '#7A6A52',
  },

  details: { flex: 1, minWidth: 280, maxWidth: 460, justifyContent: 'center', gap: 4 },
  eyebrow: { fontSize: 11, letterSpacing: 3, fontWeight: '600' },
  name: { fontFamily: serif, fontSize: 34, fontWeight: '700', marginBottom: 6 },

  rowline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  rowMuted: { fontSize: 14 },
  rowLabel: { fontSize: 15 },
  rowValue: { fontSize: 15, fontWeight: '600' },

  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 12,
  },
  totalLabel: { fontSize: 11, letterSpacing: 2.4, fontWeight: '600' },
  totalValue: { fontFamily: serif, fontSize: 36, fontWeight: '700' },

  waiting: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 10 },
  waitingDot: { width: 8, height: 8, borderRadius: 4 },
  waitingText: { fontSize: 14 },

  actionbar: { flexDirection: 'row', gap: 12, marginTop: 22, flexWrap: 'wrap' },
  btn: {
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: { borderWidth: 1, backgroundColor: 'transparent' },
  btnGhostText: { fontSize: 15 },
  btnText: { fontSize: 15, fontWeight: '700', letterSpacing: 0.4 },

  done: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 5 },
  check: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  checkMark: { fontSize: 42, fontWeight: '700' },
  doneTitle: { fontFamily: serif, fontSize: 52, fontWeight: '700' },
  doneKick: { fontSize: 16, textAlign: 'center', maxWidth: 420, lineHeight: 23, marginTop: 4 },
  orderNo: { fontSize: 17, letterSpacing: 1.6, marginTop: 8 },
  homePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    borderWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 999,
  },
  homeDot: { width: 8, height: 8, borderRadius: 4 },
  homeText: { fontSize: 11, fontWeight: '700', letterSpacing: 2.2 },
});
