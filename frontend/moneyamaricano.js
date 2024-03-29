import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Moneyamaricano = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');

    const handleTap = () => {
        navigation.navigate('Moneyamaricano');
      };

//export default function App() {
  const amaricano = {
    uri: 'https://www.acouplecooks.com/wp-content/uploads/2022/01/Iced-Americano-008s.jpg',
  };
  const back = {
    uri: 'https://cdn.icon-icons.com/icons2/1339/PNG/512/thinarrowpointingleft_87489.png',
  };
  const QR = {
    uri: 'https://img2.pic.in.th/pic/S__30212103.jpeg',
  };

  return (
    <View style={styles.container}>
      <Image source={back} style={styles.backimage}/>
      <Image source={amaricano} style={styles.amaricanoimage}/>
      <View style={styles.textBox}>
        <Text style={styles.text}>Amaricano</Text>
        </View>
        
        <Image source={QR} style={styles.QRiamge}/>
        <View style={styles.textTHX}>
        <Text style={styles.text}>THANK YOU</Text>
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
  backimage: {
    width: 30, // กำหนดความกว้างของรูปภาพ
    height: 20, // กำหนดความสูงของรูปภาพ
    margin: -10,
    right : 160,
    top: -80,
  },
  amaricanoimage: {
    width: 290, // กำหนดความกว้างของรูปภาพ
    height: 370, // กำหนดความสูงของรูปภาพ
    marginBottom: -100, // กำหนดระยะห่างจากข้อความด้านล่าง
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    top: -40,
  },
  textBox: {
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    paddingHorizontal: 70, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: -367,
  },
  textTHX: {
    top: 70,
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    paddingHorizontal: 70, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 13, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderRadius: 20,
    backgroundColor: '#E0C5B1',
    paddingVertical: 8,
  },
  text: {
    fontSize: 20, // กำหนดขนาดของตัวอักษร
    fontFamily: 'Arial',
  },
  QRiamge: {
    width: 150, // กำหนดความกว้างของรูปภาพ
    height: 150, // กำหนดความสูงของรูปภาพ
    right : 0,
    margin: 5,
    top: 35,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  }

});

export default Moneyamaricano;