import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Moneymocca = () => {
    const navigation = useNavigation();

    const handleTap = () => {
        navigation.navigate('Home');
    };

    const Mocca = {
        uri: 'https://www.everyday-delicious.com/wp-content/uploads/2021/05/caffee-mocha-kawa-mokka-everyday-delicious-1-1197x1800.jpg',
    };
    const QR = {
        uri: 'https://img5.pic.in.th/file/secure-sv1/S__30220303.jpeg',
    };

    return (
        <View style={styles.container}>
            <Image source={Mocca} style={styles.Moccaimage}/>
            <View style={styles.textBox}>
                <Text style={styles.text}>Mocca</Text>
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
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        top: -40,
    },
    textBox: {
        borderWidth: 2,
        borderColor: 'black',
        paddingHorizontal: 90,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        paddingVertical: 5,
        top: -367,
    },
    textTHX: {
        top: 70,
        borderWidth: 2,
        borderColor: 'black',
        paddingHorizontal: 70,
        paddingVertical: 13,
        borderRadius: 20,
        backgroundColor: '#E0C5B1',
        paddingVertical: 8,
    },
    text: {
        fontSize: 20,
        fontFamily: 'Arial',
    },
    QRimage: {
        width: 150,
        height: 150,
        right : 0,
        margin: 5,
        top: 35,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    }
});

export default Moneymocca;
