import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffff', dark: '#000000' }}
      headerImage={
        <View style={styles.headerImageContainer}>
          <Image source={require('@/assets/images/figma_360.png')} style={styles.logo} />
        </View>
      }>
      <ThemedView style={styles.container}>
        <View style={styles.headerImageContainer}>
          <Image source={require('@/assets/images/figma_360.png')} style={styles.logo} />
        </View>
        <ThemedText type="title" style={styles.title}>
          WePet
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.subtitle}>
          Enter to your account
        </ThemedText>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#828282"
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password..."
          secureTextEntry
          style={styles.input}
          placeholderTextColor="#828282"
        />

        <View style={styles.rowButtons}>
          <Pressable style={[styles.button, styles.buttonLight]} onPress={() => {}}>
            <ThemedText style={styles.buttonText}>Sign Up</ThemedText>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonPrimary]} onPress={() => {}}>
            <ThemedText style={[styles.buttonText, { color: '#fff' }]}>Log In</ThemedText>
          </Pressable>
        </View>

        <Link href="/forgot">
          <ThemedText type="defaultSemiBold" style={styles.forgot}>
            Forgot your Password?
          </ThemedText>
        </Link>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <ThemedText style={styles.orText}>or</ThemedText>
          <View style={styles.divider} />
        </View>

        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn} onPress={() => {}}>
            <Image source={require('@/assets/images/figma_logo.png')} style={styles.socialIcon} />
            <ThemedText style={styles.socialText}> Google</ThemedText>
          </Pressable>
          <Pressable style={styles.socialBtn} onPress={() => {}}>
            <Image source={require('@/assets/images/figma_logo_apple.png')} style={styles.socialIcon} />
            <ThemedText style={styles.socialText}> Apple</ThemedText>
          </Pressable>
        </View>

        <ThemedText style={styles.terms}>
          By clicking continue, you accept our <ThemedText style={{ fontWeight: '600' }}>Terms & Conditions</ThemedText> &{' '}
          <ThemedText style={{ fontWeight: '600' }}>Privacy Policy</ThemedText>
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    width: "100%",
    height: 125,
    maxWidth: "100%",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: 125,
    resizeMode: 'cover',
    opacity: 0.9,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    color: '#1a1c1f',
  },
  subtitle: {
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#1a1c1f',
  },
  rowButtons: {
    flexDirection: 'row',
    marginTop: 14,
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLight: {
    backgroundColor: 'rgba(26,115,233,0.6)',
    marginRight: 8,
  },
  buttonPrimary: {
    backgroundColor: '#1a73e9',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  forgot: {
    marginTop: 10,
    textDecorationLine: 'underline',
    color: '#007aff',
  },
  dividerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e6e6e6',
  },
  orText: {
    marginHorizontal: 8,
    color: '#828282',
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  socialBtn: {
    flex: 1,
    height: 44,
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  socialText: {
    marginLeft: 8,
  },
  socialIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    overflow: "hidden",
  },
  terms: {
    marginTop: 16,
    color: '#828282',
    textAlign: 'center',
  },
});
