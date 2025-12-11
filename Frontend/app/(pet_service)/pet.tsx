import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, Image, Text, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PetStyler } from '@/components/pet-styler';
import petService from '@/services/pet';

type PetStyle = 'dog' | 'cat' | 'dragon' | 'duck';

export const unstable_settings = {
  headerShown: false,
};

export default function PetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = (params.groupId as string) ?? 'unknown';

  // pet state (fetched from backend)
  const [pet, setPet] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await petService.getPetByGroup(groupId);
        if (mounted) setPet(data);
      } catch (e) {
        console.error("Failed to fetch pet:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [groupId]);

  return (
    <ThemedView style={styles.container}>
      {/* Background Image */}
      <View style={styles.backgroundContainer}>
        {/* Forest-like gradient background (placeholder) */}
        <View style={styles.backgroundGradient} />
      </View>

      {/* Content */}
      <SafeAreaView style={styles.safeContent}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>

          {/* Level Circle */}
          <View style={styles.levelCircle}>
            <ThemedText style={styles.levelNumber}>{pet?.level ?? '...'}</ThemedText>
            <ThemedText style={styles.levelText}>LVL</ThemedText>
          </View>
        </View>

        {/* Top Right Buttons (Settings & Activities) */}
        <View style={styles.topRightButtons}>
          <Pressable 
            onPress={() => router.push(`/(pet_service)/group-settings?groupId=${groupId}`)} 
            style={styles.iconButton}
          >
            <Text style={styles.iconText}>⚙️</Text>
          </Pressable>
          <Pressable 
            onPress={() => router.push('/(main_nav)/activities')} 
            style={[styles.iconButton, { marginTop: 12 }]}
          >
            <Text style={styles.iconText}>✓</Text>
          </Pressable>
        </View>

        {/* Main Pet Area - Center */}
        <View style={styles.petCenterContainer}>
          <PetStyler style={(pet?.type ?? 'dog') as PetStyle} size={180} />
        </View>

        {/* Right Progress Indicators */}
        <View style={styles.rightProgressContainer}>
          {/* Food */}
          <View style={styles.progressIndicatorWrapper}>
            <View style={[styles.circleProgress, { borderColor: '#ffd166' }]}>
              <Text style={styles.progressIcon}>🍗</Text>
            </View>
            <ThemedText style={styles.progressValue}>{Math.round(pet?.food ?? 0)}%</ThemedText>
          </View>

          {/* Life */}
          <View style={styles.progressIndicatorWrapper}>
            <View style={[styles.circleProgress, { borderColor: '#ff6b6b' }]}>
              <Text style={styles.progressIcon}>❤️</Text>
            </View>
            <ThemedText style={styles.progressValue}>{Math.round(pet?.life ?? 0)}%</ThemedText>
          </View>

          {/* Clean */}
          <View style={styles.progressIndicatorWrapper}>
            <View style={[styles.circleProgress, { borderColor: '#74c0fc' }]}>
              <Text style={styles.progressIcon}>🧼</Text>
            </View>
            <ThemedText style={styles.progressValue}>{Math.round(pet?.clean ?? 0)}%</ThemedText>
          </View>
        </View>
        
        {/* Action Buttons (Feed / Clean / Play) */}
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionBtn} onPress={async () => {
            if (!pet) return;
            try {
              const updated = await petService.performPetAction(pet.id, 'feed');
              setPet(updated);
            } catch (e) {
              // optimistic local update fallback
              setPet((p:any) => ({ ...p, food: Math.min(100, (p?.food ?? 0) + 10) }));
            }
          }}>
            <ThemedText>Feed</ThemedText>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={async () => {
            if (!pet) return;
            try {
              const updated = await petService.performPetAction(pet.id, 'clean');
              setPet(updated);
            } catch (e) {
              setPet((p:any) => ({ ...p, clean: Math.min(100, (p?.clean ?? 0) + 10) }));
            }
          }}>
            <ThemedText>Clean</ThemedText>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={async () => {
            if (!pet) return;
            try {
              const updated = await petService.performPetAction(pet.id, 'play');
              setPet(updated);
            } catch (e) {
              setPet((p:any) => ({ ...p, life: Math.min(100, (p?.life ?? 0) + 5), happiness: Math.min(100, (p?.happiness ?? 0) + 10) }));
            }
          }}>
            <ThemedText>Play</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundGradient: {
    flex: 1,
    backgroundColor: '#90EE90',
    opacity: 0.4,
  },
  safeContent: {
    flex: 1,
    position: 'relative',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  backBtnText: {
    fontSize: 22,
    fontWeight: '600',
  },
  levelCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e8def8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    borderWidth: 3,
    borderColor: '#6750a4',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6750a4',
  },
  levelText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6750a4',
  },
  topRightButtons: {
    position: 'absolute',
    right: 16,
    top: 70,
    zIndex: 10,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconText: {
    fontSize: 22,
  },
  petCenterContainer: {
    position: 'absolute',
    left: '50%',
    top: '35%',
    transform: [{ translateX: -90 }, { translateY: -90 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightProgressContainer: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -90 }],
    gap: 16,
  },
  progressIndicatorWrapper: {
    alignItems: 'center',
  },
  circleProgress: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  progressIcon: {
    fontSize: 28,
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
    color: '#666',
  },
  actionsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 36,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 20,
  },
  actionBtn: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    minWidth: 80,
  },
});


