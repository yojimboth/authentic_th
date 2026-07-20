import React, { useState } from 'react';
import { View, TextInput, ScrollView, Alert, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { useProfile } from '../hooks/useProfile';
import apiClient from '../../../services/api-client';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { currentConfig } from '../../../config/whiteLabelConfig';

type NavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

interface EditProfileScreenProps {
  navigation: NavigationProp;
}

// Validation functions for Australian PII data
const validatePhone = (phone: string): { valid: boolean; message?: string } => {
  // Australian phone number validation
  // Accepts: +61XXXXXXXXX, 0XXXXXXXXX, 04XXXXXXXX (mobile), landlines
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  const phoneRegex = /^(\+61|0)[2-8]\d{8}$/;
  
  if (!cleaned) {
    return { valid: false, message: 'Phone number is required' };
  }
  if (!phoneRegex.test(cleaned)) {
    return { valid: false, message: 'Please enter a valid Australian phone number (e.g., 04XX XXX XXX or +61 4XX XXX XXX)' };
  }
  return { valid: true };
};

const validateAddress = (address: string): { valid: boolean; message?: string } => {
  if (!address.trim()) {
    return { valid: false, message: 'Address is required' };
  }
  if (address.trim().length < 10) {
    return { valid: false, message: 'Address must be at least 10 characters' };
  }
  if (address.trim().length > 500) {
    return { valid: false, message: 'Address must be less than 500 characters' };
  }
  // Comprehensive sanitization: remove dangerous characters and null bytes
  const sanitized = address.replace(/[<>{}\x00-\x1f\x7f]/g, '');
  if (sanitized !== address) {
    return { valid: false, message: 'Address contains invalid characters' };
  }
  return { valid: true };
};

export const EditProfileScreen = ({ navigation }: EditProfileScreenProps) => {
  const { state } = useProfile();
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  // Security: Properly narrow AsyncState type
  const userProfile = state.status === 'success' ? state.data : null;

  // Set initial values once profile data is loaded
  React.useEffect(() => {
    if (userProfile) {
      setPhone(userProfile.phone);
      setAddress(userProfile.primaryAddress);
    }
  }, [userProfile]);

  const handleSave = async () => {
    // Clear previous errors
    setPhoneError('');
    setAddressError('');
    
    // Validate inputs
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
      setPhoneError(phoneValidation.message || 'Invalid phone number');
      Alert.alert('Validation Error', phoneValidation.message || 'Invalid phone number');
      return;
    }
    
    const addressValidation = validateAddress(address);
    if (!addressValidation.valid) {
      setAddressError(addressValidation.message || 'Invalid address');
      Alert.alert('Validation Error', addressValidation.message || 'Invalid address');
      return;
    }

    setIsSaving(true);
    try {
      // Mock API call to update profile
      await apiClient.patch('/user/profile', {
        phone: phone.replace(/[\s\-\(\)]/g, ''), // Send cleaned phone
        primaryAddress: address.trim(),
      });
      
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: any) {
      // Security: Don't expose internal error details to users
      console.error('Profile update error:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again or contact support.');
    } finally {
      setIsSaving(false);
    }
  };

  if (state.status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={currentConfig.theme.primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.subtitle}>
              Update your contact information and primary address.
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Phone Number Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[
                  styles.input,
                  phoneError ? styles.inputError : null,
                ]}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (phoneError) setPhoneError('');
                }}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                maxLength={20}
              />
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Format: 04XX XXX XXX or +61 4XX XXX XXX
                </Text>
              )}
            </View>

            {/* Address Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Primary Address</Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  addressError ? styles.inputError : null,
                ]}
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  if (addressError) setAddressError('');
                }}
                placeholder="Enter your full address"
                multiline={true}
                textAlignVertical="top"
                maxLength={500}
              />
              {addressError ? (
                <Text style={styles.errorText}>{addressError}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Minimum 10 characters required
                </Text>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.saveButton,
                isSaving && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#18181B',
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717A',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  form: {
    marginBottom: 32,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#18181B',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#18181B',
    fontFamily: 'Inter-Regular',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    marginLeft: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#71717A',
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    marginLeft: 4,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#E4E4E7',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
});
