import React , { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () =>{
  const navigation = useNavigation();
  const [name,setName] = useState('');
  const home = {
    uri: 'https://img2.pic.in.th/pic/S__30203910.jpeg',
  };
  const hand = {
    uri: 'https://static.vecteezy.com/system/resources/thumbnails/016/589/155/small_2x/hand-gestures-finger-and-sign-language-outline-icon-png.png',
  };

  return (
    <View style={styles.container}>
      <Image source={home} style={styles.imageHome} />
      <Image source={hand} style={styles.imageHand} />
      <Text style={styles.text}>TAP TO BUY COFFEE</Text>
    </View>
  );
}
// export default function App() {
  
// }

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // ทำให้ container สามารถเป็น parent สำหรับ position absolute ของ elements ภายใน
  },
  imageHome: {
    width: 300, // ปรับขนาดตามที่ต้องการ
    height: 300, // ปรับขนาดตามที่ต้องการ
    marginBottom: 20, // ปรับตามที่คุณต้องการ เพื่อให้เหมาะสมกับ layout
  },
  imageHand: {
    position: 'absolute', // ทำให้รูปนี้สามารถวางเหนือหรือด้านล่างของอีกภาพหนึ่งได้
    width: 32, // ปรับขนาดตามที่ต้องการ
    height: 38, // ปรับขนาดตามที่ต้องการ
    bottom: 170, // ปรับตำแหน่ง bottom ตามที่คุณต้องการ
  },
  text: {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    position: 'absolute', // ทำให้ข้อความนี้สามารถปรับตำแหน่งได้อย่างอิสระ
    bottom: 100, // ปรับตำแหน่ง bottom ตามที่ต้องการ เพื่อให้อยู่ด้านล่างของรูปภาพ hand
  },
});
