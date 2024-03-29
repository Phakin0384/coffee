import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

export default function App() {
  const Amaricano = {
    uri: 'https://www.acouplecooks.com/wp-content/uploads/2022/01/Iced-Americano-008s.jpg',
  };
  const Hot = {
    uri: 'https://www.freeiconspng.com/uploads/black-flame-icon-png-24.png',
  };
  const Cold = {
    uri: 'https://static.thenounproject.com/png/1184671-200.png',
  };

  return (
    <View style={styles.container}>
      <View style={styles.textback}>
        <Text style={styles.text}>ย้อนกลับ</Text>
        </View>
      <Image source={Amaricano} style={styles.Amaricanoimage}/>
      <View style={styles.textBox}>
        <Text style={styles.text}>Amaricano</Text>
        </View>

        <Image source={Hot} style={styles.Hotimage}/>
        <View style={styles.textselecthot}>
        <Text style={styles.text}>ร้อน</Text>
        </View>
        <Image source={Cold} style={styles.Coldimage}/>
        <View style={styles.textselectcold}>
        <Text style={styles.text}>เย็น</Text>
        </View>
        <View style={styles.textselectcancel}>
        <Text style={styles.text}>ยกเลิก</Text>
        </View>
        <View style={styles.textselectcoreect}>
        <Text style={styles.text}>ยืนยันคำสั่งซื้อ</Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEE8DC', // กำหนดสีพื้นหลังของทั้งหน้าจอ
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width:400,
  },
  Amaricanoimage: {
    width: 290, // กำหนดความกว้างของรูปภาพ
    height: 370, // กำหนดความสูงของรูปภาพ
    marginBottom: -100, // กำหนดระยะห่างจากข้อความด้านล่าง
    margin: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    top: -70
  },
  Hotimage: {
    width: 30, // กำหนดความกว้างของรูปภาพ
    height: 40, // กำหนดความสูงของรูปภาพ
    top: 65,
    right: 130
  },
  Coldimage: {
    width: 40, // กำหนดความกว้างของรูปภาพ
    height: 40, // กำหนดความสูงของรูปภาพ
    top: -12,
    left: 130,
  },
  textback: {
    margin: 13,
    right: 89,
    top: 7,
    borderWidth: 3,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#E8FFC1'
  },
  textBox: {
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    paddingHorizontal: 90, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: 40,
  },
  text: {
    fontSize: 20, // กำหนดขนาดของตัวอักษร
    fontFamily: 'Arial',
  },
  textSweet: {
    paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderRadius: 20,
    paddingHorizontal: 30,
    backgroundColor: '#EBCCCC',
    paddingVertical: 5,
    top: 120,
  },
  textselecthot: {
    paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: 30,
    right: 60,
  },
    textselectcold: {
      paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
      paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
      borderWidth: 2, // กำหนดความหนาของกรอบ
      borderColor: 'black', // กำหนดสีของกรอบ
      borderRadius: 20,
      paddingHorizontal: 20,
      backgroundColor: '#FFFFFF',
      paddingVertical: 5,
      top: -51,
      left: 60,
  },
  textselectcancel: {
    paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderWidth: 3, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: '#F1A4A4',
    paddingVertical: 5,
    top: 34,
    right: 90,
  },
  textselectcoreect: {
    paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderWidth: 3, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    borderRadius: 20,
    paddingHorizontal: 20,
    backgroundColor: '#E8FFC1',
    paddingVertical: 5,
    top: -8,
    left: 80,
  }
});
