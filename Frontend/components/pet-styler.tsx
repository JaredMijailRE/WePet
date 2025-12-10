import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';

type PetStyle = 'dog' | 'cat' | 'dragon' | 'duck';

type PetStylerProps = {
  style: PetStyle;
  size?: number;
};

/**
 * Renders different pet styles (dog, cat, dragon, duck) based on the Pou base design
 * Each style has unique colors, ear shapes, and facial features
 */
export const PetStyler = ({ style, size = 140 }: PetStylerProps) => {
  const scale = useSharedValue(1);
  const bob = useSharedValue(0);

  useEffect(() => {
    // gentle breathing + bobbing
    scale.value = withRepeat(
      withSequence(withTiming(1.03, { duration: 900 }), withTiming(1, { duration: 900 })),
      -1,
      true
    );
    bob.value = withRepeat(
      withSequence(withTiming(-6, { duration: 1000 }), withTiming(0, { duration: 1000 })),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: bob.value }],
  }));

  // Get style config based on pet type
  const config = getPetConfig(style);

  return (
    <Animated.View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2 },
        animatedStyle,
      ]}
    >
      <View
        style={[
          styles.body,
          { 
            borderRadius: size * 0.45,
            backgroundColor: config.bodyColor,
          },
        ]}
      >
        {/* Ears (for dog and cat) */}
        {(style === 'dog' || style === 'cat') && (
          <View style={[styles.earsContainer, { marginTop: -size * 0.05 }]}>
            <View
              style={[
                styles.ear,
                {
                  width: size * 0.18,
                  height: size * 0.22,
                  borderRadius: size * 0.09,
                  backgroundColor: config.earColor,
                  transform: [{ rotate: style === 'cat' ? '-15deg' : '-25deg' }],
                },
              ]}
            />
            <View
              style={[
                styles.ear,
                {
                  width: size * 0.18,
                  height: size * 0.22,
                  borderRadius: size * 0.09,
                  backgroundColor: config.earColor,
                  transform: [{ rotate: style === 'cat' ? '15deg' : '25deg' }],
                },
              ]}
            />
          </View>
        )}

        {/* Eyes */}
        <View style={[styles.eyesRow, { marginTop: size * 0.15, gap: size * 0.08 }]}>
          <View
            style={[
              styles.eye,
              {
                width: size * 0.12,
                height: size * 0.12,
                borderRadius: (size * 0.12) / 2,
                backgroundColor: config.eyeColor,
              },
            ]}
          />
          <View
            style={[
              styles.eye,
              {
                width: size * 0.12,
                height: size * 0.12,
                borderRadius: (size * 0.12) / 2,
                backgroundColor: config.eyeColor,
              },
            ]}
          />
        </View>

        {/* Mouth/Snout */}
        <View
          style={[
            styles.mouth,
            {
              marginTop: size * 0.08,
              width: size * 0.26,
              height: size * 0.08,
              borderRadius: size * 0.04,
              backgroundColor: config.mouthColor,
            },
          ]}
        />

        {/* Dragon horns or special features */}
        {style === 'dragon' && (
          <View style={[styles.dragonHorns, { marginTop: -size * 0.12 }]}>
            <View
              style={[
                styles.dragonHorn,
                {
                  width: size * 0.12,
                  height: size * 0.16,
                  backgroundColor: config.accentColor,
                },
              ]}
            />
            <View
              style={[
                styles.dragonHorn,
                {
                  width: size * 0.12,
                  height: size * 0.16,
                  backgroundColor: config.accentColor,
                },
              ]}
            />
          </View>
        )}

        {/* Duck bill */}
        {style === 'duck' && (
          <View
            style={[
              styles.duckBill,
              {
                width: size * 0.22,
                height: size * 0.1,
                backgroundColor: config.accentColor,
                marginTop: size * 0.06,
                borderRadius: size * 0.05,
              },
            ]}
          />
        )}
      </View>
    </Animated.View>
  );
};

/**
 * Configuration for each pet style
 */
function getPetConfig(style: PetStyle) {
  const configs: Record<PetStyle, any> = {
    dog: {
      bodyColor: '#f6c48b', // warm tan/peach
      earColor: '#c99a6f', // darker brown
      eyeColor: '#000',
      mouthColor: '#7a4b2f', // dark brown
      accentColor: '#c99a6f',
    },
    cat: {
      bodyColor: '#ff9f5a', // orange
      earColor: '#ff8a3d', // darker orange
      eyeColor: '#000',
      mouthColor: '#d97f3a', // darker orange
      accentColor: '#ff8a3d',
    },
    dragon: {
      bodyColor: '#7fb069', // green
      earColor: '#5a8a4a', // darker green
      eyeColor: '#ffeb00', // yellow eyes
      mouthColor: '#3d5a28', // dark green
      accentColor: '#d4572f', // red horns
    },
    duck: {
      bodyColor: '#fff9d4', // light yellow
      earColor: '#ffd700', // gold
      eyeColor: '#000',
      mouthColor: '#ffa500', // orange bill
      accentColor: '#ff9800', // orange bill
    },
  };

  return configs[style];
}

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
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  earsContainer: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: '15%',
  },
  ear: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  eyesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eye: {
    backgroundColor: '#000',
  },
  mouth: {
    backgroundColor: '#7a4b2f',
  },
  dragonHorns: {
    position: 'absolute',
    top: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: '20%',
    gap: 20,
  },
  dragonHorn: {
    borderRadius: 6,
  },
  duckBill: {
    marginVertical: 8,
  },
});

export default PetStyler;
