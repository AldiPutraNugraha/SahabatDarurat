import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

type LatLng = { latitude: number; longitude: number };

type AmbulanceMapProps = {
  user: LatLng;
  ambulance: LatLng;
  primaryColor: string;
  successColor: string;
};

export function AmbulanceMap({ user, ambulance, primaryColor, successColor }: AmbulanceMapProps) {
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    const midLat = (user.latitude + ambulance.latitude) / 2;
    const midLng = (user.longitude + ambulance.longitude) / 2;
    const latDelta = Math.max(Math.abs(user.latitude - ambulance.latitude), 0.01) * 1.6;
    const lngDelta = Math.max(Math.abs(user.longitude - ambulance.longitude), 0.01) * 1.6;
    mapRef.current?.animateToRegion({ latitude: midLat, longitude: midLng, latitudeDelta: latDelta, longitudeDelta: lngDelta }, 400);
  }, [user, ambulance]);

  return (
    <MapView
      ref={(r) => (mapRef.current = r)}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: (user.latitude + ambulance.latitude) / 2,
        longitude: (user.longitude + ambulance.longitude) / 2,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }}
    >
      <Marker coordinate={user} title="Lokasi Anda" pinColor={successColor} />
      <Marker coordinate={ambulance} title="Ambulans" description="Menuju lokasi Anda">
        <Ionicons name="medical" size={28} color={primaryColor} />
      </Marker>
      <Polyline coordinates={[ambulance, user]} strokeColor={primaryColor} strokeWidth={3} />
    </MapView>
  );
}

const styles = StyleSheet.create({});


