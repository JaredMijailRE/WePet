import React from 'react';
import { View, Pressable, StyleSheet, Image } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MoodName, moodConfig } from '../assets/moodAssets';

type Props = {
  onPress: () => void;
  mood?: MoodName | null; // opcional
};

export default function CircleButton({ onPress, mood }: Props) {
  const activeMood = mood ?? null;
  const color = activeMood ? moodConfig[activeMood].color : '#ffd33d';

  return (
    <View
      style={[
        styles.circleButtonContainer,
        { borderColor: color },
      ]}
    >
      <Pressable
        style={[
          styles.circleButton,
          activeMood && { borderColor: color, borderWidth: 2 },
        ]}
        onPress={onPress}
      >
        {activeMood ? (
          <Image
            source={moodConfig[activeMood].image}
            style={styles.moodImage}
            resizeMode="contain"
          />
        ) : (
          <MaterialIcons name="add" size={40} color="#25292e" />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  circleButtonContainer: {
    width: 96,
    height: 96,
    borderWidth: 4,
    borderRadius: 48,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  circleButton: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodImage: {
    width: 64,
    height: 64,
  },
});