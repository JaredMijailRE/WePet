import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Alert, SafeAreaView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PetStyler } from '@/components/pet-styler';
import { useGroups } from '@/hooks';
import * as Clipboard from 'expo-clipboard';

type PetStyle = 'dog' | 'cat' | 'dragon' | 'duck';

interface Member {
  id: string;
  name: string;
  role: 'Administrator' | 'Member';
  status: string;
}

export default function GroupSettings() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const {getGroupInviteCode, loading, error} = useGroups();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const handleShareGroup = async () => {
    console.log('groupId recibido:', groupId);
    if (!groupId) {
      Alert.alert('Error', 'No se pudo obtener el ID del grupo');
      return;
    }
    try {
      const inviteCode = await getGroupInviteCode(groupId)
      console.log('inviteCode recibido:', inviteCode);
      const message = String(inviteCode);
        try {
          if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(String(inviteCode));
          } else if (Clipboard?.setStringAsync) {
            await Clipboard.setStringAsync(String(inviteCode));
          }

          if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.alert(`Código copiado: ${inviteCode}`);
          } else {
            Alert.alert('Código copiado', `Código: ${inviteCode}`);
          }
        } catch (copyErr) {
          console.warn('Error al copiar al portapapeles', copyErr);
          // Fallback: mostrar el código en alerta
          if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.alert(String(inviteCode));
          } else {
            Alert.alert('Código de invitación', String(inviteCode));
          }
        }
    } catch (err) {
      console.error('Error al obtener código:', err);
      Alert.alert('Error', error?.message || 'No se pudo obtener el código de invitación');
    }
  };

  // Dummy group state
  const [groupName, setGroupName] = useState('Group 1');
  const [isEditingName, setIsEditingName] = useState(false);
  const [petStyle, setPetStyle] = useState<PetStyle>('dog');
  
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'Alex (You)', role: 'Administrator', status: 'Status' },
    { id: '2', name: 'Raul', role: 'Member', status: 'Status' },
    { id: '3', name: 'Sam', role: 'Member', status: 'Status' },
  ]);

  const handleExitGroup = () => {
    Alert.alert(
      'Exit Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Exit',
          onPress: () => {
            router.push('/(main_nav)/groups');
          },
          style: 'default',
        },
      ]
    );
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      'Are you sure you want to delete this group? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            router.push('/(main_nav)/groups');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId));
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeContent}>
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </Pressable>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Pet Display */}
          <View style={styles.petSection}>
            <PetStyler style={petStyle} size={140} />
          </View>

          {/* Group Name with Edit Button */}
          <View style={styles.groupNameContainer}>
            {isEditingName ? (
              <TextInput
                style={styles.groupNameInput}
                value={groupName}
                onChangeText={setGroupName}
                onBlur={() => setIsEditingName(false)}
                autoFocus
              />
            ) : (
              <>
                <ThemedText style={styles.groupName}>{groupName}</ThemedText>
                <Pressable onPress={() => setIsEditingName(true)} style={styles.editButton}>
                  <Text style={styles.editIcon}>✏️</Text>
                </Pressable>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            {/* Change Pet Button */}
            <Pressable style={styles.mainButton} onPress={() => Alert.alert('Change Pet')}>
              <Text style={styles.buttonIcon}>🐾</Text>
              <ThemedText style={styles.mainButtonText}>Change Pet</ThemedText>
            </Pressable>

            {/* Add & Share Row */}
            <View style={styles.buttonRow}>
              <Pressable style={[styles.smallButton, { flex: 1 }]} onPress={() => Alert.alert('Add Member')}>
                <Text style={styles.buttonIcon}>👥</Text>
                <ThemedText style={styles.buttonText}>Add</ThemedText>
              </Pressable>
              <Pressable style={[styles.smallButton, { flex: 1, marginLeft: 12 }]} onPress={handleShareGroup}>
                <Text style={styles.buttonIcon}>📤</Text>
                <ThemedText style={styles.buttonText}>Share</ThemedText>
              </Pressable>
            </View>
          </View>

          {/* Members Section */}
          <View style={styles.membersSection}>
            <ThemedText style={styles.sectionTitle}>Members</ThemedText>
            
            {members.slice(0, 3).map((member) => (
              <View key={member.id} style={styles.memberCell}>
                {/* Avatar Placeholder */}
                <View style={styles.memberAvatar}>
                  <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
                </View>

                {/* Member Info */}
                <View style={styles.memberInfo}>
                  <View style={styles.memberNameRow}>
                    <ThemedText style={styles.memberName}>{member.name}</ThemedText>
                    <ThemedText style={styles.memberRole}>{member.role}</ThemedText>
                  </View>
                  <ThemedText style={styles.memberStatus}>{member.status}</ThemedText>
                </View>

                {/* Remove Button (only for non-admin or for admin to remove others) */}
                {member.id !== '1' && (
                  <Pressable 
                    onPress={() => handleRemoveMember(member.id)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeIcon}>⋮</Text>
                  </Pressable>
                )}
              </View>
            ))}

            {/* View All Link */}
            <Pressable onPress={() => Alert.alert('View all members')}>
              <ThemedText style={styles.viewAllLink}>View all</ThemedText>
            </Pressable>
          </View>

          {/* Bottom Action Buttons */}
          <View style={styles.bottomActionsSection}>
            <Pressable style={styles.exitButton} onPress={handleExitGroup}>
              <Text style={styles.exitButtonIcon}>🚪</Text>
              <ThemedText style={styles.exitButtonText}>Exit Group</ThemedText>
            </Pressable>

            <Pressable style={styles.deleteButton} onPress={handleDeleteGroup}>
              <Text style={styles.deleteButtonIcon}>🗑️</Text>
              <ThemedText style={styles.deleteButtonText}>Delete Group</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeContent: {
    flex: 1,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backText: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingTop: 60,
  },
  petSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  groupNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  groupName: {
    fontSize: 20,
    fontWeight: '600',
  },
  groupNameInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    borderBottomWidth: 2,
    borderBottomColor: '#6750a4',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 120,
    textAlign: 'center',
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 16,
  },
  actionsSection: {
    paddingHorizontal: 20,
    marginBottom: 28,
    gap: 12,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonIcon: {
    fontSize: 16,
  },
  membersSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  memberCell: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6750a4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '600',
  },
  memberRole: {
    fontSize: 14,
    color: '#999',
  },
  memberStatus: {
    fontSize: 12,
    color: '#999',
  },
  removeButton: {
    padding: 8,
  },
  removeIcon: {
    fontSize: 20,
    color: '#666',
  },
  viewAllLink: {
    color: '#2f8ab8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  bottomActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  exitButtonIcon: {
    fontSize: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8c1d18',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButtonIcon: {
    fontSize: 16,
  },
});
