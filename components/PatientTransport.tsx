import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  FlatList, 
  SafeAreaView, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  View, 
  Modal,
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

type TransportType = 'regular' | 'elderly' | 'wheelchair';
type BookingStatus = 'pending' | 'confirmed' | 'on-the-way' | 'completed' | 'cancelled';

interface TransportBooking {
  id: string;
  pickupLocation: string;
  destination: string;
  date: string;
  time: string;
  transportType: TransportType;
  notes?: string;
  status: BookingStatus;
  estimatedCost: number;
  estimatedDuration: number;
  createdAt: string;
}

const STORAGE_KEY = 'patient_transport_bookings';

const transportTypes = [
  { id: 'regular', name: 'Mobil Biasa', icon: 'car-outline', price: 50000 },
  { id: 'elderly', name: 'Mobil Khusus Lansia', icon: 'car-sport-outline', price: 75000 },
  { id: 'wheelchair', name: 'Mobil Kursi Roda', icon: 'car-outline', price: 100000 },
];

export function PatientTransport({ onClose }: { onClose?: () => void }) {
  const [bookings, setBookings] = useState<TransportBooking[]>([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedTransportType, setSelectedTransportType] = useState<TransportType>('regular');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const storedBookings = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveBookings = async (bookingsToSave: TransportBooking[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookingsToSave));
    } catch (error) {
      console.error('Error saving bookings:', error);
      Alert.alert('Error', 'Gagal menyimpan booking');
    }
  };

  const createBooking = async () => {
    if (!pickupLocation.trim() || !destination.trim() || !date.trim() || !time.trim()) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }

    const selectedType = transportTypes.find(t => t.id === selectedTransportType);
    if (!selectedType) return;

    const newBooking: TransportBooking = {
      id: String(Date.now()),
      pickupLocation: pickupLocation.trim(),
      destination: destination.trim(),
      date: date.trim(),
      time: time.trim(),
      transportType: selectedTransportType,
      notes: notes.trim() || undefined,
      status: 'pending',
      estimatedCost: selectedType.price,
      estimatedDuration: Math.floor(Math.random() * 30) + 15, // 15-45 menit
      createdAt: new Date().toISOString(),
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    await saveBookings(updatedBookings);
    
    // Reset form
    setPickupLocation('');
    setDestination('');
    setDate('');
    setTime('');
    setNotes('');
    setShowBookingForm(false);
    
    Alert.alert('Sukses', 'Booking transportasi berhasil dibuat!');
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    await saveBookings(updatedBookings);
  };

  const cancelBooking = async (bookingId: string) => {
    Alert.alert(
      'Batalkan Booking',
      'Apakah Anda yakin ingin membatalkan booking ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya, Batalkan',
          style: 'destructive',
          onPress: () => updateBookingStatus(bookingId, 'cancelled')
        }
      ]
    );
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'on-the-way': return '#8b5cf6';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'confirmed': return 'Dikonfirmasi';
      case 'on-the-way': return 'Sedang Menuju';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return 'Unknown';
    }
  };

  const getTransportTypeName = (type: TransportType) => {
    return transportTypes.find(t => t.id === type)?.name || 'Unknown';
  };

  const renderBookingItem = ({ item }: { item: TransportBooking }) => (
    <ThemedView style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <ThemedText style={styles.bookingTitle}>
          {item.pickupLocation} → {item.destination}
        </ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <ThemedText style={styles.statusText}>{getStatusText(item.status)}</ThemedText>
        </View>
      </View>
      
      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={styles.detailText}>{item.date} • {item.time}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="car-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={styles.detailText}>{getTransportTypeName(item.transportType)}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={styles.detailText}>Rp {item.estimatedCost.toLocaleString()}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={Colors.light.primary} />
          <ThemedText style={styles.detailText}>~{item.estimatedDuration} menit</ThemedText>
        </View>
      </View>

      {item.notes && (
        <View style={styles.notesContainer}>
          <ThemedText style={styles.notesText}>Catatan: {item.notes}</ThemedText>
        </View>
      )}

      <View style={styles.bookingActions}>
        {item.status === 'pending' && (
          <>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.confirmBtn]}
              onPress={() => updateBookingStatus(item.id, 'confirmed')}
            >
              <ThemedText style={styles.actionBtnText}>Konfirmasi</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.cancelBtn]}
              onPress={() => cancelBooking(item.id)}
            >
              <ThemedText style={styles.actionBtnText}>Batalkan</ThemedText>
            </TouchableOpacity>
          </>
        )}
        
        {item.status === 'confirmed' && (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.startBtn]}
            onPress={() => updateBookingStatus(item.id, 'on-the-way')}
          >
            <ThemedText style={styles.actionBtnText}>Mulai Perjalanan</ThemedText>
          </TouchableOpacity>
        )}
        
        {item.status === 'on-the-way' && (
          <TouchableOpacity 
            style={[styles.actionBtn, styles.completeBtn]}
            onPress={() => updateBookingStatus(item.id, 'completed')}
          >
            <ThemedText style={styles.actionBtnText}>Selesai</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );

  const renderBookingForm = () => (
    <Modal visible={showBookingForm} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <ThemedView style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowBookingForm(false)} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.modalTitle}>Booking Transportasi</ThemedText>
          <View style={{ width: 40 }} />
        </ThemedView>

        <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Lokasi Jemput</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Alamat rumah atau lokasi jemput"
              value={pickupLocation}
              onChangeText={setPickupLocation}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Lokasi Tujuan</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Nama rumah sakit atau klinik"
              value={destination}
              onChangeText={setDestination}
              maxLength={100}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <ThemedText style={styles.inputLabel}>Tanggal</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/YYYY"
                value={date}
                onChangeText={setDate}
                maxLength={10}
              />
            </View>
            
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <ThemedText style={styles.inputLabel}>Waktu</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="HH:MM"
                value={time}
                onChangeText={setTime}
                maxLength={5}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Jenis Transportasi</ThemedText>
            <View style={styles.transportTypeContainer}>
              {transportTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.transportTypeBtn,
                    selectedTransportType === type.id && styles.transportTypeBtnActive
                  ]}
                  onPress={() => setSelectedTransportType(type.id as TransportType)}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={20} 
                    color={selectedTransportType === type.id ? '#fff' : Colors.light.primary} 
                  />
                  <ThemedText 
                    style={[
                      styles.transportTypeText,
                      selectedTransportType === type.id && styles.transportTypeTextActive
                    ]}
                  >
                    {type.name}
                  </ThemedText>
                  <ThemedText 
                    style={[
                      styles.transportTypePrice,
                      selectedTransportType === type.id && styles.transportTypePriceActive
                    ]}
                  >
                    Rp {type.price.toLocaleString()}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Catatan Khusus (Opsional)</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Contoh: Pasien lansia, butuh kursi roda, dll"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={createBooking}>
            <ThemedText style={styles.submitBtnText}>Buat Booking</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Antar Jemput Pasien</ThemedText>
        <TouchableOpacity onPress={() => setShowBookingForm(true)} style={styles.addButton}>
          <Ionicons name="add" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
      </ThemedView>

      {bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="car-outline" size={64} color={Colors.light.textSecondary} />
          <ThemedText style={styles.emptyTitle}>Belum Ada Booking</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            Buat booking transportasi untuk jadwal kontrol atau kunjungan medis
          </ThemedText>
          <TouchableOpacity 
            style={styles.emptyActionBtn} 
            onPress={() => setShowBookingForm(true)}
          >
            <ThemedText style={styles.emptyActionBtnText}>Buat Booking Pertama</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderBookingForm()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.light.surface,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  addButton: { padding: 8 },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyActionBtn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  
  listContainer: { padding: 16 },
  bookingCard: {
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    opacity: 0.8,
  },
  notesContainer: {
    backgroundColor: Colors.light.background,
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  notesText: {
    fontSize: 14,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmBtn: { backgroundColor: '#10b981' },
  cancelBtn: { backgroundColor: '#ef4444' },
  startBtn: { backgroundColor: '#8b5cf6' },
  completeBtn: { backgroundColor: '#3b82f6' },
  actionBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Modal styles
  modalContainer: { flex: 1, backgroundColor: Colors.light.background },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  closeBtn: { padding: 8 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  formContainer: { flex: 1, padding: 16 },
  inputGroup: { marginBottom: 20 },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.textPrimary,
  },
  input: {
    backgroundColor: Colors.light.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: { flexDirection: 'row' },
  transportTypeContainer: { gap: 8 },
  transportTypeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: Colors.light.surface,
  },
  transportTypeBtnActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  transportTypeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  transportTypeTextActive: { color: '#fff' },
  transportTypePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.primary,
  },
  transportTypePriceActive: { color: '#fff' },
  submitBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
