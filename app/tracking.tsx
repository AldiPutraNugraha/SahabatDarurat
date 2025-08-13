import { AmbulanceTracking } from '@/components/AmbulanceTracking';
import { router } from 'expo-router';
import React from 'react';

export default function TrackingScreen() {
  return <AmbulanceTracking onClose={() => router.back()} />;
}


