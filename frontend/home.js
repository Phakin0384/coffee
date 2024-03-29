import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');

  const handleTap = () => {
    // Navigate to the screen you want upon tapping
    navigation.navigate('Home');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleTap}>
      <Image source={{ uri: 'https://img2.pic.in.th/pic/S__30203910.jpeg' }} style={styles.imageHome} />
      <Image source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/016/589/155/small_2x/hand-gestures-finger-and-sign-language-outline-icon-png.png' }} style={styles.imageHand} />
      <Text style={styles.text}>TAP TO BUY COFFEE</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'#FFFFFF',
  },
  imageHome: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  imageHand: {
    width: 32,
    height: 38,
    position: 'absolute',
    bottom: 170,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 100,
  },
});

export default Home;

