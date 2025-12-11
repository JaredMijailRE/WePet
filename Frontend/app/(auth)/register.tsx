import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  ScrollView,
  useColorScheme,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const PASSWORD_REQUIREMENTS = {
  length: /^.{8,16}$/,
  lowercase: /[a-z]/,
  uppercase: /[A-Z]/,
  number: /[0-9]/,
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
};

interface PasswordValidation {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

const RequirementItem = ({
  label,
  met,
  colorScheme,
}: {
  label: string;
  met: boolean;
  colorScheme: string | null | undefined;
}) => {
  const checkColor = met ? '#007aff' : '#999999';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <View style={styles.requirementItem}>
      <ThemedText style={[styles.requirementCheckmark, { color: checkColor }]}>
        {met ? '✓' : '✗'}
      </ThemedText>
      <ThemedText style={[styles.requirementLabel, { color: textColor }]}>
        {label}
      </ThemedText>
    </View>
  );
};

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validation, setValidation] = useState<PasswordValidation>({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const router = useRouter();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? '#1a1a1a' : '#ffffff';
  const inputBgColor = colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5';
  const borderColor = password ? '#007aff' : '#cccccc';
  const confirmBorderColor = confirmPassword ? '#007aff' : '#cccccc';
  const textColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  const validatePassword = useCallback((pwd: string) => {
    const newValidation: PasswordValidation = {
      length: PASSWORD_REQUIREMENTS.length.test(pwd),
      lowercase: PASSWORD_REQUIREMENTS.lowercase.test(pwd),
      uppercase: PASSWORD_REQUIREMENTS.uppercase.test(pwd),
      number: PASSWORD_REQUIREMENTS.number.test(pwd),
      special: PASSWORD_REQUIREMENTS.special.test(pwd),
    };
    setValidation(newValidation);
  }, []);

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    validatePassword(text);
  };

  const allRequirementsMet = Object.values(validation).every((v) => v === true);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canContinue = allRequirementsMet && passwordsMatch && username && email && birthDate;

  const handleRegister = async () => {
    if (canContinue) {
      try {
        const response = await fetch('http://localhost/user/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            birth_date: birthDate,
          }),
        });
                const data = await response.json();
        if (response.ok) {
          setShowSuccessModal(true);
        } else {
          let message = 'An error occurred';
          if (data.detail) {
            if (Array.isArray(data.detail)) {
              message = data.detail.map((err: any) => err.msg).join(', ');
            } else if (typeof data.detail === 'string') {
              message = data.detail;
            }
          }
          setErrorMessage(message);
          setShowErrorModal(true);
        }
      } catch (error) {
        setErrorMessage('An error occurred. Please try again.');
        setShowErrorModal(true);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <ThemedText style={styles.backText}>←</ThemedText>
          </Pressable>
        </View>

        {/* Lock Icon */}
        <View style={styles.iconContainer}>
          <ThemedText style={styles.lockIcon}>📝</ThemedText>
        </View>

        {/* Title */}
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>
          Create account
        </ThemedText>

        {/* Subtitle */}
        <ThemedText style={[styles.subtitle, { color: '#666666' }]}>
          Please fill in the details to create an account.
        </ThemedText>

        {/* Username Input */}
        <View style={[styles.inputWrapper, { borderColor: username ? '#007aff' : '#cccccc' }]}>
          <TextInput
            style={[styles.passwordInput, { color: textColor, backgroundColor: inputBgColor }]}
            placeholder="Username"
            placeholderTextColor="#999999"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email Input */}
        <View style={[styles.inputWrapper, { borderColor: email ? '#007aff' : '#cccccc' }]}>
          <TextInput
            style={[styles.passwordInput, { color: textColor, backgroundColor: inputBgColor }]}
            placeholder="Email"
            placeholderTextColor="#999999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Birth Date Input */}
        <View style={[styles.inputWrapper, { borderColor: birthDate ? '#007aff' : '#cccccc' }]}>
          <TextInput
            style={[styles.passwordInput, { color: textColor, backgroundColor: inputBgColor }]}
            placeholder="Birth Date (YYYY-MM-DD)"
            placeholderTextColor="#999999"
            value={birthDate}
            onChangeText={setBirthDate}
          />
        </View>


        {/* Password Input */}
        <View style={[styles.inputWrapper, { borderColor }]}>
          <TextInput
            style={[styles.passwordInput, { color: textColor, backgroundColor: inputBgColor }]}
            placeholder="Enter your password"
            placeholderTextColor="#999999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <ThemedText style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️'}</ThemedText>
          </Pressable>
        </View>

        {/* Confirm Password Input */}
        <View style={[styles.inputWrapper, { borderColor: confirmBorderColor }]}>
          <TextInput
            style={[styles.passwordInput, { color: textColor, backgroundColor: inputBgColor }]}
            placeholder="Confirm your password"
            placeholderTextColor="#999999"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <Pressable
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeButton}
          >
            <ThemedText style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️'}</ThemedText>
          </Pressable>
        </View>

        {/* Password Mismatch Warning */}
        {confirmPassword.length > 0 && !passwordsMatch && (
          <ThemedText style={styles.errorText}>❌ Passwords do not match</ThemedText>
        )}

        {/* Requirements List */}
        <View style={styles.requirementsContainer}>
          <RequirementItem
            label="8-16 characters long"
            met={validation.length}
            colorScheme={colorScheme}
          />
          <RequirementItem
            label="1 lowercase character (a-z)"
            met={validation.lowercase}
            colorScheme={colorScheme}
          />
          <RequirementItem
            label="1 uppercase character (A-Z)"
            met={validation.uppercase}
            colorScheme={colorScheme}
          />
          <RequirementItem
            label="1 number"
            met={validation.number}
            colorScheme={colorScheme}
          />
          <RequirementItem
            label="1 special character (e.g. ! @ # $ %)"
            met={validation.special}
            colorScheme={colorScheme}
          />
        </View>

        {/* Continue Button */}
        <Pressable
          style={[
            styles.continueButton,
            {
              backgroundColor: canContinue ? '#007aff' : '#cccccc',
            },
          ]}
          onPress={handleRegister}
          disabled={!canContinue}
        >
          <ThemedText style={styles.continueText}>Register</ThemedText>
        </Pressable>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          router.replace('/(auth)/signin');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
            <ThemedText style={styles.successIcon}>✅</ThemedText>
            <ThemedText type="title" style={[styles.modalTitle, { color: textColor }]}>
              Account Created!
            </ThemedText>
            <ThemedText style={[styles.modalMessage, { color: '#666666' }]}>
              Your account has been successfully created.
            </ThemedText>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                router.replace('/(auth)/signin');
              }}
            >
              <ThemedText style={styles.modalButtonText}>Go to Sign In</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
            <ThemedText style={styles.successIcon}>❌</ThemedText>
            <ThemedText type="title" style={[styles.modalTitle, { color: textColor }]}>
              Error
            </ThemedText>
            <ThemedText style={[styles.modalMessage, { color: '#666666' }]}>
              {errorMessage}
            </ThemedText>
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowErrorModal(false)}
            >
              <ThemedText style={styles.modalButtonText}>Close</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 12,
    paddingRight: 16,
  },
  backText: {
    fontSize: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  lockIcon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 52,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  eyeButton: {
    paddingHorizontal: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  requirementsContainer: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  requirementCheckmark: {
    fontSize: 18,
    marginRight: 12,
    fontWeight: 'bold',
    minWidth: 24,
  },
  requirementLabel: {
    fontSize: 14,
    flex: 1,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
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
  errorText: {
    fontSize: 12,
    color: '#ff3333',
    marginBottom: 12,
    fontWeight: '500',
  },
});

