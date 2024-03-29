import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './frontend/home';
import Menu from './frontend/menu';
import Buymocca from './frontend/buymocca';
import Buyamaricano from './frontend/buyamaricano'
import Buyespresso from './frontend/buyespresso'
import Buycapuchino from './frontend/buycapuchino'
import BuyLatte from './frontend/buylatte'
export default function App() {
  return (
    <View style={styles.container}>
    <BuyLatte/>
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
