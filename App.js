import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Home from './frontend/home';
import Menu from './frontend/menu';
import BuyScreen from './frontend/screens/BuyScreen';
import PaymentScreen from './frontend/screens/PaymentScreen';
import { ThemeProvider, useTheme } from './frontend/ThemeContext';

const Stack = createStackNavigator();

// Every screen draws its own CREMA top bar (wordmark, step dots, Back/Theme),
// so the navigator's stock header is turned off throughout.
function Navigation() {
  const { colors, isDark } = useTheme();
  return (
    <NavigationContainer
      theme={{
        dark: isDark,
        colors: {
          primary: colors.crema,
          background: colors.ground,
          card: colors.panel,
          text: colors.ink,
          border: colors.line,
          notification: colors.crema,
        },
      }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Buy" component={BuyScreen} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Navigation />
    </ThemeProvider>
  );
}

export default App;
