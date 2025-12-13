import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Image, Text, SafeAreaView, Animated, Easing } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PetStyler } from '@/components/pet-styler';
import petService from '@/services/pet';
import Svg, { Circle } from 'react-native-svg';

type PetStyle = 'dog' | 'cat' | 'dragon' | 'duck';

export const unstable_settings = {
  headerShown: false,
};

// Simple SVG-based circular progress ring
function CircleProgress({
  size = 75,
  strokeWidth = 5,
  color = '#6750a4',
  bgColor = 'rgba(0,0,0,0.08)',
  value = 0,
}: {
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  value?: number; // 0..100
}) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <Svg width={size} height={size} style={{ position: 'absolute', top: 0, left: 0 }}>
      {/* track */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* progress */}
      <Circle
        cx={cx}
        cy={cy}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        fill="none"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    </Svg>
  );
}

const PET_SIZE = 180;

type ParticleType = 'food' | 'clean' | 'life';

type Particle = {
  id: string;
  type: ParticleType;
  emoji: string;
  x: number; // initial horizontal offset from center
  rise: number; // total rise in px
  driftX: number; // additional horizontal drift
  duration: number;
  delay: number;
};

function AnimatedParticle({ p, onDone }: { p: Particle; onDone: (id: string) => void }) {
  const progress = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration: p.duration,
      delay: p.delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    anim.start(() => {
      onDone(p.id);
    });
    return () => {
      anim.stop();
    };
  }, [p.id]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -p.rise] });
  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [p.x, p.x + p.driftX] });
  const scale = progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.6, 1.05, 1] });
  const opacity = progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0, 1, 0] });

  return (
    <Animated.Text
      style={[
        styles.particleEmoji,
        {
          position: 'absolute',
          left: PET_SIZE / 2,
          top: PET_SIZE / 2,
          transform: [{ translateX }, { translateY }, { scale }],
          opacity,
        },
      ]}
    >
      {p.emoji}
    </Animated.Text>
  );
}

export default function PetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const groupId = (params.groupId as string) ?? 'unknown';

  // pet state (fetched from backend)
  const [pet, setPet] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  // local decay timer ref so we can clear on unmount or pet change
  const decayTimerRef = useRef<NodeJS.Timer | null>(null);
  // configurable decay rates per hour
  const decayPerHour = useMemo(() => ({
    food: 8,    // percent per hour
    clean: 6,
    life: 4,
  }), []);
  // tick interval in ms
  const decayTickMs = 60 * 1000; // 1 minute granularity

  const [particles, setParticles] = useState<Particle[]>([]);

  const handleParticleDone = useCallback((id: string) => {
    setParticles((prev) => prev.filter((pp) => pp.id !== id));
  }, []);

  const spawnParticles = useCallback((type: ParticleType, count = 8) => {
    const emojiMap: Record<ParticleType, string[]> = {
      food: ['🍗', '🍖', '🥕', '🍎', '✨'],
      clean: ['🫧', '🧼', '✨'],
      life: ['❤️', '💖', '💘', '✨'],
    };
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const items: Particle[] = Array.from({ length: count }).map(() => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      return {
        id,
        type,
        emoji: pick(emojiMap[type]),
        x: (Math.random() - 0.5) * 120, // -60..60
        rise: 80 + Math.random() * 80, // 60..140
        driftX: (Math.random() - 0.5) * 60, // -20..20
        duration: 1000 + Math.random() * 600, // 800..1400ms
        delay: Math.random() * 200,
      };
    });
    setParticles((prev) => [...prev, ...items]);
  }, []);

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

  // Decay effect: decreases stats smoothly over time while screen is mounted
  useEffect(() => {
    // clear any previous timer
    if (decayTimerRef.current) {
      clearInterval(decayTimerRef.current as unknown as number);
      decayTimerRef.current = null;
    }
    // don't start until we have a pet loaded
    if (!pet) return;

    const perMinute = {
      food: decayPerHour.food / 30,
      clean: decayPerHour.clean / 30,
      life: decayPerHour.life / 30,
    };

    decayTimerRef.current = setInterval(() => {
      setPet((prev: any) => {
        if (!prev) return prev;
        const next = {
          ...prev,
          food: Math.max(0, (prev.food ?? 0) - perMinute.food),
          clean: Math.max(0, (prev.clean ?? 0) - perMinute.clean),
          life: Math.max(0, (prev.life ?? 0) - perMinute.life),
        };
        return next;
      });
    }, decayTickMs) as unknown as NodeJS.Timer;

    return () => {
      if (decayTimerRef.current) {
        clearInterval(decayTimerRef.current as unknown as number);
        decayTimerRef.current = null;
      }
    };
  }, [pet?.id, decayPerHour.food, decayPerHour.clean, decayPerHour.life]);

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
          <View style={styles.petWrapper}>
            <PetStyler style={(pet?.type ?? 'dog') as PetStyle} size={PET_SIZE} />
            <View pointerEvents="none" style={styles.particlesLayer}>
              {particles.map((p) => (
                <AnimatedParticle key={p.id} p={p} onDone={handleParticleDone} />
              ))}
            </View>
          </View>
        </View>

        {/* Right Progress Indicators */}
        <View style={styles.rightProgressContainer}>
          {/* Food */}
          <View style={styles.progressIndicatorWrapper}>
            <View style={styles.progressCircleWrapper}>
              <CircleProgress size={75} strokeWidth={5} color="#ffd166" bgColor="rgba(0,0,0,0.08)" value={Math.round(pet?.food ?? 0)} />
              <Text style={styles.progressIcon}>🍗</Text>
            </View>
            <ThemedText style={styles.progressValue}>{Math.round(pet?.food ?? 0)}%</ThemedText>
          </View>

          {/* Life */}
          <View style={styles.progressIndicatorWrapper}>
            <View style={styles.progressCircleWrapper}>
              <CircleProgress size={75} strokeWidth={5} color="#ff6b6b" bgColor="rgba(0,0,0,0.08)" value={Math.round(pet?.life ?? 0)} />
              <Text style={styles.progressIcon}>❤️</Text>
            </View>
            <ThemedText style={styles.progressValue}>{Math.round(pet?.life ?? 0)}%</ThemedText>
          </View>

          {/* Clean */}
          <View style={styles.progressIndicatorWrapper}>
            <View style={styles.progressCircleWrapper}>
              <CircleProgress size={75} strokeWidth={5} color="#74c0fc" bgColor="rgba(0,0,0,0.08)" value={Math.round(pet?.clean ?? 0)} />
              <Text style={styles.progressIcon}>🧼</Text>
            </View>
            <ThemedText style={styles.progressValue}>{Math.round(pet?.clean ?? 0)}%</ThemedText>
          </View>
        </View>
        
        {/* Action Buttons (Feed / Clean / Play) */}
        <View style={styles.actionsRow}>
          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]} onPress={async () => { spawnParticles('food');
            if (!pet) return;
            // optimistic local update for snappy UI
            setPet((p:any) => ({ ...p, food: Math.min(100, (p?.food ?? 0) + 15) }));
            try {
              const updated = await petService.performPetAction(pet.id, 'feed');
              setPet(updated);
            } catch (e) {
              // keep optimistic value if backend fails
              console.warn('Feed action failed, kept optimistic state', e);
            }
          }}>
            <ThemedText>Feed</ThemedText>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]} onPress={async () => { spawnParticles('clean');
            if (!pet) return;
            setPet((p:any) => ({ ...p, clean: Math.min(100, (p?.clean ?? 0) + 20) }));
            try {
              const updated = await petService.performPetAction(pet.id, 'clean');
              setPet(updated);
            } catch (e) {
              console.warn('Clean action failed, kept optimistic state', e);
            }
          }}>
            <ThemedText>Clean</ThemedText>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]} onPress={async () => { spawnParticles('life');
            if (!pet) return;
            setPet((p:any) => ({ ...p, life: Math.min(100, (p?.life ?? 0) + 8), happiness: Math.min(100, (p?.happiness ?? 0) + 15) }));
            try {
              const updated = await petService.performPetAction(pet.id, 'play');
              setPet(updated);
            } catch (e) {
              console.warn('Play action failed, kept optimistic state', e);
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
  petWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  particlesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particleEmoji: {
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
  progressCircleWrapper: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    position: 'relative',
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
  actionBtnPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowOpacity: 0.5,
  },
});


