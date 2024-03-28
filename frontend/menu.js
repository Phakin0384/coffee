import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

export default function App() {
  const Mocca = {
    uri: 'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
  };

  const Americano = {
    uri: 'https://www.acouplecooks.com/wp-content/uploads/2022/01/Iced-Americano-008s.jpg',
  };
  const Espresso = {
    uri: 'https://www.thespruceeats.com/thmb/HJrjMfXdLGHbgMhnM0fMkDx9XPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/what-is-espresso-765702-hero-03_cropped-ffbc0c7cf45a46ff846843040c8f370c.jpg',
  };
  const Cappuccino = {
    uri: 'https://coffeeaffection.com/wp-content/uploads/2021/02/does-a-cappuccino-have-caffeine.jpg',
  };
  const Latte = {
    uri: 'https://coffeeaffection.com/wp-content/uploads/2021/05/Spanish-latte-milk-and-espresso.jpg',
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.menuTitle}>เมนู</Text>
      <Text style={[styles.menuTitle, styles.selectMenu]}>
        กดเพื่อเลือกเมนู
      </Text>
      <View style={styles.menuItemContainer}>
        <View style={styles.menuItem}>
          <Image source={Mocca} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Mocca</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={Americano} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Americano</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={Espresso} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Espresso</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={Cappuccino} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Cappuccino</Text>
        </View>
        <View style={styles.menuItem}>
          <Image source={Latte} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Latte</Text>
        </View>
      </View>
      <View style={styles.taskBar}>
        <Text style={styles.taskBarText}>Task bar</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE8DC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  menuTitle: {
    marginBottom: 50,
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#000000',
  },
  selectMenu: {
    fontSize: 15,
    fontFamily: 'Arial',
    position: 'absolute',
    top: 170,
    right: 70,
  },
  menuItemContainer: {
    width: Dimensions.get('window').width,
    alignItems: 'flex-start',
    padding: 20,
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    marginLeft: 30,
  },
  menuItemIcon: {
    width: 70,
    height: 90,
    borderRadius: 6,
  },
  menuItemText: {
    fontFamily: 'Inria Serif',
    fontSize: 20,
    color: '#000000',
    marginLeft: 100,
    borderWidth: 3,
    borderColor: '#000000',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  taskBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#7E7E7E', // สีพื้นหลังของ task bar
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskBarText: {
    fontFamily: 'Arial',
    fontSize: 30, // ขนาดข้อความของ task bar
    color: '#000000', // สีข้อความของ task bar
  },
});
