import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

type Contact = { id: string; name: string; phone: string };

const STORAGE_KEY = 'emergency_contacts';

const initialContacts: Contact[] = [
  { id: 'c1', name: 'Ibu', phone: '081234567890' },
  { id: 'c2', name: 'Ayah', phone: '081298765432' },
  { id: 'c3', name: 'Sahabat', phone: '081212341234' },
];

export function EmergencyContacts({ onClose }: { onClose?: () => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);

  // Load contacts from storage on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      } else {
        // If no stored contacts, use initial contacts and save them
        setContacts(initialContacts);
        await saveContacts(initialContacts);
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      setContacts(initialContacts);
    } finally {
      setLoading(false);
    }
  };

  const saveContacts = async (contactsToSave: Contact[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contactsToSave));
    } catch (error) {
      console.error('Error saving contacts:', error);
      Alert.alert('Error', 'Gagal menyimpan kontak');
    }
  };

  const addContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Error', 'Nama dan nomor telepon harus diisi');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (!phoneRegex.test(phone.trim())) {
      Alert.alert('Error', 'Format nomor telepon tidak valid');
      return;
    }

    const newContact: Contact = {
      id: String(Date.now()),
      name: name.trim(),
      phone: phone.trim(),
    };

    const updatedContacts = [newContact, ...contacts];
    setContacts(updatedContacts);
    await saveContacts(updatedContacts);
    
    setName('');
    setPhone('');
    
    Alert.alert('Sukses', 'Kontak berhasil ditambahkan');
  };

  const deleteContact = async (contactId: string) => {
    Alert.alert(
      'Hapus Kontak',
      'Apakah Anda yakin ingin menghapus kontak ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const updatedContacts = contacts.filter(c => c.id !== contactId);
            setContacts(updatedContacts);
            await saveContacts(updatedContacts);
          }
        }
      ]
    );
  };

  const editContact = async (contact: Contact) => {
    Alert.prompt(
      'Edit Kontak',
      'Masukkan nama baru:',
      contact.name,
      async (newName) => {
        if (newName && newName.trim()) {
          const updatedContact = { ...contact, name: newName.trim() };
          const updatedContacts = contacts.map(c => c.id === contact.id ? updatedContact : c);
          setContacts(updatedContacts);
          await saveContacts(updatedContacts);
        }
      }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Kontak Darurat</ThemedText>
          <View style={{ width: 40 }} />
        </ThemedView>
        
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>Memuat kontak...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Kontak Darurat</ThemedText>
        <View style={{ width: 40 }} />
      </ThemedView>

      <View style={styles.inputRow}>
        <TextInput 
          placeholder="Nama" 
          value={name} 
          onChangeText={setName} 
          style={styles.input}
          maxLength={30}
        />
        <TextInput 
          placeholder="No. Telepon" 
          value={phone} 
          onChangeText={setPhone} 
          keyboardType="phone-pad" 
          style={styles.input}
          maxLength={15}
        />
        <TouchableOpacity onPress={addContact} style={styles.addBtn}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.card}>
            <Ionicons name="people" size={18} color={Colors.light.primary} />
            <View style={styles.contactInfo}>
              <ThemedText style={styles.name}>{item.name}</ThemedText>
              <ThemedText style={styles.phone}>{item.phone}</ThemedText>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={() => editContact(item)} style={styles.actionBtn}>
                <Ionicons name="create-outline" size={16} color={Colors.light.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteContact(item.id)} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>Belum ada kontak darurat</ThemedText>
            <ThemedText style={styles.emptySubtext}>Tambahkan kontak keluarga atau teman</ThemedText>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  input: { flex: 1, backgroundColor: Colors.light.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  addBtn: { backgroundColor: Colors.light.primary, padding: 10, borderRadius: 10 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    padding: 14, 
    borderRadius: 12, 
    backgroundColor: Colors.light.surface, 
    marginBottom: 10 
  },
  contactInfo: { flex: 1 },
  name: { fontWeight: '600', fontSize: 16 },
  phone: { opacity: 0.8, marginTop: 2 },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: { padding: 8 },
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
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});


