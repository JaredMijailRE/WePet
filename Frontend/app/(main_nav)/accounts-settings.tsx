import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userService from '@/services/user';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function AccountSettings() {
  const router = useRouter();
  const navigation = useNavigation();
  const { logout } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  // removed share location toggle
  const [isEditingName, setIsEditingName] = useState(false);

  const getUserIdFromToken = (token: string | null): string | null => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const payload = parts[1];
      const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');

      let decoded = '';
      if (typeof atob !== 'undefined') {
        decoded = atob(b64);
      } else if (typeof (globalThis as any)?.Buffer !== 'undefined') {
        decoded = (globalThis as any).Buffer.from(b64, 'base64').toString('utf8');
      } else if (typeof window !== 'undefined' && (window as any).atob) {
        decoded = (window as any).atob(b64);
      }

      let json = decoded;
      try {
        if (json.startsWith('%')) json = decodeURIComponent(json);
      } catch {}
      const data = JSON.parse(json);
      return data.sub || data.user_id || data.id || null;
    } catch (e) {
      console.warn('Failed to parse token for user id', e);
      return null;
    }
  };

  const formatDate = (iso: string | null | undefined): string => {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    } catch {
      return '';
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const userId = getUserIdFromToken(token);
        if (!userId) {
          console.warn('No user id resolved from token');
          return;
        }
        const user = await userService.getUserById(userId);
        setName(user.username || '');
        setEmail(user.email || '');
        setBirthdate(formatDate(user.birth_date));
      } catch (err) {
        console.error('Failed to load user profile', err);
      }
    })();
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      if (typeof window !== 'undefined') {
        window.alert('Signed out');
      } else {
        Alert.alert('Signed out');
      }
      router.replace('/(auth)/signin');
    } catch (err) {
      Alert.alert('Error', (err as any)?.message || 'No se pudo cerrar sesión');
    }
  };

  const handleDeleteAccount = () => {
    if (typeof window !== 'undefined') {
      const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
      if (!confirm) return;
      window.alert('Delete account not implemented');
      return;
    }
    Alert.alert('Delete Account', 'Not implemented');
  };

  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const tint = useThemeColor({}, 'tint');

  // Hide bottom tabs on this screen if using a tab navigator (expo-router)
  useEffect(() => {
    try {
      // @ts-ignore - setOptions exists when nested in a navigator
      navigation?.setOptions?.({ tabBarStyle: { display: 'none' } });
    } catch {}
  }, [navigation]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeContent}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: card, borderColor: border, borderWidth: 1 }]}>
          <Text style={[styles.backText, { color: text }]}>←</Text>
        </Pressable>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Avatar Placeholder */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarCircle, { backgroundColor: '#e6e0ff' }]}>
              <Text style={[styles.avatarInitial, { color: '#4f378b' }]}>{(name || '?').charAt(0)}</Text>
            </View>
            <View style={styles.nameRow}>
              {isEditingName ? (
                <TextInput
                  style={[styles.nameInput, { borderBottomColor: tint, color: text }]}
                  value={name}
                  onChangeText={setName}
                  onBlur={() => setIsEditingName(false)}
                  onSubmitEditing={() => setIsEditingName(false)}
                  autoFocus
                  placeholderTextColor={text + '80'}
                />
              ) : (
                <>
                  <ThemedText style={styles.nameText}>{name}</ThemedText>
                  <Pressable onPress={() => setIsEditingName(true)} style={styles.editButton}>
                    <Text style={[styles.editIcon, { color: text }]}>✏️</Text>
                  </Pressable>
                </>
              )}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <Pressable style={[styles.primaryPill, { backgroundColor: '#eef1ff' }] }>
              <ThemedText style={[styles.primaryPillText, { color: '#2d2a6a' }]}>Change password</ThemedText>
            </Pressable>
          </View>

          
          {/* Inputs */}
          <View style={styles.inputGroup}>
            <View style={[styles.inputContainer, { borderColor: border, backgroundColor: card }] }>
              <Text style={[styles.inputLabel, { backgroundColor: background, color: text }]} >Email</Text>
              <TextInput style={[styles.input, { color: text }]} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" placeholderTextColor={text + '80'} />
            </View>
            <View style={[styles.inputContainer, { borderColor: border, backgroundColor: card }] }>
              <Text style={[styles.inputLabel, { backgroundColor: background, color: text }]}>Birthdate</Text>
              <TextInput style={[styles.input, { color: text }]} value={birthdate} onChangeText={setBirthdate} placeholder="DD/MM/YYYY" placeholderTextColor={text + '80'} />
            </View>
          </View>

          {/* Danger and sign out */}
          <View style={styles.bottomActionsSection}>
            <Pressable style={[styles.signOutButton, { backgroundColor: '#2c2c2c' }]} onPress={handleSignOut}>
              <Text style={[styles.signOutButtonText, { color: '#fff' }]}>Sign out</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeContent: { flex: 1, position: 'relative' },
  backButton: {
    position: 'absolute', top: 16, left: 12, width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', zIndex: 10,
  },
  backText: { fontSize: 20, fontWeight: '600' },
  scrollView: { flex: 1, paddingTop: 72 },

  avatarSection: { alignItems: 'center', marginTop: 8, marginBottom: 16 },
  avatarCircle: { width: 140, height: 140, borderRadius: 70, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 64, fontWeight: '700' },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 6 },
  nameText: { fontSize: 20, fontWeight: '600' },
  nameInput: {
    fontSize: 20, fontWeight: '600', borderBottomWidth: 2, paddingVertical: 4, paddingHorizontal: 8, minWidth: 140, textAlign: 'center',
  },
  editButton: { padding: 4 },
  editIcon: { fontSize: 16 },

  actionsSection: { alignItems: 'center', marginBottom: 12 },
  primaryPill: {
    borderRadius: 999, paddingVertical: 10, paddingHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
  },
  primaryPillText: { fontSize: 14, fontWeight: '600' },

    
  inputGroup: { paddingHorizontal: 20, gap: 12, marginTop: 8 },
  inputContainer: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8 },
  inputLabel: { position: 'absolute', top: -10, left: 8, paddingHorizontal: 6, fontSize: 12 },
  input: { fontSize: 16, paddingVertical: 6 },

  bottomActionsSection: { paddingHorizontal: 20, marginTop: 24, marginBottom: 32, gap: 12 },
  signOutButton: { borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  signOutButtonText: { fontSize: 16, fontWeight: '600' },
  deleteButton: { backgroundColor: '#8c1d18', borderRadius: 8, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  deleteButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
