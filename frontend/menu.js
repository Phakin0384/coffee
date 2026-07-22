import React, { useEffect, useState, useCallback } from 'react';
import {
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getProducts } from './api/client';
import { MENU as FALLBACK_MENU } from './data/menu';
import { colors, radius } from './theme';
import { serif } from './fonts';

// The menu is loaded live from the backend so staff can add or hide drinks
// from the admin page without shipping a new app build. If the server can't be
// reached, we fall back to the built-in list so the machine still works.
export default function Menu() {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

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
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>CHOOSE YOUR COFFEE</Text>
        <Text style={styles.title}>เมนู</Text>
        <Text style={styles.subtitle}>กดเพื่อเลือกเมนู</Text>
      </View>

      {status === 'loading' ? (
        <View style={styles.centre}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.hint}>กำลังโหลดเมนู… · Loading menu…</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {status === 'error' && (
            <TouchableOpacity style={styles.offline} onPress={loadMenu}>
              <Text style={styles.offlineText}>ออฟไลน์ · Showing saved menu — tap to retry</Text>
            </TouchableOpacity>
          )}
          {items.map((drink) => (
            <TouchableOpacity
              key={drink.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Buy', { product: drink })}
            >
              <Image source={{ uri: drink.image }} style={styles.cardImage} />
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{drink.name}</Text>
                {!!drink.nameThai && <Text style={styles.cardThai}>{drink.nameThai}</Text>}
              </View>
              <Text style={styles.cardPrice}>฿{drink.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 12,
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 3,
    color: colors.accent,
    fontWeight: '600',
  },
  title: {
    fontFamily: serif,
    fontSize: 40,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.dim,
    marginTop: 2,
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  hint: {
    color: colors.dim,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 14,
  },
  offline: {
    backgroundColor: colors.thanks,
    borderRadius: radius,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  offlineText: {
    color: colors.text,
    fontSize: 13,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
  },
  cardImage: {
    width: 68,
    height: 84,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontFamily: serif,
    fontSize: 22,
    color: colors.text,
  },
  cardThai: {
    fontSize: 14,
    color: colors.dim,
    marginTop: 2,
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
  },
});
