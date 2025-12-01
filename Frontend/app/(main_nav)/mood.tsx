// MoodScreen.tsx (o como se llame)

// app/(main_nav)/mood.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import MoodPickerModal from '../../components/mood-picker-modal';
import CircleButton from '../../components/circle-button-mood';
import { Mood } from '../../assets/moodAssets';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MoodScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const handleSelectMood = (mood: Mood) => {
    setSelectedMood(mood);
  };

  return (
    <View style={styles.container}>
      {/* contenido de la pantalla */}

      <View
        style={[
          styles.bottomArea,
          { bottom: tabBarHeight + insets.bottom + 16 }, // encima del tab bar
        ]}
      >
        <CircleButton
          onPress={() => setModalVisible(true)}
          mood={selectedMood}
        />
      </View>

      <MoodPickerModal
        visible={isModalVisible}
        onSelectMood={handleSelectMood}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bottomArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
