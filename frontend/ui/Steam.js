import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../ThemeContext';

// Three wisps rising on staggered loops, matching the concept's @keyframes rise.
// react-native-web cannot drive animations off the JS thread, so only ask for
// the native driver where one exists.
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

function Wisp({ delay, height, color }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(t, {
          toValue: 1,
          duration: 3400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: USE_NATIVE_DRIVER }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [t, delay]);

  return (
    <Animated.View
      style={[
        styles.wisp,
        {
          height,
          backgroundColor: color,
          opacity: t.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.45, 0] }),
          transform: [
            {
              translateY: t.interpolate({
                inputRange: [0, 1],
                outputRange: [height * 0.1, -height * 1.2],
              }),
            },
            { scaleX: t.interpolate({ inputRange: [0, 1], outputRange: [1, 0.6] }) },
          ],
        },
      ]}
    />
  );
}

export default function Steam({ style, scale = 1 }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.steam, style]} pointerEvents="none">
      <Wisp delay={0} height={30 * scale} color={colors.inkDim} />
      <Wisp delay={500} height={39 * scale} color={colors.inkDim} />
      <Wisp delay={1000} height={30 * scale} color={colors.inkDim} />
    </View>
  );
}

const styles = StyleSheet.create({
  steam: {
    flexDirection: 'row',
    gap: 7,
    alignItems: 'flex-end',
  },
  wisp: {
    width: 7,
    borderRadius: 999,
  },
});
