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
    marginBottom: 20,
    fontFamily: 'Inria Serif',
    fontSize: 30,
    color: '#000000',
  },
  menuItemContainer: {
    width: Dimensions.get('window').width,
    alignItems: 'flex-start', // จัดเรียงเนื้อหาให้ชิดด้านซ้าย
    padding: 20,
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: 'row', // เพิ่มเพื่อให้รูปและข้อความเรียงในแนวนอน
    marginBottom: 20,
    alignItems: 'center', // จัดให้รูปและข้อความอยู่กึ่งกลางตามแนวตั้ง
  },
  menuItemIcon: {
    marginRight: 10,
    width: 70,
    height: 90,
    borderRadius: 6,
  },
  menuItemText: {
    fontFamily: 'Inria Serif',
    fontSize: 20,
    color: '#000000',
  },
});
