import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StatusIndicatorProps {
  status: 'pending' | 'accepted' | 'in-progress' | 'arrived' | 'completed' | 'cancelled';
  showLabel?: boolean;
}

export function StatusIndicator({ status, showLabel = true }: StatusIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          color: Colors.light.warning,
          icon: 'hourglass-outline' as const,
          label: 'Menunggu',
          bgColor: '#FEF3C7' // amber-100
        };
      case 'accepted':
        return {
          color: Colors.light.secondary,
          icon: 'checkmark-circle-outline' as const,
          label: 'Diterima',
          bgColor: '#DBEAFE' // blue-100
        };
      case 'in-progress':
        return {
          color: Colors.light.primary,
          icon: 'car-outline' as const,
          label: 'Dalam Perjalanan',
          bgColor: Colors.light.primaryLight
        };
      case 'arrived':
        return {
          color: Colors.light.success,
          icon: 'location-outline' as const,
          label: 'Tiba di Lokasi',
          bgColor: '#D1FAE5' // emerald-100
        };
      case 'completed':
        return {
          color: Colors.light.success,
          icon: 'checkmark-done-outline' as const,
          label: 'Selesai',
          bgColor: '#D1FAE5' // emerald-100
        };
      case 'cancelled':
        return {
          color: Colors.light.textMuted,
          icon: 'close-circle-outline' as const,
          label: 'Dibatalkan',
          bgColor: '#F3F4F6' // gray-100
        };
      default:
        return {
          color: Colors.light.textMuted,
          icon: 'help-circle-outline' as const,
          label: 'Status Tidak Diketahui',
          bgColor: '#F3F4F6'
        };
    }
  };

  const config = getStatusConfig();
  const textColor = useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, 'text');

  return (
    <View style={[styles.container, showLabel && styles.containerWithLabel]}>
      <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
        <Ionicons 
          name={config.icon} 
          size={showLabel ? 20 : 16} 
          color={config.color} 
        />
      </View>
      {showLabel && (
        <ThemedText style={[styles.label, { color: textColor }]}>
          {config.label}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  containerWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});
