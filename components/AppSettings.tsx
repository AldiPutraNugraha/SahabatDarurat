import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, Modal, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface AppSettings {
  notifications: {
    emergency: boolean;
    transport: boolean;
    updates: boolean;
    marketing: boolean;
  };
  privacy: {
    locationSharing: boolean;
    dataCollection: boolean;
    analytics: boolean;
  };
  preferences: {
    language: string;
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  emergency: {
    autoLocation: boolean;
    sosContacts: string[];
    emergencyTimeout: number;
  };
}

export function AppSettings({ onClose }: { onClose: () => void }) {
  const [settings, setSettings] = useState<AppSettings>({
    notifications: {
      emergency: true,
      transport: true,
      updates: false,
      marketing: false,
    },
    privacy: {
      locationSharing: true,
      dataCollection: false,
      analytics: false,
    },
    preferences: {
      language: 'id',
      theme: 'light',
      fontSize: 'medium',
      soundEnabled: true,
      vibrationEnabled: true,
    },
    emergency: {
      autoLocation: true,
      sosContacts: [],
      emergencyTimeout: 30,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      Alert.alert('Berhasil', 'Pengaturan berhasil disimpan');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Gagal menyimpan pengaturan');
    }
  };

  const handleToggle = (category: keyof AppSettings, key: string, value: boolean) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    };
    saveSettings(newSettings);
  };

  const handleEditField = (field: string, value: string) => {
    setEditField(field);
    setEditValue(value);
    setIsEditing(true);
  };

  const handleSaveField = () => {
    if (editField) {
      const [category, key] = editField.split('.');
      const newSettings = {
        ...settings,
        [category]: {
          ...settings[category as keyof AppSettings],
          [key]: editValue,
        },
      };
      saveSettings(newSettings);
      setIsEditing(false);
      setEditField(null);
    }
  };

  const renderSettingItem = (
    title: string,
    subtitle: string,
    icon: string,
    value?: boolean | string,
    onToggle?: (value: boolean) => void,
    onPress?: () => void,
    isEditable: boolean = false
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !isEditable}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: Colors.light.primaryLight }]}>
          <Ionicons name={icon as any} size={20} color={Colors.light.primary} />
        </View>
        <View style={styles.settingText}>
          <ThemedText style={styles.settingTitle}>{title}</ThemedText>
          <ThemedText style={styles.settingSubtitle}>{subtitle}</ThemedText>
        </View>
      </View>
      <View style={styles.settingRight}>
        {typeof value === 'boolean' && onToggle ? (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ false: Colors.light.border, true: Colors.light.primaryLight }}
            thumbColor={value ? Colors.light.primary : Colors.light.surface}
          />
        ) : (
          <View style={styles.settingValue}>
            <ThemedText style={styles.settingValueText}>{value}</ThemedText>
            {isEditable && (
              <TouchableOpacity onPress={() => handleEditField(editField!, value as string)}>
                <Ionicons name="pencil" size={16} color={Colors.light.primary} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <ThemedView style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      {children}
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Back Button */}
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onClose}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Pengaturan Aplikasi</ThemedText>
          <View style={styles.headerSpacer} />
        </View>
      </ThemedView>

      {/* Notifications */}
      {renderSection('Notifikasi', (
        <>
          {renderSettingItem(
            'Notifikasi Darurat',
            'Dapatkan notifikasi untuk panggilan ambulans',
            'warning',
            settings.notifications.emergency,
            (value) => handleToggle('notifications', 'emergency', value)
          )}
          {renderSettingItem(
            'Notifikasi Transport',
            'Update status antar jemput pasien',
            'car',
            settings.notifications.transport,
            (value) => handleToggle('notifications', 'transport', value)
          )}
          {renderSettingItem(
            'Update Aplikasi',
            'Notifikasi versi terbaru',
            'refresh',
            settings.notifications.updates,
            (value) => handleToggle('notifications', 'updates', value)
          )}
          {renderSettingItem(
            'Promo & Info',
            'Informasi layanan dan promosi',
            'megaphone',
            settings.notifications.marketing,
            (value) => handleToggle('notifications', 'marketing', value)
          )}
        </>
      ))}

      {/* Privacy */}
      {renderSection('Privasi & Keamanan', (
        <>
          {renderSettingItem(
            'Bagikan Lokasi',
            'Izinkan akses lokasi untuk layanan darurat',
            'location',
            settings.privacy.locationSharing,
            (value) => handleToggle('privacy', 'locationSharing', value)
          )}
          {renderSettingItem(
            'Koleksi Data',
            'Kumpulkan data penggunaan untuk perbaikan',
            'analytics',
            settings.privacy.dataCollection,
            (value) => handleToggle('privacy', 'dataCollection', value)
          )}
          {renderSettingItem(
            'Analitik',
            'Kirim data analitik anonim',
            'bar-chart',
            settings.privacy.analytics,
            (value) => handleToggle('privacy', 'analytics', value)
          )}
        </>
      ))}

      {/* Preferences */}
      {renderSection('Preferensi', (
        <>
          {renderSettingItem(
            'Bahasa',
            'Pilih bahasa aplikasi',
            'language',
            settings.preferences.language === 'id' ? 'Indonesia' : 'English',
            undefined,
            () => handleEditField('preferences.language', settings.preferences.language),
            true
          )}
          {renderSettingItem(
            'Tema',
            'Pilih tema aplikasi',
            'color-palette',
            settings.preferences.theme === 'light' ? 'Terang' : 
            settings.preferences.theme === 'dark' ? 'Gelap' : 'Otomatis',
            undefined,
            () => handleEditField('preferences.theme', settings.preferences.theme),
            true
          )}
          {renderSettingItem(
            'Ukuran Font',
            'Sesuaikan ukuran teks',
            'text',
            settings.preferences.fontSize === 'small' ? 'Kecil' :
            settings.preferences.fontSize === 'medium' ? 'Sedang' : 'Besar',
            undefined,
            () => handleEditField('preferences.fontSize', settings.preferences.fontSize),
            true
          )}
          {renderSettingItem(
            'Suara',
            'Aktifkan suara notifikasi',
            'volume-high',
            settings.preferences.soundEnabled,
            (value) => handleToggle('preferences', 'soundEnabled', value)
          )}
          {renderSettingItem(
            'Getaran',
            'Aktifkan getaran notifikasi',
            'phone-portrait',
            settings.preferences.vibrationEnabled,
            (value) => handleToggle('preferences', 'vibrationEnabled', value)
          )}
        </>
      ))}

      {/* Emergency Settings */}
      {renderSection('Pengaturan Darurat', (
        <>
          {renderSettingItem(
            'Lokasi Otomatis',
            'Kirim lokasi otomatis saat darurat',
            'navigate',
            settings.emergency.autoLocation,
            (value) => handleToggle('emergency', 'autoLocation', value)
          )}
          {renderSettingItem(
            'Timeout Darurat',
            'Waktu tunggu sebelum panggilan otomatis',
            'timer',
            `${settings.emergency.emergencyTimeout} detik`,
            undefined,
            () => handleEditField('emergency.emergencyTimeout', settings.emergency.emergencyTimeout.toString()),
            true
          )}
        </>
      ))}

      {/* Actions */}
      {renderSection('Aksi', (
        <>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Reset', 'Reset semua pengaturan ke default?', [
            { text: 'Batal', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: () => {
              const defaultSettings: AppSettings = {
                notifications: { emergency: true, transport: true, updates: false, marketing: false },
                privacy: { locationSharing: true, dataCollection: false, analytics: false },
                preferences: { language: 'id', theme: 'light', fontSize: 'medium', soundEnabled: true, vibrationEnabled: true },
                emergency: { autoLocation: true, sosContacts: [], emergencyTimeout: 30 },
              };
              saveSettings(defaultSettings);
            }}
          ])}>
            <Ionicons name="refresh" size={20} color={Colors.light.error} />
            <ThemedText style={styles.actionButtonText}>Reset Pengaturan</ThemedText>
          </TouchableOpacity>
        </>
      ))}

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
    padding: 20,
    backgroundColor: Colors.light.surface,
    marginBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.light.primaryLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.light.primary,
  },
  headerSpacer: {
    width: 40,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.light.text,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.light.text,
  },
  settingSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    color: Colors.light.textSecondary,
  },
  settingRight: {
    alignItems: 'center',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
    marginRight: 8,
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
