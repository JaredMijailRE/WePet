// app/(main_nav)/mood.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Modal, Pressable } from 'react-native';

import MoodPickerModal from '../../components/mood-picker-modal';
import CircleButton from '../../components/circle-button-mood';
import { MoodName } from '../../assets/moodAssets';
import GroupMoodCard, { Group } from '../../components/group-mood-card';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  postMood,
  getGroupMoods,
  getUserGroups,
  BackendMember,
  BackendGroup,
} from '../(mood)/sharing-service';

// Por ahora dejamos un grupo “por defecto” mientras funciona el getUserGroups()
const BACKEND_GROUP_ID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

const MOCK_GROUPS: Group[] = [
  {
    id: BACKEND_GROUP_ID,
    name: 'Grupo de prueba',
    members: []
  },
];

function mapBackendMembers(backendMembers: BackendMember[]): Group["members"] {
  return backendMembers.map((m, index) => ({
    id: m.user_id,
    name: `User ${index + 1}`,
    mood: m.emotion as MoodName,
  }));
}

export default function MoodScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodName | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [backendGroupMembers, setBackendGroupMembers] = useState<Group['members']>([]);

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function load() {
      try {
        // 👉 aquí podrías usar getUserGroups() para saber los grupos del usuario:
        // const userGroups = await getUserGroups();
        // console.log('Grupos del usuario:', userGroups);

        const data = await getGroupMoods(BACKEND_GROUP_ID);
        console.log('Respuesta cruda del backend:', data);
        setBackendGroupMembers(mapBackendMembers(data));
      } catch (e) {
        console.error('Error cargando moods del grupo', e);
      }
    }
    load();
  }, []);

  const handleSelectMood = async (mood: MoodName) => {
    try {
      setSelectedMood(mood);
      console.log('Mood seleccionado:', mood);
      await postMood(
        [BACKEND_GROUP_ID],
         mood ,
      );

      const data = await getGroupMoods(BACKEND_GROUP_ID);
      setBackendGroupMembers(mapBackendMembers(data));
    } catch (e) {
      console.error('Error al enviar el mood', e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.title}>Moods</Text>
          
          {MOCK_GROUPS.map(group => {
            const isBackendGroup = group.id === BACKEND_GROUP_ID;

            const groupData: Group = isBackendGroup
              ? {
                  ...group,
                  members: backendGroupMembers.length
                    ? backendGroupMembers
                    : group.members,
                }
              : group;

            return (
              <GroupMoodCard
                key={groupData.id}
                group={groupData}
                maxVisible={6}
                onPressOverflow={g => setSelectedGroup(g)}
              />
            );
          })}
        </ScrollView>
      </View>

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
              <GroupMoodCard group={selectedGroup} />
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
