// src/components/MoodPickerModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';
import { MoodName, moodConfig} from '../assets/moodAssets';
type Props = {
  visible: boolean;
  onSelectMood: (mood: MoodName) => void;
  onClose: () => void;
};

// List of moods to display in the modal
const moods: { mood: MoodName; label: string }[] = [
  { mood: 'happy',     label: 'Happy' },
  { mood: 'excited',   label: 'Excited' },
  { mood: 'calm',      label: 'Calm' },
  { mood: 'tired',     label: 'Tired' },
  { mood: 'proud',     label: 'Proud' },
  { mood: 'jealous',   label: 'Jealous' },
  { mood: 'worried',   label: 'Worried' },
  { mood: 'sad',       label: 'Sad' },
  { mood: 'surprised', label: 'Surprised' },
  { mood: 'scared',    label: 'Scared' },
  { mood: 'shy',       label: 'Shy' },
  { mood: 'angry',     label: 'Angry' },
  { mood: 'silly',     label: 'Silly' },
  { mood: 'bored',     label: 'Bored' },
  { mood: 'loved',     label: 'Loved' },
  { mood: 'confused',  label: 'Confused' },
];

export default function MoodPickerModal({
  visible,
  onSelectMood,
  onClose,
}: Props) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>How was your day?</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.grid}>
            {moods.map(({ mood, label }) => (
              <Pressable
                key={mood}
                style={styles.moodItem}
                onPress={() => {
                  onSelectMood(mood);
                  onClose();
                }}
              >
                <Image
                  source={moodConfig[mood].image}
                  style={styles.moodImage}
                  resizeMode="contain"
                />
                <Text style={styles.moodLabel}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end', // bottom sheet style
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodItem: {
    width: '22%', // ~4 per row, ajusta si quieres
    alignItems: 'center',
    marginVertical: 8,
  },
  moodImage: {
    width: 48,
    height: 48,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
});
