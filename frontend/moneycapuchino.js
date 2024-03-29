import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Moneycapuchino = () => {
  const navigation = useNavigation();
  const handleTap = () => {
    const data={
      prices: navigation.setParams('price')
    }
      navigation.navigate('Home');
      axios.post("http://10.64.40.137:5000/bill", data ,{ timeout: 10000 })
  .then(response => {
    console.log(response.data); // Log response for debugging
    navigation.navigate('Home');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error occurred while processing your order. Please try again later.');
  });
    };

//export default function App() {
  const Cappuccino = {
    uri: 'https://coffeeaffection.com/wp-content/uploads/2021/02/does-a-cappuccino-have-caffeine.jpg',
  };
  const QR = {
    uri: 'https://img5.pic.in.th/file/secure-sv1/S__30220303.jpeg',
  };

  return (
    <View style={styles.container}>
      <Image source={Cappuccino} style={styles.Cappuccinoimage}/>
      <View style={styles.textBox}>
        <Text style={styles.text}>Cappuccino</Text>
        </View>
        
        <Image source={QR} style={styles.QRiamge}/>
        <View style={styles.BATHtext}>
          <Text style={styles.text}>ราคา 50 BATH</Text>
        </View>
        <Image source={QR} style={styles.QRimage}/>
            <TouchableOpacity style={styles.textTHX} onPress={handleTap}>
                <Text style={styles.text}>THANK YOU</Text>
            </TouchableOpacity>
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
  },
  BATHtext: {
    top: 50,
  }

});

export default Moneycapuchino;