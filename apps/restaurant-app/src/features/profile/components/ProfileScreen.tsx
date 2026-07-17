import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/types';
import { useAuthStore } from '../../../store/authStore';
import { Button } from '../../../components/common/Button';
import { useProfile } from '../hooks/useProfile';
import { TextInput } from '../../../components/common/TextInput';

type ProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'MainTabs'>;
};

const settingsItems = [
  { title: 'Notification Preferences' },
  { title: 'Printer Configuration' },
  { title: 'Subscription Plan' },
  { title: 'Help & Support' },
];

export const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const { user, logout } = useAuthStore();
  const { updateProfile } = useProfile();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <View className="flex-1 bg-zinc-50">
      <View className="bg-white px-4 pt-4 pb-3 border-b border-zinc-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-zinc-900">Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <Text className="text-brand-primary text-base font-semibold">Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-xl p-4 mb-4 border border-zinc-200">
          <Text className="text-base font-semibold text-zinc-900 mb-3">Account Details</Text>
          <View className="space-y-2">
            <View className="flex-row items-center mb-1">
              <Text className="text-sm text-zinc-500 w-20">Name:</Text>
              <Text className="text-sm text-zinc-900 font-medium">{user.fullName}</Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Text className="text-sm text-zinc-500 w-20">Email:</Text>
              <Text className="text-sm text-zinc-900">{user.email}</Text>
            </View>
            {user.phone && (
              <View className="flex-row items-center mb-1">
                <Text className="text-sm text-zinc-500 w-20">Phone:</Text>
                <Text className="text-sm text-zinc-900">{user.phone}</Text>
              </View>
            )}
            <View className="flex-row items-center mb-1">
              <Text className="text-sm text-zinc-500 w-20">Role:</Text>
              <Text className="text-sm text-zinc-900 capitalize">{user.role}</Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-sm text-zinc-500 w-20">Tenant:</Text>
              <Text className="text-sm text-zinc-900">Siam Authentic</Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4 border border-zinc-200">
          <Text className="text-base font-semibold text-zinc-900 mb-3">Settings</Text>
          {settingsItems.map((item) => (
            <TouchableOpacity
              key={item.title}
              className="flex-row items-center justify-between py-3 border-b border-zinc-100 last:border-b-0"
              activeOpacity={0.7}
            >
              <Text className="text-sm text-zinc-700">{item.title}</Text>
              <Text className="text-zinc-400">→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mb-8">
          <Button title="Logout" onPress={handleLogout} variant="danger" />
        </View>
      </ScrollView>
    </View>
  );
};