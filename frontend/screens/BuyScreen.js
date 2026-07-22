import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDrink, HOT_ICON, COLD_ICON, SWEETNESS_LEVELS } from '../data/menu';
import { createOrder } from '../api/client';
import { colors, radius } from '../theme';
import { serif } from '../fonts';

// One screen for every drink. The chosen product is passed from the menu as a
// route param (it comes from the live /products API); we fall back to the
// static lookup if only a legacy drinkId was passed.
export default function BuyScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const drink = route.params?.product ?? getDrink(route.params?.drinkId);

  const [sweetness, setSweetness] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!drink) {
    return (
      <View style={[styles.container, styles.centre]}>
        <Text style={styles.optionText}>Sorry, that drink is not on the menu.</Text>
      </View>
    );
  }

  const needsSweetness = drink.hasSweetness;
  const canConfirm = temperature !== null && (!needsSweetness || sweetness !== null);

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
      await createOrder(order);
      navigation.navigate('Payment', { product: drink, ...order });
    } catch (err) {
      const message =
        err.response?.data?.error ||
        'Could not place your order. Please check your connection and try again.';
      Alert.alert('Order failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: drink.image }} style={styles.drinkImage} />

      <Text style={styles.name}>{drink.name}</Text>
      <Text style={styles.price}>฿{drink.price}</Text>

      {needsSweetness && (
        <>
          <Text style={styles.sectionLabel}>ระดับความหวาน · SWEETNESS</Text>
          <View style={styles.optionRow}>
            {SWEETNESS_LEVELS.map((level) => {
              const on = sweetness === level;
              return (
                <TouchableOpacity
                  key={level}
                  style={[styles.pill, on && styles.pillSelected]}
                  onPress={() => setSweetness(level)}
                >
                  <Text style={[styles.optionText, on && styles.onDark]}>{level}%</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      <Text style={styles.sectionLabel}>อุณหภูมิ · TEMPERATURE</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.tempOption, temperature === 'hot' && styles.tempHot]}
          onPress={() => setTemperature('hot')}
        >
          <Image source={{ uri: HOT_ICON }} style={styles.tempIcon} />
          <Text style={[styles.optionText, temperature === 'hot' && styles.onDark]}>
            ร้อน · Hot
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tempOption, temperature === 'cold' && styles.tempCold]}
          onPress={() => setTemperature('cold')}
        >
          <Image source={{ uri: COLD_ICON }} style={styles.tempIcon} />
          <Text style={[styles.optionText, temperature === 'cold' && styles.onDark]}>
            เย็น · Cold
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.confirm, (!canConfirm || submitting) && styles.confirmDisabled]}
        onPress={handleConfirm}
        disabled={!canConfirm || submitting}
      >
        {submitting ? (
          <ActivityIndicator color={colors.onAccent} />
        ) : (
          <Text style={styles.confirmText}>ยืนยันคำสั่งซื้อ · Confirm</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  centre: {
    justifyContent: 'center',
  },
  drinkImage: {
    width: 240,
    height: 288,
    borderRadius: radius,
  },
  name: {
    fontFamily: serif,
    fontSize: 30,
    color: colors.text,
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
  sectionLabel: {
    fontSize: 12,
    letterSpacing: 2,
    color: colors.dim,
    marginTop: 10,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  pillSelected: {
    backgroundColor: colors.selected,
    borderColor: colors.selected,
  },
  tempOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  tempHot: {
    backgroundColor: colors.hot,
    borderColor: colors.hot,
  },
  tempCold: {
    backgroundColor: colors.cold,
    borderColor: colors.cold,
  },
  tempIcon: {
    width: 22,
    height: 28,
    resizeMode: 'contain',
  },
  optionText: {
    fontSize: 17,
    color: colors.text,
  },
  onDark: {
    color: colors.onTemp,
    fontWeight: '600',
  },
  confirm: {
    marginTop: 18,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: radius,
    backgroundColor: colors.confirm,
    minWidth: 240,
    alignItems: 'center',
  },
  confirmDisabled: {
    backgroundColor: colors.confirmDisabled,
  },
  confirmText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.onAccent,
    letterSpacing: 0.5,
  },
});
