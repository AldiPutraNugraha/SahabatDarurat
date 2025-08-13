import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string;
  medicalNotes: string;
  totalEmergencyCalls: number;
  averageRating: number;
}

export function UserProfile() {
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData>({
    name: user?.displayName || 'User',
    email: user?.email || '',
    phone: '',
    emergencyContact: '',
    bloodType: '',
    allergies: '',
    medicalNotes: '',
    totalEmergencyCalls: 0,
    averageRating: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadProfileData();
    loadServiceStats();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setProfileData(prev => ({ ...prev, ...JSON.parse(savedProfile) }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadServiceStats = async () => {
    try {
      const emergencyHistory = await AsyncStorage.getItem('emergencyCallHistory');
      const transportHistory = await AsyncStorage.getItem('transportBookingHistory');
      
      let totalCalls = 0;
      let totalRating = 0;
      let ratedCalls = 0;

      if (emergencyHistory) {
        const calls = JSON.parse(emergencyHistory);
        totalCalls += calls.length;
        calls.forEach((call: any) => {
          if (call.rating) {
            totalRating += call.rating;
            ratedCalls++;
          }
        });
      }

      if (transportHistory) {
        const bookings = JSON.parse(transportHistory);
        totalCalls += bookings.length;
        bookings.forEach((booking: any) => {
          if (booking.rating) {
            totalRating += booking.rating;
            ratedCalls++;
          }
        });
      }

      const averageRating = ratedCalls > 0 ? totalRating / ratedCalls : 0;
      setProfileData(prev => ({
        ...prev,
        totalEmergencyCalls: totalCalls,
        averageRating: Math.round(averageRating * 10) / 10
      }));
    } catch (error) {
      console.error('Error loading service stats:', error);
    }
  };

  const saveProfileData = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));
      setIsEditing(false);
      setEditField(null);
      Alert.alert('Berhasil', 'Profil berhasil diperbarui');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Gagal menyimpan profil');
    }
  };

  const handleEditField = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSaveField = () => {
    if (editField) {
      setProfileData(prev => ({ ...prev, [editField]: editValue }));
      saveProfileData();
    }
  };

  const renderProfileField = (label: string, value: string, field: keyof UserProfileData, editable: boolean = true) => (
    <View style={styles.fieldContainer}>
      <ThemedText style={styles.fieldLabel}>{label}</ThemedText>
      <View style={styles.fieldValueContainer}>
        <ThemedText style={styles.fieldValue}>{value || '-'}</ThemedText>
        {editable && (
          <TouchableOpacity 
            onPress={() => handleEditField(field, value)}
            style={styles.editButton}
          >
            <Ionicons name="pencil" size={16} color={Colors.light.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <ThemedView style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statText}>
          <ThemedText style={styles.statValue}>{value}</ThemedText>
          <ThemedText style={styles.statTitle}>{title}</ThemedText>
        </View>
      </View>
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={Colors.light.primary} />
        </View>
        <ThemedText style={styles.userName}>{profileData.name}</ThemedText>
        <ThemedText style={styles.userEmail}>{profileData.email}</ThemedText>
      </ThemedView>

      {/* Stats */}
      <ThemedView style={styles.statsContainer}>
        <ThemedText style={styles.sectionTitle}>Statistik Layanan</ThemedText>
        <View style={styles.statsGrid}>
          {renderStatCard('Total Panggilan', profileData.totalEmergencyCalls, 'medical', Colors.light.primary)}
          {renderStatCard('Rating Rata-rata', profileData.averageRating > 0 ? `${profileData.averageRating}/5` : 'Belum ada', 'star', Colors.light.secondary)}
        </View>
      </ThemedView>

      {/* Profile Info */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Informasi Pribadi</ThemedText>
        {renderProfileField('Nama Lengkap', profileData.name, 'name')}
        {renderProfileField('Email', profileData.email, 'email', false)}
        {renderProfileField('Nomor Telepon', profileData.phone, 'phone')}
        {renderProfileField('Kontak Darurat', profileData.emergencyContact, 'emergencyContact')}
      </ThemedView>

      {/* Medical Info */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Informasi Medis</ThemedText>
        {renderProfileField('Golongan Darah', profileData.bloodType, 'bloodType')}
        {renderProfileField('Alergi', profileData.allergies, 'allergies')}
        {renderProfileField('Catatan Medis', profileData.medicalNotes, 'medicalNotes')}
      </ThemedView>

      {/* Actions */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Aksi</ThemedText>
        <TouchableOpacity style={styles.actionButton} onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={20} color={Colors.light.error} />
          <ThemedText style={styles.actionButtonText}>Keluar dari Aplikasi</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Edit Modal */}
      <Modal visible={isEditing} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Edit {editField}</ThemedText>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Masukkan ${editField}`}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setIsEditing(false)}>
                <ThemedText style={styles.modalButtonText}>Batal</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonPrimary]} onPress={handleSaveField}>
                <ThemedText style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Simpan</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.light.surface,
    marginBottom: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
  },
  statsContainer: {
    margin: 16,
    padding: 20,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.light.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.text,
  },
  statTitle: {
    fontSize: 12,
    opacity: 0.7,
    color: Colors.light.text,
  },
  section: {
    margin: 16,
    padding: 20,
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.light.textSecondary,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldValue: {
    fontSize: 16,
    color: Colors.light.text,
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.light.errorLight,
    borderRadius: 12,
  },
  actionButtonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: Colors.light.text,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: Colors.light.background,
    color: Colors.light.text,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  modalButtonPrimary: {
    backgroundColor: Colors.light.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modalButtonTextPrimary: {
    color: Colors.light.surface,
  },
});
