import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './frontend/home';
import Menu from './frontend/menu';
import Buymocca from './frontend/buymocca';
import Buyamaricano from './frontend/buyamaricano'
import Buyespresso from './frontend/buyespresso'
export default function App() {
  return (
    <View style={styles.container}>
    <Buyespresso/>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
