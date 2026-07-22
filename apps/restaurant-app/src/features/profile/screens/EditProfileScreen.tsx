import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput as RNTextInput,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { useProfile } from '../hooks/useProfile';

type EditProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'EditProfile'>;
};

export const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const { profile, isLoading, updateProfile } = useProfile();
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.primaryAddress || '');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    const result = await updateProfile(phone, address);
    if (result.success) {
      navigation.goBack();
    } else {
      setError('Failed to update profile');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <View style={styles.headerSpacer} />
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Form Card */}
        <View style={styles.card}>
          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone</Text>
            <RNTextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="04XX XXX XXX"
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Address Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <RNTextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="123 Street, City NSW 0000"
              autoCapitalize="words"
              autoCorrect
            />
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.actionButton, styles.cancelButton]}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            style={[styles.actionButton, styles.saveButton, isLoading && styles.buttonDisabled]}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSpacer: {
    width: 64,
  },
  scrollContent: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginLeft: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
    minHeight: 44,
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 8,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#DC2626',
    fontFamily: 'Inter-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  buttonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  bottomSpacer: {
    height: 16,
  },
});