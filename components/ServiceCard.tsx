import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isEmergency?: boolean;
}

export function ServiceCard({ 
  title, 
  description, 
  icon, 
  onPress, 
  isEmergency = false 
}: ServiceCardProps) {
  // Force light theme colors
  const backgroundColor = Colors.light.surface;
  const textColor = Colors.light.text;
  const secondaryTextColor = Colors.light.textSecondary;
  const borderColor = Colors.light.border;
  const primaryColor = Colors.light.primary;
  const secondaryColor = Colors.light.secondary;
  const primaryLightColor = Colors.light.primaryLight;
  const surfaceVariantColor = Colors.light.surfaceVariant;
  
  const iconColor = isEmergency ? primaryColor : secondaryColor;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor, borderColor },
        isEmergency && [styles.emergencyBorder, { borderColor: primaryColor }]
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isEmergency ? primaryLightColor : surfaceVariantColor }
      ]}>
        <Ionicons 
          name={icon} 
          size={28} 
          color={iconColor}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>
          {title}
        </Text>
        <Text style={[styles.description, { color: secondaryTextColor }]}>
          {description}
        </Text>
      </View>
      
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={secondaryTextColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    marginVertical: 6,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  emergencyBorder: {
    borderWidth: 2,
    elevation: 6,
    shadowOpacity: 0.2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
