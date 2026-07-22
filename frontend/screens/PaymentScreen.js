import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDrink, QR_IMAGE } from '../data/menu';
import { colors, radius } from '../theme';

// One payment screen for every drink. Order details arrive via route params.
export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { drinkId, price } = route.params ?? {};
  const drink = getDrink(drinkId);
  const amount = price ?? drink?.price ?? 0;

  const handleDone = () => navigation.popToTop();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {drink && <Image source={{ uri: drink.image }} style={styles.drinkImage} />}

      <View style={styles.namePill}>
        <Text style={styles.name}>{drink ? drink.name : 'Order'}</Text>
      </View>

      <Image source={{ uri: QR_IMAGE }} style={styles.qr} />
      <Text style={styles.price}>ราคา {amount} บาท</Text>

      <TouchableOpacity style={styles.thanks} onPress={handleDone}>
        <Text style={styles.text}>THANK YOU</Text>
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
  qr: {
    width: 150,
    height: 150,
    borderRadius: radius,
  },
  price: {
    fontSize: 20,
  },
  thanks: {
    marginTop: 8,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 60,
    paddingVertical: 12,
    borderRadius: radius,
    backgroundColor: colors.thanks,
  },
  text: {
    fontSize: 18,
  },
});
