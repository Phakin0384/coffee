import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';

export default function App() {
  const Americano = {
    uri: 'https://www.acouplecooks.com/wp-content/uploads/2022/01/Iced-Americano-008s.jpg',
  };
  const Hot = {
    uri: 'https://www.freeiconspng.com/uploads/black-flame-icon-png-24.png',
  };
  const Cold = {
    uri: 'https://static.thenounproject.com/png/1184671-200.png',
  };

  const [sweetness, setSweetness] = useState(null);
  const [temperature, setTemperature] = useState(null);

  const handleSweetnessSelection = (level) => {
    setSweetness(level);
  };

  const handleTemperatureSelection = (type) => {
    setTemperature(type);
  };

  return (
    <View style={styles.container}>
      <Image source={Americano} style={styles.Americanoimage}/>
      <View style={styles.textBox}>
        <Text style={styles.text}>Americano</Text>
      </View>

      <Image source={Hot} style={styles.Hotimage}/>
      <TouchableOpacity onPress={() => handleTemperatureSelection('hot')} style={styles.textselecthot}>
        <Text style={[styles.text, temperature === 'hot' && styles.selected]}>ร้อน</Text>
      </TouchableOpacity>

      <Image source={Cold} style={styles.Coldimage}/>
      <TouchableOpacity onPress={() => handleTemperatureSelection('cold')} style={styles.textselectcold}>
        <Text style={[styles.text, temperature === 'cold' && styles.selected]}>เย็น</Text>
      </TouchableOpacity>


      <View style={styles.textselectcoreect}>
        <Text style={styles.text}>ยืนยันคำสั่งซื้อ</Text>
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
    position: 'relative',
    width: 400,
  },
  Americanoimage: {
    width: 290,
    height: 370,
    marginBottom: -100,
    margin: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    top: -90
  },
  Hotimage: {
    width: 30,
    height: 40,
    top: 75,
    right: 130
  },
  Coldimage: {
    width: 40,
    height: 40,
    top: -5,
    left: 130,
  },
  textBox: {
    borderWidth: 2,
    borderColor: 'black',
    paddingHorizontal: 90,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: 30,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Arial',
  },
  textselecthot: {
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    top: 40,
    right: 60,
  },
  textselectcold: {
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    top: -41,
    left: 60,
  },
  textselectcoreect: {
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E8FFC1',
    top: 10,
    left: 0,
  },
  selected: {
    backgroundColor: '#F1A4A4', 
    borderRadius: 20,
  },
});