import React from 'react';
import { StatusBar, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function App() {
  
  const navigation = useNavigation();
  
  const handleMenuPress = (menuItem) => {
    switch (menuItem) {
      case "Mocca":
        const data ={
          name:menuItem
        }
        navigation.navigate('BuyMocca');
        axios.post("http://10.64.40.137:5000/bill", data ,{ timeout: 10000 })
      .then(response => {
        console.log(response.data); // Log response for debugging
        navigation.navigate('MOCCA');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while processing your order. Please try again later.');
      });

        break;
      case "Americano":
        navigation.navigate('BuyAmericano');
        axios.post("http://10.64.40.137:5000/bill", data)
      .then(response => {
        console.log(response.data); // Log response for debugging
        navigation.navigate('AMARICANO');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while processing your order. Please try again later.');
      });
        break;
      case "Espresso":
        navigation.navigate('BuyEspresso');
        axios.post("http://10.64.40.137:5000/bill", data)
      .then(response => {
        console.log(response.data); // Log response for debugging
        navigation.navigate('ESPRESSO');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while processing your order. Please try again later.');
      });
        break;
      case "Cappuccino":
        navigation.navigate('BuyCappuccino');
        axios.post("http://10.64.40.137:5000/bill", data)
      .then(response => {
        console.log(response.data); // Log response for debugging
        navigation.navigate('CAPUCHINO');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while processing your order. Please try again later.');
      });
        break;
      case "Latte":
        navigation.navigate('BuyLatte');
        axios.post("http://10.64.40.137:5000/bill", data)
      .then(response => {
        console.log(response.data); // Log response for debugging
        navigation.navigate('LATTE');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error occurred while processing your order. Please try again later.');
      });
        break;
      default:
        break;
    }
  };

  const Mocca = {
    uri: 'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
  };

  const Americano = {
    uri: 'https://www.acouplecooks.com/wp-content/uploads/2022/01/Iced-Americano-008s.jpg',
  };
  const Espresso = {
    uri: 'https://www.thespruceeats.com/thmb/HJrjMfXdLGHbgMhnM0fMkDx9XPQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/what-is-espresso-765702-hero-03_cropped-ffbc0c7cf45a46ff846843040c8f370c.jpg',
  };
  const Cappuccino = {
    uri: 'https://coffeeaffection.com/wp-content/uploads/2021/02/does-a-cappuccino-have-caffeine.jpg',
  };
  const Latte = {
    uri: 'https://coffeeaffection.com/wp-content/uploads/2021/05/Spanish-latte-milk-and-espresso.jpg',
  };
  const Logocoffee = {
    uri: 'https://i.pinimg.com/originals/86/35/91/8635916db47d59862c20162626f8a1f3.png',
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.menuTitle}>เมนู</Text>
      <Text style={[styles.menuTitle, styles.selectMenu]}>กดเพื่อเลือกเมนู</Text>
      <Text style={styles.orderHere}>ORDER YOUR COFFEE</Text> 

      <View style={styles.menuItemContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("Mocca")}>
          <Image source={Mocca} style={styles.menuItemImage} />
          <Text style={styles.menuItemText}>Mocca</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("Americano")}>
          <Image source={Americano} style={styles.menuItemImage} />
          <Text style={styles.menuItemText}>Americano</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("Espresso")}>
          <Image source={Espresso} style={styles.menuItemImage} />
          <Text style={styles.menuItemText}>Espresso</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("Cappuccino")}>
          <Image source={Cappuccino} style={styles.menuItemImage} />
          <Text style={styles.menuItemText}>Cappuccino</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress("Latte")}>
          <Image source={Latte} style={styles.menuItemImage} />
          <Text style={styles.menuItemText}>Latte</Text>
        </TouchableOpacity>
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
    width: 400,
  },
  menuTitle: {
    fontFamily: 'Arial',
    fontSize: 45,
    color: '#000000',
    right: 100,
    top: -5,
  },
  selectMenu: {
    fontSize: 15,
    fontFamily: 'Arial',
    position: 'absolute',
    top: 80,
    right: 85,
  },
  menuItemContainer: {
    padding: 20,
    borderRadius: 10,
  },
  menuItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    marginLeft: 30,
  },
  menuItemImage: {
    width: 70,
    height: 90,
    borderRadius: 6,
  },
  menuItemText: {
    fontFamily: 'Arial',
    fontSize: 20,
    color: '#000000',
    marginLeft: 100,
    borderWidth: 2,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  orderHere: {
    position: 'absolute',
    top: 15,
    right: 20,
    fontFamily: 'Arial',
    fontSize: 15,
    color: '#000000',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#000000',
    overflow: 'hidden',
  },
});