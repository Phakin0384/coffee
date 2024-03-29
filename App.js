import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Home from './frontend/home';
import Buymocca from './frontend/buymocca';
import Menu from './frontend/menu';
import 'react-native-gesture-handler';
export default function App() {
  return (
    <View style={styles.container}>
    <Home/>
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
