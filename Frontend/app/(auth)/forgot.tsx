import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Image } from 'react-native';
import FigmaModal from '@/components/ui/forgot-alert';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ParallaxScrollView from '@/components/parallax-scroll-view';

export default function ForgotScreen() {
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#ffffff', dark: '#000000' }}
      headerImage={
        <View style={styles.headerContainer}>
          <Image source={require('@/assets/images/figma_68_icon.png')} style={styles.icon} />
        </View>
      }>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Forgot your password?</ThemedText>
        <ThemedText style={styles.helpText}>Enter the email associated with your account.</ThemedText>

        <View style={styles.inputWrap}>
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

        <Pressable style={styles.continueBtn} onPress={() => setModalVisible(true)}>
          <ThemedText type="defaultSemiBold" style={styles.continueText}>
            Continue
          </ThemedText>
        </Pressable>
        <FigmaModal visible={modalVisible} onClose={() => setModalVisible(false)} />
        <Image source={require('@/assets/images/figma_68_360.png')} style={styles.bottomImage} />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 16,
    paddingTop: 8,
  },
  icon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    tintColor: '#1a1c29',
  },
  container: {
    paddingHorizontal: 18,
    paddingTop: 8,
    alignItems: 'flex-start',
  },
  title: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 22.4,
  },
  helpText: {
    color: '#797979',
    marginBottom: 18,
    fontSize: 16.8,
  },
  inputWrap: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#f3f3f3',
    borderRadius: 16,
    paddingHorizontal: 18,
    fontSize: 17.92,
    borderWidth: 2.24,
    borderColor: '#007aff',
    color: '#1a1c29',
  },
  inputAccent: {
    position: 'absolute',
    left: 18,
    top: 18,
    width: 2.24,
    height: 26.88,
    backgroundColor: '#007aff',
    borderRadius: 2,
  },
  rowText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  remember: {
    color: '#797979',
    marginRight: 6,
    fontSize: 15.68,
  },
  link: {
    color: '#007aff',
    fontSize: 15.68,
  },
  continueBtn: {
    marginTop: 18,
    width: '100%',
    height: 60,
    backgroundColor: '#007aff',
    borderRadius: 15.68,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 17.92,
  },
  bottomImage: {
    width: '120%',
    height: 220,
    marginTop: 28,
    alignSelf: 'center',
    opacity: 0.46,
    resizeMode: 'cover',
  },
});
