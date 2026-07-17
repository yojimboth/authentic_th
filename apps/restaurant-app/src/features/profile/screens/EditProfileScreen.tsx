import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { TextInput } from '../../../components/common/TextInput';
import { Button } from '../../../components/common/Button';
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
    <View className="flex-1 bg-zinc-50">
      <View className="bg-white px-4 pt-4 pb-3 border-b border-zinc-200">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()} className="py-2">
            <Text className="text-brand-primary text-base font-semibold">← Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-bold text-zinc-900">Edit Profile</Text>
          <View className="w-16" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-xl p-4 mb-4 border border-zinc-200">
          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            placeholder="04XX XXX XXX"
            keyboardType="phone-pad"
          />

          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="123 Street, City NSW 0000"
          />

          {error && (
            <Text className="text-red-500 text-sm mb-2">{error}</Text>
          )}
        </View>

        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-1 border border-zinc-300 py-3 rounded-lg items-center"
          >
            <Text className="text-zinc-600 font-semibold">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading}
            className="flex-1 bg-brand-primary py-3 rounded-lg items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold">Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};