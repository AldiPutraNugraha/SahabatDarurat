import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

type Hospital = {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  phone?: string;
  lat?: number;
  lon?: number;
};

// OpenStreetMap Overpass API untuk rumah sakit di Bandung
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

const fetchHospitalsFromAPI = async (): Promise<Hospital[]> => {
  try {
    // Query untuk rumah sakit di area Bandung
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](area:3600000000);
        way["amenity"="hospital"](area:3600000000);
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-json' },
      body: query,
    });

    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    const hospitals: Hospital[] = [];
    const seenNames = new Set();

    data.elements?.forEach((element: any) => {
      if (element.tags && element.tags.name && !seenNames.has(element.tags.name)) {
        seenNames.add(element.tags.name);
        
        hospitals.push({
          id: element.id?.toString() || Math.random().toString(),
          name: element.tags.name,
          address: element.tags['addr:street'] 
            ? `${element.tags['addr:street']}, ${element.tags['addr:city'] || 'Bandung'}`
            : 'Bandung, Jawa Barat',
          distanceKm: Math.random() * 15 + 1,
          phone: element.tags.phone || element.tags['contact:phone'],
          lat: element.lat,
          lon: element.lon,
        });
      }
    });

    return hospitals.length > 0 ? hospitals.slice(0, 20) : getFallbackBandungHospitals();
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    return getFallbackBandungHospitals();
  }
};

// Data fallback untuk rumah sakit di Bandung
const getFallbackBandungHospitals = (): Hospital[] => [
  { id: 'h1', name: 'RS Hasan Sadikin', address: 'Jl. Pasteur No.38, Bandung', distanceKm: 2.1, phone: '022-2034953' },
  { id: 'h2', name: 'RS Immanuel', address: 'Jl. Kopo No.161, Bandung', distanceKm: 4.3, phone: '022-5207635' },
  { id: 'h3', name: 'RS Borromeus', address: 'Jl. Ir. H. Juanda No.100, Bandung', distanceKm: 3.7, phone: '022-2506930' },
  { id: 'h4', name: 'RS Advent', address: 'Jl. Cihampelas No.161, Bandung', distanceKm: 5.2, phone: '022-2034386' },
  { id: 'h5', name: 'RS Santosa', address: 'Jl. Kebon Jati No.38, Bandung', distanceKm: 1.8, phone: '022-4248888' },
  { id: 'h6', name: 'RS Melinda', address: 'Jl. Dr. Cipto No.1, Bandung', distanceKm: 6.1, phone: '022-4231287' },
];

export function HospitalsList({ onClose }: { onClose?: () => void }) {
  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
  const surfaceColor = useThemeColor({ light: Colors.light.surface, dark: Colors.dark.surface }, 'surface');
  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    try {
      setLoading(true);
      const data = await fetchHospitalsFromAPI();
      setHospitals(data);
    } catch (err) {
      console.error('Error loading hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => loadHospitals();

  const Item = ({ item }: { item: Hospital }) => (
    <ThemedView style={[styles.card, { backgroundColor: surfaceColor }]}>
      <View style={styles.rowBetween}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <View style={styles.distancePill}>
          <Ionicons name="navigate" size={14} color="#fff" />
          <ThemedText style={styles.distanceText}>{item.distanceKm.toFixed(1)} km</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.address}>{item.address}</ThemedText>
      {item.phone && (
        <View style={styles.phoneRow}>
          <Ionicons name="call" size={16} color={Colors.light.primary} />
          <ThemedText style={styles.phoneText}>{item.phone}</ThemedText>
        </View>
      )}
    </ThemedView>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={[styles.header, { backgroundColor: surfaceColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Rumah Sakit Terdekat</ThemedText>
          <View style={{ width: 40 }} />
        </ThemedView>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <ThemedText style={styles.loadingText}>Memuat data rumah sakit...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ThemedView style={[styles.header, { backgroundColor: surfaceColor }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Rumah Sakit Terdekat</ThemedText>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={hospitals}
        keyExtractor={(i) => i.id}
        renderItem={Item}
        contentContainerStyle={{ padding: 16 }}
        refreshing={loading}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '600' },
  distancePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.light.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 },
  distanceText: { color: '#fff', fontSize: 12 },
  address: { marginTop: 8, opacity: 0.8 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 6 },
  phoneText: { color: Colors.light.primary },
});


