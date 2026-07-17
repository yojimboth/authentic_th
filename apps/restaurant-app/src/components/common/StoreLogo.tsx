import React from 'react';
import { Image, ImageSourcePropType, StyleProp, View, ViewStyle } from 'react-native';

interface StoreLogoProps {
  logoSource?: ImageSourcePropType | null;
  size?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

const PLACEHOLDER_LOGO: ImageSourcePropType = {
  uri: 'https://via.placeholder.com/150?text=Restaurant',
};

export const StoreLogo: React.FC<StoreLogoProps> = ({
  logoSource,
  size = 64,
  className = '',
  style,
}) => {
  return (
    <View className={`items-center justify-center ${className}`} style={style}>
      <Image
        source={logoSource ?? PLACEHOLDER_LOGO}
        style={{ width: size, height: size }}
        className="rounded-full bg-gray-200"
        resizeMode="cover"
      />
    </View>
  );
};