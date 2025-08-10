import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AmbulanceTrackingProps {
  requestId?: string;
  onClose?: () => void;
}

export function AmbulanceTracking({ onClose }: AmbulanceTrackingProps) {
  const [, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [eta, setEta] = useState(12);
  const [status, setStatus] = useState<'on-way' | 'arrived' | 'completed'>('on-way');

  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
  const surfaceColor = useThemeColor({ light: Colors.light.surface, dark: Colors.dark.surface }, 'surface');
  const primaryColor = useThemeColor({ light: Colors.light.primary, dark: Colors.dark.primary }, 'primary');
  const successColor = useThemeColor({ light: Colors.light.success, dark: Colors.dark.success }, 'success');

  useEffect(() => {
    getCurrentLocation();
    simulateAmbulanceMovement();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const simulateAmbulanceMovement = () => {
    // Simulate ambulance getting closer
    const interval = setInterval(() => {
      setEta(prev => {
        if (prev <= 1) {
          setStatus('arrived');
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 5000); // Update every 5 seconds for demo

    return () => clearInterval(interval);
  };

  const handleCallDriver = () => {
    Alert.alert(
      'Hubungi Driver',
      'Menghubungi driver ambulans...',
      [{ text: 'OK' }]
    );
  };

  const handleChatDriver = () => {
    Alert.alert(
      'Chat Driver',
      'Membuka chat dengan driver...',
      [{ text: 'OK' }]
    );
  };

  const getStatusColor = () => {
    switch (status) {
      case 'arrived':
        return successColor;
      default:
        return primaryColor;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'on-way':
        return 'Ambulans dalam perjalanan';
      case 'arrived':
        return 'Ambulans telah tiba';
      case 'completed':
        return 'Layanan selesai';
      default:
        return 'Status tidak diketahui';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: surfaceColor }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Tracking Ambulans</ThemedText>
        <View style={styles.placeholder} />
      </ThemedView>

      {/* Map Placeholder */}
      <ThemedView style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color={primaryColor} />
          <ThemedText style={styles.mapText}>
            Peta akan menampilkan lokasi ambulans secara real-time
          </ThemedText>
        </View>
      </ThemedView>

      {/* Status Card */}
      <ThemedView style={[styles.statusCard, { backgroundColor: surfaceColor }]}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
          <ThemedText style={styles.statusText}>{getStatusText()}</ThemedText>
        </View>

        {status === 'on-way' && (
          <View style={styles.etaContainer}>
            <Ionicons name="time" size={20} color={primaryColor} />
            <ThemedText style={styles.etaText}>
              ETA: {eta} menit
            </ThemedText>
          </View>
        )}

        {/* Driver Info */}
        <View style={styles.driverInfo}>
          <View style={styles.driverDetails}>
            <ThemedText style={styles.driverName}>Ahmad Syahputra</ThemedText>
            <ThemedText style={styles.vehicleInfo}>B 1234 XYZ • Ambulans Type A</ThemedText>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FCD34D" />
              <ThemedText style={styles.rating}>4.8</ThemedText>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: primaryColor }]}
            onPress={handleCallDriver}
          >
            <Ionicons name="call" size={20} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Telepon</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.light.secondary }]}
            onPress={handleChatDriver}
          >
            <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Chat</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Emergency Contact */}
      <ThemedView style={[styles.emergencyContact, { backgroundColor: surfaceColor }]}>
        <ThemedText style={styles.emergencyTitle}>Kontak Darurat</ThemedText>
        <TouchableOpacity style={styles.emergencyButton}>
          <Ionicons name="call" size={20} color={primaryColor} />
          <ThemedText style={styles.emergencyText}>119 - Ambulans</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  mapText: {
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.7,
  },
  statusCard: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  etaText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: Colors.light.primary,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  emergencyContact: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyText: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.light.primary,
  },
});
