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
import Moneymocca from './frontend/moneymocca';
import Moneylatte from './frontend/moneylatte';
import Moneyespresso from './frontend/moneyespresso';
import Moneycapuchino from './frontend/moneycapuchino';
import Moneyamaricano from './frontend/moneyamaricano';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="BuyMocca" component={Buymocca} />
        <Stack.Screen name="BuyAmericano" component={Buyamaricano} />
        <Stack.Screen name="BuyEspresso" component={Buyespresso} />
        <Stack.Screen name="BuyCappuccino" component={Buycapuchino} />
        <Stack.Screen name="BuyLatte" component={BuyLatte} />
        <Stack.Screen name="MOCCA" component={Moneymocca} />
        <Stack.Screen name="AMERICANO" component={Moneyamaricano} />
        <Stack.Screen name="CAPUCHINO" component={Moneycapuchino} />
        <Stack.Screen name="ESPRESSO" component={Moneyespresso} />
        <Stack.Screen name="LATTE" component={Moneylatte} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;