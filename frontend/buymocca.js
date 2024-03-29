import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native';

export default function App() {
  const Mocca = {
    uri: 'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
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
      <Image source={Mocca} style={styles.Moccaimage}/>
      <View style={styles.textBox}>
        <Text style={styles.text}>Mocca</Text>
      </View>

      <View style={styles.textSweet}>
        <Text style={styles.text}>ระดับความหวาน</Text>
      </View>

      <View style={styles.textselectsweet25}>
        <TouchableOpacity onPress={() => handleSweetnessSelection(25)}>
          <Text style={[styles.text, sweetness === 25 && styles.selected]}>25 %</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textselectsweet50}>
        <TouchableOpacity onPress={() => handleSweetnessSelection(50)}>
          <Text style={[styles.text, sweetness === 50 && styles.selected]}>50 %</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textselectsweet75}>
        <TouchableOpacity onPress={() => handleSweetnessSelection(75)}>
          <Text style={[styles.text, sweetness === 75 && styles.selected]}>75 %</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.textselectsweet100}>
        <TouchableOpacity onPress={() => handleSweetnessSelection(100)}>
          <Text style={[styles.text, sweetness === 100 && styles.selected]}>100 %</Text>
        </TouchableOpacity>
      </View>

      <Image source={Hot} style={styles.Hotimage}/>
      <TouchableOpacity onPress={() => handleTemperatureSelection('hot')} style={styles.textselecthot}>
        <Text style={[styles.text, temperature === 'hot' && styles.selected]}>ร้อน</Text>
      </TouchableOpacity>

      <Image source={Cold} style={styles.Coldimage}/>
      <TouchableOpacity onPress={() => handleTemperatureSelection('cold')} style={styles.textselectcold}>
        <Text style={[styles.text, temperature === 'cold' && styles.selected]}>เย็น</Text>
      </TouchableOpacity>

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
    backgroundColor: '#EEE8DC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 400,
  },
  Moccaimage: {
    width: 290,
    height: 370,
    marginBottom: -100,
    margin: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    top: 25
  },
  Hotimage: {
    width: 30,
    height: 40,
    top: 95,
    right: 130
  },
  Coldimage: {
    width: 40,
    height: 40,
    top: 15,
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
    top: 130,
  },
  text: {
    fontSize: 20,
    fontFamily: 'Arial',
  },
  textSweet: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    paddingHorizontal: 30,
    backgroundColor: '#EBCCCC',
    paddingVertical: 5,
    top: 140,
  },
  textselectsweet25: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    top: 155,
    right: 130,
  },
  textselectsweet50: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    top: 120,
    right: 40,
  },
  textselectsweet75: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    top: 83,
    left: 50,
  },
  textselectsweet100: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    top: 46,
    left: 140,
  },
  textselecthot: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    top: 60,
    right: 60,
  },
  textselectcold: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    top: -21,
    left: 60,
  },
  textselectcancel: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    top: 20,
    right: 90,
  },
  textselectcoreect: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    top: -22,
    left: 80,
  },
  selected: {
    backgroundColor: '#F0C419', // Change to your desired color when selected
  }
});

// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

// export default function App() {
//   const Mocca = {
//     uri: 'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
//   };
//   const Hot = {
//     uri: 'https://www.freeiconspng.com/uploads/black-flame-icon-png-24.png',
//   };
//   const Cold = {
//     uri: 'https://static.thenounproject.com/png/1184671-200.png',
//   };

//   return (
//     <View style={styles.container}>
//       <Image source={Mocca} style={styles.Moccaimage}/>
//       <View style={styles.textBox}>
//         <Text style={styles.text}>Mocca</Text>
//         </View>

//         <View style={styles.textSweet}>
//         <Text style={styles.text}>ระดับความหวาน</Text>
//         </View>

//         <View style={styles.textselectsweet25}>
//         <Text style={styles.text}>25 %</Text>
//         </View>

//         <View style={styles.textselectsweet50}>
//         <Text style={styles.text}>50 %</Text>
//         </View>
//         <View style={styles.textselectsweet75}>
//         <Text style={styles.text}>75 %</Text>
//         </View>
//         <View style={styles.textselectsweet100}>
//         <Text style={styles.text}>100 %</Text>
//         </View>
//         <Image source={Hot} style={styles.Hotimage}/>
//         <View style={styles.textselecthot}>
//         <Text style={styles.text}>ร้อน</Text>
//         </View>
//         <Image source={Cold} style={styles.Coldimage}/>
//         <View style={styles.textselectcold}>
//         <Text style={styles.text}>เย็น</Text>
//         </View>
//         <View style={styles.textselectcancel}>
//         <Text style={styles.text}>ยกเลิก</Text>
//         </View>
//         <View style={styles.textselectcoreect}>
//         <Text style={styles.text}>ยืนยันคำสั่งซื้อ</Text>
//         </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#EEE8DC', // กำหนดสีพื้นหลังของทั้งหน้าจอ
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     width:400,
//   },
//   Moccaimage: {
//     width: 290, // กำหนดความกว้างของรูปภาพ
//     height: 370, // กำหนดความสูงของรูปภาพ
//     marginBottom: -100, // กำหนดระยะห่างจากข้อความด้านล่าง
//     margin: 5,
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     top: 25
//   },
//   Hotimage: {
//     width: 30, // กำหนดความกว้างของรูปภาพ
//     height: 40, // กำหนดความสูงของรูปภาพ
//     top: 95,
//     right: 130
//   },
//   Coldimage: {
//     width: 40, // กำหนดความกว้างของรูปภาพ
//     height: 40, // กำหนดความสูงของรูปภาพ
//     top: 15,
//     left: 130,
//   },
//   textBox: {
//     borderWidth: 2, // กำหนดความหนาของกรอบ
//     borderColor: 'black', // กำหนดสีของกรอบ
//     paddingHorizontal: 90, // กำหนดระยะห่างภายในกรอบด้านข้าง
//     paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//     borderRadius: 20,
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 5,
//     top: 130,
//   },
//   text: {
//     fontSize: 20, // กำหนดขนาดของตัวอักษร
//     fontFamily: 'Arial',
//   },
//   textSweet: {
//     paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
//     paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//     borderRadius: 20,
//     paddingHorizontal: 30,
//     backgroundColor: '#EBCCCC',
//     paddingVertical: 5,
//     top: 140,
//   },
//   textselectsweet25: {
//     paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
//     paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//     borderWidth: 2, // กำหนดความหนาของกรอบ
//     borderColor: 'black', // กำหนดสีของกรอบ
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 5,
//     top: 155,
//     right: 130,
//   },
//   textselectsweet50: {
//     paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
//     paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//     borderWidth: 2, // กำหนดความหนาของกรอบ
//     borderColor: 'black', // กำหนดสีของกรอบ
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 5,
//     top: 120,
//     right: 40,
//   },
//   textselectsweet75: {
//     paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
//     paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//     borderWidth: 2, // กำหนดความหนาของกรอบ
//     borderColor: 'black', // กำหนดสีของกรอบ
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 5,
//     top: 83,
//     left: 50,
//   },
//   textselectsweet100: {
//     paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
//     paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//     borderWidth: 2, // กำหนดความหนาของกรอบ
//     borderColor: 'black', // กำหนดสีของกรอบ
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 5,
//     top: 46,
//     left: 140,
//   },
//   textselecthot: {
//     paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
//     paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//     borderWidth: 2, // กำหนดความหนาของกรอบ
//     borderColor: 'black', // กำหนดสีของกรอบ
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 5,
//     top: 60,
//     right: 60,
//   },
//     textselectcold: {
//       paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
//       paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//       borderWidth: 2, // กำหนดความหนาของกรอบ
//       borderColor: 'black', // กำหนดสีของกรอบ
//       borderRadius: 20,
//       paddingHorizontal: 20,
//       backgroundColor: '#FFFFFF',
//       paddingVertical: 5,
//       top: -21,
//       left: 60,
//   },
//   textselectcancel: {
//     paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
//     paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//     borderWidth: 3, // กำหนดความหนาของกรอบ
//     borderColor: 'black', // กำหนดสีของกรอบ
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     backgroundColor: '#F1A4A4',
//     paddingVertical: 5,
//     top: 20,
//     right: 90,
//   },
//   textselectcoreect: {
//     paddingHorizontal: 20, // กำหนดระยะห่างภายในกรอบด้านข้าง
//     paddingVertical: 10, // กำหนดระยะห่างภายในกรอบด้านบนและล่าง
//     borderWidth: 3, // กำหนดความหนาของกรอบ
//     borderColor: 'black', // กำหนดสีของกรอบ
//     borderRadius: 20,
//     paddingHorizontal: 20,
//     backgroundColor: '#E8FFC1',
//     paddingVertical: 5,
//     top: -22,
//     left: 80,
//   }
// });
