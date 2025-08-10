import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EmergencyButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function EmergencyButton({ onPress, isLoading = false, disabled = false }: EmergencyButtonProps) {
  const backgroundColor = useThemeColor({ light: Colors.light.primary, dark: Colors.dark.primary }, 'primary');
  const textColor = '#FFFFFF';

  const handlePress = () => {
    Alert.alert(
      'Panggil Ambulans Darurat',
      'Apakah Anda yakin ingin memanggil ambulans darurat?',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Ya, Panggil!', style: 'destructive', onPress: onPress }
      ]
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor },
        (disabled || isLoading) && styles.disabled
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Ionicons 
          name="medical" 
          size={48} 
          color={textColor} 
          style={styles.icon}
        />
        <Text style={[styles.title, { color: textColor }]}>
          {isLoading ? 'Memanggil...' : 'DARURAT'}
        </Text>
        <Text style={[styles.subtitle, { color: textColor }]}>
          Panggil Ambulans
        </Text>
      </View>
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Ionicons name="hourglass" size={24} color={textColor} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    position: 'relative',
    marginVertical: 10,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.95,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.6,
  },
  loadingOverlay: {
    position: 'absolute',
    bottom: 25,
    right: 25,
  },
});
