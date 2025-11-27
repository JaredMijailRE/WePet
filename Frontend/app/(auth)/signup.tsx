import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffff', dark: '#000000' }}
      headerImage={
        <View style={styles.headerContainer}>
          <Pressable onPress={() => router.back()}>
            <ThemedText style={styles.backButton}>←</ThemedText>
          </Pressable>
        </View>
      }>
      <ThemedView style={styles.container}>
        <View style={styles.iconContainer}>
          <Image source={require('@/assets/images/figma_signup_icon.png')} style={styles.icon} />
        </View>

        <ThemedText type="title" style={styles.mainTitle}>
          Get going with email
        </ThemedText>

        <ThemedText style={styles.helpText}>
          It's helpful to provide a good reason for why the email address is required.
        </ThemedText>

        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email address"
            style={styles.input}
            placeholderTextColor="#797979"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.inputAccent} />
        </View>

        <View style={styles.checkboxRow}>
          <Pressable
            style={[styles.checkbox, newsletter && styles.checkboxChecked]}
            onPress={() => setNewsletter(!newsletter)}>
            {newsletter && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </Pressable>
          <ThemedText style={styles.checkboxText}>
            Stay up to date with the latest news and resources delivered directly to your inbox
          </ThemedText>
        </View>

        <Pressable style={styles.continueBtn} onPress={() => router.push('/verify')}>
          <ThemedText type="defaultSemiBold" style={styles.continueText}>
            Continue
          </ThemedText>
        </Pressable>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 120,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingTop: 20,
  },
  backButton: {
    fontSize: 28,
    color: '#1a1c29',
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },
  mainTitle: {
    fontSize: 22,
    marginBottom: 8,
    color: '#1a1c29',
  },
  helpText: {
    color: '#797979',
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 21,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#f3f3f3',
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 17,
    borderWidth: 2,
    borderColor: '#007aff',
    color: '#1a1c29',
  },
  inputAccent: {
    position: 'absolute',
    left: 18,
    top: 18,
    width: 2,
    height: 26,
    backgroundColor: '#007aff',
    borderRadius: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    width: '100%',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d7d7d7',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#797979',
    lineHeight: 21,
  },
  continueBtn: {
    marginTop: 12,
    width: '100%',
    height: 60,
    backgroundColor: '#007aff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 18,
  },
});
