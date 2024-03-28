import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

export default function App() {
    const MoccaImage = {
      uri: 'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
      width: 250,
      height: 200,
    };
  
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <Text style={styles.menuTitle}>เมนู</Text>
        <View style={styles.menuItemContainer}>
          <View style={styles.menuItem}>
            <Image source={MoccaImage} style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Mocca</Text>
          </View>
            <Text></Text>
        </View>
      </View>
    );
  }