import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

type LatLng = { latitude: number; longitude: number };

type AmbulanceMapProps = {
  user: LatLng;
  ambulance: LatLng;
  primaryColor: string;
  successColor: string;
};

export function AmbulanceMap({ primaryColor }: AmbulanceMapProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
      <Ionicons name="map" size={48} color={primaryColor} />
      <ThemedText style={{ marginTop: 12, opacity: 0.7, textAlign: 'center' }}>
        Peta tidak tersedia di web, gunakan device/emulator.
      </ThemedText>
    </View>
  );
}


