import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

interface QuickActionButtonProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isEmergency?: boolean;
}

function QuickActionButton({ 
  title, 
  subtitle, 
  icon, 
  onPress, 
  isEmergency = false 
}: QuickActionButtonProps) {
  const backgroundColor = useThemeColor(
    { light: Colors.light.surface, dark: Colors.dark.surface }, 
    'surface'
  );
  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text }, 
    'text'
  );
  const secondaryTextColor = useThemeColor(
    { light: Colors.light.textSecondary, dark: Colors.dark.textSecondary }, 
    'textSecondary'
  );

  const iconColor = isEmergency ? Colors.light.primary : Colors.light.secondary;

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor },
        isEmergency && styles.emergencyButton
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isEmergency ? Colors.light.primaryLight : Colors.light.surfaceVariant }
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
        color={isEmergency ? Colors.light.primary : secondaryTextColor} 
      />
    </TouchableOpacity>
  );
}

export function QuickActions() {
  const surfaceColor = useThemeColor({ light: Colors.light.surface, dark: Colors.dark.surface }, 'surface');

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
            // Linking.openURL('tel:119');
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
      <ThemedText style={styles.sectionTitle}>Akses Cepat Ambulans</ThemedText>
      
      <QuickActionButton
        title="Panggil Ambulans 119"
        subtitle="Hubungi layanan ambulans darurat"
        icon="medical"
        onPress={handleAmbulanceCall}
        isEmergency={true}
      />
      
      <QuickActionButton
        title="Panduan P3K"
        subtitle="Petunjuk pertolongan pertama darurat"
        icon="heart"
        onPress={handleFirstAid}
      />
      
      <QuickActionButton
        title="Kontak Darurat"
        subtitle="Keluarga dan teman terdekat"
        icon="people"
        onPress={handleEmergencyContacts}
      />
      
      <QuickActionButton
        title="Info Medis Pribadi"
        subtitle="Golongan darah, alergi, obat-obatan"
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
    color: Colors.light.primary,
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
    borderColor: Colors.light.primary,
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
      <View style={[styles.iconContainer, urgent && { backgroundColor: Colors.light.primaryLight }]}>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={[styles.actionTitle, { color: textColor }]}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.actionSubtitle, { color: secondaryTextColor }]}>
          {subtitle}
        </ThemedText>
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color={secondaryTextColor} 
      />
    </TouchableOpacity>
  );
}

export function QuickActions() {
  const surfaceColor = useThemeColor({ light: Colors.light.surface, dark: Colors.dark.surface }, 'surface');

  const handleEmergencyCall = (number: string, service: string) => {
    Alert.alert(
      `Panggil ${service}`,
      `Apakah Anda yakin ingin menghubungi ${service} di nomor ${number}?`,
      [
        { text: 'Batal', style: 'cancel' },
        { 
          text: 'Hubungi', 
          style: 'destructive',
          onPress: () => {
            Linking.openURL(`tel:${number}`);
          }
        }
      ]
    );
  };

  const handleFirstAid = () => {
    Alert.alert(
      'Panduan Pertolongan Pertama',
      'Fitur panduan pertolongan pertama akan segera tersedia!',
      [{ text: 'OK' }]
    );
  };

  const handleEmergencyContacts = () => {
    Alert.alert(
      'Kontak Darurat Pribadi',
      'Fitur pengelolaan kontak darurat pribadi akan segera tersedia!',
      [{ text: 'OK' }]
    );
  };

  const handleSOSFeature = () => {
    Alert.alert(
      'SOS Alert',
      'Fitur SOS alert akan mengirim pesan darurat ke kontak terpilih dengan lokasi Anda.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: surfaceColor }]}>
      <ThemedText style={styles.sectionTitle}>Aksi Darurat Cepat</ThemedText>
      
      <QuickActionButton
        title="Ambulans 119"
        subtitle="Panggilan ambulans darurat"
        icon="medical"
        onPress={() => handleEmergencyCall('119', 'Ambulans')}
        urgent={true}
      />
      
      <QuickActionButton
        title="Polisi 110"
        subtitle="Panggilan polisi darurat"
        icon="shield"
        onPress={() => handleEmergencyCall('110', 'Polisi')}
        color={Colors.light.secondary}
      />
      
      <QuickActionButton
        title="Pemadam 113"
        subtitle="Panggilan pemadam kebakaran"
        icon="flame"
        onPress={() => handleEmergencyCall('113', 'Pemadam Kebakaran')}
        color="#EF4444" // red-500
      />
      
      <QuickActionButton
        title="SAR 115"
        subtitle="Tim Search and Rescue"
        icon="boat"
        onPress={() => handleEmergencyCall('115', 'SAR')}
        color="#F59E0B" // amber-500
      />
      
      <View style={styles.divider} />
      
      <QuickActionButton
        title="SOS Alert"
        subtitle="Kirim pesan darurat ke kontak"
        icon="warning"
        onPress={handleSOSFeature}
        color={Colors.light.primary}
      />
      
      <QuickActionButton
        title="Pertolongan Pertama"
        subtitle="Panduan P3K dalam keadaan darurat"
        icon="heart"
        onPress={handleFirstAid}
        color={Colors.light.success}
      />
      
      <QuickActionButton
        title="Kontak Darurat"
        subtitle="Keluarga dan teman terdekat"
        icon="people"
        onPress={handleEmergencyContacts}
        color={Colors.light.secondary}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  urgentButton: {
    borderWidth: 1,
    borderColor: Colors.light.primaryLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F3F4F6', // gray-100
  },
  textContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 12,
    opacity: 0.3,
  },
});
