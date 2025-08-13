import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SimpleSplashScreenProps {
  onAnimationComplete: () => void;
}

export function SimpleSplashScreen({ onAnimationComplete }: SimpleSplashScreenProps) {
  useEffect(() => {
    // Simple timer to show splash screen for 3 seconds
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/Logo_SahabatDarurat.png')}
          style={styles.logo}
          contentFit="contain"
          priority="high"
        />
      </View>

      {/* App name */}
      <View style={styles.appNameContainer}>
        <Text style={styles.appName}>SahabatDarurat</Text>
        <Text style={styles.appTagline}>Layanan Ambulans Darurat</Text>
      </View>

      {/* Simple loading text */}
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  appNameContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.light.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  appTagline: {
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    opacity: 0.8,
  },
});
