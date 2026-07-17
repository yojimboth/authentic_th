import React from 'react';
import { View, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/RootNavigator';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
import { useProfile } from '../hooks/useProfile';
import { logout } from '../../../utils/mockAuth';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { state } = useProfile(); // Hook will be implemented below

  if (state.status === 'loading') {
    return (
      <View className="flex-1 bg-zinc-50 items-center justify-center">
        <Typography variant="body">Loading Profile...</Typography>
      </View>
    );
  }

  // Security: Properly narrow AsyncState type before accessing data
  const user = state.status === 'success' ? state.data : null;

  return (
    <View className="flex-1 bg-zinc-50">
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

        <View className="p-6 bg-brand-primary/20 border border-brand-primary/30 rounded-3xl shadow-sm mb-8">
          <Typography variant="h3" className="text-brand-primary mb-1">Loyalty Points</Typography>
          <Typography variant="h1" className="text-brand-primary font-poppins text-4xl">
            {user?.loyaltyPoints} pts
          </Typography>
          <Typography variant="caption" className="text-zinc-600 mt-2">
            Points are earned on every order. Redeem for discounts!
          </Typography>
        </View>

        <View className="space-y-4">
          <View className="flex-row items-center justify-between mb-6">
            <Typography variant="h3">Account Details</Typography>
            <Button 
              title="Edit" 
              variant="ghost" 
              onPress={() => navigation.navigate('EditProfile')} 
              className="py-1 px-3 h-8 text-xs"
            />
          </View>
          <View className="py-3 border-b border-zinc-100">
            <Typography variant="caption" className="text-zinc-500 mb-1">Phone</Typography>
            <Typography variant="body" className="font-medium">{user?.phone}</Typography>
          </View>
          <View className="py-3 border-b border-zinc-100">
            <Typography variant="caption" className="text-zinc-500 mb-1">Primary Address</Typography>
            <Typography variant="body" className="font-medium">
              {user?.primaryAddress}
            </Typography>
          </View>
        </View>

        <Button 
          title="Logout" 
          variant="danger" 
          onPress={async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Splash' }],
            });
          }} 
          className="mt-12 py-4" 
        />
      </ScrollView>
    </View>
  );
};
