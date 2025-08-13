import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ActivityIndicator, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AmbulanceTrackingProps {
  requestId?: string;
  onClose?: () => void;
}

export function AmbulanceTracking({ onClose }: AmbulanceTrackingProps) {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [eta, setEta] = useState(12);
  const [status, setStatus] = useState<'on-way' | 'arrived' | 'completed'>('on-way');
  const [ambulanceCoord, setAmbulanceCoord] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
  const surfaceColor = useThemeColor({ light: Colors.light.surface, dark: Colors.dark.surface }, 'surface');
  const primaryColor = useThemeColor({ light: Colors.light.primary, dark: Colors.dark.primary }, 'primary');
  const successColor = useThemeColor({ light: Colors.light.success, dark: Colors.dark.success }, 'success');

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Initialize ambulance start position once user position is known
  useEffect(() => {
    if (!userLocation) return;
    const { latitude, longitude } = userLocation.coords;
    // Start 1.5km to the southwest for demo
    const start = moveCoordinateTowards(
      { latitude: latitude - 0.012, longitude: longitude - 0.012 },
      { latitude, longitude },
      0
    );
    setAmbulanceCoord(start);
    focusRegion(latitude, longitude, start.latitude, start.longitude);
  // Intentionally ignore pure helper dependency to avoid re-initializing start position
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Izin Lokasi', 'Izin lokasi diperlukan untuk tracking real-time.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // Move ambulance towards user every second and update ETA
  useEffect(() => {
    if (!userLocation || !ambulanceCoord || status === 'arrived') return;
    const target = {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    };
    const interval = setInterval(() => {
      setAmbulanceCoord((prev) => {
        if (!prev) return prev;
        const next = stepTowards(prev, target, 140); // 140 m/s (~504 km/h) just for visible demo speed
        const dist = distanceMeters(next, target);
        if (dist < 30) {
          setStatus('arrived');
          setEta(0);
          return target;
        }
        // Update ETA (minutes)
        const speed = 140; // meters per second (demo)
        setEta(Math.max(1, Math.round((dist / speed) / 60)));
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation, ambulanceCoord, status]);

  const focusRegion = (uLat: number, uLng: number, aLat: number, aLng: number) => {
    const midLat = (uLat + aLat) / 2;
    const midLng = (uLng + aLng) / 2;
    const latDelta = Math.max(Math.abs(uLat - aLat), 0.01) * 1.6;
    const lngDelta = Math.max(Math.abs(uLng - aLng), 0.01) * 1.6;
    mapRef.current?.animateToRegion({ latitude: midLat, longitude: midLng, latitudeDelta: latDelta, longitudeDelta: lngDelta }, 500);
  };

  // Helpers: simple geodesic approximations
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  // const toDeg = (rad: number) => (rad * 180) / Math.PI;
  const EARTH_R = 6371000; // meters

  const distanceMeters = (a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) => {
    const dLat = toRad(b.latitude - a.latitude);
    const dLng = toRad(b.longitude - a.longitude);
    const lat1 = toRad(a.latitude);
    const lat2 = toRad(b.latitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * EARTH_R * Math.asin(Math.sqrt(h));
  };

  const stepTowards = (from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }, stepMeters: number) => {
    const dist = distanceMeters(from, to);
    if (dist === 0) return to;
    const frac = Math.min(1, stepMeters / dist);
    return {
      latitude: from.latitude + (to.latitude - from.latitude) * frac,
      longitude: from.longitude + (to.longitude - from.longitude) * frac,
    };
  };

  const moveCoordinateTowards = (from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }, meters: number) => stepTowards(from, to, meters);

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

      {/* Map Realtime */}
      <ThemedView style={styles.mapContainer}>
        {userLocation && ambulanceCoord ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: (userLocation.coords.latitude + ambulanceCoord.latitude) / 2,
              longitude: (userLocation.coords.longitude + ambulanceCoord.longitude) / 2,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          >
            <Marker
              coordinate={{ latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude }}
              title="Lokasi Anda"
              pinColor={successColor}
            />
            <Marker
              coordinate={ambulanceCoord}
              title="Ambulans"
              description="Menuju lokasi Anda"
            >
              <Ionicons name="medical" size={28} color={primaryColor} />
            </Marker>
            <Polyline
              coordinates={[ambulanceCoord, { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude }]}
              strokeColor={primaryColor}
              strokeWidth={3}
            />
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            <ActivityIndicator color={primaryColor} />
            <ThemedText style={styles.mapText}>Menyiapkan peta...</ThemedText>
          </View>
        )}
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
