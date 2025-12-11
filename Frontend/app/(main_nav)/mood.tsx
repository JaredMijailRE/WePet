// app/(main_nav)/mood.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Modal, Pressable } from 'react-native';

import MoodPickerModal from '../../components/mood-picker-modal';
import CircleButton from '../../components/circle-button-mood';
import { MoodName } from '../../assets/moodAssets';
import GroupMoodCard, { Group } from '../../components/group-mood-card';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSharing } from '@/hooks/useSharing';
import { EmotionRestponseDTO } from '@/hooks/types';
import { getUsersByIds } from '@/services/user';

function mapBackendMembers(
  backendMembers: EmotionRestponseDTO[],
  idToName?: Record<string, string>,
): Group['members'] {
  return backendMembers.map((m, index) => ({
    id: m.user_id,
    name: idToName?.[m.user_id] ?? `User ${index + 1}`,
    mood: m.emotion as MoodName,
  }));
}

export default function MoodScreen() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodName | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [groups, setGroups] = useState<Group[]>([]);

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  const {
    getMoodsForUserGroups,
    postMoodToUserGroups,
    loading,
    error,
  } = useSharing();

  useEffect(() => {
    async function load() {
      try {
        const data = await getMoodsForUserGroups();
        // data: { group: GroupResponseDTO; moods: EmotionRestponseDTO[] }[]

        // Recolectar IDs únicos de usuarios y obtener sus nombres
        const uniqueIds = Array.from(
          new Set(
            data.flatMap(({ moods }) => moods.map((m) => m.user_id)),
          ),
        );

        let idToName: Record<string, string> = {};
        try {
          if (uniqueIds.length) {
            const users = await getUsersByIds(uniqueIds);
            idToName = users.reduce<Record<string, string>>((acc, u) => {
              acc[u.id] = u.username;
              return acc;
            }, {});
          }
        } catch (err) {
          console.warn('No se pudieron obtener los nombres de usuario', err);
        }

        const mappedGroups: Group[] = data.map(({ group, moods }) => ({
          id: group.id,
          name: group.name,
          members: mapBackendMembers(moods, idToName),
        }));

        setGroups(mappedGroups);
      } catch (e) {
        console.error('Error cargando moods de los grupos', e);
      }
    }

    load();
  }, [getMoodsForUserGroups]);

  const handleSelectMood = async (mood: MoodName) => {
    try {
      setSelectedMood(mood);
      console.log('Mood seleccionado:', mood);

      await postMoodToUserGroups(mood);

      const data = await getMoodsForUserGroups();

      // Recolectar IDs únicos de usuarios y obtener sus nombres
      const uniqueIds = Array.from(
        new Set(
          data.flatMap(({ moods }) => moods.map((m) => m.user_id)),
        ),
      );

      let idToName: Record<string, string> = {};
      try {
        if (uniqueIds.length) {
          const users = await getUsersByIds(uniqueIds);
          idToName = users.reduce<Record<string, string>>((acc, u) => {
            acc[u.id] = u.username;
            return acc;
          }, {});
        }
      } catch (err) {
        console.warn('No se pudieron obtener los nombres de usuario', err);
      }

      const mappedGroups: Group[] = data.map(({ group, moods }) => ({
        id: group.id,
        name: group.name,
        members: mapBackendMembers(moods, idToName),
      }));
      setGroups(mappedGroups);
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

          {groups.length === 0 && !loading && (
            <Text>No tienes grupos todavía.</Text>
          )}

          {groups.map(group => (
            <GroupMoodCard
              key={group.id}
              group={group}
              maxVisible={6}
              onPressOverflow={g => setSelectedGroup(g)}
            />
          ))}

          {error && (
            <Text style={{ color: 'red', marginTop: 8 }}>
              Ocurrió un error al cargar la información.
            </Text>
          )}
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
