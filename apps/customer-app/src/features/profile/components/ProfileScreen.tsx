import React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useCartStore } from '../../../store/useCartStore';
import apiClient from '../../../services/apiClient';

export const ProfileScreen = () => {
  const { state } = useProfile(); // Hook will be implemented below

  if (state.status === 'loading') {
    return (
      <SafeAreaView className="flex-1 bg-zinc-50 items-center justify-center">
        <Typography variant="body">Loading Profile...</Typography>
      </SafeAreaView>
    );
  }

  const user = state.data;

  return (
    <SafeAreaView className="flex-1 bg-zinc-50">
      <ScrollView className="px-6 pt-6">
        <View className="flex-row items-center mb-8">
          <Image 
            source={{ uri: `https://i.pravatar.cc/150?u=${user?.id}` }} 
            className="w-20 h-20 rounded-full border-2 border-brand-primary mr-4"
          />
          <View>
            <Typography variant="h1" className="font-poppins">{user?.fullName}</Typography>
            <Typography variant="caption">{user?.email}</Typography>
          </View>
        </View>

        <View className="p-6 bg-brand-primary rounded-3xl shadow-md mb-8">
          <Typography variant="h3" className="text-white mb-1">Loyalty Points</Typography>
          <Typography variant="h1" className="text-white font-poppins text-4xl">
            {user?.loyaltyPoints} pts
          </Typography>
          <Typography variant="caption" className="text-white/80 mt-2">
            Points are earned on every order. Redeem for discounts!
          </Typography>
        </View>

        <View className="space-y-4">
          <Typography variant="h3" className="mb-4">Account Details</Typography>
          <View className="p-4 bg-white border border-zinc-200 rounded-xl flex-row justify-between items-center mb-3">
            <Typography variant="body" className="text-zinc-500">Phone</Typography>
            <Typography variant="body">{user?.phone}</Typography>
          </View>
          <View className="p-4 bg-white border border-zinc-200 rounded-xl flex-row justify-between items-center mb-3">
            <Typography variant="body" className="text-zinc-500">Primary Address</Typography>
            <Typography variant="body" className="text-right flex-1 ml-4">{user?.primaryAddress}</Typography>
          </View>
        </View>

        <Button title="Logout" variant="danger" onPress={() => {}} className="mt-12 py-4" />
      </ScrollView>
    </SafeAreaView>
  );
};
