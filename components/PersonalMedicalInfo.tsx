import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';

export function PersonalMedicalInfo({ onClose }: { onClose?: () => void }) {
  const [blood, setBlood] = useState('O+');
  const [allergy, setAllergy] = useState('Tidak ada');
  const [meds, setMeds] = useState('Vitamin C');

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Info Medis Pribadi (Dummy)</ThemedText>
        <View style={{ width: 40 }} />
      </ThemedView>

      <View style={styles.form}>
        <ThemedText>Golongan Darah</ThemedText>
        <TextInput style={styles.input} value={blood} onChangeText={setBlood} />

        <ThemedText style={{ marginTop: 14 }}>Alergi</ThemedText>
        <TextInput style={styles.input} value={allergy} onChangeText={setAllergy} />

        <ThemedText style={{ marginTop: 14 }}>Obat yang Dikonsumsi</ThemedText>
        <TextInput style={styles.input} value={meds} onChangeText={setMeds} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  form: { padding: 16 },
  input: { backgroundColor: Colors.light.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 },
});


