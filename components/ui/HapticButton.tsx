import React from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticButtonProps extends TouchableOpacityProps {
  onPress: () => void;
  hapticStyle?: Haptics.ImpactFeedbackStyle;
}

export const HapticButton: React.FC<HapticButtonProps> = ({ 
  onPress, 
  hapticStyle = Haptics.ImpactFeedbackStyle.Medium,
  children,
  ...props 
}) => {
  const handlePress = () => {
    Haptics.impactAsync(hapticStyle);
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} {...props}>
      {children}
    </TouchableOpacity>
  );
};

