import React from 'react';
import { StatusBar, TouchableOpacity, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MENU } from './data/menu';
import { colors, radius } from './theme';

// The menu is rendered from the shared MENU data, so adding a drink there
// automatically adds it here and wires up navigation to the Buy screen.
export default function Menu() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.header}>
        <Text style={styles.title}>เมนู</Text>
        <Text style={styles.subtitle}>กดเพื่อเลือกเมนู · ORDER YOUR COFFEE</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {MENU.map((drink) => (
          <TouchableOpacity
            key={drink.id}
            style={styles.item}
            onPress={() => navigation.navigate('Buy', { drinkId: drink.id })}
          >
            <Image source={{ uri: drink.image }} style={styles.itemImage} />
            <Text style={styles.itemText}>{drink.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  list: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 16,
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
