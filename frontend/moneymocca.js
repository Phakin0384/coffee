import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

const Moneymocca = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');

    const handleTap = () => {
        // Navigate to the screen you want upon tapping
        navigation.navigate('Moneymocca');
      };

//export default function App() {
  const Mocca = {
    uri: 'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
  };
  const Hot = {
    uri: 'https://www.freeiconspng.com/uploads/black-flame-icon-png-24.png',
  };
  const Cold = {
    uri: 'https://static.thenounproject.com/png/1184671-200.png',
  };
  const back = {
    uri: 'https://cdn.icon-icons.com/icons2/1339/PNG/512/thinarrowpointingleft_87489.png',
  };

  return (
    <View style={styles.container}>
      <Image source={back} style={styles.backimage}/>
      <View style={styles.textback}>
        <Text style={styles.text}>ย้อนกลับ</Text>
        </View>
      <Image source={Mocca} style={styles.Moccaimage}/>
      <View style={styles.textBox}>
        <Text style={styles.text}>Mocca</Text>
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
  backimage: {
    width: 30, // กำหนดความกว้างของรูปภาพ
    height: 20, // กำหนดความสูงของรูปภาพ
    margin: -10,
    right : 160,
    top: 36,
  },
  Moccaimage: {
    width: 290, // กำหนดความกว้างของรูปภาพ
    height: 370, // กำหนดความสูงของรูปภาพ
    marginBottom: -100, // กำหนดระยะห่างจากข้อความด้านล่าง
    margin: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    top: 110,
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
  textselectsweet25: {
    paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
    paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
    borderWidth: 2, // กำหนดความหนาของกรอบ
    borderColor: 'black', // กำหนดสีของกรอบ
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    paddingVertical: 5,
    top: 132,
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
    top: 95,
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
    top: 57,
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
    top: 20,
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

export default Moneymocca;
