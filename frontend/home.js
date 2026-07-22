import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from './theme';
import { serif } from './fonts';

const Home = () => {
  const navigation = useNavigation();

  const handleTap = () => navigation.navigate('Menu');

  return (
    <TouchableOpacity style={styles.container} onPress={handleTap} activeOpacity={0.92}>
      <Image source={{ uri: 'https://img2.pic.in.th/pic/S__30203910.jpeg' }} style={styles.hero} />
      <Text style={styles.eyebrow}>FRESH COFFEE · FRESHLY PRESSED</Text>
      <Text style={styles.brand}>CREMA</Text>
      <Text style={styles.tagline}>Café-grade espresso, brewed to your taste.</Text>

      <View style={styles.startPill}>
        <View style={styles.dot} />
        <Text style={styles.startText}>แตะเพื่อเริ่ม · TOUCH TO START</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 24,
    gap: 6,
  },
  hero: {
    width: 240,
    height: 240,
    borderRadius: 120,
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 3,
    color: colors.accent,
    fontWeight: '600',
  },
  brand: {
    fontFamily: serif,
    fontSize: 56,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 15,
    color: colors.dim,
    textAlign: 'center',
    maxWidth: 260,
  },
  startPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 22,
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 999,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.onAccent,
  },
  startText: {
    color: colors.onAccent,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

export default Home;
