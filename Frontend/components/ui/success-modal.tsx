import React from 'react';
import { Modal, View, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  message: string;
  buttonText: string;
  onButtonPress: () => void;
}

export const SuccessModal = ({
  visible,
  title,
  message,
  buttonText,
  onButtonPress,
}: SuccessModalProps) => {
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? '#1a1a1a' : '#ffffff';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onButtonPress}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
          <ThemedText style={styles.successIcon}>✅</ThemedText>
          <ThemedText type="title" style={[styles.modalTitle, { color: textColor }]}>
            {title}
          </ThemedText>
          <ThemedText style={[styles.modalMessage, { color: '#666666' }]}>
            {message}
          </ThemedText>
          <Pressable style={styles.modalButton} onPress={onButtonPress}>
            <ThemedText style={styles.modalButtonText}>{buttonText}</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    width: '85%',
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
