import React from 'react';
import { Modal, StyleSheet, View, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function FigmaModal({ visible, onClose }: Props) {
  const router = useRouter();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <ThemedView style={styles.overlay}>
        <Image source={require('@/assets/images/figma_68_5082_blur.png')} style={styles.blur} />

        <View style={styles.card}>
          <Image source={require('@/assets/images/figma_68_5082_icon.png')} style={styles.icon} />
          <ThemedText type="title" style={styles.title}>
            Check your email
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            We've sent a password reset link to the email address provided. Follow the link to reset your
            password.
          </ThemedText>

          <Pressable
            style={styles.actionBtn}
            onPress={() => {
              onClose();
              router.dismissTo('/signin');
            }}
            accessibilityRole="button">
            <ThemedText type="defaultSemiBold" style={styles.subtitle}>
              Back to Sign In
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blur: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    opacity: 0.6,
    resizeMode: 'cover',
  },
  card: {
    width: '86%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    width: 56,
    height: 56,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b6b6b',
    textAlign: 'center',
    marginBottom: 18,
  },
  actionBtn: {
    width: '100%',
    alignItems: 'center',
  },
  actionImg: {
    width: 200,
    height: 48,
    resizeMode: 'contain',
  },
});
