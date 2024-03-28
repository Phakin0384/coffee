import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>กดเพื่อเลือกเมนู</Text>
      <Text>Mocca</Text>
      <Text>Americano</Text>
      <Text>Espresspo</Text>
      <Text>CAPUCHINO</Text>
      <Text>Latte</Text>
      <StatusBar style="auto" />
    </View>

    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE8DC',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
