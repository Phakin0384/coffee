import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.menuTitle}>เมนู</Text>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuItem}>Mocca</Text>
        <Text style={styles.menuItem}>Amricano</Text>
        <Text style={styles.menuItem}>Espresspso</Text>
        <Text style={styles.menuItem}>Capuchino</Text>
        <Text style={styles.menuItem}>Latte</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE8DC', // สีพื้นหลังที่เหมาะสำหรับร้านกาแฟ
    alignItems: 'center',
    justifyContent: 'center', // จัดเรียงเนื้อหาด้านบนสุดของ container
    paddingTop: 30, // เพิ่มระยะห่างด้านบนของ container
  },
  menuTitle: {
    marginBottom: 200, // เพิ่มระยะห่างระหว่างเมนูกาแฟกับหัวเรื่อง
    fontFamily: 'Inria Serif', // เปลี่ยนแบบอักษร
    fontSize: 30, // กำหนดขนาดอักษร
    color: '#000000', // สีของข้อความ
  },
  menuItemContainer: {
    width: Dimensions.get('window').width, // ให้ความกว้างเท่ากับความกว้างของหน้าจอ
    alignItems: 'center', // จัดเรียงเมนูให้อยู่ตรงกลาง
    padding: 20, // เพิ่มช่องว่างรอบขอบของเมนู
    borderRadius: 10, // กำหนดขอบเขตโค้งของเมนู
  },
  menuItem: {
    marginBottom: 60, // เพิ่มระยะห่างระหว่างรายการเมนู
    fontFamily: 'Inria Serif', // เปลี่ยนแบบอักษร
    fontSize: 20, // กำหนดขนาดอักษร
    color: '#000000', // สีของข้อความ
  },
});
