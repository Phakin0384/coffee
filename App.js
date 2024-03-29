import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './frontend/home';
import Menu from './frontend/menu';
import Buymocca from './frontend/buymocca';
import Buyamaricano from './frontend/buyamaricano';
import Buyespresso from './frontend/buyespresso';
import Buycapuchino from './frontend/buycapuchino';
import BuyLatte from './frontend/buylatte';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="BuyLatte" component={BuyLatte} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;