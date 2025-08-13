import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface CustomSplashScreenProps {
  onAnimationComplete: () => void;
}

export function CustomSplashScreen({ onAnimationComplete }: CustomSplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const loadingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Reset values
      logoScale.setValue(0);
      logoOpacity.setValue(0);
      textOpacity.setValue(0);
      loadingOpacity.setValue(0);

      // Sequence of animations
      Animated.sequence([
        // Logo fade in and scale up
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        // Text fade in
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Loading fade in
        Animated.timing(loadingOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        // Wait a bit
        Animated.delay(2000),
        // Fade out everything
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(textOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(loadingOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        onAnimationComplete();
      });
    };

    // Start animation after a short delay
    const timer = setTimeout(startAnimation, 300);
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('@/assets/images/Logo_SahabatDarurat.png')}
          style={styles.logo}
          contentFit="contain"
          priority="high"
        />
      </Animated.View>

      {/* App name */}
      <Animated.View
        style={[
          styles.appNameContainer,
          {
            opacity: textOpacity,
          },
        ]}
      >
        <Text style={styles.appName}>SahabatDarurat</Text>
        <Text style={styles.appTagline}>Layanan Ambulans Darurat</Text>
      </Animated.View>

      {/* Simple loading indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: loadingOpacity,
          },
        ]}
      >
        <View style={styles.loadingDots}>
          <View style={[styles.dot, styles.dot1]} />
          <View style={[styles.dot, styles.dot2]} />
          <View style={[styles.dot, styles.dot3]} />
        </View>
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </Animated.View>
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
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.primary,
    marginHorizontal: 4,
  },
  dot1: {
    opacity: 0.3,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 1,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    opacity: 0.8,
  },
});
