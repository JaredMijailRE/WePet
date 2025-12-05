import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Image, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function VerifyScreen() {
  const [code, setCode] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleVerify = () => {
    const fullCode = code.join('');
    console.log('Verify code:', fullCode);
    // Navigate to password creation screen
    router.push('/password');
  };

  const handleDigitChange = (index: number, digit: string) => {
    // Only allow numbers
    if (!/^\d?$/.test(digit)) return;

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-focus next box if digit entered
    if (digit && index < 3) {
      setFocusedIndex(index + 1);
    }
  };

  const handleDigitBackspace = (index: number) => {
    if (code[index] === '' && index > 0) {
      // If current box is empty, move to previous
      setFocusedIndex(index - 1);
    } else {
      // Clear current box
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffff', dark: '#000000' }}
      headerImage={
        <View style={styles.headerContainer}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Image source={require('@/assets/images/figma_verify_back_icon.png')} style={styles.backIcon} />
          </Pressable>
        </View>
      }>
      <ThemedView style={styles.container}>
        <View style={styles.iconContainer}>
          <Image source={require('@/assets/images/figma_verify_mail_icon.png')} style={styles.mailIcon} />
        </View>

        <ThemedText type="title" style={styles.mainTitle}>
          Check your Email!
        </ThemedText>

        <ThemedText style={styles.helpText}>
          We send you a verification code:
        </ThemedText>

        <View style={styles.codeBoxContainer}>
          <View style={styles.codeBox}>
            <View style={styles.codeInputsWrapper}>
              {[0, 1, 2, 3].map((index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.codeInputBox,
                    focusedIndex === index && styles.codeInputBoxFocused,
                  ]}
                  onPress={() => setFocusedIndex(index)}
                >
                  <ThemedText style={styles.codeInputText}>{code[index]}</ThemedText>
                  <TextInput
                    style={styles.hiddenInput}
                    value={code[index]}
                    onChangeText={(digit) => handleDigitChange(index, digit)}
                    onKeyPress={(e) => {
                      if (e.nativeEvent.key === 'Backspace') {
                        handleDigitBackspace(index);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    ref={(ref) => {
                      if (focusedIndex === index && ref) {
                        ref.focus();
                      }
                    }}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable style={styles.sendAgainBtn}>
            <Image source={require('@/assets/images/figma_verify_icon.png')} style={styles.sendIcon} />
            <ThemedText style={styles.sendAgainText}>Send Again...</ThemedText>
          </Pressable>

          <Pressable style={styles.verifyBtn} onPress={handleVerify}>
            <ThemedText type="defaultSemiBold" style={styles.verifyText}>
              Verify
            </ThemedText>
          </Pressable>
        </View>

        <View style={styles.codeInputContainer}>
          {/* Hidden input for keyboard control */}
        </View>

        <Image source={require('@/assets/images/figma_verify_360.png')} style={styles.bottomImage} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 100,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 12,
    paddingTop: 16,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  mailIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  mainTitle: {
    fontSize: 22,
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },
  helpText: {
    color: '#000',
    marginBottom: 24,
    fontSize: 14,
    textAlign: 'center',
  },
  codeBoxContainer: {
    width: '100%',
    marginBottom: 24,
  },
  codeBox: {
    width: '100%',
    height: 180,
    backgroundColor: '#bfddf3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeInputsWrapper: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
  },
  codeInputBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#cccccc',
  },
  codeInputBoxFocused: {
    borderColor: '#007aff',
    backgroundColor: '#f0f8ff',
  },
  codeInputText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  codeText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#000',
    letterSpacing: 8,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  sendAgainBtn: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#d9d9d9',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  sendAgainText: {
    fontSize: 14,
    color: '#1e1e1e',
  },
  verifyBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#1a73e9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyText: {
    color: '#fff',
    fontSize: 14,
  },
  codeInputContainer: {
    width: '100%',
    marginBottom: 20,
    opacity: 0,
    height: 0,
  },
  codeInput: {
    width: '100%',
    height: 0,
  },
  bottomImage: {
    width: '150%',
    height: 220,
    marginTop: 28,
    alignSelf: 'center',
    opacity: 0.46,
    resizeMode: 'cover',
  },
});
