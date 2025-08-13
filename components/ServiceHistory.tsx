import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

// Interface untuk riwayat layanan yang digabungkan
interface ServiceHistoryItem {
  id: string;
  serviceType: 'emergency' | 'transport';
  title: string;
  description: string;
  location: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  rating?: number;
  notes?: string;
  // Data spesifik untuk emergency
  emergencyType?: string;
  estimatedArrival?: number;
  // Data spesifik untuk transport
  transportType?: string;
  destination?: string;
  pickupTime?: string;
}

const EMERGENCY_HISTORY_KEY = 'emergency_service_history';
const TRANSPORT_HISTORY_KEY = 'patient_transport_bookings';

export function ServiceHistory({ onClose }: { onClose?: () => void }) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'cancelled' | 'pending'>('all');
  const [history, setHistory] = useState<ServiceHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
  const surfaceColor = useThemeColor({ light: Colors.light.surface, dark: Colors.dark.surface }, 'surface');
  const primaryColor = useThemeColor({ light: Colors.light.primary, dark: Colors.dark.primary }, 'primary');
  const successColor = useThemeColor({ light: Colors.light.success, dark: Colors.dark.success }, 'success');
  const textSecondaryColor = useThemeColor({ light: Colors.light.textSecondary, dark: Colors.dark.textSecondary }, 'textSecondary');

  useEffect(() => {
    loadServiceHistory();
  }, []);

  const loadServiceHistory = async () => {
    try {
      setLoading(true);
      
      // Load emergency history
      const emergencyHistory = await AsyncStorage.getItem(EMERGENCY_HISTORY_KEY);
      const transportHistory = await AsyncStorage.getItem(TRANSPORT_HISTORY_KEY);
      
      const emergencyData: ServiceHistoryItem[] = emergencyHistory 
        ? JSON.parse(emergencyHistory).map((item: any) => ({
            id: `emergency_${item.id}`,
            serviceType: 'emergency' as const,
            title: 'Panggilan Ambulans Darurat',
            description: item.description || 'Panggilan ambulans darurat',
            location: item.location?.address || 'Lokasi tidak tersedia',
            status: item.status || 'pending',
            createdAt: new Date(item.createdAt || Date.now()),
            completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
            rating: item.rating,
            notes: item.notes,
            emergencyType: item.emergencyType || 'Darurat',
            estimatedArrival: item.estimatedArrival
          }))
        : [];

      const transportData: ServiceHistoryItem[] = transportHistory 
        ? JSON.parse(transportHistory).map((item: any) => ({
            id: `transport_${item.id}`,
            serviceType: 'transport' as const,
            title: 'Antar Jemput Pasien',
            description: `${item.pickupLocation} → ${item.destination}`,
            location: item.pickupLocation || 'Lokasi tidak tersedia',
            status: item.status || 'pending',
            createdAt: new Date(item.createdAt || Date.now()),
            completedAt: item.status === 'completed' ? new Date() : undefined,
            rating: item.rating,
            notes: item.notes,
            transportType: item.transportType,
            destination: item.destination,
            pickupTime: `${item.date} ${item.time}`
          }))
        : [];

      // Gabungkan dan urutkan berdasarkan waktu terbaru
      const combinedHistory = [...emergencyData, ...transportData]
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setHistory(combinedHistory);
    } catch (error) {
      console.error('Error loading service history:', error);
      Alert.alert('Error', 'Gagal memuat riwayat layanan');
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return successColor;
      case 'cancelled':
        return Colors.light.textMuted;
      case 'in-progress':
        return '#3b82f6';
      case 'pending':
        return '#f59e0b';
      default:
        return primaryColor;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      case 'in-progress':
        return 'Berlangsung';
      case 'pending':
        return 'Menunggu';
      default:
        return status;
    }
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'medical';
      case 'transport':
        return 'car';
      default:
        return 'help-circle';
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return '#ef4444';
      case 'transport':
        return '#3b82f6';
      default:
        return primaryColor;
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={16}
            color="#FCD34D"
          />
        ))}
      </View>
    );
  };

  const addRating = async (itemId: string, rating: number) => {
    try {
      const updatedHistory = history.map(item => 
        item.id === itemId ? { ...item, rating } : item
      );
      setHistory(updatedHistory);
      
      // Update rating di storage sesuai jenis layanan
      if (itemId.startsWith('emergency_')) {
        const emergencyHistory = await AsyncStorage.getItem(EMERGENCY_HISTORY_KEY);
        if (emergencyHistory) {
          const emergencyData = JSON.parse(emergencyHistory);
          const updatedEmergencyData = emergencyData.map((item: any) => 
            `emergency_${item.id}` === itemId ? { ...item, rating } : item
          );
          await AsyncStorage.setItem(EMERGENCY_HISTORY_KEY, JSON.stringify(updatedEmergencyData));
        }
      } else if (itemId.startsWith('transport_')) {
        const transportHistory = await AsyncStorage.getItem(TRANSPORT_HISTORY_KEY);
        if (transportHistory) {
          const transportData = JSON.parse(transportHistory);
          const updatedTransportData = transportData.map((item: any) => 
            `transport_${item.id}` === itemId ? { ...item, rating } : item
          );
          await AsyncStorage.setItem(TRANSPORT_HISTORY_KEY, JSON.stringify(updatedTransportData));
        }
      }
      
      Alert.alert('Sukses', 'Rating berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding rating:', error);
      Alert.alert('Error', 'Gagal menambahkan rating');
    }
  };

  const renderHistoryItem = ({ item }: { item: ServiceHistoryItem }) => (
    <TouchableOpacity style={[styles.historyItem, { backgroundColor: surfaceColor }]}>
      <View style={styles.itemHeader}>
        <View style={styles.serviceInfo}>
          <View style={[styles.serviceTypeIcon, { backgroundColor: getServiceTypeColor(item.serviceType) }]}>
            <Ionicons name={getServiceTypeIcon(item.serviceType) as any} size={16} color="#fff" />
          </View>
          <ThemedText style={styles.serviceType}>
            {item.title}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <ThemedText style={styles.statusText}>
              {getStatusText(item.status)}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={[styles.date, { color: textSecondaryColor }]}>
          {item.createdAt.toLocaleDateString('id-ID')}
        </ThemedText>
      </View>

      <ThemedText style={styles.description} numberOfLines={2}>
        {item.description}
      </ThemedText>

      <View style={styles.locationContainer}>
        <Ionicons name="location" size={16} color={textSecondaryColor} />
        <ThemedText style={[styles.address, { color: textSecondaryColor }]} numberOfLines={1}>
          {item.location}
        </ThemedText>
      </View>

      {/* Additional info berdasarkan jenis layanan */}
      {item.serviceType === 'emergency' && item.estimatedArrival && (
        <View style={styles.infoRow}>
          <Ionicons name="time" size={16} color={textSecondaryColor} />
          <ThemedText style={[styles.infoText, { color: textSecondaryColor }]}>
            Estimasi: {item.estimatedArrival} menit
          </ThemedText>
        </View>
      )}

      {item.serviceType === 'transport' && item.pickupTime && (
        <View style={styles.infoRow}>
          <Ionicons name="calendar" size={16} color={textSecondaryColor} />
          <ThemedText style={[styles.infoText, { color: textSecondaryColor }]}>
            Jadwal: {item.pickupTime}
          </ThemedText>
        </View>
      )}

      {item.rating ? (
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
          <ThemedText style={[styles.ratingText, { color: textSecondaryColor }]}>
            ({item.rating}/5)
          </ThemedText>
        </View>
      ) : item.status === 'completed' && (
        <TouchableOpacity 
          style={styles.addRatingBtn}
          onPress={() => {
            Alert.alert(
              'Tambah Rating',
              'Berikan rating untuk layanan ini:',
              [
                { text: '1', onPress: () => addRating(item.id, 1) },
                { text: '2', onPress: () => addRating(item.id, 2) },
                { text: '3', onPress: () => addRating(item.id, 3) },
                { text: '4', onPress: () => addRating(item.id, 4) },
                { text: '5', onPress: () => addRating(item.id, 5) },
                { text: 'Batal', style: 'cancel' }
              ]
            );
          }}
        >
          <ThemedText style={styles.addRatingText}>Tambah Rating</ThemedText>
        </TouchableOpacity>
      )}

      {item.notes && (
        <ThemedText style={[styles.notes, { color: textSecondaryColor }]}>
          &ldquo;{item.notes}&rdquo;
        </ThemedText>
      )}
    </TouchableOpacity>
  );

  const FilterButton = ({ filter, title }: { filter: typeof selectedFilter; title: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && { backgroundColor: primaryColor }
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <ThemedText
        style={[
          styles.filterText,
          selectedFilter === filter && styles.filterTextActive
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={[styles.header, { backgroundColor: surfaceColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={primaryColor} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Riwayat Layanan</ThemedText>
          <View style={styles.placeholder} />
        </ThemedView>
        
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Memuat riwayat layanan...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: surfaceColor }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Riwayat Layanan</ThemedText>
        <TouchableOpacity onPress={loadServiceHistory} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color={primaryColor} />
        </TouchableOpacity>
      </ThemedView>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FilterButton filter="all" title="Semua" />
        <FilterButton filter="pending" title="Menunggu" />
        <FilterButton filter="in-progress" title="Berlangsung" />
        <FilterButton filter="completed" title="Selesai" />
        <FilterButton filter="cancelled" title="Dibatalkan" />
      </View>

      {/* History List */}
      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadServiceHistory}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={textSecondaryColor} />
            <ThemedText style={[styles.emptyText, { color: textSecondaryColor }]}>
              Belum ada riwayat layanan
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: textSecondaryColor }]}>
              Riwayat akan muncul setelah Anda menggunakan layanan ambulans atau transportasi
            </ThemedText>
          </View>
        }
      />
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
  refreshButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.surfaceVariant,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  historyItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  serviceTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  date: {
    fontSize: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 12,
  },
  addRatingBtn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  addRatingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.6,
    paddingHorizontal: 32,
  },
});
