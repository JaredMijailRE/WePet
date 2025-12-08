import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Image, Text, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PetStyler } from '@/components/pet-styler';

type PetStyle = 'dog' | 'cat' | 'dragon' | 'duck';

export default function PetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = (params.groupId as string) ?? 'unknown';

  // Dummy pet state per group - replace with API integration
  const [pet, setPet] = useState({ 
    name: `Pet of ${groupId}`, 
    level: 5, 
    life: 78, 
    food: 52, 
    clean: 34,
    style: 'dog' as PetStyle,
  });

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
            <ThemedText style={styles.levelNumber}>{pet.level}</ThemedText>
            <ThemedText style={styles.levelText}>LVL</ThemedText>
          </View>
        </View>

        {/* Top Right Buttons (Settings & Activities) */}
        <View style={styles.topRightButtons}>
          <Pressable 
            onPress={() => router.push(`/pet_service/group-settings?groupId=${groupId}`)} 
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
          <PetStyler style={pet.style} size={180} />
        </View>

        {/* Right Progress Indicators */}
        <View style={styles.rightProgressContainer}>
          {/* Food */}
          <View style={styles.progressIndicatorWrapper}>
            <View style={[styles.circleProgress, { borderColor: '#ffd166' }]}>
              <Text style={styles.progressIcon}>🍗</Text>
            </View>
            <ThemedText style={styles.progressValue}>{Math.round(pet.food)}%</ThemedText>
          </View>

          {/* Life */}
          <View style={styles.progressIndicatorWrapper}>
            <View style={[styles.circleProgress, { borderColor: '#ff6b6b' }]}>
              <Text style={styles.progressIcon}>❤️</Text>
            </View>
            <ThemedText style={styles.progressValue}>{Math.round(pet.life)}%</ThemedText>
          </View>

          {/* Clean */}
          <View style={styles.progressIndicatorWrapper}>
            <View style={[styles.circleProgress, { borderColor: '#74c0fc' }]}>
              <Text style={styles.progressIcon}>🧼</Text>
            </View>
            <ThemedText style={styles.progressValue}>{Math.round(pet.clean)}%</ThemedText>
          </View>
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
});


