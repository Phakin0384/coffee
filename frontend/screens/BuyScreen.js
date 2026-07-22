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

// One screen for every drink. The specific drink is chosen by the `drinkId`
// route param passed from the menu.
export default function BuyScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const drink = getDrink(route.params?.drinkId);

  const [sweetness, setSweetness] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!drink) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sorry, that drink is not on the menu.</Text>
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
      navigation.navigate('Payment', { drinkId: drink.id, ...order });
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

      <View style={styles.namePill}>
        <Text style={styles.name}>{drink.name}</Text>
      </View>

      {needsSweetness && (
        <>
          <View style={styles.sweetHeader}>
            <Text style={styles.text}>ระดับความหวาน</Text>
          </View>
          <View style={styles.optionRow}>
            {SWEETNESS_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.pill, sweetness === level && styles.pillSelected]}
                onPress={() => setSweetness(level)}
              >
                <Text style={styles.text}>{level} %</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <View style={styles.sweetHeader}>
        <Text style={styles.text}>อุณหภูมิ</Text>
      </View>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.tempOption, temperature === 'hot' && styles.pillSelected]}
          onPress={() => setTemperature('hot')}
        >
          <Image source={{ uri: HOT_ICON }} style={styles.tempIcon} />
          <Text style={styles.text}>ร้อน</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tempOption, temperature === 'cold' && styles.pillSelected]}
          onPress={() => setTemperature('cold')}
        >
          <Image source={{ uri: COLD_ICON }} style={styles.tempIcon} />
          <Text style={styles.text}>เย็น</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.confirm, (!canConfirm || submitting) && styles.confirmDisabled]}
        onPress={handleConfirm}
        disabled={!canConfirm || submitting}
      >
        {submitting ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Text style={styles.text}>ยืนยันคำสั่งซื้อ</Text>
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
    gap: 16,
  },
  drinkImage: {
    width: 260,
    height: 320,
    borderRadius: radius,
  },
  namePill: {
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 80,
    paddingVertical: 8,
    borderRadius: radius,
    backgroundColor: colors.surface,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  sweetHeader: {
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderRadius: radius,
    backgroundColor: colors.sweetHeader,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  pill: {
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius,
    backgroundColor: colors.pill,
  },
  pillSelected: {
    backgroundColor: colors.selected,
  },
  tempOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: radius,
    backgroundColor: colors.pill,
  },
  tempIcon: {
    width: 24,
    height: 30,
    resizeMode: 'contain',
  },
  confirm: {
    marginTop: 8,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: radius,
    backgroundColor: colors.confirm,
  },
  confirmDisabled: {
    backgroundColor: colors.confirmDisabled,
    opacity: 0.6,
  },
  text: {
    fontSize: 18,
  },
});
