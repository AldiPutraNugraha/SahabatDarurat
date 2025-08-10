import { Colors } from '@/constants/Colors';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  // Always use light theme
  const backgroundColor = lightColor || Colors.light.background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
