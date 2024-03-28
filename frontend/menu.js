import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

export default function App() {
  const NoteBook1 = {
    uri: 'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
    width: 250,
    height: 175,
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.menuTitle}>เมนู</Text>
      <View style={styles.menuItemContainer}>
        <View style={styles.menuItem}>
          <Image source={NoteBook1} style={styles.menuItemIcon} />
          <Text style={styles.menuItemText}>Mocca</Text>
        </View>
        <Text style={styles.menuItemText}>Amricano</Text>
        <Text style={styles.menuItemText}>Espresspso</Text>
        <Text style={styles.menuItemText}>Capuchino</Text>
        <Text style={styles.menuItemText}>Latte</Text>
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
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: 'row', // เพิ่มเพื่อให้รูปและข้อความเรียงในแนวนอน
    marginBottom: 60,
    alignItems: 'center', // จัดให้รูปและข้อความอยู่กึ่งกลางตามแนวตั้ง
  },
  menuItemIcon: {
    marginRight: 10, // เพิ่มระยะห่างระหว่างรูปและข้อความ
    width: 50, // กำหนดความกว้างของรูปภาพ
    height: 50, // กำหนดความสูงของรูปภาพ
    borderRadius: 5, // กำหนดขอบเขตโค้งของรูปภาพ
  },
  menuItemText: {
    fontFamily: 'Inria Serif',
    fontSize: 20,
    color: '#000000',
  },
});
