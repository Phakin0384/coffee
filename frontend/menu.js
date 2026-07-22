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
        <Text style={styles.title}>เมนู</Text>
        <Text style={styles.subtitle}>กดเพื่อเลือกเมนู · ORDER YOUR COFFEE</Text>
      </View>

      {status === 'loading' ? (
        <View style={styles.centre}>
          <ActivityIndicator size="large" color={colors.text} />
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
              style={styles.item}
              onPress={() => navigation.navigate('Buy', { product: drink })}
            >
              <Image source={{ uri: drink.image }} style={styles.itemImage} />
              <Text style={styles.itemText}>{drink.name}</Text>
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
    paddingTop: 24,
    paddingBottom: 12,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text,
    marginTop: 4,
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  hint: {
    color: colors.text,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  itemImage: {
    width: 70,
    height: 90,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  itemText: {
    fontSize: 20,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: radius,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 6,
    minWidth: 140,
    textAlign: 'center',
  },
});
