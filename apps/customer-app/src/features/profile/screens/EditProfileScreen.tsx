import React, { useState } from 'react';
import { View, TextInput, ScrollView, Alert } from 'react-native';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useProfile } from '../hooks/useProfile';
import apiClient from 'api-client';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

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
      <View className="flex-1 bg-zinc-50 items-center justify-center">
        <Typography variant="body">Loading Profile...</Typography>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-50">
      <ScrollView className="px-6 pt-6">
        <View className="mb-8">
          <Typography variant="h2" className="font-poppins mb-2">Edit Profile</Typography>
          <Typography variant="caption" className="text-zinc-500">
            Update your contact information and primary address.
          </Typography>
        </View>

        <View className="space-y-6">
          <View>
            <Typography variant="body" className="mb-2 ml-1 font-medium">Phone Number</Typography>
            <TextInput
              className={`p-4 bg-white border rounded-xl text-zinc-900 ${phoneError ? 'border-red-500' : 'border-zinc-200'}`}
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
              <Typography variant="caption" className="text-red-500 mt-1 ml-1">
                {phoneError}
              </Typography>
            ) : (
              <Typography variant="caption" className="text-zinc-500 mt-1 ml-1">
                Format: 04XX XXX XXX or +61 4XX XXX XXX
              </Typography>
            )}
          </View>

          <View>
            <Typography variant="body" className="mb-2 ml-1 font-medium">Primary Address</Typography>
            <TextInput
              className={`p-4 bg-white border rounded-xl text-zinc-900 min-h-[120px] ${addressError ? 'border-red-500' : 'border-zinc-200'}`}
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
              <Typography variant="caption" className="text-red-500 mt-1 ml-1">
                {addressError}
              </Typography>
            ) : (
              <Typography variant="caption" className="text-zinc-500 mt-1 ml-1">
                Minimum 10 characters required
              </Typography>
            )}
          </View>
        </View>

        <View className="flex-row space-x-4 mt-12">
          <Button 
            title="Cancel" 
            variant="ghost" 
            onPress={() => navigation.goBack()} 
            className="flex-1"
          />
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            loading={isSaving}
            className="flex-1"
          />
        </View>
      </ScrollView>
    </View>
  );
};
