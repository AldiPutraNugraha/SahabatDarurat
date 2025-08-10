import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { EmergencyRequest } from '@/types/emergency';

// Mock data untuk contoh
const mockHistory: EmergencyRequest[] = [
  {
    id: '1',
    userId: 'user1',
    location: {
      latitude: -6.2088,
      longitude: 106.8456,
      address: 'Jl. Thamrin No. 1, Jakarta Pusat'
    },
    serviceType: 'emergency',
    description: 'Kecelakaan lalu lintas',
    status: 'completed',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T11:15:00'),
    ambulanceId: 'amb1',
    estimatedArrival: 12,
    rating: 5,
    notes: 'Layanan sangat memuaskan'
  },
  {
    id: '2',
    userId: 'user1',
    location: {
      latitude: -6.1944,
      longitude: 106.8229,
      address: 'Jl. Sudirman No. 45, Jakarta Selatan'
    },
    serviceType: 'non-emergency',
    description: 'Antar pasien ke rumah sakit',
    status: 'completed',
    createdAt: new Date('2024-01-10T14:20:00'),
    updatedAt: new Date('2024-01-10T15:00:00'),
    ambulanceId: 'amb2',
    estimatedArrival: 8,
    rating: 4,
  },
  {
    id: '3',
    userId: 'user1',
    location: {
      latitude: -6.2215,
      longitude: 106.8452,
      address: 'Jl. Gatot Subroto No. 123, Jakarta'
    },
    serviceType: 'transport',
    description: 'Transportasi medis',
    status: 'cancelled',
    createdAt: new Date('2024-01-05T09:15:00'),
    updatedAt: new Date('2024-01-05T09:30:00'),
  }
];

interface ServiceHistoryProps {
  onClose?: () => void;
}

export function ServiceHistory({ onClose }: ServiceHistoryProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  const backgroundColor = useThemeColor({ light: Colors.light.background, dark: Colors.dark.background }, 'background');
  const surfaceColor = useThemeColor({ light: Colors.light.surface, dark: Colors.dark.surface }, 'surface');
  const primaryColor = useThemeColor({ light: Colors.light.primary, dark: Colors.dark.primary }, 'primary');
  const successColor = useThemeColor({ light: Colors.light.success, dark: Colors.dark.success }, 'success');
  const textSecondaryColor = useThemeColor({ light: Colors.light.textSecondary, dark: Colors.dark.textSecondary }, 'textSecondary');

  const filteredHistory = mockHistory.filter(item => {
    if (selectedFilter === 'all') return true;
    return item.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return successColor;
      case 'cancelled':
        return Colors.light.textMuted;
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

  const getServiceTypeText = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'Darurat';
      case 'non-emergency':
        return 'Non-Darurat';
      case 'transport':
        return 'Transportasi';
      default:
        return type;
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

  const renderHistoryItem = ({ item }: { item: EmergencyRequest }) => (
    <TouchableOpacity style={[styles.historyItem, { backgroundColor: surfaceColor }]}>
      <View style={styles.itemHeader}>
        <View style={styles.serviceInfo}>
          <ThemedText style={styles.serviceType}>
            {getServiceTypeText(item.serviceType)}
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
          {item.location.address || 'Alamat tidak tersedia'}
        </ThemedText>
      </View>

      {item.rating && (
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
          <ThemedText style={[styles.ratingText, { color: textSecondaryColor }]}>
            ({item.rating}/5)
          </ThemedText>
        </View>
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: surfaceColor }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Riwayat Layanan</ThemedText>
        <View style={styles.placeholder} />
      </ThemedView>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FilterButton filter="all" title="Semua" />
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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={textSecondaryColor} />
            <ThemedText style={[styles.emptyText, { color: textSecondaryColor }]}>
              Belum ada riwayat layanan
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
  },
  serviceType: {
    fontSize: 16,
    fontWeight: '600',
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
  notes: {
    fontSize: 12,
    fontStyle: 'italic',
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
  },
});
