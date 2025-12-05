// app/(main_nav)/mood.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Modal, Pressable } from 'react-native';
import MoodPickerModal from '../../components/mood-picker-modal';
import CircleButton from '../../components/circle-button-mood';
import { Mood } from '../../assets/moodAssets';
import GroupMoodCard, { Group } from '../../components/group-mood-card';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MOCK_GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Group 1',
    members: [],
  },
  {
    id: 'g2',
    name: 'Group 2',
    members: [
      { id: '1', name: 'Name 5', mood: 'jealous' },
      { id: '2', name: 'Name 6', mood: 'loved' },
      { id: '3', name: 'Name 1', mood: 'happy' },
      { id: '4', name: 'Name 2', mood: 'sad' },
      { id: '5', name: 'Name 3', mood: 'excited' },
      { id: '6', name: 'Name 4', mood: 'calm' },
      { id: '7', name: 'Name 1', mood: 'happy' },
      { id: '8', name: 'Name 2', mood: 'sad' },
      { id: '9', name: 'Name 3', mood: 'excited' },
      { id: '10', name: 'Name 4', mood: 'calm' },
      { id: '11', name: 'Name 1', mood: 'happy' },
      { id: '12', name: 'Name 2', mood: 'sad' },
      { id: '13', name: 'Name 3', mood: 'excited' },
      { id: '14', name: 'Name 4', mood: 'calm' },
    ],
  },
  {
    id: 'g3',
    name: 'Group 3',
    members: [
      { id: '5', name: 'Name 5', mood: 'worried' },
      { id: '6', name: 'Name 6', mood: 'loved' },
      { id: '7', name: 'Name 4', mood: 'calm' },
      { id: '8', name: 'Name 5', mood: 'worried' },
      { id: '9', name: 'Name 6', mood: 'loved' },
      { id: '10', name: 'Name 4', mood: 'calm' },
    ],
  },
  {
    id: 'g4',
    name: 'Group 4',
    members: [
      { id: '5', name: 'Name 5', mood: 'worried' },
      { id: '6', name: 'Name 6', mood: 'loved' },
      { id: '7', name: 'Name 4', mood: 'calm' },
      { id: '8', name: 'Name 5', mood: 'worried' },
      { id: '9', name: 'Name 6', mood: 'loved' },
      { id: '10', name: 'Name 4', mood: 'calm' },
      { id: '10', name: 'Name 4', mood: 'calm' },
    ],
  },
];

export default function MoodScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const handleSelectMood = (mood: Mood) => {
    setSelectedMood(mood);
    // Aquí va el back
  };

  return (
    <View style={styles.container}>
      {/* Contenido scrolleable */}
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Moods</Text>

          {MOCK_GROUPS.map(group => (
            <GroupMoodCard
              key={group.id}
              group={group}
              maxVisible={6}
              onPressOverflow={g => setSelectedGroup(g)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Botón en footer fijo abajo, sin absolute */}
      <View
        style={[
          styles.bottomArea,
          { paddingBottom: tabBarHeight + insets.bottom + 16 },
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

      <Modal
        transparent
        visible={!!selectedGroup}
        animationType="fade"
        onRequestClose={() => setSelectedGroup(null)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalBox}>
            {selectedGroup && (
              <>
                <GroupMoodCard group={selectedGroup} />
              </>
            )}
          </View>
          <Pressable
            onPress={() => setSelectedGroup(null)}
            style={styles.closeButtonBottom}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  bottomArea: {
    alignItems: 'center',
    paddingTop: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeText: {
    fontSize: 20,
  },
  closeButtonWrapper: {
    position: 'absolute',
    top: 12,
    right: 16,
    zIndex: 1,
  },
  modalBox: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
  },
  closeButtonBottom: {
    alignSelf: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#EDEDED',
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
});
