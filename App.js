import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './frontend/home';
import Menu from './frontend/menu';
import BuyLatte from './frontend/buylatte';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

function App() {
  return (
    <View style={styles.container}>
    <BuyLatte/>
    </View>
    
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
