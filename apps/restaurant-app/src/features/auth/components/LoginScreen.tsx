import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { StoreLogo } from '../../../components/common/StoreLogo';
import { useAuth } from '../../auth/hooks/useAuth';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
};

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = (): boolean => {
    let valid = true;
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    const result = await login();
    if (result.success) {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <StoreLogo size={80} style={styles.logo} />
          <Text style={styles.title}>Restaurant Login</Text>
          <Text style={styles.subtitle}>Sign in to manage your store</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <RNTextInput
              style={[
                styles.input,
                emailError ? styles.inputError : null,
              ]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError('');
              }}
              placeholder="your@email.com"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <RNTextInput
              style={[
                styles.input,
                passwordError ? styles.inputError : null,
              ]}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              placeholder="Enter password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
              autoCorrect={false}
            />
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorMessage}>
              <Text style={styles.errorMessageBox}>{error}</Text>
            </View>
          )}

          {/* Sign In Button */}
          <TouchableOpacity
            style={[
              styles.button,
              isLoading && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotButtonText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 32,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    minHeight: 52,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
    fontFamily: 'Inter-Regular',
  },
  errorMessage: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorMessageBox: {
    fontSize: 14,
    fontWeight: '400',
    color: '#DC2626',
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  forgotButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4F46E5',
    fontFamily: 'Inter-Medium',
  },
});