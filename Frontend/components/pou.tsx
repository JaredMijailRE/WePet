import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

type PouProps = {
  size?: number;
};

export const Pou = ({ size = 140 }: PouProps) => {
  const scale = useSharedValue(1);
  const bob = useSharedValue(0);

  useEffect(() => {
    // gentle breathing + bobbing
    scale.value = withRepeat(withSequence(withTiming(1.03, { duration: 900 }), withTiming(1, { duration: 900 })), -1, true);
    bob.value = withRepeat(withSequence(withTiming(-6, { duration: 1000 }), withTiming(0, { duration: 1000 })), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: bob.value }],
  }));

  return (
    <Animated.View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <View style={[styles.body, { borderRadius: size * 0.45 }]}>
        <View style={[styles.eyesRow, { marginTop: size * 0.18 }]}> 
          <View style={[styles.eye, { width: size * 0.12, height: size * 0.12, borderRadius: (size * 0.12) / 2 }]} />
          <View style={[styles.eye, { width: size * 0.12, height: size * 0.12, borderRadius: (size * 0.12) / 2 }]} />
        </View>
        <View style={[styles.mouth, { marginTop: size * 0.06, width: size * 0.26, height: size * 0.08, borderRadius: size * 0.04 }]} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    width: '92%',
    height: '92%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6c48b',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  eyesRow: {
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  eye: {
    backgroundColor: '#000',
  },
  mouth: {
    backgroundColor: '#7a4b2f',
  },
});

export default Pou;
