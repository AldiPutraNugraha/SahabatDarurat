import React from 'react';
import { router } from 'expo-router';
import { AmbulanceTracking } from '@/components/AmbulanceTracking';

export default function TrackingScreen() {
  return <AmbulanceTracking onClose={() => router.back()} />;
}


