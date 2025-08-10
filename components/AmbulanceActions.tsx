import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

interface ActionButtonProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isEmergency?: boolean;
}

function ActionButton({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  isEmergency = false 
}: ActionButtonProps) {
  // Force light theme colors
  const backgroundColor = Colors.light.surface;
  const textColor = Colors.light.text;
  const secondaryTextColor = Colors.light.textSecondary;
  const primaryColor = Colors.light.primary;
  const secondaryColor = Colors.light.secondary;
  const primaryLightColor = Colors.light.primaryLight;
  const surfaceVariantColor = Colors.light.surfaceVariant;

  const iconColor = isEmergency ? primaryColor : secondaryColor;

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor },
        isEmergency && [styles.emergencyButton, { borderColor: primaryColor }]
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isEmergency ? primaryLightColor : surfaceVariantColor }
      ]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={[
          styles.actionTitle, 
          { color: textColor },
          isEmergency && { fontWeight: '700' }
        ]}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.actionSubtitle, { color: secondaryTextColor }]}>
          {subtitle}
        </ThemedText>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={isEmergency ? primaryColor : secondaryTextColor} 
      />
    </TouchableOpacity>
  );
}

export function AmbulanceActions() {
  // Force light theme colors
  const surfaceColor = Colors.light.surface;
  const primaryColor = Colors.light.primary;

  const handleAmbulanceCall = () => {
    Alert.alert(
      'Panggil Ambulans 119',
      'Apakah Anda yakin ingin menghubungi layanan ambulans darurat?',
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hubungi Sekarang', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Berhasil', 'Menghubungi layanan ambulans 119...');
          }
        }
      ]
    );
  };

  const handleFirstAid = () => {
    Alert.alert(
      'Panduan P3K',
      'Fitur panduan pertolongan pertama akan segera tersedia untuk membantu Anda dalam situasi darurat.',
      [{ text: 'OK' }]
    );
  };

  const handleEmergencyContacts = () => {
    Alert.alert(
      'Kontak Darurat',
      'Kelola kontak keluarga dan teman terdekat untuk situasi darurat.',
      [{ text: 'OK' }]
    );
  };

  const handleMedicalInfo = () => {
    Alert.alert(
      'Info Medis',
      'Kelola informasi medis pribadi seperti golongan darah, alergi, dan obat-obatan.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: surfaceColor }]}>
      <ThemedText style={[styles.sectionTitle, { color: primaryColor }]}>Layanan Ambulans Darurat</ThemedText>
      
      <ActionButton
        title="Panggil Ambulans 119"
        subtitle="Hubungi layanan ambulans darurat sekarang"
        icon="medical"
        onPress={handleAmbulanceCall}
        isEmergency={true}
      />
      
      <ActionButton
        title="Panduan P3K"
        subtitle="Petunjuk pertolongan pertama dalam keadaan darurat"
        icon="heart"
        onPress={handleFirstAid}
      />
      
      <ActionButton
        title="Kontak Darurat"
        subtitle="Keluarga dan teman terdekat yang dapat dihubungi"
        icon="people"
        onPress={handleEmergencyContacts}
      />
      
      <ActionButton
        title="Info Medis Pribadi"
        subtitle="Golongan darah, alergi, dan riwayat medis"
        icon="document-text"
        onPress={handleMedicalInfo}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emergencyButton: {
    borderWidth: 2,
    borderColor: 'transparent', // Will be overridden by inline style
    elevation: 4,
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
  textContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
});
