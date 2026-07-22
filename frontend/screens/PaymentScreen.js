import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDrink, QR_IMAGE } from '../data/menu';
import { colors, radius } from '../theme';
import { serif } from '../fonts';

// One payment screen for every drink. Order details arrive via route params;
// the product object is forwarded from the Buy screen (falls back to a legacy
// drinkId lookup).
export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product, drinkId, price } = route.params ?? {};
  const drink = product ?? getDrink(drinkId);
  const amount = price ?? drink?.price ?? 0;

  const handleDone = () => navigation.popToTop();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>สแกนเพื่อจ่าย · SCAN TO PAY</Text>
      <Text style={styles.name}>{drink ? drink.name : 'Order'}</Text>

      <View style={styles.qrCard}>
        <Image source={{ uri: QR_IMAGE }} style={styles.qr} />
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>ราคา · Total</Text>
        <Text style={styles.price}>฿{amount}</Text>
      </View>

      <TouchableOpacity style={styles.thanks} onPress={handleDone}>
        <Text style={styles.thanksText}>ขอบคุณค่ะ · THANK YOU</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    gap: 14,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 3,
    color: colors.accent,
    fontWeight: '600',
  },
  name: {
    fontFamily: serif,
    fontSize: 30,
    color: colors.text,
  },
  qrCard: {
    backgroundColor: colors.surface,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: 6,
  },
  qr: {
    width: 190,
    height: 190,
    borderRadius: 10,
  },
  priceRow: {
    alignItems: 'center',
    marginTop: 6,
  },
  priceLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.dim,
  },
  price: {
    fontFamily: serif,
    fontSize: 36,
    color: colors.accent,
    fontWeight: '700',
  },
  thanks: {
    marginTop: 16,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: radius,
    backgroundColor: colors.accent,
  },
  thanksText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onAccent,
    letterSpacing: 1,
  },
});
