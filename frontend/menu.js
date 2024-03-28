import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.menuItem}>กดเพื่อเลือกเมนู</Text>
      <Text style={styles.menuItem}>Mocca</Text>
      <Text style={styles.menuItem}>Americano</Text>
      <Text style={styles.menuItem}>Espresso</Text>
      <Text style={styles.menuItem}>CAPPUCCINO</Text>
      <Text style={styles.menuItem}>Latte</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Background color fills the entire screen
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItem: {
    marginBottom: 10, // Add space between each menu item
    fontFamily: 'Arial', // Change the font
    fontSize: 20, // Set the font size
  },
});
