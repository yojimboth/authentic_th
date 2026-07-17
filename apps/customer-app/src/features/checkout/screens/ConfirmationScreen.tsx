import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../../components/common/Typography';
import { Button } from '../../../components/common/Button';
 
interface ConfirmationScreenProps {
  // Props from navigation (RootStackParamList)
  route: { params: { orderId: string } };
}
 
export const ConfirmationScreen = ({ route }: ConfirmationScreenProps) => {
  const navigation = useNavigation<any>();
 
  const handleReturnHome = () => {
    // Reset the stack to the MainTabs and navigate to the Menu
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };
 
  return (
    <View className="flex-1 bg-zinc-50 items-center justify-center p-6">
      <View className="w-20 h-20 bg-emerald-100 rounded-full items-center justify-center mb-6">
        <Text className="text-emerald-500 text-4xl">✓</Text>
      </View>
      <Typography variant="h1" className="text-center font-poppins mb-2">Order Confirmed!</Typography>
      <Typography variant="body" className="text-center text-zinc-500 mb-8">
        Your delicious Thai feast is being prepared and will be with you shortly.
      </Typography>
      <Button title="Return to Home" onPress={handleReturnHome} className="w-full py-4" />
    </View>
  );
};

