import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './ThemeContext';
import { serif } from './fonts';
import Steam from './ui/Steam';
import Cup, { RIM_FROM_BOTTOM } from './ui/Cup';
import { DRINK_ART } from './data/menu';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

// Attract loop. Anything on this screen has to read from a couple of metres
// away, so the wordmark is oversized and the call to action pulses.
const Home = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const compact = Math.min(width, height) < 520;

  const breathe = useRef(new Animated.Value(0.65)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(breathe, {
          toValue: 0.65,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breathe]);

  const cup = compact ? 170 : 230;

  return (
    <TouchableOpacity
      style={styles.flex}
      onPress={() => navigation.navigate('Menu')}
      activeOpacity={0.94}
    >
      <LinearGradient colors={[colors.groundAlt, colors.ground]} style={styles.container}>
        {/* Soft crema halo behind the cup. */}
        <View
          style={[
            styles.halo,
            {
              width: cup * 2.1,
              height: cup * 2.1,
              borderRadius: cup * 1.05,
              backgroundColor: colors.cremaSoft,
            },
          ]}
        />

        <View style={[styles.cupWrap, { width: cup, height: cup }]}>
          <Cup art={DRINK_ART.latte} size={cup} />
          {/* The rim sits at 46% down the cup's box, so anchor the steam to
              that rather than to the top of the (mostly empty) SVG. */}
          <Steam
            style={[styles.steam, { bottom: cup * RIM_FROM_BOTTOM }]}
            scale={compact ? 0.85 : 1}
          />
        </View>

        <Text style={[styles.eyebrow, { color: colors.crema }]}>
          FRESH COFFEE · FRESHLY PRESSED
        </Text>
        <Text
          style={[
            styles.brand,
            { color: colors.ink, fontSize: compact ? 52 : 74, lineHeight: compact ? 60 : 84 },
          ]}
        >
          CREMA
        </Text>
        <Text style={[styles.kick, { color: colors.inkDim }]}>
          Café-grade espresso from the machine. Brewed to your taste in under a minute.
        </Text>

        <Animated.View
          style={[styles.startPill, { borderColor: colors.lineStrong, opacity: breathe }]}
        >
          <View style={[styles.dot, { backgroundColor: colors.crema }]} />
          <Text style={[styles.startText, { color: colors.ink }]}>
            แตะเพื่อเริ่ม · TOUCH TO START
          </Text>
        </Animated.View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 4,
  },
  halo: {
    position: 'absolute',
    opacity: 0.45,
  },
  cupWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 18,
  },
  steam: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 3.5,
    fontWeight: '600',
  },
  brand: {
    fontFamily: serif,
    fontWeight: '700',
    letterSpacing: 1,
  },
  kick: {
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 380,
    lineHeight: 23,
  },
  startPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 26,
    borderWidth: 1,
    paddingHorizontal: 26,
    paddingVertical: 15,
    borderRadius: 999,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  startText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.4,
  },
});

export default Home;
