import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

import { AmbulanceActions } from '@/components/AmbulanceActions';
import { EmergencyButton } from '@/components/EmergencyButton';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [isEmergencyLoading, setIsEmergencyLoading] = useState(false);

  // Force light theme colors
  const backgroundColor = Colors.light.background;
  const surfaceColor = Colors.light.surface;
  const primaryColor = Colors.light.primary;
  const textSecondaryColor = Colors.light.textSecondary;

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Lokasi', 'Izin akses lokasi diperlukan untuk layanan darurat');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleEmergencyCall = async () => {
    setIsEmergencyLoading(true);
    
    try {
      // Simulate emergency call process
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Navigate to tracking screen
      router.push('/tracking');
    } catch {
      Alert.alert('Error', 'Gagal memanggil ambulans. Silakan coba lagi.');
    } finally {
      setIsEmergencyLoading(false);
    }
  };

  const { signOut } = useAuth();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ScrollView style={[styles.container, { backgroundColor }]} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor: surfaceColor }]}>
          <View style={styles.headerContent}>
            <View>
              <ThemedText style={[styles.greeting, { color: primaryColor }]}>Selamat datang!</ThemedText>
              <ThemedText style={styles.subtitle}>
                {location ? 'Lokasi terdeteksi' : 'Mencari lokasi...'}
              </ThemedText>
            </View>
            <Pressable onPress={async () => { await signOut(); router.replace('/(auth)'); }} accessibilityRole="button">
              <Ionicons name="log-out-outline" size={24} color={textSecondaryColor} />
            </Pressable>
          </View>
        </ThemedView>

        {/* Emergency Button Section */}
        <ThemedView style={styles.emergencySection}>
          <ThemedText style={[styles.sectionTitle, { color: primaryColor }]}>Layanan Darurat</ThemedText>
          <View style={styles.emergencyButtonContainer}>
            <EmergencyButton 
              onPress={handleEmergencyCall}
              isLoading={isEmergencyLoading}
            />
          </View>
          <ThemedText style={styles.emergencyNote}>
            Tekan untuk panggilan darurat. Ambulans akan segera dikirim ke lokasi Anda.
          </ThemedText>
        </ThemedView>

        {/* Quick Actions */}
        <AmbulanceActions />
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
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.8,
    marginTop: 6,
  },
  emergencySection: {
    padding: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  emergencyButtonContainer: {
    marginVertical: 24,
  },
  emergencyNote: {
    textAlign: 'center',
    fontSize: 15,
    opacity: 0.8,
    marginTop: 16,
    paddingHorizontal: 24,
    lineHeight: 22,
  },
  servicesSection: {
    padding: 24,
    paddingTop: 12,
  },
});
