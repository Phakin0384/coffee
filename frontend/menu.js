import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.menuTitle}>เมนูกาแฟ</Text>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuItem}>กาแฟเย็น</Text>
        <Text style={styles.menuItem}>กาแฟดำ</Text>
        <Text style={styles.menuItem}>กาแฟหวาน</Text>
        <Text style={styles.menuItem}>กาแฟไขมัน</Text>
        <Text style={styles.menuItem}>กาแฟออร์แกนิค</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4B3621', // สีพื้นหลังที่เหมาะสำหรับร้านกาแฟ
    alignItems: 'center',
    justifyContent: 'flex-start', // จัดเรียงเนื้อหาด้านบนสุดของ container
    paddingTop: 50, // เพิ่มระยะห่างด้านบนของ container
  },
  menuTitle: {
    marginBottom: 20, // เพิ่มระยะห่างระหว่างเมนูกาแฟกับหัวเรื่อง
    fontFamily: 'Arial', // เปลี่ยนแบบอักษร
    fontSize: 30, // กำหนดขนาดอักษร
    color: '#FFFFFF', // สีของข้อความ
    alignSelf: 'flex-start', // จัดเรียงตามด้านบนของ container
  },
  menuItemContainer: {
    width: Dimensions.get('window').width * 1, // ให้ความกว้างเป็น 80% ของความกว้างของหน้าจอ
    padding: 20, // เพิ่มช่องว่างรอบขอบของเมนู
    borderRadius: 10, // กำหนดขอบเขตโค้งของเมนู
  },
  menuItem: {
    marginBottom: 10, // เพิ่มระยะห่างระหว่างรายการเมนู
    fontFamily: 'Arial', // เปลี่ยนแบบอักษร
    fontSize: 20, // กำหนดขนาดอักษร
    color: '#FFFFFF', // สีของข้อความ
  },
});
