import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { AmbulanceTracking } from '@/components/AmbulanceTracking';
import { EmergencyContacts } from '@/components/EmergencyContacts';
import { HospitalsList } from '@/components/HospitalsList';
import { MedicalConsultation } from '@/components/MedicalConsultation';
import { PatientTransport } from '@/components/PatientTransport';
import { PersonalMedicalInfo } from '@/components/PersonalMedicalInfo';
import { ServiceCard } from '@/components/ServiceCard';
import { ServiceHistory } from '@/components/ServiceHistory';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { UserProfile } from '@/components/UserProfile';
import { AppSettings } from '@/components/AppSettings';

export default function ExploreScreen() {
  const [activeModal, setActiveModal] = useState<'history' | 'tracking' | 'hospitals' | 'consultation' | 'contacts' | 'medical-info' | 'patient-transport' | 'profile' | 'settings' | null>(null);

  // Force light theme colors
  const backgroundColor = Colors.light.background;
  const surfaceColor = Colors.light.surface;

  const handleServicePress = (serviceType: string) => {
    switch (serviceType) {
      case 'history':
        setActiveModal('history');
        break;
      case 'tracking':
        setActiveModal('tracking');
        break;
      case 'emergency-contacts':
        setActiveModal('contacts');
        break;
      case 'hospitals':
        setActiveModal('hospitals');
        break;
      case 'consultation':
        setActiveModal('consultation');
        break;
      case 'medical-info':
        setActiveModal('medical-info');
        break;
      case 'patient-transport':
        setActiveModal('patient-transport');
        break;
      case 'profile':
        setActiveModal('profile');
        break;
      case 'settings':
        setActiveModal('settings');
        break;
      default:
        Alert.alert('Info', `Fitur ${serviceType} akan segera tersedia!`);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  if (activeModal === 'history') {
    return <ServiceHistory onClose={closeModal} />;
  }

  if (activeModal === 'tracking') {
    return <AmbulanceTracking onClose={closeModal} />;
  }

  if (activeModal === 'hospitals') {
    return <HospitalsList onClose={closeModal} />;
  }

  if (activeModal === 'consultation') {
    return <MedicalConsultation onClose={closeModal} />;
  }

  if (activeModal === 'contacts') {
    return <EmergencyContacts onClose={closeModal} />;
  }

  if (activeModal === 'medical-info') {
    return <PersonalMedicalInfo onClose={closeModal} />;
  }

  if (activeModal === 'patient-transport') {
    return <PatientTransport onClose={closeModal} />;
  }

  if (activeModal === 'profile') {
    return <UserProfile />;
  }

  if (activeModal === 'settings') {
    return <AppSettings />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor: surfaceColor }]}>
          <ThemedText style={[styles.headerTitle, { color: Colors.light.primary }]}>Layanan Ambulans</ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: Colors.light.textSecondary }]}>
            Akses lengkap semua layanan ambulans darurat
          </ThemedText>
        </ThemedView>

        {/* Emergency Services */}
                <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: Colors.light.primary }]}>Bantuan Darurat</ThemedText>
          
          <ServiceCard
            title="Tracking Ambulans"
            description="Pantau lokasi ambulans secara real-time"
            icon="locate"
            onPress={() => handleServicePress('tracking')}
            isEmergency={true}
          />
          
          <ServiceCard
            title="Riwayat Layanan"
            description="Lihat semua riwayat panggilan ambulans Anda"
            icon="time"
            onPress={() => handleServicePress('history')}
          />
          
          <ServiceCard
            title="Kontak Darurat"
            description="Kelola kontak keluarga untuk situasi darurat"
            icon="people"
            onPress={() => handleServicePress('emergency-contacts')}
          />
        </ThemedView>

        {/* Medical Services */}
        <ThemedView style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: Colors.light.primary }]}>Layanan Medis</ThemedText>
          
          <ServiceCard
            title="Antar Jemput Pasien"
            description="Layanan transportasi ke rumah sakit atau klinik"
            icon="car"
            onPress={() => handleServicePress('patient-transport')}
          />
          
          <ServiceCard
            title="Rumah Sakit Terdekat"
            description="Temukan rumah sakit terdekat dari lokasi Anda"
            icon="business"
            onPress={() => handleServicePress('hospitals')}
          />
          
          <ServiceCard
            title="Konsultasi Medis"
            description="Chat dengan tenaga medis profesional"
            icon="chatbubbles"
            onPress={() => handleServicePress('consultation')}
          />
          
          <ServiceCard
            title="Info Medis Pribadi"
            description="Kelola riwayat medis dan informasi kesehatan"
            icon="document-text"
            onPress={() => handleServicePress('medical-info')}
          />
        </ThemedView>

        {/* Profile & Settings */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Profil & Pengaturan</ThemedText>
          
          <ServiceCard
            title="Profil Pengguna"
            description="Kelola profil dan rating layanan ambulans"
            icon="person"
            onPress={() => handleServicePress('profile')}
          />
          
          <ServiceCard
            title="Pengaturan Aplikasi"
            description="Notifikasi, privasi, dan preferensi"
            icon="settings"
            onPress={() => handleServicePress('settings')}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
});
