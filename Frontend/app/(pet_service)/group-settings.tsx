import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Alert, SafeAreaView, Platform, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PetStyler } from '@/components/pet-styler';
import { useGroups, useGroupMembers } from '@/hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Clipboard from 'expo-clipboard';
import petService from '@/services/pet';
import userService from '@/services/user';

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
  const {getGroupInviteCode, getGroup, updateGroup, loading, error} = useGroups();
  const { listGroupMembers, getUserById, removeGroupMember } = useGroupMembers();
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const handleShareGroup = async () => {
    if (!groupId) {
      Alert.alert('Error', 'No se pudo obtener el ID del grupo');
      return;
    }
    try {
      const inviteCode = await getGroupInviteCode(groupId)
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

  // Load group details when we have a groupId
  useEffect(() => {
    const load = async () => {
      if (!groupId) return;
      try {
        const g = await getGroup(groupId);
        if (g?.name) setGroupName(g.name);
      } catch (err) {
        console.error('Error loading group details:', err);
      }
    };

    load();
  }, [groupId]);

  

  // Group state
  const [groupName, setGroupName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [petStyle, setPetStyle] = useState<PetStyle>('dog');
  
  const [members, setMembers] = useState<Member[]>([]);

  // Pet name editing state
  const [isEditingPetName, setIsEditingPetName] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [petId, setPetId] = useState<string | null>(null);
  const [isSavingPetName, setIsSavingPetName] = useState(false);

  // Load members when we have a groupId
  useEffect(() => {
    const loadMembers = async () => {
      if (!groupId) {
        return;
      }
      try {
        console.log(`Loading members for group: ${groupId}`);
        // 1. Obtener lista de miembros del grupo (con IDs) usando useGroupMembers
        const groupMembers = await listGroupMembers(groupId as string);
        console.log(`Found ${groupMembers?.length || 0} group members`);

        // 2. Extraer user IDs de los miembros del grupo (deduplicados)
        const userIdSet = new Set<string>();
        const memberRoles: { [key: string]: string } = {};

        for (const gm of groupMembers || []) {
          const userId = (gm as any).user_id;
          if (userId) {
            userIdSet.add(userId);
            memberRoles[userId] = (gm as any).role;
          }
        }

        const userIds = Array.from(userIdSet);

        // 3. Si hay user IDs, obtener datos de usuarios usando el endpoint batch
        if (userIds.length > 0) {
          try {
            console.log(`Fetching ${userIds.length} users using batch endpoint:`, userIds);
            const users = await userService.getUsersByIds(userIds);
            console.log(`Successfully fetched ${users.length} user details`);

            // 4. Crear objetos Member con datos reales de usuarios
            const memberDetails: Member[] = users.map(user => ({
              id: user.id,
              name: user.username, // Usar username real en lugar de placeholder
              role: memberRoles[user.id] === 'admin' ? 'Administrator' : 'Member',
              status: 'Member',
            }));

            setMembers(memberDetails);
          } catch (userErr) {
            console.warn('Error fetching user data with batch endpoint, falling back to placeholders. User IDs attempted:', userIds, 'Error:', userErr);

            // Fallback: crear miembros con placeholders si falla la API de usuarios
            const memberDetails: Member[] = userIds.map(userId => ({
              id: userId,
              name: `User ${userId.slice(0, 6)}`,
              role: memberRoles[userId] === 'admin' ? 'Administrator' : 'Member',
              status: 'Member',
            }));

            console.log(`Created ${memberDetails.length} members with placeholder names`);
            setMembers(memberDetails);
          }
        } else {
          setMembers([]);
        }
      } catch (err) {
        console.error('Error loading group members:', err);
        setMembers([]);
      }
    };

    loadMembers();
  }, [groupId]);

  const handleSaveGroup = async () => {
    if (!groupId) {
      Alert.alert('Error', 'No se pudo obtener el ID del grupo');
      return;
    }

    try {
      await updateGroup(groupId, { name: groupName });
      Alert.alert('Guardado', 'Nombre del grupo actualizado');
    } catch (err) {
      console.error('Error updating group name:', err);
      Alert.alert('Error', error?.message || (err as any)?.message || 'No se pudo actualizar el nombre del grupo');
    }
  };

  const getUserIdFromToken = (token: string | null): string | null => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];
      // base64url -> base64
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      let decoded = '';
      // Try atob (web), Buffer (node/react-native), or global atob
      if (typeof atob !== 'undefined') {
        decoded = atob(b64);
      } else if (typeof (globalThis as any)?.Buffer !== 'undefined') {
        decoded = (globalThis as any).Buffer.from(b64, 'base64').toString('utf8');
      } else if (typeof window !== 'undefined' && (window as any).atob) {
        decoded = (window as any).atob(b64);
      } else {
        // Fallback: try a manual base64 decode (rare)
        try {
          decoded = decodeURIComponent(
            Array.prototype.map
              .call(atob(b64), function (c: string) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
              })
              .join('')
          );
        } catch (e) {
          console.warn('No base64 decoder available', e);
          return null;
        }
      }

      // If decoded is percent-encoded, try to JSON parse directly
      let json = decoded;
      try {
        // Some decoders already return utf8, others percent-encoded
        if (json.startsWith('%')) {
          json = decodeURIComponent(json);
        }
      } catch (e) {
        // ignore
      }
      const data = JSON.parse(json);
      return data.sub || data.user_id || data.id || null;
    } catch (e) {
      console.warn('Failed to parse token for user id', e);
      return null;
    }
  };

  const handleExitGroup = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const confirm = window.confirm('Are you sure you want to leave this group?');
      if (!confirm) return;
      (async () => {
        console.log('Exit confirmed (web)');
        if (!groupId) {
          window.alert('Error: no se pudo obtener el ID del grupo');
          return;
        }

        try {
          const token = await AsyncStorage.getItem('authToken');
          console.log('authToken (debug):', token);
          const userId = getUserIdFromToken(token);
          console.log('Leaving group, resolved userId:', userId);
          if (!userId) {
            window.alert('Error: no se pudo determinar el usuario actual');
            return;
          }

          await removeGroupMember(groupId as string, userId);
          setMembers((prev) => prev.filter((m) => m.id !== userId));
          window.alert('Has salido del grupo');
          router.push('/(main_nav)/groups');
        } catch (err) {
          console.error('Error leaving group:', err);
          window.alert('Error: ' + ((err as any)?.message || 'No se pudo salir del grupo'));
        }
      })();
      return;
    }

    // Native flow
    Alert.alert(
      'Exit Group',
      'Are you sure you want to leave this group?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Exit',
          onPress: () => {
            (async () => {
              if (!groupId) {
                Alert.alert('Error', 'No se pudo obtener el ID del grupo');
                return;
              }

              try {
                const token = await AsyncStorage.getItem('authToken');
                console.log('authToken (debug):', token);
                const userId = getUserIdFromToken(token);
                console.log('Leaving group, resolved userId:', userId);
                if (!userId) {
                  Alert.alert('Error', 'No se pudo determinar el usuario actual');
                  return;
                }

                await removeGroupMember(groupId as string, userId);
                setMembers((prev) => prev.filter((m) => m.id !== userId));

                Alert.alert('Salida', 'Has salido del grupo');
                router.push('/(main_nav)/groups');
              } catch (err) {
                console.error('Error leaving group:', err);
                Alert.alert('Error', (err as any)?.message || 'No se pudo salir del grupo');
              }
            })();
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

  const handleChangeName = async () => {
    if (!groupId) {
      Alert.alert('Error', 'No se pudo obtener el ID del grupo');
      return;
    }

    try {
      const pet = await petService.getPetByGroup(groupId);
      setPetId(pet.id || `pet-${groupId}`);
      setNewPetName(pet.name || '');
      setIsEditingPetName(true);
    } catch (err) {
      console.error('Error loading pet:', err);
    }
  };

  const handleSavePetName = async () => {

    if (!petId) {
      Alert.alert('Error', 'No se pudo obtener el ID de la mascota');
      return;
    }

    setIsSavingPetName(true);
    try {
      await petService.updatePetName(petId, newPetName.trim());
      setIsEditingPetName(false);
      Alert.alert('Éxito', 'Nombre de la mascota actualizado');
    } catch (err) {
      console.error('Error updating pet name:', err);
      Alert.alert('Error', 'No se pudo actualizar el nombre de la mascota');
    } finally {
      setIsSavingPetName(false);
    }
  };

  const handleCancelPetNameEdit = () => {
    setIsEditingPetName(false);
    setNewPetName('');
    setPetId(null);
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
                onBlur={() => { setIsEditingName(false); handleSaveGroup(); }}
                onSubmitEditing={() => { setIsEditingName(false); handleSaveGroup(); }}
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

            {/* Add & Share Row */}
            <View style={styles.buttonRow}>
               {/* Change Pet Button */}
            <Pressable style={[styles.smallButton, { flex: 1, marginLeft: 12 }]} onPress={handleChangeName}>
              <Text style={styles.buttonIcon}>🐾</Text>
              <ThemedText style={styles.buttonText}>Change Pet´s name</ThemedText>
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

      {/* Edit Pet Name Modal */}
      <Modal
        visible={isEditingPetName}
        transparent
        animationType="fade"
        onRequestClose={handleCancelPetNameEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Change Pet Name</ThemedText>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Enter pet name"
              placeholderTextColor="#999"
              value={newPetName}
              onChangeText={setNewPetName}
              maxLength={30}
              editable={!isSavingPetName}
            />
            
            <View style={styles.modalButtonGroup}>
              <Pressable 
                onPress={handleCancelPetNameEdit}
                disabled={isSavingPetName}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <ThemedText style={styles.modalButtonText}>Cancel</ThemedText>
              </Pressable>
              
              <Pressable 
                onPress={handleSavePetName}
                disabled={isSavingPetName}
                style={[styles.modalButton, styles.saveButton]}
              >
                <ThemedText style={[styles.modalButtonText, { color: '#fff' }]}>
                  {isSavingPetName ? 'Saving...' : 'Save'}
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#6750a4',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveButton: {
    backgroundColor: '#6750a4',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
