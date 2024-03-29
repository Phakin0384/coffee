import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

export default function App() {
  const Cappuccino = {
    uri: 'https://coffeeaffection.com/wp-content/uploads/2021/02/does-a-cappuccino-have-caffeine.jpg',
  };
  const Hot = {
    uri: 'https://www.freeiconspng.com/uploads/black-flame-icon-png-24.png',
  };
  const Cold = {
    uri: 'https://static.thenounproject.com/png/1184671-200.png',
  };

  return (
    <View style={styles.container}>
      <Image source={Cappuccino} style={styles.Cappuccinoimage}/>
      <View style={styles.textBox}>
        <Text style={styles.text}>Cappuccino</Text>
        </View>

        <View style={styles.textSweet}>
        <Text style={styles.text}>ระดับความหวาน</Text>
        </View>

        <View style={styles.textselectsweet25}>
        <Text style={styles.text}>25 %</Text>
        </View>

        <View style={styles.textselectsweet50}>
        <Text style={styles.text}>50 %</Text>
        </View>
        <View style={styles.textselectsweet75}>
        <Text style={styles.text}>75 %</Text>
        </View>
        <View style={styles.textselectsweet100}>
        <Text style={styles.text}>100 %</Text>
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
  Cappuccinoimage: {
    width: 290, // กำหนดความกว้างของรูปภาพ
    height: 370, // กำหนดความสูงของรูปภาพ
    marginBottom: -100, // กำหนดระยะห่างจากข้อความด้านล่าง
    margin: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    top: 20,
  },
  Hotimage: {
    width: 30, // กำหนดความกว้างของรูปภาพ
    height: 40, // กำหนดความสูงของรูปภาพ
    top: 85,
    right: 130
  },
  Coldimage: {
    width: 40, // กำหนดความกว้างของรูปภาพ
    height: 40, // กำหนดความสูงของรูปภาพ
    top: 12,
    left: 130,
  },
  textBox: {
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    paddingHorizontal: 90, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: 130,
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
    top: 140,
  },
  textselectsweet25: {
    paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: 152,
    right: 130,
  },
  textselectsweet50: {
    paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: 115,
    right: 40,
  },
  textselectsweet75: {
    paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: 77,
    left: 50,
  },
  textselectsweet100: {
    paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: 40,
    left: 140,
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
    top: 50,
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
      top: -31,
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
    top: 20,
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
    top: -20,
    left: 80,
  }
});
